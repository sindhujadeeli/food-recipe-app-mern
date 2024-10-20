const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign({ id: user._id,
      email: user.email, 
      username: user.username, 
      // role: user.role
   }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Register User
exports.registerUser = async (req, res) => {
  const { username, email, password, dob } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    const existingUserId = await User.findOne({ username });
    
    if (existingUserId) {
      return res.status(409).json({ message: 'Username already exists' });
    }
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const user = new User({ username, email, password, dob });
    await user.save();
    
    const token = generateToken(user);
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Protected route example
exports.protectedRoute = (req, res) => {
  res.status(200).json({ message: 'Welcome to the protected route!' });
};

exports.checkRole = async (req, res) => {
  const isAdmin = await User.find({ role: 'admin', email:req.user.email});
  if (isAdmin.length > 0) {
    return res.status(200).send({isAdmin:true});
  }
  else{
    return res.status(200).send({isAdmin:false});
  }
};

exports.getAllAdmins = async (req, res) => {
  const admins = await User.find({ role: 'admin' });
  res.status(200).send(admins);
};

exports.createAdmin = async (req, res) => {
  const { email } = req.body; // Get the email from the request parameters
  try {
    
    // Find the user by email and update their role to 'admin'
    const user = await User.findOneAndUpdate(
      { email },
      { role: 'admin' },
      { new: true } // Return the updated document
    );

    if (!user) return res.status(404).send('User not found.');


    res.status(200).send(user); // Return the updated user
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

exports.deleteAdmin = async (req, res) => {
  const email = req.params.email; // Get the email from the request parameters
  try {
    if(email == req.user.email){
      return res.status(400).send('You cannot delete yourself.');
    }
    // Find the user by email and update their role to 'user'
    const user = await User.findOneAndUpdate(
      { email },
      { role: 'user' },
      { new: true } // Return the updated document
    );

    if (!user) return res.status(404).send('User not found.');

    res.status(200).send(user); // Return the updated user
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

exports.userProfile = async (req, res) => {
  try {
    res.status(200).send(req.user);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
}

//update username based on email
exports.editProfile = async (req, res) => {
  try {
    const { email, username } = req.body;
    const user = await User.findOneAndUpdate(
      { email },
      { username },
      { new: true }
    );
    if (!user) return res.status(404).send('User not found.');
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send('User not found.');
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).send('Current password is incorrect.');
    }

    user.password = newPassword;
    await user.save();
    res.status(200).send('Password changed successfully.');
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

exports.resetPasswords= async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send('User not found.');
    }
    res.status(200).send('Password reset link sent to your email.');
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

// Function to verify code and reset password
exports.resetPassword = async (req, res) => {
  try{
    const { email, newPassword, dob } = req.body;
  const user = await User.findOne({ email, dob });
  if (!user) {
    return res.status(400).json({ success: false, message: 'Invalid email or Date of birth' });
  }
  user.password = newPassword; 
  await user.save();

  res.json({ success: true });
  }
  catch(err){
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
