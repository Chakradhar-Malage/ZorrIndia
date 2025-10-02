import { useEffect, useRef } from 'react';

export default function Carousel({ images, name, productId }) {
  const carouselRef = useRef(null);

  useEffect(() => {
    if (window.bootstrap && carouselRef.current) {
      new window.bootstrap.Carousel(carouselRef.current, {
        interval: 4000,  // Pause 4 seconds on each image
        wrap: true,      // Loop back to start after end
        pause: 'hover',  // Pause auto-cycle on hover (optional, for better UX)
      });
    }
  }, [productId]);

  // Filter out potentially blank/invalid images (e.g., if path is empty or invalid)
  const validImages = images.filter(img => img && img.trim() !== '');

  if (validImages.length === 0) {
    return <p>No images available</p>;  // Fallback if all images are invalid
  }

  return (
    <div id={`carousel-${productId}`} className="carousel slide" ref={carouselRef} data-bs-ride="carousel">
      <div className="carousel-inner">
        {validImages.map((img, idx) => (
          <div key={idx} className={`carousel-item ${idx === 0 ? 'active' : ''}`}>
            <img src={img} className="d-block w-100" alt={name} onError={() => console.error(`Failed to load image: ${img}`)} />
          </div>
        ))}
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target={`#carousel-${productId}`}
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true" />
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target={`#carousel-${productId}`}
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true" />
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}