const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const config = require('../config/database');

router.post('/register', (req, res) => {
    let newUser = new Admin({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        contact: req.body.contact,
        password: req.body.password,
        job_profile: req.body.job_profile
    });
    Admin.addAdmin(newAdmin, (err, user) => {
        if (err) {
            let message = '';
            if (err.errors.username) message = 'Username already taken..'
            if (err.errors.email) message += 'Email already exist...'
            return res.json({
                success: false,
                message
            });
        } else {
            return res.json({
                success: true,
                message: 'Admin registered'
            })
        }
    })
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    Admin.getAdminByUsername(username, (err, admin) => {
        if (err) throw err;
        if (!admin) {
            return res.json({
                success: false,
                message: 'Admin not Found.'
            })
        }
        Admin.comparePassword(password, admin.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign({
                    type: 'admin',
                    data: {
                        _id: admin._id,
                        username: admin.username,
                        name: admin.name,
                        email: admin.email,
                        contact: admin.contact,
                        job_profile: admin.job_profile
                    }
                }, config.secret, {
                    expiresIn: 604800 // a week 
                });
                return res.json({
                    success: true,
                    token: 'JWT' + token
                });
            } else {
                return res.json({
                    success: true,
                    message: 'Wrong Password'
                })
            }
        })
    })
});

router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
    console.log(req.user);
    res.json('hello');
})

module.exports = router;