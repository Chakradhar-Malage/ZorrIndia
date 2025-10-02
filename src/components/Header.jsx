import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { FaShoppingCart, FaPhone } from 'react-icons/fa';  // Import icons

export default function Header() {
  const { cartCount } = useCart();
  return (
    <header className="bg-dark text-white py-3">
      <div className="container d-flex justify-content-between align-items-center">
        <h1 className="mb-0">Zorr</h1>
        <nav>
          <ul className="list-inline mb-0">
            <li className="list-inline-item">
              <Link to="/" className="text-white d-flex align-items-center">
                <span>Home</span>
              </Link>
            </li>
            <li className="list-inline-item"><Link to="/orders" className="text-white">Orders</Link></li>
            <li className="list-inline-item">
              <Link to="/cart" className="text-white d-flex align-items-center">
                <FaShoppingCart /> Cart ({cartCount})
              </Link>
            </li>
            <li className="list-inline-item">
              <a href="#contact" className="text-white d-flex align-items-center">
                <FaPhone /> Contact
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}