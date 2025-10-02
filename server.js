import express from 'express';
import Razorpay from 'razorpay';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import mysql from 'mysql2/promise';
import 'dotenv/config';  // Load .env variables


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const rzp = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// DB Connection Pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'zorr_user',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'zorr_db'
});

console.log('Connected to MySQL Database');

app.use(express.json());
app.use(express.static(join(__dirname, 'dist')));

// Create Order for RazorPay
app.post('/create-order', async (req, res) => {
    const { amount } = req.body;
    try {
        const order = await rzp.orders.create({
            amount,
            currency: 'INR',
            receipt: 'receipt#' + Math.floor(Math.random() * 1000)
        });
        res.json({ order });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Save Order after Success
// app.post('/save-order', async (req, res) => {
//     const { total, payment_method, items } = req.body;
//     let connection;
//     try {
//         connection = await pool.getConnection();
//         await connection.beginTransaction();

//         const [orderResult] = await connection.query(
//             'INSERT INTO orders (total, payment_method) VALUES (?, ?)',
//             [total, payment_method]
//         );
//         const orderId = orderResult.insertId;

//         for (const item of items) {
//             await connection.query(
//                 'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
//                 [orderId, item.product_id, item.quantity, item.price]
//             );
//         }

//         await connection.commit();
//         connection.release();
//         res.json({ success: true, orderId });
//     } catch (error) {
//         if (connection) await connection.rollback();
//         connection?.release();
//         console.error('Save order error:', error);
//         res.status(500).json({ error: error.message });
//     }
// });

app.post('/save-order', async (req, res) => {
    const { total, payment_method, items } = req.body;

    try {
        // Start a transaction
        await pool.query('START TRANSACTION');

        const [orderResult] = await pool.query(
            'INSERT INTO orders (total, payment_method) VALUES (?, ?)',
            [total, payment_method]
        );
        const orderId = orderResult.insertId;

        for (const item of items) {
            await pool.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                [orderId, item.product_id, item.quantity, item.price]
            );
        }

        await pool.query('COMMIT');
        res.json({ success: true, orderId });
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Save order error:', error);
        res.status(500).json({ error: error.message });
    }
});


// Fetch Orders
app.get('/orders', async (req, res) => {
    try {
        const [orders] = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
        const detailedOrders = await Promise.all(orders.map(async (order) => {
            const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
            return { ...order, items };
        }));
        res.json(detailedOrders);
    } catch (error) {
        console.error('Fetch orders error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
    // Check if the request is for a static file; if not, serve index.html
    if (!req.accepts('html')) return res.status(404).send('Not Found');
    res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(3000, () => console.log('Server running on port 3000'));