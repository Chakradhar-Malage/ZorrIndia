import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { products } from '../data';

export default function Home() {
  return (
    <>
      <Hero />
      <section id="products" className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-4">Our Products</h2>
          <div className="row">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}