
require('dotenv').config();
const express = require('express');
const User = require('../models/user');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

router.post('/register', async (req, res) => {
  try {
    const { email, password, confirm_password, name } = req.body;

    if (password !== confirm_password) {
      return res.json({ error: 'Passwords do not match!' });
    }
    if (!email || !password || !name) {
      return res.json({ error: 'All fields are required' });
    }

    const exist = await User.findOne({ email });
    if (exist) {
      return res.json({ error: 'Email is already in use' });
    }

    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    const user = await User.create({ name, email, password: hash });

    jwt.sign({ email: user.email, id: user._id }, process.env.SECRET_KEY, {}, (err, token) => {
      if (err) throw err;
      res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'Strict' });
      res.redirect('/home');
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ error: 'No user found' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.json({ error: 'Wrong Password' });
    }

    jwt.sign({ email: user.email, id: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'Strict' });
      res.redirect('/home');
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;