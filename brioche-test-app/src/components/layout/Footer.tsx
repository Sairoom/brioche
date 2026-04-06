import './Footer.scss';

const Footer = () => (
    <footer className="footer" id="contacts">
      <div className="footer_inner">
        <a className="footer_logo">
          Brioche
        </a>
        <nav className="footer_links">
          <a href="/">О магазине</a>
          <a href="/">Как заказать</a>
          <a href="/">Доставка</a>
          <a href="/">Оплата</a>
          <a href="/">История проекта</a>
          <a href="/">Контакты</a>
        </nav>
        <p className="footer_copy">© 2021-2026 BRIOCHE - All rights reserved.</p>
      </div>
    </footer>
);

export default Footer;
