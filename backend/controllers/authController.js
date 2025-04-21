const authModel = require('../models/authModel');

exports.register = (req, res) => {
  const { name, email, password } = req.body;

  authModel.findUserByEmail(email, (err, results) => {
    if (results.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    authModel.createUser({ name, email, password }, (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ message: 'User registered successfully' });
    });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  authModel.findUserByEmail(email, (err, results) => {
    if (err) return res.status(500).json({ error: err });

    if (results.length === 0 || results[0].password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful', user: results[0] });
  });
};
