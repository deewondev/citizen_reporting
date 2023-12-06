const express = require('express');
const router = express.Router();
const authMiddleware = require('../helpers/authMiddleware');
const User = require('../model/User');
const Post = require('../model/Post');
const Subscription = require('../model/Subscription');
const getTimeDifference =  require('../helpers/timeDifference');

/**
 * Get Method
 * Home Page
 */
router.get('/', authMiddleware, async(req, res) => {
    const isLoggedIn = req.isLoggedIn || false;
    const user = await User.findById(req.userId);
    const { category } = req.query;
    let posts, initialPosts, filteredPosts;
    initialPosts = await Post.find({}).sort({createdAt: -1}).limit(10);
    filteredPosts = await Post.find({category}).sort({createdAt: -1});
    
    try {
        if (category && category !== 'all') {
            posts = filteredPosts;
        } else {
            posts = initialPosts;
        }
        // sort in ascending order (createdAt: 1) and descending order (createdAt: -1)
        const latestPosts = await Post.find({}).sort({createdAt: -1}).limit(3);
        const featuredPosts = await Post.find({isFeatured: true}).sort({createdAt: -1}).limit(5);
        res.render('index', { isLoggedIn, user, posts, category, latestPosts, featuredPosts, getTimeDifference, currentPage: '/' });   
    } catch (error) {
        console.log(error.message);    
    }
});

/**
 * Get Method
 * Load-More Post
 */
router.get('/load-more', async(req, res) => {
    const skip = parseInt(req.query.skip || 0);
    const limit = 3;

    try {
        const posts = await Post.find({}).sort({createdAt: -1}).skip(skip).limit(limit).exec();
        res.json(posts);
    } catch (error) {
        console.log(error.message);
    }
});

/**
 * Get Method
 * Register Page
 */
router.get('/register', authMiddleware, (req, res) => {
    const isLoggedIn = req.isLoggedIn || false;
    const success = req.query.success || '';
    const danger = req.query.danger || '';

    res.render('auth/register', { isLoggedIn, success, danger, currentPage: '/register' });
});

/**
 * Get Method
 * Login Page
 */
router.get('/login', authMiddleware, (req, res) => {
    const isLoggedIn = req.isLoggedIn || false;
    const success = req.query.success || '';
    const danger = req.query.danger || '';

    res.render('auth/login', { isLoggedIn, success, danger, currentPage: '/login' });
});


/**
 * Get Method
 * Single Post Page
 */
router.get('/post/:id', authMiddleware, async(req, res) => {
    try {
        const isLoggedIn = req.isLoggedIn || false;
        const user = await User.findById(req.userId);
        const slug = req.params.id;
        const data = await Post.findById({_id: slug});
        const relatedPosts = await Post.find({ category: data.category });
        const latestPosts = await Post.find({}).sort({createdAt: -1}).limit(3);
        res.render('posts', {isLoggedIn, user, data, relatedPosts, latestPosts, getTimeDifference, currentPage: `/post/${slug}`});
    } catch (error) {
        console.log(error.message);
    }
});

/**
 * Post Method
 * Search Page
 */
router.post('/search', authMiddleware, async(req, res) => {
    const isLoggedIn = req.isLoggedIn || false;
    const user = await User.findById(req.userId);
    let { searchTerm } = req.body;

    try {
        const latestPosts = await Post.find({}).sort({createdAt: -1}).limit(3);
        const search = await Post.find({
            $or: [
                { title: { $regex: new RegExp(searchTerm, 'i') }},
                { description: { $regex: new RegExp(searchTerm, 'i') }}
            ]
        });
        res.render('search', {isLoggedIn, user, latestPosts, search, getTimeDifference, currentPage: '/search'});
    } catch (error) {
        console.log(error.message);
    }
});

/**
 * Post Method
 * Email Subscription
 */
router.post('/subscribe', async(req, res) => {
    const { email } = req.body;
    try {
        const newSub = await Subscription.create({ email });

        req.session.emailSub = newSub.email;
        res.redirect('subscribe');
    } catch (error) {
        console.log(error.message);
    }
});

/**
 * Get Method
 * Email Subscription
 */
router.get('/subscribe', authMiddleware, async(req, res) => {
    try {
        const isLoggedIn = req.isLoggedIn || false;
        const user = await User.findById(req.userId);
        const latestPosts = await Post.find({}).sort({createdAt: -1}).limit(3);
        const newEmail = req.session.emailSub
        res.render('subscribe', {user, isLoggedIn, newEmail, latestPosts, getTimeDifference, currentPage: '/subscribe'});
    } catch (error) {
        console.log(error.message);
    }
});


module.exports = router;
