import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
const router = express.Router();
import Post from '../models/Post.js';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const adminLayout = '../views/layouts/admin';
const jwtSecret = process.env.JWT_SECRET;

// Middleware
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorised' });
    }
    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next();
    }
    catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Unauthorised' });
    }
}

// Admin Login
router.get('/admin', async (req, res) => {
    try {
        const locals = {
            title: 'Admin',
            description: 'Welcome to admin dashboard'
        }
        res.render('admin/index', { locals, layout: adminLayout })
    }
    catch (error) { console.error(error); }
});

// Admin Dashboard
router.get('/dashboard', authMiddleware, async (req, res) => {
    try {
        const locals = {
            title: 'Admin',
            description: 'Welcome to admin dashboard',
            layout: adminLayout
        }
        const data = await Post.find();
        res.render('admin/dashboard', { locals, data, layout: adminLayout });
    }
    catch (error) { console.error(error); }
});

// Admin Login Check
router.post('/admin', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) { return res.status(401).json({ message: 'Invalid credentials' }); }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) { return res.status(401).json({ message: 'Invalid credentials' }); }
        const token = jwt.sign({ userId: user._id }, jwtSecret);
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/dashboard');
    }


    catch (error) { console.error(error); }
});

// Admin Register
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashPassword = await bcrypt.hash(password, 10);
        try {
            const user = await User.create({ username, password: hashPassword });
            res.status(201).json({ message: 'user created', user });
        }
        catch (error) {
            console.error(error);
            if (error.code === 11000) {
                res.status(409).json({ message: 'user taken' });
            }
            res.status(500).json({ message: 'internal server error' });
        }
    }
    catch (error) { console.error(error); }
});

// Create Post Panel
router.get('/add-post', authMiddleware, async (req, res) => {
    try {
        const locals = {
            title: 'Add Post',
            description: 'Welcome to admin dashboard',

        }
        const data = await Post.find();
        res.render('admin/add-post', { locals, layout: adminLayout });
    }
    catch (error) { console.error(error); }
});

// Upload Post Redirect
router.post('/add-post', authMiddleware, async (req, res) => {
    try {
        const newPost = new Post({
            title: req.body.title,
            body: req.body.body,
        });
        await Post.create(newPost);
        res.redirect('/dashboard')
    }
    catch (error) { console.error(error); }
});

// Edit Existing post
router.get('/edit-post/:id', authMiddleware, async (req, res) => {
    try {
        const data = await Post.findOne({ _id: req.params.id });
        const locals = {
            title: 'Edit Post',
            description: 'Welcome to admin dashboard',
        }
        res.render('admin/edit-post', {
            data,
            layout: adminLayout
        });

    }
    catch (error) { console.error(error); }
});

// Update Existing post
router.put('/edit-post/:id', authMiddleware, async (req, res) => {
    try {
        await Post.findByIdAndUpdate(req.params.id, {
            title: req.params.title,
            body: req.params.body,
            updatedAt: Date.now()
        });
        res.redirect(`/edit-post/${req.params.id}`);
    }
    catch (error) { console.error(error); }
});

// Delete Existing Post
router.delete('/delete-post/:id', authMiddleware, async (req, res) => {
    try {
        await Post.deleteOne({ _id: req.params.id });
        res.redirect('/dashboard');
    }
    catch (error) { console.error(error); }
});

export default router;