const Post=require('../models/Post');
const User=require('../models/User');
const cloudinary=require('cloudinary'); 
exports.createPost = async (req, res) => {
    try{
        const myCloud=await cloudinary.v2.uploader.upload(req.body.image,{folder:"myfolderPost"});//uploading the image from frontend to cloudinary 
        const newPostData={
            caption:req.body.caption, 
            image:{
            public_id:myCloud.public_id,
            url:myCloud.secure_url,
            },
            owner:req.user._id,
        };
        const post=await Post.create(newPostData);
        const user=await User.findById(req.user._id);
        user.post.unshift(post._id);
        await user.save();
        res.status(201).json({ success:true,post,message:"post created"});
    }catch(error){
        res.status(500).json({success:false,message:error.message});
    }
}

exports.likeAndUnlikePost=async(req,res)=>{
    try{
        const post=await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({success:false,message:"Post not found"});
        }
        if(post.likes.includes(req.user._id)){ //post is already liked by user
            const likeIndex=post.likes.indexOf(req.user._id);
            post.likes.splice(likeIndex,1); //remove like from post
            await post.save();
            return res.status(200).json({success:true,message:"Post unliked successfully"});
        }else{//post is not liked by user
            post.likes.push(req.user._id); //add like to post
            await post.save();
            return res.status(200).json({success:true,message:"Post liked successfully"});
        }
    }catch(error){
        res.status(500).json({success:false,message:error.message});
    }
}

exports.deletePost=async (req,res)=>{
    try{
        const post=await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({success:false,message:"Post not found"});
        } 
        if(post.owner.toString()!==req.user._id.toString()){
            return res.status(403).json({success:false,message:"Unauthorized person"});
        }
        await Post.deleteOne({ _id: post._id });
        await cloudinary.v2.uploader.destroy(post.image.public_id) ; //delete from cloudinary also
        const user=await User.findById(req.user._id);
        const postIndex=user.post.indexOf(req.params.id);
        user.post.splice(postIndex,1); //remove post from user
        await user.save();
        res.status(200).json({success:true,message:"Post deleted"});
    }catch(error){
        res.status(500).json({success:false,message:error.message});
    }
}

exports.getPostOfFollowing=async (req,res)=>{
    try{
        const user=await User.findById(req.user._id).populate("following","posts");
        const posts=[];
        for(let i=0;i<user.following.length;i++){
            const post=await Post.find({owner:user.following[i]._id}).populate("owner likes comments.user");
            posts.push(...post);
        }
        res.status(200).json({success:true,posts:posts.reverse()});
    }catch(error){
        res.status(500).json({success:false,message:error.message});
    }
}

exports.updateCaption=async (req,res)=>{ //jo caption post kiya wahi update kar sakta hai
    try{
        const post=await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({success:false,message:"Post not found"});
        } 
        if(post.owner.toString()!==req.user._id.toString()){
            return res.status(403).json({success:false,message:"You are not authorized to update this post"});
        }
        post.caption=req.body.caption;
        await post.save();
        res.status(200).json({success:true,message:"Post updated",post});
    }catch(error){
        res.status(500).json({success:false,message:error.message});
    }
}

exports.CommentOnPost=async (req,res)=>{
    try{
        const post=await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({success:false,message:"Post not found"});
        } 
        const comment={
            user:req.user._id,
            comment:req.body.comment,
        };
        post.comments.push(comment);
        await post.save();
        res.status(200).json({success:true,message:"Comment added successfully",post});
    }catch(error){
        res.status(500).json({success:false,message:error.message});
    }
}

//delete comment from post , only post owner can delete comment
exports.deleteComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }
        const { commentId } = req.body;
        if (!commentId) {
            return res.status(400).json({success: false,message: "commentId is required to delete a comment"});
        }
        const commentIndex = post.comments.findIndex(
            (comment) => comment._id.toString() === commentId.toString()
        );
        if (commentIndex === -1) {
            return res.status(404).json({ success: false, message: "Comment not found" });
        }
        const comment = post.comments[commentIndex];
        const isPostOwner = post.owner.toString() === req.user._id.toString();
        const isCommentAuthor = comment.user.toString() === req.user._id.toString();

        if (!isPostOwner && !isCommentAuthor) {
            return res.status(403).json({ success: false, message: "You are not authorized to delete this comment" });
        }
        post.comments.splice(commentIndex, 1);
        await post.save();
        return res.status(200).json({success: true, message: "Comment deleted successfully", post,});
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message});
    }
};
