import './Header.scss';
import phone from '../../assets/images/Header/phonev.svg';
import tg from '../../assets/images/Header/tgv.svg';
import korz from '../../assets/images/Header/korzv.svg';
import arrow from '../../assets/images/Header/arrow.svg';
import { useCartTotals } from '../../features/cart/cartStorage';

const top_links = [
  { label: 'Как заказать?', href: '/how-to-order' },
  { label: 'Бронь столика', href: '/reserve' },
  { label: 'Доставка', href: '/delivery' },
] as const;

const nav_items = [
  {
    title: 'Пасха',
    links: [],
  },
  {
    title: 'Солёное',
    links: ['На завтрак', 'Спецпредложения', 'Травы и овощи', 'Теплое и горячее'],
  },
  {
    title: 'Сладкое',
    links: ['Конфеты', 'Кексы', 'Десерты', 'Торты'],
  },
  {
    title: 'Торты',
    links: ['Стандартные торты', 'Торты на заказ', 'Мини-торты', 'Все торты'],
  },
  {
    title: 'Напитки',
    links: ['Кофе', 'Лимонады', 'Коктейли', 'Листовые чаи', 'Фруктовые чаи'],
  },
  {
    title: 'Коллекция',
    links: ['Посуда', 'Свечи', 'Диффузоры', 'Скидки'],
  },
] as const;

const pasxa_path = '/pasxa';

const Header = () => {
  const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
  const isPasxaPage = currentPath === '/pasxa';
  const { totalItemsCount } = useCartTotals();

  return (
    <header className="header">
      <div className="container header_top">
        <ul className="header_links">
          {top_links.map((item) => (
            <li key={item.label}>
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
        </ul>

        <a className="header_logo" href="/">
          Brioche
        </a>

        <div className="header_actions">
          <span className="header_time">
            с 9:00 до 22:00
          </span>
          <button type="button">
            <img src={phone} alt="" />
          </button>
          <button type="button">
            <img src={tg} alt="" />
          </button>
          <button
            type="button"
            className="header_cart_button"
            onClick={() => {
              window.location.href = '/cart';
            }}
            aria-label="Открыть корзину"
          >
            <img src={korz} alt="" />
            {totalItemsCount > 0 ? <span className="header_cart_badge">{totalItemsCount}</span> : null}
          </button>
        </div>
      </div>

      <div className="header_bottom">
        <nav className="container header_menu">
          {nav_items.map((item, index) => (
            <div className="menu_item" key={item.title}>
              {index === 0 ? (
                <a className={`menu_item_trigger${isPasxaPage ? ' is_active' : ''}`} href={pasxa_path}>
                  {item.title}
                </a>
              ) : (
                <>
                  <button className="menu_item_trigger" type="button">
                    {item.title}
                    <img className="menu_item_arrow" src={arrow} alt="" />
                  </button>
                  <div className="menu_item_dropdown">
                    {item.links.map((link, linkIndex) => (
                      <a
                        href={
                          index === 5 && linkIndex === 0
                            ? '/tableware'
                            : link === 'На завтрак'
                            ? '/breakfast'
                            : link === 'Конфеты'
                              ? '/candies'
                              : link === 'Стандартные торты'
                                ? '/standard-cakes'
                                : link === 'Кофе'
                                  ? '/coffee'
                                : '#menu'
                        }
                        key={link}
                      >
                        {link}
                      </a>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;


