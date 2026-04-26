import Layout from '../../components/layout/Layout';
import trashIcon from '../../assets/images/trash.svg';
import {
  formatRubles,
  removeCartItem,
  updateCartItemQuantity,
  useCartTotals,
} from '../../features/cart/cartStorage';
import './Cart.scss';

const Cart = () => {
  const { items, totalPrice } = useCartTotals();
  const hasItems = items.length > 0;

  return (
    <Layout>
      <main className="cart">
        <section className="container cart_content">
          <aside className="cart_checkout">
            <h1>Оформление заказа</h1>
            <ol>
              <li className="is_active">
                <span className="cart_step_number">1</span>
                <span className="cart_cart">Ваша корзина</span>
              </li>
              <li>
                <span className="cart_step_number">2</span>
                <span className="cart_cart">Доставка и оплата</span>
              </li>
              <li>
                <span className="cart_step_number">3</span>
                <span className="cart_cart">Завершение покупки</span>
              </li>
            </ol>
          </aside>

          <article className="cart_main">
            {hasItems ? (
              <>
                <div className="cart_items">
                  {items.map((item) => {
                    const detailOptions = item.options;

                    return (
                      <article className="cart_item" key={item.id}>
                        <img className="cart_item_image" src={item.imageUrl} alt={item.title} />

                        <div className="cart_item_info">
                          <h2>{item.title}</h2>
                          {detailOptions.map((option) => (
                            <p key={`${item.id}-${option.id}`}>
                              {option.label}: {option.value}
                            </p>
                          ))}
                        </div>

                        <div className="cart_item_quantity">
                          <button
                            type="button"
                            aria-label={`Уменьшить количество: ${item.title}`}
                            onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            −
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            type="button"
                            aria-label={`Увеличить количество: ${item.title}`}
                            onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>

                        <p className="cart_item_price">{formatRubles(item.unitPrice * item.quantity)}</p>

                        <button
                          type="button"
                          className="cart_item_remove"
                          onClick={() => removeCartItem(item.id)}
                          aria-label={`Удалить товар: ${item.title}`}
                        >
                          <img src={trashIcon} alt="" />
                        </button>
                      </article>
                    );
                  })}
                </div>

                <div className="cart_bottom">
                  <a className="cart_continue" href="/checkout">
                    Продолжить
                    <span aria-hidden="true">→</span>
                  </a>
                  <p className="cart_total">Итого: {formatRubles(totalPrice)}</p>
                </div>
              </>
            ) : (
              <>
                <p className="cart_empty_message">Ваша корзина пока пуста.</p>
                <a href="/" className="cart_back_link">
                  Вернуться в магазин
                </a>
              </>
            )}
          </article>
        </section>
      </main>
    </Layout>
  );
};

export default Cart;
