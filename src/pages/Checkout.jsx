import { useEffect, useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { products } from '../data';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const { cart, getCartTotal, setCart } = useCart(); // Added setCart to reset state
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  const validateForm = (formData) => {
    const errors = {};
    if (!formData.name) errors.name = 'Name is required';
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Valid email is required';
    if (!formData.phone || !/^\d{10}$/.test(formData.phone)) errors.phone = 'Valid 10-digit phone is required';
    if (!formData.address) errors.address = 'Address is required';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      address: e.target.address.value,
    };
    const errors = validateForm(formData);
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) return;

    const payment = e.target.payment.value;
    if (cart.length === 0) return alert('Cart is empty');

    const total = getCartTotal() * 100; // in paise

    if (payment === 'cod') {
      const success = await saveOrderToDB(total, 'cod');
      console.log('COD saveOrderToDB success:', success); // Debug log
      if (success) {
        alert('Order placed with COD!');
        localStorage.removeItem('cart');
        setCart([]); // Reset cart state
        navigate('/orders');
      } else {
        alert('Failed to save order. Please try again.');
      }
    } else {
      const response = await fetch('/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total }),
      });
      const { order } = await response.json();

      const options = {
        key: 'YOUR_RAZORPAY_KEY_ID',
        amount: total,
        currency: 'INR',
        name: 'Zorr',
        description: 'Gym Products Order',
        order_id: order.id,
        handler: async (response) => {
          alert(`Payment successful! ID: ${response.razorpay_payment_id}`);
          const success = await saveOrderToDB(total, 'online');
          console.log('Online saveOrderToDB success:', success); // Debug log
          if (success) {
            localStorage.removeItem('cart');
            setCart([]); // Reset cart state
            navigate('/orders');
          } else {
            alert('Failed to save order. Please try again.');
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#dc3545',
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    }
  };

  const saveOrderToDB = async (total, paymentMethod) => {
    const items = cart.map(item => ({
      product_id: item.id,
      quantity: item.quantity,
      price: products.find(p => p.id === item.id).price
    }));

    try {
      const response = await fetch('/save-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          total: getCartTotal(),
          payment_method: paymentMethod,
          items: items
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to save order');
      return data.success;
    } catch (error) {
      console.error('Save order error:', error);
      return false;
    }
  };

  return (
    <section className="py-5">
      <div className="container">
        <h2>Checkout</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input type="text" className="form-control" id="name" required />
            {formErrors.name && <p className="text-danger">{formErrors.name}</p>}
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input type="email" className="form-control" id="email" required />
            {formErrors.email && <p className="text-danger">{formErrors.email}</p>}
          </div>
          <div className="mb-3">
            <label htmlFor="phone" className="form-label">Phone</label>
            <input type="tel" className="form-control" id="phone" required />
            {formErrors.phone && <p className="text-danger">{formErrors.phone}</p>}
          </div>
          <div className="mb-3">
            <label htmlFor="address" className="form-label">Address</label>
            <textarea className="form-control" id="address" required />
            {formErrors.address && <p className="text-danger">{formErrors.address}</p>}
          </div>
          <div className="mb-3">
            <label className="form-label">Payment Method</label>
            <div>
              <input type="radio" id="cod" name="payment" value="cod" defaultChecked />
              <label htmlFor="cod">Cash on Delivery (COD)</label>
            </div>
            <div>
              <input type="radio" id="online" name="payment" value="online" />
              <label htmlFor="online">Online Payment (RazorPay)</label>
            </div>
          </div>
          <button type="submit" className="btn btn-success">Place Order</button>
        </form>
      </div>
    </section>
  );
}