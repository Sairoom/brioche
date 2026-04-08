import Layout from '../../components/layout/Layout';
import SideBar from '../../components/layout/SideBar';
import { sideBarItems } from '../../components/layout/sidebarItems';
import './Order.scss';

const Order = () => (
  <Layout>
    <main className="order">
      <section className="container order_content">
        <SideBar className="order_sidebar" items={sideBarItems} activeKey="order" />

        <article className="order_main">
          <h2>Всё просто!</h2>
          <p>
            <strong>На этом сайте вы можете заказать:</strong>
          </p>
          <ul className="order_list">
            <li>все блюда нашего Солёного меню</li>
            <li>большинство напитков</li>
            <li>десерты из витрины нашего Кафе</li>
            <li>особенные подарки для себя или ваших близких</li>
          </ul>
          <p>
            Мы подробно рассказали о нашей <a href="/delivery">Доставке</a> и вариантах{' '}
            <a href="/payment">Оплаты</a>.
          </p>
          <p>
            Если вы заказываете доставку в подарок, указав получателя, пожалуйста, не забывайте
            указать и ваш личный номер телефона для подтверждения заказа.
          </p>
          <p>
            Все ваши дополнительные пожелания и вообще любые пометки можно указать в поле
            «Комментарии» при оформлении заказа. Мы обязательно их прочитаем и учтем.
          </p>
          <p>
            При оформлении заказа с 9:00 до 21:00 наш менеджер свяжется с вами в течение часа. Если
            вдруг этого не произошло, не волнуйтесь, мы вот-вот перезвоним. Просто прямо сейчас мы
            обсуждаем и готовим заказ, оформленный чуть-чуть раньше вашего.
          </p>
          <p>
            При оформлении заказа после 21:00 наш менеджер свяжется с вами до 12:00 следующего дня.
          </p>
          <p>
            Вы всегда можете связаться с нашим менеджером по телефону +7 (800) 555-35-35 или в{' '}
            <span>WhatsApp</span>.
          </p>
        </article>
      </section>
    </main>
  </Layout>
);

export default Order;
