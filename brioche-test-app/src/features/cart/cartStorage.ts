import { useEffect, useMemo, useState } from 'react';

export type CartItemOption = {
  id: string;
  label: string;
  value: string;
};

export type CartItem = {
  id: string;
  productId: number;
  slug: string;
  title: string;
  imageUrl: string;
  unitPrice: number;
  quantity: number;
  options: CartItemOption[];
};

export type AddCartItemPayload = Omit<CartItem, 'id' | 'quantity'> & {
  quantity?: number;
};

const CART_STORAGE_KEY = 'brioche_cart_v1';
const CART_CHANGED_EVENT = 'brioche:cart-changed';

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const toFiniteNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
};

const normalizeOption = (value: unknown): CartItemOption | null => {
  if (!isObject(value)) {
    return null;
  }

  const id = typeof value.id === 'string' ? value.id.trim() : '';
  const label = typeof value.label === 'string' ? value.label.trim() : '';
  const optionValue = typeof value.value === 'string' ? value.value.trim() : '';

  if (!id || !label || !optionValue) {
    return null;
  }

  return { id, label, value: optionValue };
};

const normalizeItem = (value: unknown): CartItem | null => {
  if (!isObject(value)) {
    return null;
  }

  const id = typeof value.id === 'string' ? value.id.trim() : '';
  const slug = typeof value.slug === 'string' ? value.slug.trim() : '';
  const title = typeof value.title === 'string' ? value.title.trim() : '';
  const imageUrl = typeof value.imageUrl === 'string' ? value.imageUrl.trim() : '';
  const productId = toFiniteNumber(value.productId);
  const unitPrice = toFiniteNumber(value.unitPrice);
  const quantity = toFiniteNumber(value.quantity);

  if (!id || !slug || !title || !imageUrl || productId === null || unitPrice === null || quantity === null) {
    return null;
  }

  const normalizedQuantity = Math.max(1, Math.floor(quantity));
  const normalizedProductId = Math.max(1, Math.floor(productId));
  const normalizedPrice = Math.max(0, Math.floor(unitPrice));

  const options = Array.isArray(value.options)
    ? value.options.map(normalizeOption).filter((option): option is CartItemOption => option !== null)
    : [];

  return {
    id,
    slug,
    title,
    imageUrl,
    productId: normalizedProductId,
    unitPrice: normalizedPrice,
    quantity: normalizedQuantity,
    options,
  };
};

const readRawCart = (): CartItem[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  const raw = window.localStorage.getItem(CART_STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map(normalizeItem).filter((item): item is CartItem => item !== null);
  } catch {
    return [];
  }
};

const writeRawCart = (items: CartItem[]): void => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CART_CHANGED_EVENT));
};

const optionsSignature = (options: CartItemOption[]): string =>
  options
    .map((option) => `${option.id}:${option.value}`)
    .sort()
    .join('|');

const createCartItemId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `cart-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const readCartItems = (): CartItem[] => readRawCart();

export const addCartItem = (payload: AddCartItemPayload): CartItem[] => {
  const quantity = Math.max(1, Math.floor(payload.quantity ?? 1));
  const nextItems = readRawCart();

  const existingItemIndex = nextItems.findIndex(
    (item) =>
      item.slug === payload.slug &&
      item.unitPrice === payload.unitPrice &&
      optionsSignature(item.options) === optionsSignature(payload.options),
  );

  if (existingItemIndex >= 0) {
    nextItems[existingItemIndex] = {
      ...nextItems[existingItemIndex],
      quantity: nextItems[existingItemIndex].quantity + quantity,
    };
  } else {
    nextItems.push({
      ...payload,
      id: createCartItemId(),
      quantity,
    });
  }

  writeRawCart(nextItems);

  return nextItems;
};

export const updateCartItemQuantity = (itemId: string, nextQuantity: number): CartItem[] => {
  const quantity = Math.max(1, Math.floor(nextQuantity));
  const nextItems = readRawCart().map((item) => (item.id === itemId ? { ...item, quantity } : item));

  writeRawCart(nextItems);

  return nextItems;
};

export const removeCartItem = (itemId: string): CartItem[] => {
  const nextItems = readRawCart().filter((item) => item.id !== itemId);

  writeRawCart(nextItems);

  return nextItems;
};

export const clearCartItems = (): void => {
  writeRawCart([]);
};

export const cartItemsCount = (items: CartItem[]): number =>
  items.reduce((total, item) => total + item.quantity, 0);

export const cartItemsTotal = (items: CartItem[]): number =>
  items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);

export const formatRubles = (value: number): string => `${value.toLocaleString('ru-RU')} ₽`;

export const useCartItems = (): CartItem[] => {
  const [items, setItems] = useState<CartItem[]>(() => readRawCart());

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const syncItems = () => {
      setItems(readRawCart());
    };

    window.addEventListener(CART_CHANGED_EVENT, syncItems);
    window.addEventListener('storage', syncItems);

    return () => {
      window.removeEventListener(CART_CHANGED_EVENT, syncItems);
      window.removeEventListener('storage', syncItems);
    };
  }, []);

  return items;
};

export const useCartTotals = () => {
  const items = useCartItems();

  return useMemo(
    () => ({
      items,
      totalItemsCount: cartItemsCount(items),
      totalPrice: cartItemsTotal(items),
    }),
    [items],
  );
};
