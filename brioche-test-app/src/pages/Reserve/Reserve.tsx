import { ChangeEvent, FormEvent, useState } from 'react';
import Layout from '../../components/layout/Layout';
import './Reserve.scss';

type ReserveForm = {
  day: string;
  visitTime: string;
  name: string;
  phone: string;
  guests: string;
  comment: string;
  agree: boolean;
};

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
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onFieldChange =
    (field: keyof ReserveForm) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setIsSubmitted(false);
      const value = event.target instanceof HTMLInputElement && event.target.type === 'checkbox'
        ? event.target.checked
        : event.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
    };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <Layout>
      <main className="reserve">
        <section className="reserve_hero" aria-label="Блок баннера">
          <div className="reserve_hero_placeholder">Заглушка под фоновое фото</div>
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
                  <input value={form.day} onChange={onFieldChange('day')} placeholder="День*" type="text" />
                </label>

                <label className="reserve_field">
                  <input value={form.visitTime} onChange={onFieldChange('visitTime')} placeholder="Время*" type="text" />
                </label>
              </div>

              <h2 className="reserve_group_title">Информация о гостях</h2>
              <div className="reserve_row">
                <label className="reserve_field">
                  <input value={form.name} onChange={onFieldChange('name')} placeholder="Имя*" type="text" />
                </label>

                <label className="reserve_field">
                  <input
                    value={form.guests}
                    onChange={onFieldChange('guests')}
                    placeholder="Сколько гостей*"
                    type="text"
                  />
                </label>
              </div>

              <label className="reserve_field">
                <input
                  value={form.phone}
                  onChange={onFieldChange('phone')}
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
                <button type="submit">Забронировать столик</button>
                {isSubmitted && <p className="reserve_success">Заявка отправлена. Скоро с вами свяжемся.</p>}
              </div>
            </form>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Reserve;
