const jwt = require('jsonwebtoken');
const jwtSecretToken = 'myJwtSecretToken';

// Auth Middleware
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        // return res.status(401).json({ message: 'Unauthorized' });
        req.isLoggedIn = false;
        next();
    } else {
        try {
            const decoded = jwt.verify(token, jwtSecretToken);
            req.userId =  decoded.userId;
            req.isLoggedIn = true;
            next();
        } catch (error) {
            // res.status(401).json({ message: 'Unauthorized' });
            req.isLoggedIn = false;
            next();
        }
    }
}

module.exports = authMiddleware;