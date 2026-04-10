import { useMemo, useState } from 'react';
import Layout from '../../components/layout/Layout';
import './Main.scss';
import Background from '../../assets/images/Main/Background.svg';
import Siren from '../../assets/images/Main/siren.png';
import Suxoch from '../../assets/images/Main/suxoch.png';
import Mimosa from '../../assets/images/Main/mimosa.png';
import Vasilk from '../../assets/images/Main/vasilk.png';
import MacaronCake from '../../assets/images/Main/venok_mak.png';
import cakeFlowers from '../../assets/images/Main/flowers_cake.png';
import PavlovaCake from '../../assets/images/Main/pavl_cake.png';
import Bant from '../../assets/images/Main/bant_cake.png';
import Cupcakes from '../../assets/images/Main/cupcakes.png';
import Macarons from '../../assets/images/Main/macarons.png';
import LimonKul from '../../assets/images/Main/limon_kul.png';
import KlubKul from '../../assets/images/Main/klub_kul.png';
import sortIcon from '../../assets/images/Main/sort.svg';

const parse_price = (value: string) => Number(value.replace(/[^\d]/g, ''));

const products = [
  { title: 'Торт с кремовой сиренью', price: 'от 5,950 ₽', image: Siren },
  { title: 'Торт с ассорти из сухоцветов', price: 'от 4,800 ₽', image: Suxoch },
  { title: 'Торт с кремовой мимозой', price: 'от 5,950 ₽', image: Mimosa },
  { title: 'Торт с васильками', price: 'от 4,750 ₽', image: Vasilk },
  { title: 'Торт с венком из макарон', price: 'от 5,550 ₽', image: MacaronCake },
  { title: 'Торт с цветами', price: 'от 5,640 ₽', image: cakeFlowers },
  { title: 'Торт Павлова. Венок', price: 'от 5,200 ₽', image: PavlovaCake },
  { title: 'Торт с бантиками', price: 'от 4,850 ₽', image: Bant },
  { title: 'Коробка ванильных капкейков с цветами', price: 'от 2,600 ₽', image: Cupcakes },
  { title: 'Набор макарон', price: 'от 1,240 ₽', image: Macarons },
  { title: 'Пасхальный кулич в меренге с лимонным курдом', price: '4,900 ₽', image: LimonKul },
  { title: 'Пасхальный кулич с макароном и клубничным кремом', price: '6,500 ₽', image: KlubKul },
] as const;

const productsBase = products.map((product, baseIndex) => ({
  ...product,
  baseIndex,
  priceValue: parse_price(product.price),
}));

type SortType = 'new' | 'price' | null;

const Main = () => {
  const [sortType, setSortType] = useState<SortType>(null);
  const [newReversed, setNewReversed] = useState(false);
  const [priceReversed, setPriceReversed] = useState(false);

  const onNewClick = () => {
    if (sortType === 'new') {
      setNewReversed((prev) => !prev);
      return;
    }

    setSortType('new');
    setNewReversed(false);
  };

  const onPriceClick = () => {
    if (sortType === 'price') {
      setPriceReversed((prev) => !prev);
      return;
    }

    setSortType('price');
    setPriceReversed(false);
  };

  const shownProducts = useMemo(() => {
    if (sortType === 'new') {
      return newReversed ? [...productsBase].reverse() : productsBase;
    }

    if (sortType === 'price') {
      const sorted = [...productsBase].sort((a, b) => a.priceValue - b.priceValue);
      return priceReversed ? sorted.reverse() : sorted;
    }

    return productsBase;
  }, [sortType, newReversed, priceReversed]);

  return (
    <Layout>
      <main className="main">
        <section className="main_hero">
          <img src={Background} alt="" />
        </section>

        <section className="main_products" id="menu">
          <div className="main_filters">
            <span className="main_filters_text">Сортировать по</span>
            <button
              className={`main_filters_option${sortType === 'new' ? ' is_active' : ''}`}
              type="button"
              onClick={onNewClick}
            >
              новизне
              {sortType === 'new' && (
                <img
                  className={`main_filters_arrow${newReversed ? ' is_up' : ''}`}
                  src={sortIcon}
                  alt=""
                />
              )}
            </button>
            <span className="main_filters_text">или</span>
            <button
              className={`main_filters_option${sortType === 'price' ? ' is_active' : ''}`}
              type="button"
              onClick={onPriceClick}
            >
              цене
              {sortType === 'price' && (
                <img
                  className={`main_filters_arrow${priceReversed ? ' is_up' : ''}`}
                  src={sortIcon}
                  alt=""
                />
              )}
            </button>
          </div>

          <div className="container main_grid">
            {shownProducts.map((product) => (
              <article className="card" key={product.baseIndex}>
                <a href="/">
                  <div className="card_img_wrap">
                    <img src={product.image} alt={product.title} />
                  </div>
                  <h3>{product.title}</h3>
                  <div className="card_meta">
                    <p className="card_price">{product.price}</p>
                    <p className="card_cta">В корзину</p>
                  </div>
                </a>
              </article>
            ))}
          </div>

          <div className="main_more">
            <a>Больше красоты</a>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Main;
