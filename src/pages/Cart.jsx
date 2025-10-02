import { useCart } from '../contexts/CartContext';
import { products } from '../data';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { cart, removeFromCart, getCartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <section className="py-5">
        <div className="container">
          <h2>Your Cart</h2>
          <p>Your cart is empty. <Link to="/">Start shopping!</Link></p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-5">
      <div className="container">
        <h2>Your Cart</h2>
        <div className="list-group">
          {cart.map((item) => {
            const product = products.find((p) => p.id === item.id);
            const itemTotal = product.price * item.quantity;
            return (
              <div key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                {product.name} x {item.quantity}
                <span>${itemTotal.toFixed(2)}</span>
                <button className="btn btn-sm btn-danger" onClick={() => removeFromCart(item.id)}>Remove</button>
              </div>
            );
          })}
        </div>
        <div className="mt-3">
          <h4>Total: Rs. {getCartTotal().toFixed(2)}</h4>
          <Link to="/checkout" className="btn btn-success">Proceed to Checkout</Link>
        </div>
      </div>
    </section>
  );
}