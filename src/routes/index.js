const router = require('express').Router();

const authRoutes = require('./auth.route');
const userRoutes = require('./user.route');
const profileRoutes = require('./profile.route');

router.get('/', (req, res) => { res.json({ message: 'Home' }); });

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/profile', profileRoutes);

module.exports = router;
