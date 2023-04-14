const router = require('express').Router();
const path = require("path");
const multer = require('multer');
const { v4 : uuidv4 } = require('uuid');
const authUser = require('../middleware/auth');
const user = require('../controllers/user');


// User image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/userImages');
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4() + path.extname(file.originalname));
    }
});

const uploadImage = multer({
    storage: storage,

    fileFilter: (req, file, cb) => {
        if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error("Only .png, .jpg, and .jpeg file format allowed"));
        } 
    },   
}).single('image');


router.post('/register', uploadImage, user.register);
router.post('/login', user.login);
router.put('/updateImage', authUser, uploadImage, user.updateImage);
router.get('/profile', authUser, user.getProfile);
router.get('/getUser/:id', authUser, user.getUserById);
router.put('/updateProfile', authUser, user.updateProfile);
router.post('/changePassword', authUser, user.changePassword);
router.put('/update/:id', authUser, user.updateUserDetails);
router.delete('/delete/:id', authUser, user.deleteUserDetails);
router.get('/usersList', authUser, user.getUsersList);
router.get('/logout', authUser, user.logout);

module.exports = router;