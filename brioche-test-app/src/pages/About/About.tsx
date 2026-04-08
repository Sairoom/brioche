import Layout from '../../components/layout/Layout';
import SideBar from '../../components/layout/SideBar';
import { sideBarItems } from '../../components/layout/sidebarItems';
import './About.scss';

const About = () => (
  <Layout>
    <main className="about">
      <section className="container about_content">
        <SideBar className="about_sidebar" items={sideBarItems} activeKey="shop" />

        <article className="about_main">
          <p>
            О нашей большой, интересной, не самой простой, но самой любимой{' '}
            <a href="/project-history">истории проекта — здесь.</a>
          </p>
          <p>
            А этот сайт мы сделали для того, чтобы вы в любой момент легко и просто смогли оформить
            заказ, добавив в него ваши любимые блюда нашего <span>Солёного меню</span>, коробочку из
            макарон-ассорти и пару-тройку, а то и больше кусочков тортов. Мы с удовольствием
            собираем ассорти-сюрпризы из <span>Сладких позиций</span>, стараясь составить ваш набор
            максимально разнообразно. Но при этом всегда учтем ваши пожелания, если расскажете нам о
            них в комментариях при оформлении или менеджеру при подтверждении заказа.
          </p>
        </article>
      </section>
    </main>
  </Layout>
);

export default About;
