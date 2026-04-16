import { useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import Layout from '../../components/layout/Layout';
import benedictMain from '../../assets/images/product-detail/benedict-main.svg';
import benedictThumb2 from '../../assets/images/product-detail/benedict-thumb-2.jpg';
import relatedPate from '../../assets/images/product-detail/related-pate.png';
import relatedSpreads from '../../assets/images/product-detail/related-spreads.png';
import relatedSteak from '../../assets/images/product-detail/related-steak.png';
import sliderArrow from '../../assets/images/product-detail/slider-arrow.svg';
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

type ProductDetailProps = {
  slug?: string;
};

const ProductDetail = (_props: ProductDetailProps) => {
  const galleryViewportRef = useRef<HTMLDivElement | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const dragStartXRef = useRef(0);

  const [selectedImage, setSelectedImage] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const productImages = useMemo(() => product.images.filter(Boolean), []);
  const totalImages = productImages.length;
  const hasMultipleImages = totalImages > 1;

  const goToImage = (nextIndex: number) => {
    if (!totalImages) {
      return;
    }

    const normalizedIndex = ((nextIndex % totalImages) + totalImages) % totalImages;
    setSelectedImage(normalizedIndex);
  };

  const goToPrevious = () => goToImage(selectedImage - 1);
  const goToNext = () => goToImage(selectedImage + 1);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!hasMultipleImages) {
      return;
    }

    if (event.pointerType === 'mouse' && event.button !== 0) {
      return;
    }

    pointerIdRef.current = event.pointerId;
    dragStartXRef.current = event.clientX;
    setIsDragging(true);
    setDragOffset(0);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging || pointerIdRef.current !== event.pointerId) {
      return;
    }

    setDragOffset(event.clientX - dragStartXRef.current);
  };

  const handlePointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== event.pointerId) {
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const viewportWidth = galleryViewportRef.current?.offsetWidth ?? 1;
    const threshold = Math.min(120, viewportWidth * 0.18);

    if (dragOffset > threshold) {
      goToPrevious();
    } else if (dragOffset < -threshold) {
      goToNext();
    }

    setDragOffset(0);
    setIsDragging(false);
    pointerIdRef.current = null;
  };

  return (
    <Layout>
      <main className="product_detail">
        <section className="container product_detail_top">
          <div className="product_gallery">
            <div className="product_gallery_main">
              <button
                type="button"
                className="product_gallery_nav product_gallery_nav_prev"
                onClick={goToPrevious}
                aria-label="Previous photo"
                disabled={!hasMultipleImages}
              >
                <img src={sliderArrow} alt="" />
              </button>

              <div
                ref={galleryViewportRef}
                className={`product_gallery_viewport${isDragging ? ' is_dragging' : ''}`}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerEnd}
                onPointerCancel={handlePointerEnd}
              >
                <div
                  className="product_gallery_track"
                  style={{
                    transform: `translateX(calc(${-selectedImage * 100}% + ${dragOffset}px))`,
                    transition: isDragging
                      ? 'none'
                      : 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                >
                  {productImages.map((image, index) => (
                    <div className="product_gallery_slide" key={`${image}-${index}`}>
                      <img src={image} alt={product.title} draggable={false} />
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                className="product_gallery_nav product_gallery_nav_next"
                onClick={goToNext}
                aria-label="Next photo"
                disabled={!hasMultipleImages}
              >
                <img src={sliderArrow} alt="" />
              </button>
            </div>
            <div className="product_gallery_thumbs">
              {productImages.map((image, index) => (
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
                  <div className="product_related_meta">
                    <p className="product_related_price">{item.price}</p>
                    <p className="product_related_cta">В корзину</p>
                  </div>
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
