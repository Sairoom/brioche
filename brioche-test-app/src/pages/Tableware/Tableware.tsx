import Layout from '../../components/layout/Layout';
import './Tableware.scss';
import snackBowl from '../../assets/images/tableware/snack-bowl.png';
import catDessertPlate from '../../assets/images/tableware/cat-dessert-plate.png';
import floralPlateHand from '../../assets/images/tableware/floral-plate-hand.png';
import dessertPlateBlue from '../../assets/images/tableware/dessert-plate-blue.png';
import rosette from '../../assets/images/tableware/rosette.png';
import porcelainPiePlate from '../../assets/images/tableware/porcelain-pie-plate.png';
import porcelainDinnerPlate from '../../assets/images/tableware/porcelain-dinner-plate.png';
import vintageSaucerRose from '../../assets/images/tableware/vintage-saucer-rose.png';
import vintagePorcelainDish from '../../assets/images/tableware/vintage-porcelain-dish.png';
import floralPlate from '../../assets/images/tableware/floral-plate.png';
import rosetteKahla from '../../assets/images/tableware/rosette-kahla.png';
import thinCeramicBowl from '../../assets/images/tableware/thin-ceramic-bowl.png';

const products = [
  {
    title: 'Пиала для закусок',
    price: '1,500 ₽',
    image: snackBowl,
  },
  {
    title: 'Керамическая тарелка для десерта с котом',
    price: '1,500 ₽',
    image: catDessertPlate,
  },
  {
    title: 'Тарелка с цветочным декором',
    price: '4,500 ₽',
    image: floralPlateHand,
  },
  {
    title: 'Десертная тарелка',
    price: '1,500 ₽',
    image: dessertPlateBlue,
  },
  {
    title: 'Розетка',
    price: '3,000 ₽',
    image: rosette,
  },
  {
    title: 'Фарфоровая пирожковая тарелка',
    price: '500 ₽',
    image: porcelainPiePlate,
  },
  {
    title: 'Фарфоровая столовая тарелка',
    price: '550 ₽',
    image: porcelainDinnerPlate,
  },
  {
    title: 'Винтажное блюдце «Роза»',
    price: '2,000 ₽',
    image: vintageSaucerRose,
  },
  {
    title: 'Винтажное фарфоровое блюдо',
    price: '10,000 ₽',
    image: vintagePorcelainDish,
  },
  {
    title: 'Тарелка с цветочным декором',
    price: '2,500 ₽',
    image: floralPlate,
  },
  {
    title: 'Розетка Kahla',
    price: '1,250 ₽',
    image: rosetteKahla,
  },
  {
    title: 'Миска из тонкой керамики',
    price: '3,000 ₽',
    image: thinCeramicBowl,
  },
] as const;

const Tableware = () => (
  <Layout>
    <main className="tableware">
      <section className="container tableware_products">
        <div className="tableware_grid">
          {products.map((product) => (
            <article className="tableware_card" key={`${product.title}-${product.price}`}>
              <a href="/">
                <div className="tableware_card_img_wrap">
                  <img src={product.image} alt={product.title} />
                </div>
                <h3>{product.title}</h3>
                <div className="tableware_card_meta">
                  <p className="tableware_card_price">{product.price}</p>
                  <p className="tableware_card_cta">В корзину</p>
                </div>
              </a>
            </article>
          ))}
        </div>
      </section>
    </main>
  </Layout>
);

export default Tableware;
