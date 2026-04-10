import Layout from '../../components/layout/Layout';
import './Coffee.scss';
import cappuccino200 from '../../assets/images/coffee/cappuccino-200.png';
import cocoaChili from '../../assets/images/coffee/cocoa-chili.png';
import latteAndaliman from '../../assets/images/coffee/latte-andaliman.png';
import americano150 from '../../assets/images/coffee/americano-150.png';
import rafTaiga from '../../assets/images/coffee/raf-taiga.png';
import raf200 from '../../assets/images/coffee/raf-200.png';
import americano250 from '../../assets/images/coffee/americano-250.png';
import latteClassic300 from '../../assets/images/coffee/latte-classic-300.png';
import cappuccino300 from '../../assets/images/coffee/cappuccino-300.png';
import bumble from '../../assets/images/coffee/bumble.png';
import espressoTonic from '../../assets/images/coffee/espresso-tonic.png';
import cocoaClassic300 from '../../assets/images/coffee/cocoa-classic-300.png';
import latteSyrup300 from '../../assets/images/coffee/latte-syrup-300.png';
import flatWhite200 from '../../assets/images/coffee/flat-white-200.png';
import raf300 from '../../assets/images/coffee/raf-300.png';

const products = [
  { title: 'Капучино. 200 мл', price: 'от 350 ₽', image: cappuccino200 },
  { title: 'Какао чили', price: '450 ₽', image: cocoaChili },
  { title: 'Латте андалиман', price: '450 ₽', image: latteAndaliman },
  { title: 'Американо. 150 мл', price: '290 ₽', image: americano150 },
  { title: 'Раф тайга', price: 'от 400 ₽', image: rafTaiga },
  { title: 'Раф. 200 мл', price: 'от 400 ₽', image: raf200 },
  { title: 'Американо. 250 мл', price: '350 ₽', image: americano250 },
  { title: 'Латте классический. 300 мл', price: 'от 400 ₽', image: latteClassic300 },
  { title: 'Капучино. 300 мл', price: 'от 450 ₽', image: cappuccino300 },
  { title: 'Бамбл', price: '650 ₽', image: bumble },
  { title: 'Эспрессо-тоник', price: 'от 450 ₽', image: espressoTonic },
  { title: 'Какао Классический. 300 мл', price: 'от 450 ₽', image: cocoaClassic300 },
  { title: 'Латте с сиропом. 300 мл', price: 'от 490 ₽', image: latteSyrup300 },
  { title: 'Флет Уайт. 200 мл', price: 'от 400 ₽', image: flatWhite200 },
  { title: 'Раф. 300 мл', price: 'от 500 ₽', image: raf300 },
] as const;

const Coffee = () => (
  <Layout>
    <main className="coffee">
      <section className="container coffee_products">
        <div className="coffee_grid">
          {products.map((product) => (
            <article className="coffee_card" key={product.title}>
              <a href="/">
                <div className="coffee_card_img_wrap">
                  <img src={product.image} alt={product.title} />
                </div>
                <h3>{product.title}</h3>
                <div className="coffee_card_meta">
                  <p className="coffee_card_price">{product.price}</p>
                  <p className="coffee_card_cta">В корзину</p>
                </div>
              </a>
            </article>
          ))}
        </div>
      </section>
    </main>
  </Layout>
);

export default Coffee;
