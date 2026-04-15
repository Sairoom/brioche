import Layout from '../../components/layout/Layout';
import './Cart.scss';

const Cart = () => (
  <Layout>
    <main className="cart">
      <section className="container cart_content">
        <div className="cart_checkout">
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
        </div>

        <article className="cart_main">
          <p className="cart_empty_message">Ваша корзина пока пуста.</p>
          <a href="Main" className="cart_back_link">
            Вернуться в магазин
          </a>
        </article>
      </section>
    </main>
  </Layout>
);

export default Cart;
