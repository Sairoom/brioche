import Layout from '../../components/layout/Layout';
import './StandardCakes.scss';
import cakeSouffle from '../../assets/images/standard-cakes/cake-souffle.png';
import honeyCakeLemonMeringue from '../../assets/images/standard-cakes/honey-cake-lemon-meringue.png';
import wholeCakeToday from '../../assets/images/standard-cakes/whole-cake-today.png';
import napoleonCheeseRaspberry from '../../assets/images/standard-cakes/napoleon-cheese-raspberry.png';
import redVelvet from '../../assets/images/standard-cakes/red-velvet.png';
import vanillaNut from '../../assets/images/standard-cakes/vanilla-nut.png';
import napoleonCheeseMango from '../../assets/images/standard-cakes/napoleon-cheese-mango.png';
import napoleonChocolate from '../../assets/images/standard-cakes/napoleon-chocolate.png';
import chocolateMangoPassionfruit from '../../assets/images/standard-cakes/chocolate-mango-passionfruit.png';
import bananaCaramel from '../../assets/images/standard-cakes/banana-caramel.png';

const products = [
  {
    title: 'Торт-суфле',
    price: 'от 3,100 ₽',
    image: cakeSouffle,
  },
  {
    title: 'Медовик лимонный в меренге',
    price: '7,500 ₽',
    image: honeyCakeLemonMeringue,
  },
  {
    title: 'Целый торт. Сегодня',
    price: 'от 6,800 ₽',
    image: wholeCakeToday,
  },
  {
    title: 'Наполеон сырный с малиной',
    price: 'от 8,500 ₽',
    image: napoleonCheeseRaspberry,
  },
  {
    title: 'Красный бархат',
    price: 'от 8,500 ₽',
    image: redVelvet,
  },
  {
    title: 'Ванильно-ореховый',
    price: 'от 10,200 ₽',
    image: vanillaNut,
  },
  {
    title: 'Наполеон сырный с манго',
    price: 'от 7,500 ₽',
    image: napoleonCheeseMango,
  },
  {
    title: 'Наполеон шоколадный',
    price: 'от 7,500 ₽',
    image: napoleonChocolate,
  },
  {
    title: 'Шоколадный манго-маракуйя',
    price: 'от 10,200 ₽',
    image: chocolateMangoPassionfruit,
  },
  {
    title: 'Банан-карамель',
    price: 'от 10,200 ₽',
    image: bananaCaramel,
  },
] as const;

const StandardCakes = () => (
  <Layout>
    <main className="standard_cakes">
      <section className="container standard_cakes_products">
        <div className="standard_cakes_grid">
          {products.map((product) => (
            <article className="standard_cakes_card" key={product.title}>
              <a href="/">
                <div className="standard_cakes_card_img_wrap">
                  <img src={product.image} alt={product.title} />
                </div>
                <h3>{product.title}</h3>
                <div className="standard_cakes_card_meta">
                  <p className="standard_cakes_card_price">{product.price}</p>
                  <p className="standard_cakes_card_cta">В корзину</p>
                </div>
              </a>
            </article>
          ))}
        </div>
      </section>
    </main>
  </Layout>
);

export default StandardCakes;
