import React, { useEffect, useState } from 'react'
import '../Account/Account.css'
import { useDispatch, useSelector } from 'react-redux'
import { deleteMyProfile, getMyPosts, logoutUser } from '../../Actions/User';
import Loader from '../Loader/Loader';
import { toast } from 'react-toastify';
import Post from '../Post/Post';
import { Avatar, Button, Dialog, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import User from '../User/User';
import defaultAvatar from '../../default.png';
const Account = () => {
  const dispatch = useDispatch();
  const {user,loading:userloading}=useSelector((state)=>state.user)
  const { loading, error, posts } = useSelector((state) => state.myPost);
  const { error:LikeError, message,loading:deleteLoading } = useSelector((state) => state.like);
  const [followersToggle,setFollowersToggle]=useState(false)
  const [followingToggle,setFollowingToggle]=useState(false)
  const logoutHandler =async ()=>{
   await dispatch(logoutUser())
   toast.success("Logged out sucessfully");
  }
  const deleteProfileHandler=async ()=>{
    await dispatch(deleteMyProfile())
    dispatch(logoutUser())
  }
  useEffect(() => {
    dispatch(getMyPosts())
  }, [dispatch])

  useEffect(() => {
    if (LikeError) {
      toast.error(LikeError);
      dispatch({ type: 'clearErrors' });
    }
    if (error) {
      toast.error(error);
      dispatch({ type: 'clearErrors' });
    }
    if (message) {
      toast.success(message);
      dispatch({ type: 'clearMessage' });
    }
  }, [LikeError,error, message, dispatch]);
  return loading===true || userloading===true ? (<Loader />
  ) : (
    <div className='account'>
      <div className="accountleft">
        {
          posts && posts.length > 0 ? (posts.filter((post)=>post && post._id).map((post)=>(
            <Post key={post._id} postId={post._id} postImage={post.image?.url} comments={post.comments} caption={post.caption} ownerName={post.owner?.name} ownerImage={post.owner?.avatar?.url} ownerId={post.owner?._id} likes={post.likes} isAccount={true} isDelete={true}/>
          ))) : (<Typography variant='h6'>You have not made any post</Typography>)
        }
      </div>
      <div className="accountright">
        <Avatar src={user?.avatar?.url} sx={{height:'8vmax',width:'8vmax'}}/>
        <Typography variant='h5'>{user.name}</Typography>
        <div>
          <button onClick={()=>setFollowersToggle(!followersToggle)} ><Typography>Followers</Typography></button>
          <Typography>{user?.followers?.length}</Typography>
        </div>
        <div>
          <button onClick={()=>setFollowingToggle(!followingToggle)}><Typography>Following</Typography></button>
          <Typography>{user?.following?.length}</Typography>
        </div>
        <div>
          <Typography>Post</Typography>
          <Typography>{user?.post?.length}</Typography>
        </div>
        <Button variant='contained' onClick={logoutHandler}>Logout</Button>
        <Link to='/update/profile'>Edit Profile</Link>
        <Link to='/update/password'>Change Password</Link>
        <Button disabled={deleteLoading} onClick={deleteProfileHandler} variant='text' style={{color:'red',margin:'2vmax'}}>Delete My profile</Button>
        
        <Dialog open={followersToggle} onClose={()=>setFollowersToggle(!followersToggle)}>
        <div className="DialogBox">
          <Typography variant='h4'>Followers</Typography>
          {
            user && user?.followers?.length > 0 ? user?.followers?.map((follower)=>(
              <User
              key={follower._id}
              userId={follower._id}
              name={follower.name}
              avatar={follower.avatar?.url || defaultAvatar} 
            />
            )):(<Typography style={{margin:'2vmax'}}>You have no followers</Typography>)
          }
        </div>
      </Dialog>

      <Dialog open={followingToggle} onClose={()=>setFollowingToggle(!followingToggle)}> 
        <div className="DialogBox">
          <Typography variant='h4'>Following</Typography>
          {
            user && user?.following?.length > 0 ? user?.following?.map((following)=>(
              <User
              key={following._id}
              userId={following._id}
              name={following.name}
              avatar={following.avatar?.url || defaultAvatar}
            />
            )):(<Typography style={{margin:'2vmax'}}>You're not following any one</Typography>)
          }
        </div>
      </Dialog>
      </div>
    </div>
  )
}

export default Account