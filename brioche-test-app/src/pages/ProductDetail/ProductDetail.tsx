import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import Layout from '../../components/layout/Layout';
import sliderArrow from '../../assets/images/product-detail/slider-arrow.svg';
import { API_BASE_URL } from '../../config/api';
import './ProductDetail.scss';

type ProductCard = {
  id: number;
  slug: string;
  title: string;
  price: string;
  price_value: number;
  main_image_url: string;
};

type ProductDetails = ProductCard & {
  description: string | null;
  allergy_note: string | null;
  gallery_images: string[];
  ingredients: string[];
  allergens: string[];
  related: ProductCard[];
};

type ProductResponse = {
  data: ProductDetails;
};

type ProductDetailProps = {
  slug?: string;
};

type ProductSelectControl = {
  id: string;
  ariaLabel: string;
  placeholder: string;
  options: string[];
  defaultValue?: string;
  width: number;
};

type ProductDateControl = {
  id: string;
  ariaLabel: string;
  placeholder: string;
  width: number;
};

type ProductControlsConfig = {
  pricePrefix?: string;
  dateControl?: ProductDateControl;
  selectControls?: ProductSelectControl[];
};

const PRODUCT_CONTROLS_BY_SLUG: Record<string, ProductControlsConfig> = {
  'breakfast-builder': {
    selectControls: [
      {
        id: 'addons',
        ariaLabel: 'Выберите добавки',
        placeholder: 'Выберите добавки...',
        defaultValue: 'Домашняя красная икра',
        width: 273,
        options: [
          'Без добавок',
          'Мортаделла',
          'Креветки',
          'Охотничьи колбаски',
          'Куриное бедро',
          'Пастрами из индейки',
          'Слабосолёный лосось',
          'Домашняя красная икра',
          'Карамелизированный бекон',
          'Зелёный салат',
          'Огурцы',
          'Авокадо',
          'Томаты',
          'Тартин',
          'Бриошь',
        ],
      },
    ],
  },
  'salad-avocado': {
    selectControls: [
      {
        id: 'dressing',
        ariaLabel: 'Выберите заправку',
        placeholder: 'Выберите заправку...',
        width: 281,
        options: ['апельсиновый соус', 'медово-горчичный соус'],
      },
    ],
  },
  'lilac-cream-cake': {
    pricePrefix: 'от ',
    dateControl: {
      id: 'deliveryDate',
      ariaLabel: 'Выберите дату доставки',
      placeholder: 'Выберите дату доставки *',
      width: 253,
    },
    selectControls: [
      {
        id: 'flavor',
        ariaLabel: 'Выберите вкус торта',
        placeholder: 'Выберите вкус торта...',
        defaultValue: 'Сливочно-сырный с вишней',
        width: 281,
        options: [
          'Сливочно-сырный с вишней',
          'Красный бархат',
          'Ванильно-ореховый',
          'Банан-карамель',
          'Шоколадный пломбир',
          'Морковный',
          'Шоколадный манго-маракуйя',
        ],
      },
      {
        id: 'weight',
        ariaLabel: 'Выберите вес торта',
        placeholder: 'Выберите вес торта...',
        width: 220,
        options: ['1кг (диаметром 12см)', '2кг (диаметром 18см)', '4кг (диаметром 23см)'],
      },
    ],
  },
  'cornflower-cake': {
    pricePrefix: 'от ',
    dateControl: {
      id: 'deliveryDate',
      ariaLabel: 'Выберите дату доставки',
      placeholder: 'Выберите дату доставки *',
      width: 253,
    },
    selectControls: [
      {
        id: 'flavor',
        ariaLabel: 'Выберите вкус торта',
        placeholder: 'Выберите вкус торта...',
        defaultValue: 'Сливочно-сырный с вишней',
        width: 281,
        options: [
          'Сливочно-сырный с вишней',
          'Красный бархат',
          'Ванильно-ореховый',
          'Банан-карамель',
          'Шоколадный пломбир',
          'Морковный',
          'Шоколадный манго-маракуйя',
        ],
      },
      {
        id: 'weight',
        ariaLabel: 'Выберите вес торта',
        placeholder: 'Выберите вес торта...',
        width: 220,
        options: ['1кг (диаметром 12см)', '2кг (диаметром 18см)', '4кг (диаметром 23см)'],
      },
    ],
  },
  'macaron-wreath-cake': {
    pricePrefix: 'от ',
    dateControl: {
      id: 'deliveryDate',
      ariaLabel: 'Выберите дату доставки',
      placeholder: 'Выберите дату доставки *',
      width: 253,
    },
    selectControls: [
      {
        id: 'flavor',
        ariaLabel: 'Выберите вкус торта',
        placeholder: 'Выберите вкус торта...',
        defaultValue: 'Сливочно-сырный с вишней',
        width: 281,
        options: [
          'Сливочно-сырный с вишней',
          'Красный бархат',
          'Ванильно-ореховый',
          'Банан-карамель',
          'Шоколадный пломбир',
          'Морковный',
          'Шоколадный манго-маракуйя',
        ],
      },
      {
        id: 'weight',
        ariaLabel: 'Выберите вес торта',
        placeholder: 'Выберите вес торта...',
        width: 220,
        options: ['1кг (диаметром 12см)', '2кг (диаметром 18см)', '4кг (диаметром 23см)'],
      },
      {
        id: 'macaronFlavor',
        ariaLabel: 'Выберите вкус макарон',
        placeholder: 'Выберите вкус макарон...',
        width: 247,
        options: ['Ореховые', 'Ягодные'],
      },
    ],
  },
  'pavlova-wreath-cake': {
    pricePrefix: 'от ',
    dateControl: {
      id: 'deliveryDate',
      ariaLabel: 'Выберите дату доставки',
      placeholder: 'Выберите дату доставки *',
      width: 253,
    },
    selectControls: [
      {
        id: 'weight',
        ariaLabel: 'Выберите вес торта',
        placeholder: 'Выберите вес торта...',
        width: 220,
        options: ['1кг (диаметром 12см)', '2кг (диаметром 18см)', '4кг (диаметром 23см)'],
      },
    ],
  },
  'dried-flowers-cake': {
    pricePrefix: 'от ',
    dateControl: {
      id: 'deliveryDate',
      ariaLabel: 'Выберите дату доставки',
      placeholder: 'Выберите дату доставки *',
      width: 253,
    },
    selectControls: [
      {
        id: 'flavor',
        ariaLabel: 'Выберите вкус торта',
        placeholder: 'Выберите вкус торта...',
        defaultValue: 'Сливочно-сырный с вишней',
        width: 281,
        options: [
          'Сливочно-сырный с вишней',
          'Красный бархат',
          'Ванильно-ореховый',
          'Банан-карамель',
          'Шоколадный пломбир',
          'Морковный',
          'Шоколадный манго-маракуйя',
        ],
      },
      {
        id: 'weight',
        ariaLabel: 'Выберите вес торта',
        placeholder: 'Выберите вес торта...',
        width: 220,
        options: ['1кг (диаметром 12см)', '2кг (диаметром 18см)', '4кг (диаметром 23см)'],
      },
    ],
  },
  'bant-cake': {
    pricePrefix: 'от ',
    dateControl: {
      id: 'deliveryDate',
      ariaLabel: 'Выберите дату доставки',
      placeholder: 'Выберите дату доставки *',
      width: 253,
    },
    selectControls: [
      {
        id: 'flavor',
        ariaLabel: 'Выберите вкус торта',
        placeholder: 'Выберите вкус торта...',
        defaultValue: 'Красный бархат',
        width: 281,
        options: [
          'Красный бархат',
          'Ванильно-ореховый',
          'Банан-карамель',
          'Шоколадный пломбир',
          'Морковный',
          'Шоколадный манго-маракуйя',
          'Сливочно-сырный с вишней',
        ],
      },
      {
        id: 'weight',
        ariaLabel: 'Выберите вес торта',
        placeholder: 'Выберите вес торта...',
        width: 220,
        options: ['1кг (диаметром 12см)', '2кг (диаметром 18см)', '4кг (диаметром 23см)'],
      },
    ],
  },
  'cupcakes-box': {
    pricePrefix: 'от ',
    dateControl: {
      id: 'deliveryDate',
      ariaLabel: 'Выберите дату доставки',
      placeholder: 'Выберите дату доставки *',
      width: 253,
    },
    selectControls: [
      {
        id: 'quantity',
        ariaLabel: 'Выберите количество капкейков',
        placeholder: 'Выберите количество...',
        width: 232,
        options: ['4 капкейка', '6 капкейков', '9 капкейков'],
      },
    ],
  },
  'macaron-set': {
    selectControls: [
      {
        id: 'quantity',
        ariaLabel: 'Выберите набор макарон',
        placeholder: 'Выберите набор...',
        width: 247,
        options: ['4 макарон', '8 макарон', '15 макарон'],
      },
    ],
  },
};
const MONTH_NAMES = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

