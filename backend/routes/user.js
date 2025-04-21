const express = require('express');
const router = express.Router();
const {register,login,followAndUnfollowUser,logout,updatePassword,updateProfile,deleteMyProfile,myProfile,getUserProfile,getAllUsers,forgotPassword,resetPassword, getMyPosts,getUserPosts}=require('../controllers/user');
const {isAuthenticated}=require('../middlewares/auth')
router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').get(logout) 
router.route('/follow/:id').get(isAuthenticated,followAndUnfollowUser); //follow and unfollow user
router.route('/update/password').put(isAuthenticated,updatePassword); 
router.route('/update/profile').put(isAuthenticated,updateProfile);
router.route('/delete/me').delete(isAuthenticated,deleteMyProfile); //delete my profile
router.route('/me').get(isAuthenticated,myProfile); //get my profile
router.route('/user/:id').get(isAuthenticated,getUserProfile); //get user profile
router.route('/users').get(isAuthenticated,getAllUsers); //get all users
router.route('/forgot/password').post(forgotPassword); 
router.route('/password/reset/:token').put(resetPassword); 
router.route('/my/posts').get(isAuthenticated,getMyPosts)
router.route('/userposts/:id').get(isAuthenticated,getUserPosts)
module.exports = router;