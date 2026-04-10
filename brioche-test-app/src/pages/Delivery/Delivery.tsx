import Layout from '../../components/layout/Layout';
import SideBar from '../../components/layout/SideBar';
import { sideBarItems } from '../../components/layout/sidebarItems';
import './Delivery.scss';
import Map from '../../assets/images/Delivery/map.svg';

const deliverySections = [
  {
    title: 'Мы доставляем заказы от любой суммы',
    text: 'Все утренние заказы мы доставляем до 12 часов, а самый последний пакетик отправляем в 21:00. Заказы, сделанные в течение дня мы постараемся доставить вам в течение 1.5 — 2 часов и, конечно, всегда сделаем всё возможное, чтобы привезти вам заказ к указанному заранее времени, если вы укажете нужный интервал при оформлении заказа.',
  },
  {
    title: 'Доставка по району м.Курская',
    text: 'Стоимость доставки: 350 руб.\nПри заказе от 3500р. — бесплатно.\n(зона доставки «по району» обозначена на рисунке ниже)',
  },
  {
    title: 'Доставка по Москве в пределах МКАД',
    text: 'Стоимость доставки: от 700 руб.\nСтоимость доставки рассчитывается в зависимости от вашего точного адреса.',
  },
  {
    title: 'Доставка за МКАД',
    text: 'Стоимость доставки: от 1000 руб.\nСтоимость доставки рассчитывается в зависимости от вашего точного адреса.',
  },
] as const;

const Delivery = () => (
  <Layout>
    <main className="delivery">
      <section className="container delivery_content">
        <SideBar className="delivery_sidebar" items={sideBarItems} activeKey="delivery" />

        <div className="delivery_main">
          {deliverySections.map((section) => (
            <section className="delivery_block" key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.text}</p>
            </section>
          ))}
          <img className="delivery_map" src={Map}/>
        </div>
      </section>
    </main>
  </Layout>
);

export default Delivery;
