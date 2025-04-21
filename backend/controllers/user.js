const User = require('../models/User');
const Post = require('../models/Post');
const {sendEmail} = require('../middlewares/sendEmail');
const crypto = require("crypto")
const cloudinary=require('cloudinary')
exports.register = async (req, res) => {
    try {
        const { name, email, password,avatar } = req.body;
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }
        const myCloud=await cloudinary.v2.uploader.upload(avatar,{folder:"avatars"})
        user = await User.create({name,email,password, avatar: {public_id: myCloud.public_id, url:myCloud.secure_url}});
        const token = await user.getJwtToken();
        const cookieExpireDays = Number(process.env.COOKIE_EXPIRES_TIME) || 7;

        const options = {
            expires: new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };
        res.cookie("token", token, options);
        res.status(201).json({ success: true, user, token });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please enter email and password" });
        }
        const user = await User.findOne({ email }).select("+password").populate("post followers following");
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }
        const token = await user.getJwtToken();
        const cookieExpireDays = Number(process.env.COOKIE_EXPIRES_TIME) || 7;

        const options = {
            expires: new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };

        res.cookie("token", token, options);
        res.status(201).json({ success: true, user, token });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.logout = async (req, res) => {
    try {
        res.cookie("token", null, {expires: new Date(Date.now()), httpOnly: true,});
        res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

exports.followAndUnfollowUser = async (req, res) => {
    try {
        const userToFollow = await User.findById(req.params.id);
        const loggedInUser = await User.findById(req.user._id);
        if (!userToFollow) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        if (userToFollow._id.toString() === loggedInUser._id.toString()) {
            return res.status(400).json({ success: false, message: "You cannot follow yourself" });
        }

        if (loggedInUser.following.includes(userToFollow._id)) {
            const followingIndex = loggedInUser.following.indexOf(userToFollow._id);
            loggedInUser.following.splice(followingIndex, 1); //remove user from following list
            userToFollow.followers.splice(userToFollow.followers.indexOf(loggedInUser._id), 1); //remove logged in user from followers list
            await loggedInUser.save();
            await userToFollow.save();
            return res.status(200).json({ success: true, message: "Unfollowed successfully" });
        } else {
            loggedInUser.following.push(userToFollow._id); //add user to following list
            userToFollow.followers.push(loggedInUser._id); //add logged in user to followers list
            await loggedInUser.save();
            await userToFollow.save();
            return res.status(200).json({ success: true, message: "Followed successfully" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
} 

exports.updatePassword = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("+password");
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ success: false, message: "Please enter old and new password" });
        }
        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid old password" });
        }
        user.password = newPassword;
        await user.save();
        res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const { name, email,avatar } = req.body;
        if (!name || !email) {
            return res.status(400).json({ success: false, message: "Please enter name and email" });
        }
        if(avatar){
            await cloudinary.v2.uploader.destroy(user.avatar.public_id)
             const myCloud=await cloudinary.v2.uploader.upload(avatar,{folder:"avatars",})
             user.avatar.public_id=myCloud.public_id;
             user.avatar.url=myCloud.secure_url;
        }
        user.name = name;
        user.email = email;
        await user.save();
        res.status(200).json({ success: true, message: "Profile updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

exports.deleteMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        await cloudinary.v2.uploader.destroy(user.avatar.public_id)
        await user.deleteOne();

        //logout user after deleting account
        res.cookie("token", null, { expires: new Date(Date.now()), httpOnly: true });

        const posts = user.post;
        for (let i = 0; i < posts.length; i++) {  //delete all the posts of the user
            const post = await Post.findById(posts[i]);
            if (post){
                await cloudinary.v2.uploader.destroy(post.image.public_id)
                await post.deleteOne();
            } 
        }

        // removeing user from followers list of other users
        
        const followers = user.followers; //array of followers
        for (let i = 0; i < followers.length; i++) {
            const follower = await User.findById(followers[i]);
            if (follower) {
                const index = follower.following.indexOf(user._id);
                if (index > -1) {
                    follower.following.splice(index, 1); //remove user from following list of follower
                    await follower.save();
                }
            }
        }

        // removing user from following's  followers list
        const following = user.following; //array of following
        for (let i = 0; i < following.length; i++) {
            const follow = await User.findById(following[i]);
            if (follow) {
                const index = follow.followers.indexOf(user._id);
                if (index > -1) {
                    follow.followers.splice(index, 1); //remove user from followers list of follow
                    await follow.save();
                }
            }
        }

        //removing all comments of the user from all posts

        const allPosts=await Post.find();
        for(let i=0;i<allPosts.length;i++){
            const post=await Post.findById(allPosts[i]._id);
            for(let j=0;j<post.comments.length;j++){
                if(post.comments[j].user===user._id){
                    post.comments.splice(j,1);
                    
                }
            }
            await post.save();
        }

        //removing all likes of the user from all user

        for(let i=0;i<allPosts.length;i++){
            const post=await Post.findById(allPosts[i]._id);
            for(let j=0;j<post.likes.length;j++){
                if(post.likes[j]===user._id){
                    post.likes.splice(j,1);
                    
                }
            }
            await post.save();
        }

        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

exports.myProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate("post followers following");
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate("post followers following");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({
            name: { $regex: req.query.name, $options: 'i' } // <-- fixed here
        }).select("-password"); // exclude password from user data

        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


exports.getMyPosts = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const posts=[];
        for(let i=0;i<user.post.length;i++){
            const p=await Post.findById(user.post[i]).populate("likes comments.user owner");
            posts.push(p)
        }
        //console.log(posts);
        res.status(200).json({ success: true, posts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

exports.getUserPosts = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const posts=[];
        for(let i=0;i<user.post.length;i++){
            const p=await Post.findById(user.post[i]).populate("likes comments.user owner");
            posts.push(p)
        }
        //console.log(posts);
        res.status(200).json({ success: true, posts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

exports.forgotPassword = async (req, res) => {
    try {
        const user=await User.findOne({email:req.body.email});
        if(!user){
            return res.status(404).json({success:false,message:"User not found"});
        }
        const resetToken=await user.getResetPasswordToken();
        await user.save();
        // const resetPasswordUrl=`${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
        const resetPasswordUrl=`${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;
        const message=`Your password reset token is as follows:\n\n ${resetPasswordUrl}\n\nIf you have not requested this email, then ignore it.`;
        try {
            await sendEmail({
                email:user.email,
                subject:`Reset password`,
                message,
            });
            res.status(200).json({success:true,message:`Email sent to ${user.email} successfully`});
        } catch (error) {
            user.resetPasswordToken=undefined;
            user.resetPasswordExpire=undefined;
            await user.save();
            return res.status(500).json({success:false,message:error.message});
        }

    }catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
        const user = await User.findOne({resetPasswordToken,  resetPasswordExpire: { $gt: Date.now()},});
        if (!user) {
            return res.status(401).json({success: false,message: "Token is invalid or has expired",});
        }
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        res.status(200).json({success: true, message: "Password updated successfully", });
    } catch (error) {
        res.status(500).json({success: false, message: error.message,});
    }
};

