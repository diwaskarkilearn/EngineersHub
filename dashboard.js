// routes/dashboard.js
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Contact = require('../models/Contact');

const router = express.Router();

// Dashboard middleware for web routes
const dashboardAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.query.token;
    
    if (!token) {
      return res.redirect('/login?error=Please login to access dashboard');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.redirect('/login?error=Invalid session');
    }

    req.user = user;
    next();
  } catch (error) {
    res.redirect('/login?error=Invalid session');
  }
};

// Dashboard Home
router.get('/', dashboardAuth, async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const jobseekerCount = await User.countDocuments({ role: 'jobseeker' });
    const employerCount = await User.countDocuments({ role: 'employer' });
    const contactCount = await Contact.countDocuments();

    res.render('dashboard', {
      user: req.user,
      stats: {
        userCount,
        jobseekerCount,
        employerCount,
        contactCount
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).send('Server Error');
  }
});

// Profile page
router.get('/profile', dashboardAuth, (req, res) => {
  res.render('profile', { user: req.user });
});

// Jobs page
router.get('/jobs', dashboardAuth, (req, res) => {
  res.render('jobs', { user: req.user });
});
// Logout Route
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
});

module.exports = router;
