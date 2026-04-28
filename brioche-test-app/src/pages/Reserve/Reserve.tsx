import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import Layout from '../../components/layout/Layout';
import { API_BASE_URL } from '../../config/api';
import './Reserve.scss';
import ReserveBG from '../../assets/images/Reserve/reserve-bg1.jpg';

type ReserveForm = {
  day: string;
  visitTime: string;
  name: string;
  phone: string;
  guests: string;
  comment: string;
  agree: boolean;
};

type ReservePayload = {
  reservation_date: string;
  reservation_time: string;
  customer_name: string;
  customer_phone: string;
  guests: string;
  comment: string | null;
  agree_personal_data: boolean;
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

const initialForm: ReserveForm = {
  day: '',
  visitTime: '',
  name: '',
  phone: '',
  guests: '',
  comment: '',
  agree: false,
};

const Reserve = () => {
  const [form, setForm] = useState<ReserveForm>(initialForm);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dayWrapRef = useRef<HTMLDivElement | null>(null);

  const todayDate = useMemo(() => toStartOfDay(new Date()), []);
  const currentMonthStart = useMemo(() => toStartOfMonth(todayDate), [todayDate]);
  const maxReservationDate = useMemo(() => toStartOfDay(toEndOfMonth(addMonths(todayDate, 3))), [todayDate]);
  const maxReservationMonthStart = useMemo(() => toStartOfMonth(maxReservationDate), [maxReservationDate]);
  const [visibleMonthStart, setVisibleMonthStart] = useState<Date>(currentMonthStart);

  const clearSubmitState = () => {
    setSubmitError(null);
    setSubmitSuccess(null);
  };

  const onFieldChange =
    (field: keyof ReserveForm) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      clearSubmitState();
      const value =
        event.target instanceof HTMLInputElement && event.target.type === 'checkbox'
          ? event.target.checked
          : event.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
    };

  const onPhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    clearSubmitState();
    setForm((prev) => ({ ...prev, phone: formatPhoneRu(event.target.value) }));
  };

  useEffect(() => {
    if (!isDatePickerOpen) {
      return;
    }

    const onPointerDown = (event: MouseEvent) => {
      const root = dayWrapRef.current;
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
    if (!form.day) {
      return;
    }

    const selectedDate = fromIsoDate(form.day);
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
  }, [form.day, visibleMonthStart]);

  const isCurrentMonthShown =
    visibleMonthStart.getFullYear() === currentMonthStart.getFullYear() &&
    visibleMonthStart.getMonth() === currentMonthStart.getMonth();
  const isMaxMonthShown =
    visibleMonthStart.getFullYear() === maxReservationMonthStart.getFullYear() &&
    visibleMonthStart.getMonth() === maxReservationMonthStart.getMonth();

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

  const selectDay = (date: Date) => {
    const normalizedDate = toStartOfDay(date);
    if (normalizedDate.getTime() < todayDate.getTime() || normalizedDate.getTime() > maxReservationDate.getTime()) {
      return;
    }

    clearSubmitState();
    setForm((prev) => ({ ...prev, day: toIsoDate(normalizedDate) }));
    setIsDatePickerOpen(false);
  };

  const validateForm = (): string | null => {
    if (!form.day) {
      return 'Выберите день бронирования.';
    }
    if (!form.visitTime) {
      return 'Выберите время визита.';
    }
    if (!form.name.trim()) {
      return 'Укажите имя.';
    }
    if (!form.guests) {
      return 'Укажите количество гостей.';
    }
    if (!form.phone.trim()) {
      return 'Укажите телефон.';
    }
    if (!isValidRuPhone(form.phone)) {
      return 'Телефон должен быть в формате +7 XXX XXX XX XX.';
    }
    if (!form.agree) {
      return 'Нужно согласиться на обработку персональных данных.';
    }

    return null;
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      setSubmitSuccess(null);
      setSubmitError(validationError);
      return;
    }

    setSubmitError(null);
    setSubmitSuccess(null);
    setIsSubmitting(true);

    const payload: ReservePayload = {
      reservation_date: form.day,
      reservation_time: form.visitTime,
      customer_name: form.name.trim(),
      customer_phone: form.phone.trim(),
      guests: form.guests,
      comment: form.comment.trim() ? form.comment.trim() : null,
      agree_personal_data: form.agree,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/reservations`, {
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
        throw new Error(firstValidationMessage ?? fallbackMessage ?? 'Не удалось отправить бронь.');
      }

      const reservationNumber =
        (responseJson as { data?: { reservation?: { reservation_number?: string } } } | null)?.data?.reservation
          ?.reservation_number ?? null;

      setForm(initialForm);
      setVisibleMonthStart(currentMonthStart);
      setIsDatePickerOpen(false);
      setSubmitSuccess(
        typeof reservationNumber === 'string'
          ? `Заявка отправлена. Номер брони: ${reservationNumber}.`
          : 'Заявка отправлена. Скоро с вами свяжемся.',
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Не удалось отправить бронь.';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedDay = form.day ? form.day.split('-').reverse().join('.') : 'День*';

  return (
    <Layout>
      <main className="reserve">
        <section className="reserve_hero" aria-label="Блок баннера">
          <img alt="" className="reserve_hero_image" src={ReserveBG} />
          <div className="reserve_hero_overlay">
            <h1>Забронировать стол</h1>
          </div>
        </section>

        <section className="reserve_form_section">
          <div className="container reserve_content">
            <form className="reserve_form" onSubmit={onSubmit}>
              <p className="reserve_hint">Пожалуйста, оставьте ваши пожелания в форме ниже.</p>

              <h2 className="reserve_group_title">Дата и время визита</h2>
              <div className="reserve_row">
                <label className="reserve_field">
                  <div ref={dayWrapRef} className="reserve_day_wrap">
                    <button
                      type="button"
                      className={`reserve_day_trigger${form.day ? ' is_filled' : ''}${isDatePickerOpen ? ' is_open' : ''}`}
                      onClick={() => setIsDatePickerOpen((prev) => !prev)}
                      aria-haspopup="dialog"
                      aria-expanded={isDatePickerOpen}
                      aria-controls="reserve-day-datepicker"
                      aria-label="Выберите день бронирования"
                    >
                      {formattedDay}
                    </button>

                    {isDatePickerOpen ? (
                      <div id="reserve-day-datepicker" className="reserve_datepicker" role="dialog">
                        <div className="reserve_datepicker_header">
                          <button
                            type="button"
                            className="reserve_datepicker_nav"
                            onClick={goPrevMonth}
                            disabled={isCurrentMonthShown}
                            aria-label="Предыдущий месяц"
                          >
                            {'<'}
                          </button>
                          <div className="reserve_datepicker_title">{visibleMonthLabel}</div>
                          <button
                            type="button"
                            className="reserve_datepicker_nav"
                            onClick={goNextMonth}
                            disabled={isMaxMonthShown}
                            aria-label="Следующий месяц"
                          >
                            {'>'}
                          </button>
                        </div>

                        <div className="reserve_datepicker_weekdays">
                          {WEEKDAY_NAMES.map((day) => (
                            <span key={day}>{day}</span>
                          ))}
                        </div>

                        <div className="reserve_datepicker_days">
                          {calendarCells.map((cell) => {
                            if (!cell.date) {
                              return <span key={cell.key} className="reserve_datepicker_day_empty" />;
                            }

                            const normalizedDate = toStartOfDay(cell.date);
                            const isDisabled =
                              normalizedDate.getTime() < todayDate.getTime() ||
                              normalizedDate.getTime() > maxReservationDate.getTime();
                            const isSelected = form.day === toIsoDate(normalizedDate);

                            return (
                              <button
                                key={cell.key}
                                type="button"
                                className={`reserve_datepicker_day${isSelected ? ' is_selected' : ''}`}
                                onClick={() => selectDay(normalizedDate)}
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
                </label>

                <label className="reserve_field">
                  <select value={form.visitTime} onChange={onFieldChange('visitTime')}>
                    <option value="">Время *</option>
                    <option value="09:00">09:00</option>
                    <option value="10:00">10:00</option>
                    <option value="11:00">11:00</option>
                    <option value="12:00">12:00</option>
                    <option value="13:00">13:00</option>
                    <option value="14:00">14:00</option>
                    <option value="15:00">15:00</option>
                    <option value="16:00">16:00</option>
                    <option value="17:00">17:00</option>
                    <option value="18:00">18:00</option>
                    <option value="19:00">19:00</option>
                    <option value="20:00">20:00</option>
                    <option value="21:00">21:00</option>
                  </select>
                </label>
              </div>

              <h2 className="reserve_group_title">Информация о гостях</h2>
              <div className="reserve_row">
                <label className="reserve_field">
                  <input value={form.name} onChange={onFieldChange('name')} placeholder="Имя*" type="text" />
                </label>

                <label className="reserve_field">
                  <select value={form.guests} onChange={onFieldChange('guests')}>
                    <option value="">Сколько гостей *</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10+">10+</option>
                  </select>
                </label>
              </div>

              <label className="reserve_field">
                <input
                  value={form.phone}
                  onChange={onPhoneChange}
                  placeholder="Телефон (для подтверждения брони)*"
                  type="tel"
                />
              </label>

              <h2 className="reserve_group_title">Пожелания</h2>
              <label className="reserve_field">
                <textarea
                  value={form.comment}
                  onChange={onFieldChange('comment')}
                  placeholder="Если есть дополнительные пожелания к брони, пожалуйста, опишите их в этом поле"
                  rows={5}
                />
              </label>

              <label className="reserve_checkbox">
                <input checked={form.agree} onChange={onFieldChange('agree')} type="checkbox" />
                <span>Соглашаюсь на обработку персональных данных</span>
              </label>

              <div className="reserve_actions">
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Отправляем...' : 'Забронировать столик'}
                </button>
                {submitSuccess ? <p className="reserve_success">{submitSuccess}</p> : null}
              </div>
              {submitError ? <p className="reserve_error">{submitError}</p> : null}
            </form>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Reserve;