const WEEKDAY_NAMES = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const toStartOfDay = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const toStartOfMonth = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), 1);
const toEndOfMonth = (date: Date): Date => new Date(date.getFullYear(), date.getMonth() + 1, 0);
const addMonths = (date: Date, months: number): Date => new Date(date.getFullYear(), date.getMonth() + months, 1);
const DYNAMIC_GALLERY_SLUGS = new Set([
  'dried-flowers-cake',
  'macaron-wreath-cake',
  'pavlova-wreath-cake',
  'bant-cake',
  'cupcakes-box',
]);
const RELATED_OFFSET_SLUGS = new Set(['lilac-cream-cake']);
const DEFAULT_DYNAMIC_GALLERY_ASPECT_RATIO = 16 / 9;
const MIN_ASPECT_RATIO = 0.1;
const FORCED_16_BY_9_WIDTH = 690;
const FORCED_16_BY_9_HEIGHT = 460;
const ASPECT_RATIO_COMPARE_EPSILON = 0.01;
const ASPECT_RATIO_OVERRIDES_BY_IMAGE: Record<string, number> = {
  'venok-3.jpg': 16 / 9,
  'pavlov2.jpg': 16 / 9,
  'bant.jpg': 4 / 3,
  'bant1.jpg': 16 / 9,
  'bant2.jpg': 4 / 3,
  'bant3.jpg': 4 / 3,
  'bant4.jpg': 4 / 3,
};
const PRICE_BY_QUANTITY_BY_SLUG: Record<string, Record<number, number>> = {
  'cupcakes-box': {
    4: 2600,
    6: 3900,
    9: 5850,
  },
  'macaron-set': {
    4: 1240,
    8: 2480,
    15: 4650,
  },
};

