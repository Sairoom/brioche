import { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { formatRubles, useCartTotals } from '../../features/cart/cartStorage';
import './Checkout.scss';

type DeliveryMethod = 'pickup' | 'address';
type RecipientType = 'self' | 'gift';

const Checkout = () => {
  const { items, totalPrice } = useCartTotals();
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('address');
  const [recipientType, setRecipientType] = useState<RecipientType>('self');

  const hasItems = items.length > 0;
  const deliveryPrice = deliveryMethod === 'address' ? 800 : 0;
  const grandTotal = totalPrice + deliveryPrice;

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
              <li className="is_active">
                <span className="checkout_step2_number">2</span>
                <span>Доставка и оплата</span>
              </li>
              <li>
                <span className="checkout_step2_number">3</span>
                <span>Завершение покупки</span>
              </li>
            </ol>
          </aside>

          <article className="checkout_step2_main">
            {!hasItems ? (
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
                    <input type="text" placeholder="Ваше имя *" />
                    <input type="tel" placeholder="Ваш телефон *" />
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
                      <input type="text" placeholder="Улица и номер дома *" />
                      <input type="number" placeholder="Подъезд" />
                      <input type="number" placeholder="Этаж" />
                      <input type="number" placeholder="Квартира" />
                    </div>
                  ) : null}

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
                </section>

                <section className="checkout_block">
                  <h2>Детали</h2>
                  <textarea placeholder="Если у вас есть дополнительные пожелания к заказу, пожалуйста, опишите их в этом поле." />
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

                <div className="checkout_actions">
                  <a href="/cart" className="checkout_btn checkout_btn_back">
                    ← Назад
                  </a>
                  <button type="button" className="checkout_btn checkout_btn_next">
                    Продолжить
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
