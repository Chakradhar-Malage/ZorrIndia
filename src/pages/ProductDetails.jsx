import { useParams } from 'react-router-dom';
import { products } from '../data';
import Carousel from '../components/Carousel';
import { useCart } from '../contexts/CartContext';

export default function ProductDetails() {
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id));
  const { addToCart } = useCart();

  if (!product) return <p>Product not found</p>;

  return (
    <section className="py-5">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <Carousel images={product.images} name={product.name} productId={product.id} />
          </div>
          <div className="col-md-6">
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <h4>Key Features:</h4>
            <ul>
              {product.features.map((feature, idx) => <li key={idx}>{feature}</li>)}
            </ul>
            <p className="fw-bold">Rs.{product.price.toFixed(2)}</p>
            <button className="btn btn-primary" onClick={() => addToCart(product.id)}>Add to Cart</button>
          </div>
        </div>
      </div>
    </section>
  );
}