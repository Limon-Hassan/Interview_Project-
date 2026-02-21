const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../model_schema/UserModel');


async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'Invalid email or password' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid)
      return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getMe(req, res) {
  try {
    const user = await userModel.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


module.exports = {
  register,
  login,
  getMe,
};