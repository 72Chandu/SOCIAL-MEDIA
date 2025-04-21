const express = require('express');
const { createPost,likeAndUnlikePost,deletePost,getPostOfFollowing,updateCaption,CommentOnPost,deleteComment} = require('../controllers/post');
const { isAuthenticated } = require('../middlewares/auth');
const router = express.Router();

router.route('/post/upload').post(isAuthenticated,createPost); //localhost:4000/api/v1/post/upload
router.route('/post/:id').get(isAuthenticated,likeAndUnlikePost).put(isAuthenticated,updateCaption).delete(isAuthenticated,deletePost);
router.route('/posts').get(isAuthenticated,getPostOfFollowing); 
router.route('/post/comment/:id').post(isAuthenticated,CommentOnPost).delete(isAuthenticated,deleteComment);

module.exports = router;