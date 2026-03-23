// server.js - Final Clean Code
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const express = require('express');
const cors = require('cors'); // 1. Require panniyachu
const app = express();

app.use(cors()); // 2. Use panna marakatheenga!
app.use(express.json());

// 1. MongoDB Connection
mongoose.connect('mongodb+srv://itachi:itachi*123@cluster0.thb8tpt.mongodb.net/?appName=Cluster0')
    .then(() => console.log('✅ MongoDB Connected Successfully!'))
    .catch((err) => console.error('❌ Connection Error:', err));

// 2. User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// 3. Register Route
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "Registration Successful!" });
    } catch (err) {
        res.status(500).json({ message: "Server Error: " + err.message });
    }
});

// 4. Login Route
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

        res.json({ message: "Login Successful!", user: { name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ message: "Server Error: " + err.message });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});