const resolveAspectRatio = (imageUrl: string, fallbackRatio: number): number => {
  const normalizedUrl = imageUrl.toLowerCase();

  const forcedRatioEntry = Object.entries(ASPECT_RATIO_OVERRIDES_BY_IMAGE).find(([fileName]) =>
    normalizedUrl.endsWith(`/${fileName}`) || normalizedUrl.endsWith(fileName),
  );

  if (forcedRatioEntry) {
    return forcedRatioEntry[1];
  }

  return fallbackRatio;
};

const isSixteenByNineRatio = (ratio: number): boolean =>
  Math.abs(ratio - DEFAULT_DYNAMIC_GALLERY_ASPECT_RATIO) <= ASPECT_RATIO_COMPARE_EPSILON;

const toIsoDate = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');

  return `${y}-${m}-${d}`;
};

const formatRubPrice = (price: number): string => `${price.toLocaleString('ru-RU')} ₽`;

const fromIsoDate = (value: string): Date | null => {
  if (!value) {
    return null;
  }

  const [y, m, d] = value.split('-').map(Number);
  if (!y || !m || !d) {
    return null;
  }

  return new Date(y, m - 1, d);
};

const ProductDetail = ({ slug = 'benedict-pastrami' }: ProductDetailProps) => {
  const productGalleryRef = useRef<HTMLDivElement | null>(null);
  const galleryViewportRef = useRef<HTMLDivElement | null>(null);
  const galleryMainRef = useRef<HTMLDivElement | null>(null);
  const productContentRef = useRef<HTMLElement | null>(null);
  const deliveryDateWrapRef = useRef<HTMLDivElement | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const dragStartXRef = useRef(0);

  const [selectedImage, setSelectedImage] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [selectedControlValues, setSelectedControlValues] = useState<Record<string, string>>({});
  const [noSliderRelatedShift, setNoSliderRelatedShift] = useState(0);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [imageAspectRatios, setImageAspectRatios] = useState<Record<string, number>>({});
  const [galleryMainHeight, setGalleryMainHeight] = useState<number | null>(null);

  const todayDate = useMemo(() => toStartOfDay(new Date()), []);
  const currentMonthStart = useMemo(() => toStartOfMonth(todayDate), [todayDate]);
  const maxDeliveryDate = useMemo(() => toStartOfDay(toEndOfMonth(addMonths(todayDate, 3))), [todayDate]);
  const maxDeliveryMonthStart = useMemo(() => toStartOfMonth(maxDeliveryDate), [maxDeliveryDate]);
  const [visibleMonthStart, setVisibleMonthStart] = useState<Date>(currentMonthStart);

  useEffect(() => {
    const abortController = new AbortController();

    const loadProduct = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(slug)}`, {
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error('Не удалось загрузить товар.');
        }

        const payload = (await response.json()) as ProductResponse;
        setProduct(payload.data ?? null);
      } catch (error) {
        if (abortController.signal.aborted) {
          return;
        }

        setProduct(null);
        setErrorMessage(error instanceof Error ? error.message : 'Не удалось загрузить товар.');
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void loadProduct();

    return () => abortController.abort();
  }, [slug]);

  const productImages = useMemo(() => {
    if (!product) {
      return [];
    }

    return Array.from(
      new Set([product.main_image_url, ...product.gallery_images].filter(Boolean)),
    );
  }, [product]);

  useEffect(() => {
    if (!productImages.length) {
      setImageAspectRatios({});

      return;
    }

    let isDisposed = false;

    const loadImageRatios = async () => {
      const entries = await Promise.all(
        productImages.map(
          (imageUrl) =>
            new Promise<[string, number]>((resolve) => {
              const image = new Image();
              image.onload = () => {
                const width = image.naturalWidth || 0;
                const height = image.naturalHeight || 0;
                const ratio = resolveAspectRatio(imageUrl, width > 0 && height > 0 ? width / height : 1);

                resolve([imageUrl, ratio]);
              };
              image.onerror = () => resolve([imageUrl, 1]);
              image.src = imageUrl;
            }),
        ),
      );

      if (isDisposed) {
        return;
      }

      setImageAspectRatios(Object.fromEntries(entries));
    };

    void loadImageRatios();

    return () => {
      isDisposed = true;
    };
  }, [productImages]);

  useEffect(() => {
    setSelectedImage(0);
    setDragOffset(0);
    setIsDragging(false);
    pointerIdRef.current = null;
  }, [product?.id]);

  const totalImages = productImages.length;
  const hasMultipleImages = totalImages > 1;
  const controlsConfig = product ? (PRODUCT_CONTROLS_BY_SLUG[product.slug] ?? null) : null;
  const selectControls = controlsConfig?.selectControls ?? [];
  const hasControls = Boolean(controlsConfig?.dateControl) || selectControls.length > 0;
  const hasDateControl = Boolean(controlsConfig?.dateControl);
  const hasDynamicGalleryHeight = Boolean(product && DYNAMIC_GALLERY_SLUGS.has(product.slug));
  const shouldCompensateRelatedOffset =
    !hasMultipleImages || hasDynamicGalleryHeight || Boolean(product && RELATED_OFFSET_SLUGS.has(product.slug));
  const selectedImageUrl = productImages[selectedImage] ?? '';
  const selectedImageAspectRatio = Math.max(
    selectedImageUrl
      ? (imageAspectRatios[selectedImageUrl] ?? DEFAULT_DYNAMIC_GALLERY_ASPECT_RATIO)
      : DEFAULT_DYNAMIC_GALLERY_ASPECT_RATIO,
    MIN_ASPECT_RATIO,
  );

  useLayoutEffect(() => {
    if (!shouldCompensateRelatedOffset) {
      setNoSliderRelatedShift(0);

      return;
    }

    const galleryEl = productGalleryRef.current;
    const contentEl = productContentRef.current;

    if (!galleryEl || !contentEl) {
      setNoSliderRelatedShift(0);

      return;
    }

    const updateShift = () => {
      const galleryHeight = galleryEl.offsetHeight;
      const contentHeight = contentEl.offsetHeight;
      const extraHeight = Math.max(0, contentHeight - galleryHeight);

      setNoSliderRelatedShift(-extraHeight);
    };

    updateShift();

    const observer = new ResizeObserver(updateShift);
    observer.observe(galleryEl);
    observer.observe(contentEl);
    window.addEventListener('resize', updateShift);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateShift);
    };
  }, [shouldCompensateRelatedOffset, hasDynamicGalleryHeight, product?.id, hasControls]);

  useLayoutEffect(() => {
    if (!hasDynamicGalleryHeight) {
      setGalleryMainHeight(null);

      return;
    }

    const galleryEl = galleryMainRef.current;
    if (!galleryEl) {
      return;
    }

    const updateHeight = () => {
      const width = galleryEl.offsetWidth || 690;
      const nextHeight = isSixteenByNineRatio(selectedImageAspectRatio)
        ? Math.round(width * (FORCED_16_BY_9_HEIGHT / FORCED_16_BY_9_WIDTH))
        : Math.round(width / selectedImageAspectRatio);

      setGalleryMainHeight((previousHeight) => (previousHeight === nextHeight ? previousHeight : nextHeight));
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(galleryEl);
    window.addEventListener('resize', updateHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateHeight);
    };
  }, [hasDynamicGalleryHeight, product?.id, selectedImageAspectRatio]);

  useEffect(() => {
    if (!product) {
      setSelectedControlValues({});
      setDeliveryDate('');
      setVisibleMonthStart(currentMonthStart);
      setIsDatePickerOpen(false);

      return;
    }

    const config = PRODUCT_CONTROLS_BY_SLUG[product.slug];
    if (!config) {
      setSelectedControlValues({});
      setDeliveryDate('');
      setVisibleMonthStart(currentMonthStart);
      setIsDatePickerOpen(false);

      return;
    }

    const nextValues: Record<string, string> = {};
    (config.selectControls ?? []).forEach((control) => {
      nextValues[control.id] =
        control.defaultValue && control.options.includes(control.defaultValue) ? control.defaultValue : '';
    });

    setSelectedControlValues(nextValues);
    setDeliveryDate('');
    setVisibleMonthStart(currentMonthStart);
    setIsDatePickerOpen(false);
  }, [product, currentMonthStart]);

  useEffect(() => {
    if (!isDatePickerOpen) {
      return;
    }

    const onPointerDown = (event: MouseEvent) => {
      const root = deliveryDateWrapRef.current;
      if (!root) {
        return;
      }

      if (event.target instanceof Node && !root.contains(event.target)) {
        setIsDatePickerOpen(false);
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDatePickerOpen(false);
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    window.addEventListener('keydown', onEscape);

    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('keydown', onEscape);
    };
  }, [isDatePickerOpen]);

  useEffect(() => {
    if (!hasDateControl || !deliveryDate) {
      return;
    }

    const selectedDate = fromIsoDate(deliveryDate);
    if (!selectedDate) {
      return;
    }

    const selectedMonthStart = toStartOfMonth(selectedDate);
    if (
      selectedMonthStart.getFullYear() === visibleMonthStart.getFullYear() &&
      selectedMonthStart.getMonth() === visibleMonthStart.getMonth()
    ) {
      return;
    }

    setVisibleMonthStart(selectedMonthStart);
  }, [deliveryDate, hasDateControl, visibleMonthStart]);

  const goToImage = (nextIndex: number) => {
    if (!totalImages) {
      return;
    }

    const normalizedIndex = ((nextIndex % totalImages) + totalImages) % totalImages;
    setSelectedImage(normalizedIndex);
  };

  const goToPrevious = () => goToImage(selectedImage - 1);
  const goToNext = () => goToImage(selectedImage + 1);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!hasMultipleImages) {
      return;
    }

    if (event.pointerType === 'mouse' && event.button !== 0) {
      return;
    }

    pointerIdRef.current = event.pointerId;
    dragStartXRef.current = event.clientX;
    setIsDragging(true);
    setDragOffset(0);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging || pointerIdRef.current !== event.pointerId) {
      return;
    }

    setDragOffset(event.clientX - dragStartXRef.current);
  };

  const handlePointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== event.pointerId) {
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const viewportWidth = galleryViewportRef.current?.offsetWidth ?? 1;
    const threshold = Math.min(120, viewportWidth * 0.18);

    if (dragOffset > threshold) {
      goToPrevious();
    } else if (dragOffset < -threshold) {
      goToNext();
    }

    setDragOffset(0);
    setIsDragging(false);
    pointerIdRef.current = null;
  };

  if (isLoading) {
    return (
      <Layout>
        <main className="product_detail">
          <section className="container product_detail_top">
            <p>Загрузка товара...</p>
          </section>
        </main>
      </Layout>
    );
  }

  if (!product || errorMessage) {
    return (
      <Layout>
        <main className="product_detail">
          <section className="container product_detail_top">
            <p>{errorMessage ?? 'Товар не найден'}</p>
          </section>
        </main>
      </Layout>
    );
  }

  const allergensText = product.allergens.length > 0 ? `Аллергены: ${product.allergens.join(', ')}.` : null;
  const priceByQuantity = PRICE_BY_QUANTITY_BY_SLUG[product.slug];
  const selectedQuantity = priceByQuantity ? Number((selectedControlValues.quantity ?? '').match(/\d+/)?.[0] ?? '') : null;
  const selectedPrice = selectedQuantity !== null ? priceByQuantity?.[selectedQuantity] : undefined;
  const hasSelectedPrice = selectedPrice !== undefined;
  const displayPricePrefix = hasSelectedPrice ? '' : controlsConfig?.pricePrefix ?? '';
  const displayPrice = `${displayPricePrefix}${hasSelectedPrice ? formatRubPrice(selectedPrice) : product.price}`;
  const isCompactCtaButton = product.slug === 'macaron-wreath-cake';
  const formattedDeliveryDate = deliveryDate
    ? deliveryDate.split('-').reverse().join('.')
    : controlsConfig?.dateControl?.placeholder ?? '';

  const isCurrentMonthShown =
    visibleMonthStart.getFullYear() === currentMonthStart.getFullYear() &&
    visibleMonthStart.getMonth() === currentMonthStart.getMonth();
  const isMaxMonthShown =
    visibleMonthStart.getFullYear() === maxDeliveryMonthStart.getFullYear() &&
    visibleMonthStart.getMonth() === maxDeliveryMonthStart.getMonth();

  const visibleMonthLabel = `${MONTH_NAMES[visibleMonthStart.getMonth()]} ${visibleMonthStart.getFullYear()}`;

  const leadingEmptyDays = (visibleMonthStart.getDay() + 6) % 7;
  const monthDaysCount = new Date(
    visibleMonthStart.getFullYear(),
    visibleMonthStart.getMonth() + 1,
    0,
  ).getDate();

  const calendarCells = [
    ...Array.from({ length: leadingEmptyDays }, (_, index) => ({
      key: `empty-${index}`,
      date: null as Date | null,
    })),
    ...Array.from({ length: monthDaysCount }, (_, index) => ({
      key: `day-${index + 1}`,
      date: new Date(visibleMonthStart.getFullYear(), visibleMonthStart.getMonth(), index + 1),
    })),
  ];

  const goPrevMonth = () => {
    if (isCurrentMonthShown) {
      return;
    }

    setVisibleMonthStart(new Date(visibleMonthStart.getFullYear(), visibleMonthStart.getMonth() - 1, 1));
  };

  const goNextMonth = () => {
    if (isMaxMonthShown) {
      return;
    }

    setVisibleMonthStart(new Date(visibleMonthStart.getFullYear(), visibleMonthStart.getMonth() + 1, 1));
  };

  const selectDeliveryDate = (date: Date) => {
    const normalizedDate = toStartOfDay(date);

    if (normalizedDate.getTime() < todayDate.getTime() || normalizedDate.getTime() > maxDeliveryDate.getTime()) {
      return;
    }

    setDeliveryDate(toIsoDate(normalizedDate));
    setIsDatePickerOpen(false);
  };

  const galleryMainStyle =
    hasDynamicGalleryHeight && galleryMainHeight !== null ? { height: `${galleryMainHeight}px` } : undefined;

  return (
    <Layout>
      <main className={`product_detail${hasMultipleImages ? '' : ' product_detail_no_slider'}`}>
        <section className="container product_detail_top">
          <div ref={productGalleryRef} className="product_gallery">
            <div
              ref={galleryMainRef}
              className={`product_gallery_main${
                product.slug === 'toast-caviar' || product.slug === 'ikra' || product.slug === 'salad-avocado'
                  ? ' product_gallery_main_wide'
                  : ''
              }${hasDynamicGalleryHeight ? ' product_gallery_main_dynamic' : ''}`}
              style={galleryMainStyle}
            >
              {hasMultipleImages ? (
                <button
                  type="button"
                  className="product_gallery_nav product_gallery_nav_prev"
                  onClick={goToPrevious}
                  aria-label="Предыдущее фото"
                >
                  <img src={sliderArrow} alt="" />
                </button>
              ) : null}

              <div
                ref={galleryViewportRef}
                className={`product_gallery_viewport${isDragging ? ' is_dragging' : ''}`}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerEnd}
                onPointerCancel={handlePointerEnd}
              >
                <div
                  className="product_gallery_track"
                  style={{
                    transform: `translateX(calc(${-selectedImage * 100}% + ${dragOffset}px))`,
                    transition: isDragging ? 'none' : 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                >
                  {productImages.map((image, index) => (
                    <div className="product_gallery_slide" key={`${image}-${index}`}>
                      <img src={image} alt={product.title} draggable={false} />
                    </div>
                  ))}
                </div>
              </div>

              {hasMultipleImages ? (
                <button
                  type="button"
                  className="product_gallery_nav product_gallery_nav_next"
                  onClick={goToNext}
                  aria-label="Следующее фото"
                >
                  <img src={sliderArrow} alt="" />
                </button>
              ) : null}
            </div>

            {hasMultipleImages ? (
              <div className="product_gallery_thumbs">
                {productImages.map((image, index) => (
                  <button
                    key={`${image}-thumb-${index}`}
                    type="button"
                    className={`product_thumb${selectedImage === index ? ' is_active' : ''}`}
                    onClick={() => goToImage(index)}
                    aria-label={`Фото ${index + 1}`}
                  >
                    <img src={image} alt="" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <article ref={productContentRef} className="product_content">
            <h1>{product.title}</h1>
            {product.description ? <p>{product.description}</p> : null}
            {allergensText ? <p className="product_allergens">{allergensText}</p> : null}
            {product.allergy_note ? <p>{product.allergy_note}</p> : null}

            {hasControls ? (
              <div className="product_addons">
                {controlsConfig?.dateControl ? (
                  <div
                    ref={deliveryDateWrapRef}
                    className="product_addons_date_wrap"
                    style={{ width: `${controlsConfig.dateControl.width}px` }}
                  >
                    <button
                      type="button"
                      className={`product_addons_select product_addons_date_trigger${
                        deliveryDate ? ' is_filled' : ''
                      }${isDatePickerOpen ? ' is_open' : ''}`}
                      onClick={() => setIsDatePickerOpen((prev) => !prev)}
                      aria-haspopup="dialog"
                      aria-expanded={isDatePickerOpen}
                      aria-controls="product-delivery-datepicker"
                      aria-label={controlsConfig.dateControl.ariaLabel}
                    >
                      {formattedDeliveryDate}
                    </button>

                    {isDatePickerOpen ? (
                      <div id="product-delivery-datepicker" className="product_datepicker" role="dialog">
                        <div className="product_datepicker_header">
                          <button
                            type="button"
                            className="product_datepicker_nav"
                            onClick={goPrevMonth}
                            disabled={isCurrentMonthShown}
                            aria-label="Предыдущий месяц"
                          >
                            {'<'}
                          </button>
                          <div className="product_datepicker_title">{visibleMonthLabel}</div>
                          <button
                            type="button"
                            className="product_datepicker_nav"
                            onClick={goNextMonth}
                            disabled={isMaxMonthShown}
                            aria-label="Следующий месяц"
                          >
                            {'>'}
                          </button>
                        </div>

                        <div className="product_datepicker_weekdays">
                          {WEEKDAY_NAMES.map((day) => (
                            <span key={day}>{day}</span>
                          ))}
                        </div>

                        <div className="product_datepicker_days">
                          {calendarCells.map((cell) => {
                            if (!cell.date) {
                              return <span key={cell.key} className="product_datepicker_day_empty" />;
                            }

                            const normalizedDate = toStartOfDay(cell.date);
                            const isDisabled =
                              normalizedDate.getTime() < todayDate.getTime() ||
                              normalizedDate.getTime() > maxDeliveryDate.getTime();
                            const isSelected = deliveryDate === toIsoDate(normalizedDate);

                            return (
                              <button
                                key={cell.key}
                                type="button"
                                className={`product_datepicker_day${isSelected ? ' is_selected' : ''}`}
                                onClick={() => selectDeliveryDate(normalizedDate)}
                                disabled={isDisabled}
                              >
                                {normalizedDate.getDate()}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {selectControls.map((control) => (
                  <select
                    key={control.id}
                    id={`product-control-${control.id}`}
                    className="product_addons_select"
                    style={{ width: `${control.width}px` }}
                    value={selectedControlValues[control.id] ?? ''}
                    onChange={(event) =>
                      setSelectedControlValues((prev) => ({
                        ...prev,
                        [control.id]: event.target.value,
                      }))
                    }
                    aria-label={control.ariaLabel}
                  >
                    <option value="">{control.placeholder}</option>
                    {control.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ))}
              </div>
            ) : null}

            <div className={`product_cta_row${hasControls ? ' product_cta_row_with_addons' : ''}`}>
              <button type="button" className={isCompactCtaButton ? 'product_cta_button_compact' : undefined}>
                В корзину
              </button>
              <span>{displayPrice}</span>
            </div>
          </article>
        </section>

        <section
          className={`container product_related${hasMultipleImages ? '' : ' product_related_no_slider'}`}
          style={noSliderRelatedShift !== 0 ? { marginTop: `${noSliderRelatedShift}px` } : undefined}
        >
          <h2>Вас также заинтересует</h2>
          <div className="product_related_grid">
            {product.related.map((item) => (
              <article className="product_related_card" key={item.slug}>
                <a href={`/products/${item.slug}`}>
                  <div className="product_related_img_wrap">
                    <img src={item.main_image_url} alt={item.title} />
                  </div>
                  <h3>{item.title}</h3>
                  <div className="product_related_meta">
                    <p className="product_related_price">{item.price}</p>
                    <p className="product_related_cta">В корзину</p>
                  </div>
                </a>
              </article>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default ProductDetail;
