import './Footer.scss';

const Footer = () => {
  return (
    <footer className="site-footer" id="contacts">
      <div className="container site-footer__inner">
        <a className="site-footer__logo" href="/">
          Brioche
        </a>
        <nav className="site-footer__links" aria-label="Footer Navigation">
          <a href="/">О компании</a>
          <a href="/">Как заказать</a>
          <a href="/">Доставка</a>
          <a href="/">Оплата</a>
          <a href="/">История проекта</a>
          <a href="/">Контакты</a>
        </nav>
        <p className="site-footer__copyright">© 2021-2026 BRIOCHE - All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
