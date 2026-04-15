import { useMemo, useState } from 'react';
import Layout from '../../components/layout/Layout';
import benedictMain from '../../assets/images/product-detail/benedict-main.svg';
import benedictThumb2 from '../../assets/images/product-detail/benedict-thumb-2.jpg';
import relatedPate from '../../assets/images/product-detail/related-pate.png';
import relatedSpreads from '../../assets/images/product-detail/related-spreads.png';
import relatedSteak from '../../assets/images/product-detail/related-steak.png';
import './ProductDetail.scss';

type RelatedProduct = {
  title: string;
  price: string;
  image: string;
};

type ProductDetails = {
  title: string;
  description: string;
  allergens: string;
  allergyNote: string;
  price: string;
  images: string[];
  related: RelatedProduct[];
};

const product: ProductDetails = {
  title: 'Бенедикт с яйцом пашот, голландским соусом, пастрами из индейки',
  description:
    'На поджаристую бриошь, которую мы печем каждый день сами, выкладываем ломтики пастрами из индейки, дополняем двумя яйцами пашот, медово-горчичной заправкой и голландским соусом.',
  allergens: 'Аллергены: глютен, лактоза, цитрусовые, горчица, орехи',
  allergyNote:
    '*Если у вас есть аллергия на какие-либо продукты, пожалуйста, укажите это в комментарии при оформлении заказа.',
  price: '1,090 ₽',
  images: [benedictMain, benedictThumb2],
  related: [
    {
      title: 'Куриный паштет, бриошь, соус из сливы',
      price: '750 ₽',
      image: relatedPate,
    },
    {
      title: 'Сет намазок',
      price: '790 ₽',
      image: relatedSpreads,
    },
    {
      title: 'Стейк Мачете, мятый картофель, сальса верде',
      price: '2,500 ₽',
      image: relatedSteak,
    },
  ],
};

const ProductDetail = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const activeImage = useMemo(
    () => product.images[selectedImage] ?? product.images[0],
    [selectedImage],
  );

  return (
    <Layout>
      <main className="product_detail">
        <section className="container product_detail_top">
          <div className="product_gallery">
            <div className="product_gallery_main">
              <img src={activeImage} alt={product.title} />
            </div>
            <div className="product_gallery_thumbs">
              {product.images.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  className={`product_thumb${selectedImage === index ? ' is_active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                  aria-label={`Фото ${index + 1}`}
                >
                  <img src={image} alt="" />
                </button>
              ))}
            </div>
          </div>

          <article className="product_content">
            <h1>{product.title}</h1>
            <p>{product.description}</p>
            <p className="product_allergens">{product.allergens}</p>
            <p>{product.allergyNote}</p>

            <div className="product_cta_row">
              <button type="button">В корзину</button>
              <span>{product.price}</span>
            </div>
          </article>
        </section>

        <section className="container product_related">
          <h2>Вас также заинтересует</h2>
          <div className="product_related_grid">
            {product.related.map((item) => (
              <article className="product_related_card" key={item.title}>
                <a href="/">
                  <div className="product_related_img_wrap">
                    <img src={item.image} alt={item.title} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.price}</p>
                </a>
              </article>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default ProductDetail;
