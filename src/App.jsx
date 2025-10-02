import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import { CartProvider } from './contexts/CartContext';
import './styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please try again later.</h1>;
    }
    return this.props.children;
  }
}

function App() {
  return (
    <CartProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route
            path="/orders"
            element={
              <ErrorBoundary>
                <Orders />
              </ErrorBoundary>
            }
          />
        </Routes>
        <section id="contact" className="bg-dark text-white py-4 text-center">
          <div className="container">
            <h2>Contact Us</h2>
            <p>Email: support@zorr.com</p>
          </div>
        </section>
        <footer className="bg-black text-white py-3 text-center">
          <div className="container">
            <p>&copy; 2025 Zorr. All rights reserved.</p>
          </div>
        </footer>
      </Router>
    </CartProvider>
  );
}

export default App;