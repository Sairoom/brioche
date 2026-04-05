import './Header.scss';
import phone from '../../assets/images/phone.png';
import tg from '../../assets/images/tg.png';
import korz from '../../assets/images/korz.png';

const TOP_LINKS = ['Меню ресторана', 'Бронь столика', 'Доставка'];

const NAV_ITEMS = [
  {
    title: 'Пасха',
    links: ['Куличи', 'Творожная пасха', 'Наборы', 'Все пасхальное'],
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
    title: 'Напитки',
    links: ['Кофе', 'Лимонады', 'Коктейли', 'Листовые чаи', 'Фруктовые чаи'],
  },
  {
    title: 'Посуда',
    links: ['Посуда', 'Свечи', 'Диффузоры', 'Скидки'],
  },
  {
    title: 'Коллекция',
    links: ['Подарочные наборы', 'Сезонные подборки', 'Новые позиции', 'Скидки'],
  },
] as const;

const Header = () => {
  return (
    <header className="site-header">
      <div className="container site-header__top">
        <ul className="site-header__mini-links">
          {TOP_LINKS.map((item) => (
            <li key={item}>
              <a href="/">{item}</a>
            </li>
          ))}
        </ul>

        <a className="site-header__logo" href="/" aria-label="Brioche">
          Brioche
        </a>

        <div className="site-header__actions">
          <a className="site-header-time" href="/">
            с 9:00 до 22:00
          </a>
          <button type="button">
            <img src={phone} />
          </button>
          <button type="button">
            <img src={tg} />
          </button>
          <button type="button">
            <img src={korz} />
          </button>
        </div>
      </div>

      <div className="site-header__bottom">
        <nav className="container site-header__menu" aria-label="Main Navigation">
          {NAV_ITEMS.map((item) => (
            <div className="menu-item" key={item.title}>
              <button className="menu-item__trigger" type="button">
                {item.title}
                <span>⌄</span>
              </button>
              <div className="menu-item__dropdown">
                {item.links.map((link) => (
                  <a href="#menu" key={link}>
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
