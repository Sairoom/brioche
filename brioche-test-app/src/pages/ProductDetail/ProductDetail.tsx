import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import Layout from '../../components/layout/Layout';
import sliderArrow from '../../assets/images/product-detail/slider-arrow.svg';
import { API_BASE_URL } from '../../config/api';
import './ProductDetail.scss';

type ProductCard = {
  id: number;
  slug: string;
  title: string;
  price: string;
  price_value: number;
  main_image_url: string;
};

type ProductDetails = ProductCard & {
  description: string | null;
  allergy_note: string | null;
  gallery_images: string[];
  ingredients: string[];
  allergens: string[];
  related: ProductCard[];
};

type ProductResponse = {
  data: ProductDetails;
};

type ProductDetailProps = {
  slug: string;
};

const ProductDetail = ({ slug }: ProductDetailProps) => {
  const galleryViewportRef = useRef<HTMLDivElement | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const dragStartXRef = useRef(0);

  const [selectedImage, setSelectedImage] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    const loadProduct = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(slug)}`, {
          signal: abortController.signal,
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Товар не найден.');
          }

          throw new Error('Не удалось загрузить товар. Попробуйте обновить страницу.');
        }

        const payload = (await response.json()) as ProductResponse;

        if (!payload.data) {
          throw new Error('Сервер вернул пустой ответ.');
        }

        setProduct(payload.data);
      } catch (error) {
        if (abortController.signal.aborted) {
          return;
        }

        setProduct(null);
        setErrorMessage(
          error instanceof Error ? error.message : 'Не удалось загрузить товар. Попробуйте позже.',
        );
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void loadProduct();

    return () => abortController.abort();
  }, [slug]);

  const productImages = useMemo(() => {
    if (!product) {
      return [];
    }

    return Array.from(
      new Set([product.main_image_url, ...product.gallery_images].filter(Boolean)),
    );
  }, [product]);

  useEffect(() => {
    setSelectedImage(0);
    setDragOffset(0);
    setIsDragging(false);
    pointerIdRef.current = null;
  }, [product?.id]);

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

  if (isLoading) {
    return (
      <Layout>
        <main className="product_detail">
          <section className="container">
            <p className="product_detail_status">Загружаем товар...</p>
          </section>
        </main>
      </Layout>
    );
  }

  if (!product || errorMessage) {
    return (
      <Layout>
        <main className="product_detail">
          <section className="container">
            <p className="product_detail_status">{errorMessage ?? 'Товар не найден.'}</p>
          </section>
        </main>
      </Layout>
    );
  }

  const allergensText =
    product.allergens.length > 0 ? `Аллергены: ${product.allergens.join(', ')}` : null;

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
                aria-label="Предыдущее фото"
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
                aria-label="Следующее фото"
                disabled={!hasMultipleImages}
              >
                <img src={sliderArrow} alt="" />
              </button>
            </div>

            <div className="product_gallery_thumbs">
              {productImages.map((image, index) => (
                <button
                  key={`${image}-thumb-${index}`}
                  type="button"
                  className={`product_thumb${selectedImage === index ? ' is_active' : ''}`}
                  onClick={() => goToImage(index)}
                  aria-label={`Фото ${index + 1}`}
                >
                  <img src={image} alt="" />
                </button>
              ))}
            </div>
          </div>

          <article className="product_content">
            <h1>{product.title}</h1>
            {product.description ? <p>{product.description}</p> : null}
            {allergensText ? <p className="product_allergens">{allergensText}</p> : null}
            {product.allergy_note ? <p>{product.allergy_note}</p> : null}

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
              <article className="product_related_card" key={item.slug}>
                <a href={`/products/${item.slug}`}>
                  <div className="product_related_img_wrap">
                    <img src={item.main_image_url} alt={item.title} />
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
