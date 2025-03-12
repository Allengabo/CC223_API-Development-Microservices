const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 4000;

app.use(express.json());

// Sample Products Data
const products = [
    { id: 1, name: 'Laptop' },
    { id: 2, name: 'Phone' }
];

// Authentication Middleware
async function authenticate(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    try {
        const response = await axios.get('http://localhost:5000/api/verify', {
            headers: { authorization: token }
        });
        req.user = response.data;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
}

// Protected Endpoint
app.get('/api/products', authenticate, (req, res) => {
    res.json(products);
});

// Start Server
app.listen(PORT, () => {
    console.log(`Product Service running on port ${PORT}`);
});
