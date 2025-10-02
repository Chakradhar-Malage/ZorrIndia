import { useState, useEffect } from 'react';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/orders')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log('Fetched orders data:', data); // Log the raw data
        if (!Array.isArray(data)) throw new Error('Invalid data format: expected an array');
        setOrders(data);
      })
      .catch(err => {
        console.error('Fetch orders error:', err);
        setError(err.message);
      });
  }, []);

  if (error) return <div className="container py-5">Error loading orders: {error}</div>;

  return (
    <section className="py-5">
      <div className="container">
        <h2>Your Orders</h2>
        {orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          orders.map(order => {
            if (!order || typeof order !== 'object') {
              console.error('Invalid order object:', order);
              return null;
            }
            return (
              <div key={order.id} className="card mb-4">
                <div className="card-body">
                  <h5>Order ID: {order.id || 'N/A'}</h5>
                  <p>Date: {order.created_at ? new Date(order.created_at).toLocaleString() : 'N/A'}</p>
                  <p>Payment: {order.payment_method || 'N/A'}</p>
                  <p>Status: {order.status || 'N/A'}</p>
                  <p>Total: ${typeof order.total === 'number' ? order.total.toFixed(2) : '0.00'}</p>
                  <h6>Items:</h6>
                  <ul>
                    {(order.items || []).map(item => (
                      <li key={item.id}>
                        Product ID {item.product_id || 'N/A'} x {item.quantity || 0} - $
                        {typeof item.price === 'number' ? item.price.toFixed(2) : '0.00'}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}