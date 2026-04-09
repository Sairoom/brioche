import Layout from '../../components/layout/Layout';
import SideBar from '../../components/layout/SideBar';
import { sideBarItems } from '../../components/layout/sidebarItems';
import './Contacts.scss';

const Contacts = () => (
  <Layout>
    <main className="contacts">
      <section className="container contacts_content">
        <SideBar className="contacts_sidebar" items={sideBarItems} activeKey="contacts" />

        <article className="contacts_main">
          <h2>Контактные данные</h2>

          <p className="contacts_hours">
            Время работы:
            <br />
            ПН-ЧТ: 9:00 — 22:00
            <br />
            ПТ: 9:00 — 23:00
            <br />
            СБ: 10:00 — 23:00
            <br />
            ВС: 10:00 — 22:00
          </p>

          <p className="contacts_phone">
            Телефон: <strong>+7 (926) 308-33-38</strong>
          </p>

          <p className="contacts_email">
            Почта: <a href="mailto:brioche@gmail.com">brioche@gmail.com</a>
          </p>

          <p>Адрес Кафе: Москва, набережная Академика Туполева, 15к26</p>

          <div className="contacts_separator" />
        </article>
      </section>
    </main>
  </Layout>
);

export default Contacts;
