import './Header.scss';
import phone from '../../assets/images/phonev.svg';
import tg from '../../assets/images/tgv.svg';
import korz from '../../assets/images/korzv.svg';
import arrow from '../../assets/images/arrow.svg';

const top_links = ['Как заказать?', 'Бронь столика', 'Доставка'];

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
  return (
    <header className="header">
      <div className="container header_top">
        <ul className="header_links">
          {top_links.map((item) => (
            <li key={item}>
              <a>{item}</a>
            </li>
          ))}
        </ul>

        <a className="header_logo" href="/">
          Brioche
        </a>

        <div className="header_actions">
          <a className="header_time" href="/">
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

      <div className="header_bottom">
        <nav className="container header_menu">
          {nav_items.map((item, index) => (
            <div className="menu_item" key={item.title}>
              {index === 0 ? (
                <a className="menu_item_trigger" href={pasxa_path}>
                  {item.title}
                </a>
              ) : (
                <>
                  <button className="menu_item_trigger" type="button">
                    {item.title}
                    <img className="menu_item_arrow" src={arrow} />
                  </button>
                  <div className="menu_item_dropdown">
                    {item.links.map((link) => (
                      <a href="#menu" key={link}>
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
