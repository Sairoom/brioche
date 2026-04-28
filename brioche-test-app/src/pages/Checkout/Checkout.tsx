import { useEffect, useMemo, useRef, useState } from 'react';
import Layout from '../../components/layout/Layout';
import { API_BASE_URL } from '../../config/api';
import { clearCartItems, formatRubles, useCartTotals } from '../../features/cart/cartStorage';
import './Checkout.scss';

type CheckoutStep = 2 | 3;
type DeliveryMethod = 'pickup' | 'address';
type RecipientType = 'self' | 'gift';
type DeliveryTimeSlot = '' | '10:00-12:00' | '12:00-14:00' | '14:00-17:00' | '17:00-20:00' | '20:00-22:00';

type OrderPayloadOption = {
  id: string;
  label: string;
  value: string;
};

type OrderPayloadItem = {
  product_id: number;
  slug: string;
  title: string;
  unit_price: number;
  quantity: number;
  options: OrderPayloadOption[];
};

type OrderPayload = {
  customer_name: string;
  customer_phone: string;
  recipient_type: RecipientType;
  recipient_name: string | null;
  recipient_phone: string | null;
  delivery_method: DeliveryMethod;
  delivery_address: string | null;
  delivery_entrance: string | null;
  delivery_floor: string | null;
  delivery_apartment: string | null;
  delivery_date: string;
  delivery_time: string;
  comment: string | null;
  items: OrderPayloadItem[];
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
const DELIVERY_TIME_OPTIONS: Exclude<DeliveryTimeSlot, ''>[] = [
  '10:00-12:00',
  '12:00-14:00',
  '14:00-17:00',
  '17:00-20:00',
  '20:00-22:00',
];

const toStartOfDay = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const toStartOfMonth = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), 1);
const toEndOfMonth = (date: Date): Date => new Date(date.getFullYear(), date.getMonth() + 1, 0);
const addMonths = (date: Date, months: number): Date => new Date(date.getFullYear(), date.getMonth() + months, 1);

const toIsoDate = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');

  return `${y}-${m}-${d}`;
};

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

const formatPhoneRu = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  const normalized = digits.startsWith('7') ? digits : `7${digits}`;
  const limited = normalized.slice(0, 11);
  const d = limited.slice(1);

  let result = '+7';
  if (d.length > 0) {
    result += ` ${d.slice(0, 3)}`;
  }
  if (d.length > 3) {
    result += ` ${d.slice(3, 6)}`;
  }
  if (d.length > 6) {
    result += ` ${d.slice(6, 8)}`;
  }
  if (d.length > 8) {
    result += ` ${d.slice(8, 10)}`;
  }

  return result;
};

const isValidRuPhone = (value: string): boolean => /^\+7 \d{3} \d{3} \d{2} \d{2}$/.test(value.trim());
const onlyDigits = (value: string): string => value.replace(/\D/g, '');

