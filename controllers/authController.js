// controllers/authController.js
const bcrypt=require('bcrypt')
const Jwt=require('jsonwebtoken')

const user =require('../models/user')

exports.signup = async (req, res) => {
  try {
    const { name,username, password } = req.body;
    // Check if the username already exists
    const existingUser = await user.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new user({ name,username,password:hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const User = await user.findOne({ username });

    if (!User) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, User.password);

    if (passwordMatch) {
      const token = Jwt.sign({ userId: User._id }, 'secret_key', {
        expiresIn: '1h',
      });
      res.status(200).json({ token });
      // res.status(200).json({ message:'login successful' });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

