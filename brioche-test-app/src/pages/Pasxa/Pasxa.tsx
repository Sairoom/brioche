import Layout from '../../components/layout/Layout';
import './Pasxa.scss';
import dessertPlates from '../../assets/images/pasxa/dessert-plates.png';
import kulichMacaron from '../../assets/images/pasxa/kulich-macaron.png';
import kulichMeringue from '../../assets/images/pasxa/kulich-meringue.png';
import kulichLace from '../../assets/images/pasxa/kulich-lace.png';
import easterCupcakes from '../../assets/images/pasxa/easter-cupcakes.png';
import carrotCake from '../../assets/images/pasxa/carrot-cake.png';
import eggCupsHigh from '../../assets/images/pasxa/egg-cups-high.png';
import eggCup from '../../assets/images/pasxa/egg-cup.png';

const products = [
  {
    title: 'Десертные тарелки в европейском стиле',
    price: '7,500 ₽',
    image: dessertPlates,
  },
  {
    title: 'Пасхальный кулич с макарон и клубничным кремом',
    price: '6,500 ₽',
    image: kulichMacaron,
  },
  {
    title: 'Пасхальный кулич в меренге с лимонным курдом',
    price: '4,900 ₽',
    image: kulichMeringue,
  },
  {
    title: 'Пасхальный кулич с хрустящей сахарно-миндальной корочкой',
    price: 'от 3,900 ₽',
    image: kulichLace,
  },
  {
    title: 'Пасхальные капкейки',
    price: 'от 2,300 ₽',
    image: easterCupcakes,
  },
  {
    title: 'Морковный кекс. Целый',
    price: '4,400 ₽',
    image: carrotCake,
  },
  {
    title: 'Высокие пашотницы Sagaform',
    price: '3,000 ₽',
    image: eggCupsHigh,
  },
  {
    title: 'Пашотница',
    price: '2,000 ₽',
    image: eggCup,
  },
] as const;

const Pasxa = () => (
  <Layout>
    <main className="pasxa">
      <section className="container pasxa_products">
        <div className="pasxa_grid">
          {products.map((product) => (
            <article className="pasxa_card" key={product.title}>
              <a href="/">
                <div className="pasxa_card_img_wrap">
                  <img src={product.image} alt={product.title} />
                </div>
                <h3>{product.title}</h3>
                <div className="pasxa_card_meta">
                  <p className="pasxa_card_price">{product.price}</p>
                  <p className="pasxa_card_cta">В корзину</p>
                </div>
              </a>
            </article>
          ))}
        </div>
      </section>
    </main>
  </Layout>
);

export default Pasxa;
