import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <div className="col-md-6 mb-4">
      <div className="card h-100 shadow">
        <img src={product.images[0]} className="card-img-top" alt={product.name} />
        <div className="card-body">
          <h5 className="card-title">{product.name}</h5>
          <p className="card-text">{product.description.substring(0, 100)}...</p>
          <p className="fw-bold">Rs. {product.price.toFixed(2)}</p>
          <Link to={`/product/${product.id}`} className="btn btn-primary">View Details</Link>
        </div>
      </div>
    </div>
  );
}