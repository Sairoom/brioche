import Layout from '../../components/layout/Layout';
import SideBar from '../../components/layout/SideBar';
import { sideBarItems } from '../../components/layout/sidebarItems';
import './Payment.scss';

const Payment = () => (
  <Layout>
    <main className="payment">
      <section className="container payment_content">
        <SideBar className="payment_sidebar" items={sideBarItems} activeKey="payment" />

        <article className="payment_main">
          <section className="payment_block">
            <h2>Наличными или картой в кафе</h2>
            <p>
              Если вам удобно добраться до кафе или вы просто живёте рядом, то вы можете забрать
              товар самостоятельно из нашего Кафе. Оплатить заказ на десерты и солёные блюда вы
              можете наличными, картой или смартфоном.
            </p>
          </section>

          <section className="payment_block">
            <h2>Безналичная оплата после подтверждения заказа</h2>
            <p>
              Для доставки ваших заказов мы пользуемся услугами доблестных курьеров Яндекс. Это
              самый быстрый и самый безопасный способ доставки из существующих, но, к сожалению,
              курьеры не могут принять у вас оплату заказа на месте, поэтому мы просим вас оплатить
              заказ заранее после подтверждения его менеджером.
            </p>
          </section>
        </article>
      </section>
    </main>
  </Layout>
);

export default Payment;
