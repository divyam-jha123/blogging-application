const { Router } = require('express');
const User = require('../models/user');
const { createToken, verifyUser } = require('../service/authentication');
const { compare } = require('bcrypt');
const bcrypt = require('bcrypt');

const router = Router();

router.get('/signup', (req, res) => {
    return res.render('signup');
});

router.get('/login', (req, res) => {
    return res.render('login');
});

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.redirect('/user/login');
});

router.post('/signup', async (req, res) => {
    try {
        const { userName, email, password } = req.body;

        const checkUser = await User.findOne({
            email,
        });

        if (checkUser) {
            return res.redirect('/user/login');
        }

        const user = await User.create({
            userName,
            email,
            password,
        });

        return res.redirect('/user/login');


    } catch (error) {
        console.error('Signup error:', error);
        return res.render('signup', {
            error: 'Signup failed. Please try again.'
        });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({
            email: email,
        })

        if (!user) {
            return res.render('login', {
                error: 'Invalid email or password'
            });
        }

        const isMatch = await compare(
            password,
            user.password,
        )

        if (!isMatch) {
            return res.render('login', {
                error: 'Invalid email or password'
            });
        }

        const token = createToken(user);

        // Store token in cookie
        return res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 60 * 60 * 1000,
            sameSite: 'strict'
        }).redirect('/');

    } catch (error) {
        return res.render('login', {
            error: 'Invalid email or password,signup',
        })
    }
});

// forget page

router.get('/forgetPass', (req, res) => {
    return res.render('forgetPass');
});

router.post('/forgetPass', async (req, res) => {
    try {
        const { email, newPassword, confirmPassword } = req.body;

        // Validate input fields
        if (!email || !newPassword || !confirmPassword) {
            return res.render('forgetPass', {
                error: 'All fields are required'
            });
        }

        // Check if passwords match
        if (newPassword !== confirmPassword) {
            return res.render('forgetPass', {
                error: 'Passwords do not match'
            });
        }

        if (newPassword.length < 6) {
            return res.render('forgetPass', {
                error: 'Password must be at least 6 characters long'
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.render('forgetPass', {
                error: 'User not found with this email address'
            });
        }
        user.password = newPassword;
        await user.save();

        return res.render('login', {        
            success: 'Password updated successfully'
        })
    } catch (error) {
        console.error('Error updating password:', error);
        return res.render('forgetPass', {
            error: 'An error occurred. Please try again later.'
        });
    }
});




module.exports = router;