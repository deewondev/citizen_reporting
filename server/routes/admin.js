const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../model/User');
const Post = require('../model/Post');
const EmailSub = require('../model/Subscription');
const authLayout = '../views/layouts/auth';
const jwt = require('jsonwebtoken');
const jwtSecretToken = 'myJwtSecretToken';
const authMiddleware = require('../helpers/authMiddleware');
const getTimeDifference =  require('../helpers/timeDifference');
const notificationSender = require('../helpers/notificationSender');


/**
 * Post Method
 * User Registration
 */
router.post('/register', async(req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({ username, password: hashedPassword });
        res.redirect('/login?showAlert=true&success=User Created Successfully');
    } catch (error) {
        if (error.code === 11000)
            res.redirect('/register?showAlert=true&danger=User already in use');
    }
});

/**
 * Post Method
 * User Login
 */
router.post('/login', async(req, res) => {
    try {
        const { username, password } = req.body;
        
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid Credentials' });
        }
        
        const validatePassword = await bcrypt.compare(password, user.password);
        if (!validatePassword) {
            return res.status(401).json({ message: 'Invalid Credentials' });
        }

        if (user.token) {
            // if an active token exists, clear it from database (invalidate the previous session)
            user.token = null;
            await user.save();
        }

        const token = jwt.sign({ userId: user._id }, jwtSecretToken);

        // Store in database, the new token in the User model for the user
        user.token = token;
        await user.save();

        res.cookie('token', token, { httpOnly: true });
        res.redirect('/dashboard?showAlert=true&success=Login Successfully');
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

/**
 * Get Method
 * User Dashboard
 */
router.get('/dashboard', authMiddleware, async(req, res) => {
    const isLoggedIn = req.isLoggedIn || false;
    const success = req.query.success || '';
    const danger = req.query.danger || '';

    const display = [
        { first: 'All', second: 'Incidents' },
        { first: 'New', second: 'Incident' },
        { first: 'Email', second: 'Subscribers'},
        { first: 'All', second: 'Users' }
    ];

    if (isLoggedIn === false) {
        res.redirect('/login');
    } else {
        try {
            const user = await User.findById(req.userId);
            const posts = await Post.find({});
            res.render('auth/dashboard', { user, success, danger, display, posts, getTimeDifference, isLoggedIn, layout: authLayout });
        } catch (error) {
            res.status(500).json({ message: 'Page not Found!!!, please Login first' });
        }
    }
});

/**
 * Get Method
 * User All-Posts
 */
router.get('/all-posts', authMiddleware, async(req, res) => {
    const isLoggedIn = req.isLoggedIn || false;
    const success = req.query.success || '';
    const danger = req.query.danger || '';

    if (isLoggedIn === false) {
        res.redirect('/login');
    } else {
        try {
            const user = await User.findById(req.userId);
            const posts = await Post.find({});
            res.render('auth/all-posts', { user, posts, success, danger, getTimeDifference, isLoggedIn, layout: authLayout });
        } catch (error) {
            res.status(500).json({ message: 'Page not Found!!!, please Login first' });
        }
    }
});

/**
 * Get Method
 * User Add-Post
 */
router.get('/add-post', authMiddleware, async(req, res) => {
    const isLoggedIn = req.isLoggedIn || false;

    if (isLoggedIn === false) {
        res.redirect('/login');
    } else {
        try {
            const user = await User.findById(req.userId);
            res.render('auth/add-post', { user, isLoggedIn, layout: authLayout });
        } catch (error) {
            res.status(500).json({ message: 'Page not Found!!!, please Login first' });
        }
    }
});

/**
 * Post Method
 * User Add-Post
 */
router.post('/add-post', async(req, res) => {
    try {
        const { title, category, description } = req.body;
        // isFeatured is set to 50% probability (0.5) of getting a true value, 30% probability (0.3 and so on)
        const isFeaturedRandom = Math.random() < 0.5;
        await Post.create({ title, category, description, isFeatured: isFeaturedRandom });
        
        // Send notification to all email subscribers
        await notificationSender();
        res.redirect('/all-posts?showAlert=true&success=Post Created Successfully');
    } catch (error) {
        // res.status(500).json({ message: 'Internal Service Error' });
        res.redirect(`/all-posts?showAlert=true&danger=${encodeURIComponent(error.message)}`);
    }
});

/**
 * Get Method
 * User Edit-Post
 */
router.get('/edit-post/:id', authMiddleware, async(req, res) => {
    const isLoggedIn = req.isLoggedIn || false;

    if (isLoggedIn === false) {
        res.redirect('/login');
    } else {
        try {
            const user = await User.findById(req.userId);
            const post = await Post.findOne({_id: req.params.id});
            res.render('auth/edit-post', { user, post, isLoggedIn, layout: authLayout });
        } catch (error) {
            res.status(500).json({ message: 'Page not Found!!!, please Login first' });
        }
    }
});

/**
 * Post Method
 * User Add-Post
 */
router.post('/edit-post/:id', async(req, res) => {
    try {
        const { title, category, description } = req.body;
        const postID = req.params.id;
        await Post.findByIdAndUpdate(postID, {
            title,
            category,
            description,
            updatedAt: Date.now()
        });
        res.redirect('/all-posts?showAlert=true&success=Post Updated Successfully');
    } catch (error) {
        res.redirect(`/all-posts?showAlert=true&danger=${encodeURIComponent(error.message)}`);
    }
});

/**
 * Delete Method
 * User Delete Post
*/
router.delete('/delete-post/:id', authMiddleware, async(req, res) => {
    try {
        const postID = req.params.id;
        await Post.deleteOne({ _id: postID });
        res.redirect('/all-posts?showAlert=true&danger=Post Deleted Successfully');
    } catch (error) {
        res.redirect(`/all-posts?showAlert=true&danger=${encodeURIComponent(error.message)}`);
    }
});

/**
 * Get Method
 * User Logout
 */
router.get('/logout', authMiddleware, async(req, res) => {
    try {
        // Clear the token from User model in database
        const user = await User.findById(req.userId);

        if (user) {
            user.token = null;
            await user.save();
        }

        // Clear the token from user's browser
        res.clearCookie('token');
        res.redirect('/');
    } catch (error) {
        console.log(error.message);
    }
});


/**
 * Get Method
 * Email Subscribers
 */
router.get('/subscribers', authMiddleware, async(req, res) => {
    const isLoggedIn = req.isLoggedIn || false;
    const success = req.query.success || '';
    const danger = req.query.danger || '';

    if (isLoggedIn === false) {
        res.redirect('/login');
    } else {
        try {
            const user = await User.findById(req.userId);
            const emailSub = await EmailSub.find({});
            res.render('auth/subscribers', { emailSub, user, isLoggedIn, success, danger, layout: authLayout });
        } catch (error) {
            console.log(error.message);
        }
    }
});

/**
 * Delete Method
 * Email Subscribers
*/
router.delete('/delete-email/:id', authMiddleware, async(req, res) => {
    try {
        await EmailSub.deleteOne({ _id: req.params.id });
        res.redirect('/subscribers?showAlert=true&danger=Email deleted successfully');
    } catch (error) {
        res.redirect(`/subscribers?showAlert=true&danger=${encodeURIComponent(error.message)}`);
    }
});


/**
 * Get Method
 * All Users
 */
router.get('/allUsers', authMiddleware, async(req, res) => {
    const isLoggedIn = req.isLoggedIn || false;
    const success = req.query.success || '';
    const danger = req.query.danger || '';

    if (isLoggedIn === false) {
        res.redirect('/login');
    } else {
        try {
            const user = await User.findById(req.userId);
            const allUsers = await User.find({});
            res.render('auth/users', { allUsers, user, success, danger, isLoggedIn, layout: authLayout });
        } catch (error) {
            console.log(error.message);
        }
    }
});

/**
 * Delete Method
 * All Users
*/
router.delete('/delete-user/:id', authMiddleware, async(req, res) => {
    try {
        await User.deleteOne({ _id: req.params.id });
        res.redirect('/allUsers?showAlert=true&danger=User deleted successfully');
    } catch (error) {
        res.redirect(`/allUsers?showAlert=true&danger=${encodeURIComponent(error.message)}`);
    }
});

module.exports = router;
