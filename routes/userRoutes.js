const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const multerFileUpload = require('../middleware/multerFileUpload');
const authenticate = require('../middleware/authentication');

router.get('/details/:user_id', userController.getUserDetails);
router.put('/update/:user_id', authenticate, userController.updateUserDetails);
router.get('/image/:user_id', userController.getUserImage);
router.post('/insert', authenticate, multerFileUpload.single('user_image'), userController.insertUser);
router.delete('/delete/:user_id', userController.deleteUser);
router.post('/login', userController.login);

module.exports = router;