const Checkout = () => {
  const { items, totalPrice } = useCartTotals();
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>(2);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('address');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryEntrance, setDeliveryEntrance] = useState('');
  const [deliveryFloor, setDeliveryFloor] = useState('');
  const [deliveryApartment, setDeliveryApartment] = useState('');

  const [recipientType, setRecipientType] = useState<RecipientType>('self');
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');

  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState<DeliveryTimeSlot>('');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [detailsComment, setDetailsComment] = useState('');
  const deliveryDateWrapRef = useRef<HTMLDivElement | null>(null);

  const todayDate = useMemo(() => toStartOfDay(new Date()), []);
  const currentMonthStart = useMemo(() => toStartOfMonth(todayDate), [todayDate]);
  const maxDeliveryDate = useMemo(() => toStartOfDay(toEndOfMonth(addMonths(todayDate, 3))), [todayDate]);
  const maxDeliveryMonthStart = useMemo(() => toStartOfMonth(maxDeliveryDate), [maxDeliveryDate]);
  const [visibleMonthStart, setVisibleMonthStart] = useState<Date>(currentMonthStart);

  const hasItems = items.length > 0;
  const deliveryPrice = deliveryMethod === 'address' ? 800 : 0;
  const grandTotal = totalPrice + deliveryPrice;

  const isCurrentMonthShown =
    visibleMonthStart.getFullYear() === currentMonthStart.getFullYear() &&
    visibleMonthStart.getMonth() === currentMonthStart.getMonth();
  const isMaxMonthShown =
    visibleMonthStart.getFullYear() === maxDeliveryMonthStart.getFullYear() &&
    visibleMonthStart.getMonth() === maxDeliveryMonthStart.getMonth();

  const visibleMonthLabel = `${MONTH_NAMES[visibleMonthStart.getMonth()]} ${visibleMonthStart.getFullYear()}`;
  const leadingEmptyDays = (visibleMonthStart.getDay() + 6) % 7;
  const monthDaysCount = new Date(visibleMonthStart.getFullYear(), visibleMonthStart.getMonth() + 1, 0).getDate();

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

  const formattedDeliveryDate = deliveryDate
    ? deliveryDate.split('-').reverse().join('.')
    : deliveryMethod === 'pickup'
      ? 'В какой день заберете заказ?'
      : 'В какой день доставить заказ?';

  useEffect(() => {
    setIsDatePickerOpen(false);
  }, [deliveryMethod]);

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
    if (!deliveryDate) {
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
  }, [deliveryDate, visibleMonthStart]);

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

  const validateForm = (): string | null => {
    if (!hasItems) {
      return 'Корзина пуста. Добавьте товары перед оформлением.';
    }

    if (!customerName.trim()) {
      return 'Укажите ваше имя.';
    }

    if (!customerPhone.trim()) {
      return 'Укажите ваш телефон.';
    }
    if (!isValidRuPhone(customerPhone)) {
      return 'Телефон должен быть в формате +7 XXX XXX XX XX.';
    }

    if (deliveryMethod === 'address' && !deliveryAddress.trim()) {
      return 'Укажите улицу и номер дома для доставки.';
    }

    if (recipientType === 'gift') {
      if (!recipientName.trim()) {
        return 'Укажите имя получателя.';
      }

      if (!recipientPhone.trim()) {
        return 'Укажите телефон получателя.';
      }
      if (!isValidRuPhone(recipientPhone)) {
        return 'Телефон получателя должен быть в формате +7 XXX XXX XX XX.';
      }
    }

    if (!deliveryDate) {
      return 'Выберите дату доставки.';
    }

    if (!deliveryTime) {
      return 'Выберите время доставки.';
    }

    return null;
  };

  const handleSubmitOrder = async () => {
    if (isSubmitting) {
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);

    const payload: OrderPayload = {
      customer_name: customerName.trim(),
      customer_phone: customerPhone.trim(),
      recipient_type: recipientType,
      recipient_name: recipientType === 'gift' ? recipientName.trim() : null,
      recipient_phone: recipientType === 'gift' ? recipientPhone.trim() : null,
      delivery_method: deliveryMethod,
      delivery_address: deliveryMethod === 'address' ? deliveryAddress.trim() : null,
      delivery_entrance: deliveryMethod === 'address' && deliveryEntrance.trim() ? deliveryEntrance.trim() : null,
      delivery_floor: deliveryMethod === 'address' && deliveryFloor.trim() ? deliveryFloor.trim() : null,
      delivery_apartment: deliveryMethod === 'address' && deliveryApartment.trim() ? deliveryApartment.trim() : null,
      delivery_date: deliveryDate,
      delivery_time: deliveryTime.replace('-', ' — '),
      comment: detailsComment.trim() ? detailsComment.trim() : null,
      items: items.map((item) => ({
        product_id: item.productId,
        slug: item.slug,
        title: item.title,
        unit_price: item.unitPrice,
        quantity: item.quantity,
        options: item.options.map((option) => ({
          id: option.id,
          label: option.label,
          value: option.value,
        })),
      })),
    };

    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      let responseJson: unknown = null;
      try {
        responseJson = await response.json();
      } catch {
        responseJson = null;
      }

      if (!response.ok) {
        const errors = (responseJson as { errors?: Record<string, string[]> } | null)?.errors;
        const firstValidationMessage = errors ? Object.values(errors).flat().find(Boolean) : null;
        const fallbackMessage = (responseJson as { message?: string } | null)?.message;
        throw new Error(firstValidationMessage ?? fallbackMessage ?? 'Не удалось оформить заказ.');
      }

      const nextOrderNumber =
        (responseJson as { data?: { order?: { order_number?: string } } } | null)?.data?.order?.order_number ?? null;

      setOrderNumber(typeof nextOrderNumber === 'string' ? nextOrderNumber : null);
      setCheckoutStep(3);
      clearCartItems();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Не удалось оформить заказ.';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <main className="checkout_step2">
        <section className="container checkout_step2_content">
          <aside className="checkout_step2_sidebar">
            <h1>Оформление заказа</h1>
            <ol>
              <li>
                <span className="checkout_step2_number">1</span>
                <span>Ваша корзина</span>
              </li>
              <li className={checkoutStep === 2 ? 'is_active' : undefined}>
                <span className="checkout_step2_number">2</span>
                <span>Доставка и оплата</span>
              </li>
              <li className={checkoutStep === 3 ? 'is_active' : undefined}>
                <span className="checkout_step2_number">3</span>
                <span>Завершение покупки</span>
              </li>
            </ol>
          </aside>

          <article className={`checkout_step2_main${checkoutStep === 3 ? ' checkout_step2_main_step3' : ''}`}>
            {checkoutStep === 3 ? (
              <section className="checkout_step3_success">
                <h2>Заказ оформлен, ожидайте звонка менеджера</h2>
                {orderNumber ? <p>Номер заказа: {orderNumber}</p> : null}
                <a className="checkout_btn checkout_btn_next" href="/">
                  На главную
                </a>
              </section>
            ) : !hasItems ? (
              <>
                <p className="checkout_step2_empty">Ваша корзина пуста. Добавьте товары, чтобы перейти к оформлению.</p>
                <a className="checkout_step2_back" href="/cart">
                  Вернуться в корзину
                </a>
              </>
            ) : (
              <>
                <section className="checkout_block">
                  <h2>Контактные данные</h2>
                  <div className="checkout_contact_row">
                    <input
                      type="text"
                      placeholder="Ваше имя *"
                      value={customerName}
                      onChange={(event) => setCustomerName(event.target.value)}
                    />
                    <input
                      type="tel"
                      placeholder="+7 999 123 45 67 *"
                      value={customerPhone}
                      onChange={(event) => setCustomerPhone(formatPhoneRu(event.target.value))}
                    />
                  </div>
                </section>

                <section className="checkout_block">
                  <div className="checkout_delivery_head">
                    <h2>Доставка</h2>
                    <a href="/delivery">Подробнее о доставке</a>
                  </div>

                  <div className="checkout_radio_row">
                    <label>
                      <input
                        type="radio"
                        name="delivery_method"
                        value="pickup"
                        checked={deliveryMethod === 'pickup'}
                        onChange={() => setDeliveryMethod('pickup')}
                      />
                      Самовывоз *
                    </label>

                    <label>
                      <input
                        type="radio"
                        name="delivery_method"
                        value="address"
                        checked={deliveryMethod === 'address'}
                        onChange={() => setDeliveryMethod('address')}
                      />
                      Доставка по адресу *
                    </label>
                  </div>

                  {deliveryMethod === 'address' ? (
                    <div className="checkout_address_row">
                      <input
                        type="text"
                        placeholder="Улица и номер дома *"
                        value={deliveryAddress}
                        onChange={(event) => setDeliveryAddress(event.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Подъезд"
                        value={deliveryEntrance}
                        onChange={(event) => setDeliveryEntrance(onlyDigits(event.target.value))}
                      />
                      <input
                        type="text"
                        placeholder="Этаж"
                        value={deliveryFloor}
                        onChange={(event) => setDeliveryFloor(onlyDigits(event.target.value))}
                      />
                      <input
                        type="text"
                        placeholder="Квартира"
                        value={deliveryApartment}
                        onChange={(event) => setDeliveryApartment(onlyDigits(event.target.value))}
                      />
                    </div>
                  ) : null}

                  <div className="checkout_pickup_controls">
                    <div ref={deliveryDateWrapRef} className="checkout_pickup_date_wrap">
                      <button
                        type="button"
                        className={`checkout_pickup_date_trigger${deliveryDate ? ' is_filled' : ''}${
                          isDatePickerOpen ? ' is_open' : ''
                        }`}
                        onClick={() => setIsDatePickerOpen((prev) => !prev)}
                        aria-haspopup="dialog"
                        aria-expanded={isDatePickerOpen}
                        aria-controls="checkout-delivery-datepicker"
                        aria-label="Выберите день доставки"
                      >
                        {formattedDeliveryDate}
                      </button>

                      {isDatePickerOpen ? (
                        <div id="checkout-delivery-datepicker" className="checkout_datepicker" role="dialog">
                          <div className="checkout_datepicker_header">
                            <button
                              type="button"
                              className="checkout_datepicker_nav"
                              onClick={goPrevMonth}
                              disabled={isCurrentMonthShown}
                              aria-label="Предыдущий месяц"
                            >
                              {'<'}
                            </button>
                            <div className="checkout_datepicker_title">{visibleMonthLabel}</div>
                            <button
                              type="button"
                              className="checkout_datepicker_nav"
                              onClick={goNextMonth}
                              disabled={isMaxMonthShown}
                              aria-label="Следующий месяц"
                            >
                              {'>'}
                            </button>
                          </div>

                          <div className="checkout_datepicker_weekdays">
                            {WEEKDAY_NAMES.map((day) => (
                              <span key={day}>{day}</span>
                            ))}
                          </div>

                          <div className="checkout_datepicker_days">
                            {calendarCells.map((cell) => {
                              if (!cell.date) {
                                return <span key={cell.key} className="checkout_datepicker_day_empty" />;
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
                                  className={`checkout_datepicker_day${isSelected ? ' is_selected' : ''}`}
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

                    <select
                      className="checkout_pickup_time"
                      value={deliveryTime}
                      onChange={(event) => setDeliveryTime(event.target.value as DeliveryTimeSlot)}
                      aria-label="Выберите время доставки"
                    >
                      <option value="">Выберите время...</option>
                      {DELIVERY_TIME_OPTIONS.map((time) => (
                        <option key={time} value={time}>
                          {time.replace('-', ' — ')}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="checkout_radio_column">
                    <label>
                      <input
                        type="radio"
                        name="recipient_type"
                        value="self"
                        checked={recipientType === 'self'}
                        onChange={() => setRecipientType('self')}
                      />
                      Заказываю себе *
                    </label>

                    <label>
                      <input
                        type="radio"
                        name="recipient_type"
                        value="gift"
                        checked={recipientType === 'gift'}
                        onChange={() => setRecipientType('gift')}
                      />
                      Заказываю в подарок *
                    </label>
                  </div>

                  {recipientType === 'gift' ? (
                    <div className="checkout_gift_row">
                      <input
                        type="text"
                        placeholder="Имя получателя *"
                        value={recipientName}
                        onChange={(event) => setRecipientName(event.target.value)}
                      />
                      <input
                        type="tel"
                        placeholder="+7 999 123 45 67 *"
                        value={recipientPhone}
                        onChange={(event) => setRecipientPhone(formatPhoneRu(event.target.value))}
                      />
                    </div>
                  ) : null}
                </section>

                <section className="checkout_block checkout_details_block">
                  <h2>Детали</h2>
                  <textarea
                    placeholder="Если у вас есть дополнительные пожелания к заказу, пожалуйста, опишите их в этом поле."
                    value={detailsComment}
                    onChange={(event) => setDetailsComment(event.target.value)}
                  />
                </section>

                <section className="checkout_block checkout_summary">
                  <h2>Ваш заказ</h2>

                  <div className="checkout_summary_rows">
                    {items.map((item) => (
                      <article className="checkout_summary_item" key={item.id}>
                        <div className="checkout_summary_head">
                          <p className="checkout_summary_title">
                            {item.title} &#215; {item.quantity}
                          </p>
                          <p className="checkout_summary_price">{formatRubles(item.unitPrice * item.quantity)}</p>
                        </div>

                        {item.options.length > 0 ? (
                          <div className="checkout_summary_options">
                            {item.options.map((option) => (
                              <p key={`${item.id}-${option.id}`}>
                                {option.label}: {option.value}
                              </p>
                            ))}
                          </div>
                        ) : null}
                      </article>
                    ))}

                    <div className="checkout_summary_line checkout_summary_delivery">
                      <span>Доставка</span>
                      <span>
                        {deliveryMethod === 'address'
                          ? `Доставка в пределах МКАД: ${formatRubles(deliveryPrice)}`
                          : 'Самовывоз: 0 ₽'}
                      </span>
                    </div>

                    <div className="checkout_summary_line checkout_summary_total">
                      <span>Итого</span>
                      <span>{formatRubles(grandTotal)}</span>
                    </div>
                  </div>
                </section>

                <section className="checkout_block checkout_payment">
                  <h2>Оплата</h2>

                  <label className="checkout_payment_option">
                    <input type="radio" name="payment_method" defaultChecked />
                    Оплата после подтверждения заказа менеджером
                  </label>
                </section>

                {submitError ? <p className="checkout_form_error">{submitError}</p> : null}

                <div className="checkout_actions">
                  <a href="/cart" className="checkout_btn checkout_btn_back">
                    ← Назад
                  </a>
                  <button type="button" className="checkout_btn checkout_btn_next" onClick={handleSubmitOrder} disabled={isSubmitting}>
                    {isSubmitting ? 'Оформляем...' : 'Оформить заказ'}
                  </button>
                </div>
              </>
            )}
          </article>
        </section>
      </main>
    </Layout>
  );
};

export default Checkout;
