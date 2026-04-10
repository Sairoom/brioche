import Layout from '../../components/layout/Layout';
import './Candies.scss';
import dateInChocolate from '../../assets/images/candies/date-in-chocolate.png';
import assortedCandies from '../../assets/images/candies/assorted-candies.png';
import veganTruffle from '../../assets/images/candies/vegan-truffle.png';
import marmaladePassionfruit from '../../assets/images/candies/marmalade-passionfruit.png';
import nativeOpenSpacesCandy from '../../assets/images/candies/native-open-spaces-candy.png';
import currantTruffle from '../../assets/images/candies/currant-truffle.png';
import saltedToffee from '../../assets/images/candies/salted-toffee.png';

const products = [
  {
    title: 'Финик в шоколаде',
    price: 'от 250 ₽',
    image: dateInChocolate,
  },
  {
    title: 'Ассорти конфет',
    price: 'от 700 ₽',
    image: assortedCandies,
  },
  {
    title: 'Веганский трюфель',
    price: 'от 200 ₽',
    image: veganTruffle,
  },
  {
    title: 'Мармелад Маракуйя',
    price: 'от 150 ₽',
    image: marmaladePassionfruit,
  },
  {
    title: 'Конфета «Родные просторы»',
    price: 'от 200 ₽',
    image: nativeOpenSpacesCandy,
  },
  {
    title: 'Трюфель смородина',
    price: 'от 200 ₽',
    image: currantTruffle,
  },
  {
    title: 'Ириски с солью',
    price: 'от 150 ₽',
    image: saltedToffee,
  },
] as const;

const Candies = () => (
  <Layout>
    <main className="candies">
      <section className="container candies_products">
        <div className="candies_grid">
          {products.map((product) => (
            <article className="candies_card" key={product.title}>
              <a href="/">
                <div className="candies_card_img_wrap">
                  <img src={product.image} alt={product.title} />
                </div>
                <h3>{product.title}</h3>
                <div className="candies_card_meta">
                  <p className="candies_card_price">{product.price}</p>
                  <p className="candies_card_cta">В корзину</p>
                </div>
              </a>
            </article>
          ))}
        </div>
      </section>
    </main>
  </Layout>
);

export default Candies;
