const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const app = express();

// 1. Middlewares
app.use(express.json()); 
app.use(cors({
  origin: "*" // எல்லா ஃபிரண்ட்-எண்ட் லிங்கையும் அனுமதிக்கும்
}));

// 2. MongoDB Connection
mongoose.connect('mongodb+srv://itachi:itachi*123@cluster0.thb8tpt.mongodb.net/?appName=Cluster0')
    .then(() => console.log('✅ MongoDB Connected Successfully!'))
    .catch((err) => console.error('❌ Connection Error:', err));

// 3. User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// 4. Root Route (சர்வர் வேலை செய்யுதான்னு செக் பண்ண)
app.get("/", (req, res) => {
    res.send("Server is running successfully!");
});

// 5. Register Route
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

// 6. Login Route
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});