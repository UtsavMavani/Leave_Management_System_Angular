const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const Boom = require('@hapi/boom');
const { message } = require('../utils/message');
const db = require('../database/config');
const User = db.connect().users;

// Register user
const register = async (req, res, next) => {
  try {
    const data = req.body;

    const userExist = await User.findOne({
      where: { email: data.email }
    });

    if(userExist){
      return next(Boom.badRequest(message.RECORD_ALREADY_EXIST));
    }

    if (data.password){
      data.password = await bcrypt.hash(data.password, 10);
    }

    // let image = '';
    // image = req.file ? req.file.filename : null;

    const user = await User.create(data);
    
    res.status(201).json({
      statusCode: 201,
      message: 'User created successfully',
      data: user
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
      where: { email }
    });

    if (!(user && (await bcrypt.compare(password, user.password)))) {
      return next(Boom.unauthorized(message.INVALID_CREDENTIALS));
    }

    // Create jwt token
    const token = jwt.sign(
      { userId: user.id, userEmail: user.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      statusCode: 200,
      message: "User logged in successfully", 
      token: token
    });    

  } catch (err) {
    return next(Boom.badData(err));
  }
}

// Get user profile
const getProfileDetails = async (req, res, next) => {
  try {
    const id = req.user;

    const userProfile = await User.findOne({
      where: { id },
      attributes: {
        exclude: ['password', 'role']
      }
    });

    if(!userProfile){
      return next(Boom.notFound('User profile not found'));
    }

    res.status(200).json({ 
      statusCode: 200,
      data: userProfile 
    });

  } catch (err) {
    return next(Boom.badData(err));
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
    
    const user = await User.findOne({
      where : { id }
    });

    // Compare the db password to the user input old password
    const result = await bcrypt.compare(oldPass, user.password);
    
    // Set new hash password
    if(result){
      if(!(newPass === conPass)){
        return next(Boom.badData(message.NEW_CONF_PASSWORD_NOT_MATCH));
      }

      const hashPassword = await bcrypt.hash(newPass, 10);

      await User.update({
        password: hashPassword, 
      }, { 
        where: { id },
      });

      res.status(200).send({ 
        statusCode: 200,
        message: "Password changed successfully",
      });

    } else {
      return next(Boom.unauthorized(message.OLD_PASSWORD_NOT_MATCH));
    }

  } catch (err) {
    return next(Boom.badData(err));
  }
}

// // Get all users
// const getUsersDetails = async(req, res, next) => {
//   try {
//     // Find all books which is added by perticular user using foreign key (user => books)
//     // const users = await User.findAll({
//     //   include: {
//     //     model: Book
//     //   },
//     //   where: { id: 2},
//     //   attributes: {
//     //     exclude: ['password']
//     //   }
//     // });

//     const users = await User.findAll({
//       attributes: {
//         exclude: ['password']
//       }
//     });

//     if(!users.length){
//       return next(Boom.notFound(message.RECORD_NOT_FOUND));
//     }

//     res.status(200).json({
//       statusCode: 200,
//       message: 'Users found successfully',
//       data: users
//     });
//   } catch (error) {
//     return next(Boom.badImplementation());
//   }
// }


// // Update user
// const updateUserDetails = async(req, res, next) => {
//   try {
//     // Get user id
//     const { id } = req.params;

//     // Get user input
//     const { name, email, password, gender, interest } = req.body;

//     // Get detilas from database
//     const user = await User.findOne({
//       where: { id } 
//     });

//     // check if user exist or not
//     if(!user){
//       deleteUserImage(user.image);
//       return next(Boom.notFound(message.RECORD_NOT_FOUND));
//     }

//     // Update user image
//     let image = user.image ;
//     if(req.file){
//       image = (image == null) ? req.file.filename : deleteUserImage(user.image);
//     }

//     // Encrypt user password
//     const encryptedPassword = password ? await bcrypt.hash(password, 10) : user.password;

//     // Update user in our database
//     await User.update({
//       id,
//       name, 
//       email: email ? email.toLowerCase() : user.email, 
//       password: encryptedPassword, 
//       gender, 
//       interest,
//       image,
//       createdAt: user.createdAt,
//       updatedAt: new Date()
//     }, { 
//       where: { id } 
//     });

//     res.status(200).send({ 
//       statusCode: 200, 
//       message: 'User updated successfully', 
//       data: user,
//     });

//   } catch (error) {
//     return next(Boom.badImplementation());
//   }
// }


// // Delete user
// const deleteUserDetails = async(req, res, next) => {
//   try {
//     let { id } = req.params;

//     const user = await User.findOne({ where: { id } });
//     if(!user){
//       return res.status(404).send("User does not exist !");
//     } 

//     deleteUserImage(user.image);

//     await User.destroy({ where: { id } });

//     res.status(200).send({ 
//       statusCode: 200, 
//       message: 'User deleted successfully',
//       data: user 
//     });

//   } catch (error) {
//     return next(Boom.badImplementation());
//   }
// }


module.exports = {
  register,
  login,
  getProfileDetails,
  changePassword
};