const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const fs = require('fs');
const path = require('path');
const Boom = require('@hapi/boom');
const { message } = require('../utils/message');
const sendMail = require('../utils/sendEmail');

const User = require('../models').users;
const Role = require('../models').roles;
const UserLeave = require('../models').userLeaves;


// Common function for delete user image 
function deleteUserImage(image) {
  const imagePath = path.join(__dirname, "../public/userImages/");
  fs.unlinkSync(imagePath + image);
}

// Register user
const register = async (req, res, next) => {
  try {
    const data = req.body;
    
    delete data.cpassword;
    data.department = data.department ? data.department : '';
    data.grNumber = data.grNumber ? data.grNumber : '';
    data.class = data.class ? data.class : '';
    data.image = req.file ? req.file.filename : '';

    const emailPassword = data.password;

    const userExist = await User.findOne({ where: { email: data.email } });
    if(userExist){
      if (req.file) deleteUserImage(req.file.filename);
      return next(Boom.badRequest(message.RECORD_ALREADY_EXIST));
    }

    data.password = await bcrypt.hash(data.password, 10);

    const user = await User.create(data);

    await UserLeave.create({ userId: user.id });

    // const subject = "Please Logged in Leave Management System";
    // const html = `<h1>Hi, ${data.name}</h1><br/>
    //               <p>You are successfully registered in Leave Management System.</p><br/>
    //               <p>Please enter the below mentioned email and password for logging into Leave Management System.</p><br/>
    //               <p>Email : ${data.email}</p>
    //               <p>Password : ${emailPassword}</p></br>
    //               <p>Thank you</p>`;
    // sendMail(data.email, subject, html);
    
    res.status(200).json({
      message: 'User registered successfully',
      user
    });

  } catch (err) {
    return next(Boom.badData(err));
  }
}

// Login user
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      return next(Boom.badRequest(message.EMAIL_PASSWORD_REQUIRED));
    }

    const user = await User.findOne({ 
      where: { email },
      include: {
        model: Role,
        as: 'roles',
        attributes: ['name'],
      } 
    });

    if (!(user && (await bcrypt.compare(password, user.password)))) {
      return next(Boom.unauthorized(message.INVALID_CREDENTIALS));
    }

    // Create jwt token
    const token = jwt.sign(
      { userId: user.id, userEmail: user.email, userRole: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "24h" }
    );
    
    // Set the token in a cookie with a 7-day expiration time
    res.cookie('access-token', token, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true });

    res.status(200).json({
      message: "User logged in successfully", 
      token,
      user
    });    

  } catch (err) {
    return next(Boom.badImplementation());
  }
}

// Update user profile image
const updateImage = async (req, res, next) => {
  try {
    const id = req.user;

    const profile = await User.findOne({ 
      where: { id },
      include: {
        model: Role,
        as: 'roles',
        attributes: ['name'],
      } 
    });
    if (!profile){
      return next(Boom.unauthorized('User does not logged in, please login'));
    }

    if (profile.image) {
      deleteUserImage(profile.image);
    }

    profile.image = req.file ? req.file.filename : profile.image;
    profile.save();

    res.status(200).json({ 
      message: "Profile image updated successfully",
      profile
    });

  } catch (err) {
    return next(Boom.badImplementation());
  }
}

// Get user profile
const getProfile = async (req, res, next) => {
  try {
    const id = req.user;

    const profile = await User.findOne({
      where: { id },
      attributes: {
        exclude: ['password']
      },
      include: {
        model: Role,
        as: 'roles',
        attributes: ['name'],
      } 
    });

    if (!profile){
      return next(Boom.unauthorized('User does not logged in, please login'));
    }

    res.status(200).json({ 
      profile 
    });

  } catch (err) {
    return next(Boom.badImplementation());
  }
}

// Get user by id
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ where: { id } });
    if (!user){
      return next(Boom.unauthorized('User does not logged in, please login'));
    }

    res.status(200).json({ 
      user 
    });

  } catch (err) {
    return next(Boom.badImplementation());
  }
}

// Update user profile
const updateProfile = async (req, res, next) => {
  try {
    const id = req.user;
    const data = req.body;

    const user = await User.findOne({ where: { id } });
    if (!user){
      return next(Boom.unauthorized('User does not logged in, please login'));
    }

    const updated = await User.update(data, { 
      where: { id } 
    });

    res.status(200).json({ 
      message: 'User profile updated successfully',
      updated
    });

  } catch (err) {
    return next(Boom.badImplementation());
  }
}

// Change user password
const changePassword = async (req, res, next) => {
  try {
    const { oldPass, newPass, conPass} = req.body;
    const id = req.user;

    if (!(oldPass && newPass && conPass)) {
      return next(Boom.badRequest(message.OLD_NEW_CONF_PASSWORD_REQUIRED));
    }
    
    const user = await User.findOne({ where : { id } });
    if (!user) {
      return next(Boom.unauthorized('User does not logged in, please login'));
    }

    // Compare the db password to the user input old password
    const result = await bcrypt.compare(oldPass, user.password);
    
    // Set new hash password
    if(!result){
      return next(Boom.unauthorized(message.OLD_PASSWORD_NOT_MATCH));
    }

    if (!(newPass === conPass)){
      return next(Boom.badData(message.NEW_CONF_PASSWORD_NOT_MATCH));
    }

    const hashPassword = await bcrypt.hash(newPass, 10);

    await User.update({
      password: hashPassword, 
    }, { 
      where: { id },
    });

    res.status(200).json({ 
      message: "Password changed successfully",
    });

  } catch (err) {
    return next(Boom.badImplementation());
  }
}

// Update user by id
const updateUserDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const user = await User.findOne({ where: { id } });
    if (!user){
      return next(Boom.badRequest(message.RECORD_NOT_FOUND));
    }

    await User.update(data, { 
      where: { id } 
    });

    res.status(200).json({ 
      message: 'User updated successfully'
    });

  } catch (err) {
    return next(Boom.badImplementation());
  }
}

// Delete user by id
const deleteUserDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ where: { id } });
    if (!user){
      return next(Boom.notFound(message.RECORD_NOT_FOUND));
    } 

    if (user.image) {
      deleteUserImage(user.image);
    }

    await User.destroy({ where: { id } });

    res.status(200).json({  
      message: 'User deleted successfully',
    });

  } catch (err) {
    console.log(err);
    return next(Boom.badImplementation());
  }
}

// Get all users
const getUsersList = async (req, res, next) => {
  try {
    const { role } = req.query;

    const filter = {};
    if (role) {
      filter.role = parseInt(role);
    } 

    const userList = await User.findAll({
      where: filter,
      attributes: {
        exclude: ['password']
      },
      include: {
        model: Role,
        as: 'roles',
        attributes: ['name'],
      }
    });

    res.status(200).json({
      userList
    });

  } catch (err) {
    console.log(err);
    return next(Boom.badImplementation());
  }
}

// Logout user
const logout = async (req, res, next) => {
  try {
    res.clearCookie('access-token');

    res.status(200).json({
      message: "User logged out successfully"
    });

  } catch (err) {
    console.log(err);
    return next(Boom.badImplementation());
  }
}

module.exports = {
  register,
  login,
  updateImage,
  getProfile,
  getUserById,
  updateProfile,
  changePassword,
  updateUserDetails,
  deleteUserDetails,
  getUsersList,
  logout
};