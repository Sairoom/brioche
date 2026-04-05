import Layout from '../../components/layout/Layout';
import './Main.scss';
import heroBackground from '../../assets/images/hero-bg.png';
import cakeLilac from '../../assets/images/product-cake-lilac.png';
import cakeDriedFlowers from '../../assets/images/product-cake-dried-flowers.png';
import cakeMimosa from '../../assets/images/product-cake-mimosa.png';
import cakeCornflower from '../../assets/images/product-cake-cornflower.png';
import cakeMacaronsWreath from '../../assets/images/product-cake-macarons-wreath.png';
import cakeFlowers from '../../assets/images/product-cake-flowers.png';
import cakePavlovaWreath from '../../assets/images/product-cake-pavlova-wreath.png';
import cakeBows from '../../assets/images/product-cake-bows.png';
import macaronsBox from '../../assets/images/product-kulich-white.png';
import kulichCream from '../../assets/images/product-macarons-box.png';
import kulichWhite from '../../assets/images/product-kulich-cupcake-1.png';
import kulichFlowers from '../../assets/images/product-kulich-cupcake-2.png';

const PRODUCTS = [
  { title: 'Торт с кремовой сиренью', price: 'от 5,950 ₽', image: cakeLilac },
  { title: 'Торт с ассорти из сухоцветов', price: 'от 4,800 ₽', image: cakeDriedFlowers },
  { title: 'Торт с кремовой мимозой', price: 'от 5,850 ₽', image: cakeMimosa },
  { title: 'Торт с васильками', price: 'от 4,750 ₽', image: cakeCornflower },
  { title: 'Торт с венком из макарон', price: 'от 5,550 ₽', image: cakeMacaronsWreath },
  { title: 'Торт с цветами', price: 'от 6,640 ₽', image: cakeFlowers },
  { title: 'Торт Павлова. Венок', price: 'от 8,200 ₽', image: cakePavlovaWreath },
  { title: 'Торт с бантиками', price: 'от 4,850 ₽', image: cakeBows },
  { title: 'Коробка ванильных капкейков с цветами', price: 'от 2,800 ₽', image: kulichWhite },
  { title: 'Набор макарон', price: '6,500 ₽', image: kulichCream },
  {
    title: 'Пасхальный кулич с макароном и клубничным кремом',
    price: '6,500 ₽',
    image: macaronsBox,
  },
  {
    title: 'Пасхальный кулич с макароном и клубничным кремом',
    price: '6,500 ₽',
    image: kulichFlowers,
  },
] as const;

const Main = () => {
  return (
    <Layout>
      <main className="main-page">
        <section className="main-page__hero" aria-label="Hero">
          <img src={heroBackground} alt="" />
        </section>

        <section className="main-page__products" id="menu">
          <div className="main-page__filters">
            <span>Сортировать по</span>
            <button type="button">
              новинкам
              <span>▾</span>
            </button>
          </div>

          <div className="container main-page__grid">
            {PRODUCTS.map((product, index) => (
              <article className="product-card" key={product.title + product.price + index}>
                <a href="/">
                  <div className="product-card__image-wrap">
                    <img src={product.image} alt={product.title} />
                  </div>
                  <h3>{product.title}</h3>
                  <div className="product-card__meta">
                    <p className="product-card__price">{product.price}</p>
                    <p className="product-card__cta">В корзину</p>
                  </div>
                </a>
              </article>
            ))}
          </div>

          <div className="main-page__more">
            <a href="/">Больше десертов</a>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Main;
