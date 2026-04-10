import Layout from '../../components/layout/Layout';
import './Breakfast.scss';
import breakfastBuilder from '../../assets/images/breakfast/breakfast-builder.png';
import toastCaviar from '../../assets/images/breakfast/toast-caviar.png';
import benedictPastrami from '../../assets/images/breakfast/benedict-pastrami.png';
import saladAvocado from '../../assets/images/breakfast/salad-avocado.png';
import basqueCheesecake from '../../assets/images/breakfast/basque-cheesecake.png';
import benedictSalmon from '../../assets/images/breakfast/benedict-salmon.png';
import greenBuckwheat from '../../assets/images/breakfast/green-buckwheat.png';
import scrambleSausages from '../../assets/images/breakfast/scramble-sausages.png';
import crepesMilk from '../../assets/images/breakfast/crepes-milk.png';
import ricePorridge from '../../assets/images/breakfast/rice-porridge.png';

const products = [
  {
    title: 'Завтрак-конструктор',
    price: 'от 450 ₽',
    image: breakfastBuilder,
  },
  {
    title: 'Тост с домашней красной икрой',
    price: '890 ₽',
    image: toastCaviar,
  },
  {
    title: 'Бенедикт с яйцом пашот, голландским соусом и пастрами из индейки',
    price: '1,090 ₽',
    image: benedictPastrami,
  },
  {
    title: 'Салат с авокадо, яйцом пашот, гречкой с пармезаном, свежими овощами',
    price: '970 ₽',
    image: saladAvocado,
  },
  {
    title: 'Баскская запеканка, соленая карамель, брусника',
    price: 'от 950 ₽',
    image: basqueCheesecake,
  },
  {
    title: 'Бенедикт с яйцом пашот, голландским соусом и слабосоленым лососем',
    price: '1,090 ₽',
    image: benedictSalmon,
  },
  {
    title: 'Зеленая гречка, песто, яйцо пашот, пармезан',
    price: '890 ₽',
    image: greenBuckwheat,
  },
  {
    title: 'Скрембл, колбаски, жареный картофель',
    price: '1,090 ₽',
    image: scrambleSausages,
  },
  {
    title: 'Блинчики на топлёном молоке',
    price: 'от 390 ₽',
    image: crepesMilk,
  },
  {
    title: 'Рисовая каша с сезонными ягодами и фисташкой',
    price: '590 ₽',
    image: ricePorridge,
  },
] as const;

const Breakfast = () => (
  <Layout>
    <main className="breakfast">
      <section className="container breakfast_products">
        <div className="breakfast_grid">
          {products.map((product) => (
            <article className="breakfast_card" key={product.title}>
              <a href="/">
                <div className="breakfast_card_img_wrap">
                  <img src={product.image} alt={product.title} />
                </div>
                <h3>{product.title}</h3>
                <div className="breakfast_card_meta">
                  <p className="breakfast_card_price">{product.price}</p>
                  <p className="breakfast_card_cta">В корзину</p>
                </div>
              </a>
            </article>
          ))}
        </div>
      </section>
    </main>
  </Layout>
);

export default Breakfast;
