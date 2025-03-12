const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;
const SECRET_KEY = 'your_secret_key';

app.use(express.json());

// Mock User Data
const users = [{ id: 1, username: 'testuser', password: 'password123' }];

// Login Endpoint
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        const token = jwt.sign({ userId: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
        return res.json({ token });
    }
    
    res.status(401).json({ message: 'Invalid credentials' });
});

// Token Verification Middleware
app.get('/api/verify', (req, res) => {
    const token = req.headers['authorization'];

    if (!token) return res.status(403).json({ message: 'No token provided' });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Unauthorized' });

        res.json({ userId: decoded.userId, username: decoded.username });
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Auth Service running on port ${PORT}`);
});
