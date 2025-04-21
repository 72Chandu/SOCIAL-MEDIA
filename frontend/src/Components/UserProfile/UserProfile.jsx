import React, { useEffect, useState } from 'react'
import '../Account/Account.css'
import { useDispatch, useSelector } from 'react-redux'
import { followAndUnfollowUser, getUserPosts, getUserProfile} from '../../Actions/User';
import Loader from '../Loader/Loader';
import { toast } from 'react-toastify';
import Post from '../Post/Post';
import { Avatar, Button, Dialog, Typography } from '@mui/material';
import User from '../User/User';
import defaultAvatar from '../../default.png';
import { useParams } from 'react-router-dom';
const UserProfile = () => {
  const dispatch = useDispatch();
  const {users,loading:userloading,error:userError}=useSelector((state)=>state.userProfile)
  const {user:me}=useSelector((state)=>state.user)
  const { loading, error, posts } = useSelector((state) => state.userPosts);
  const { error:followError, message,loading:followLoading } = useSelector((state) => state.like);
  const [followersToggle,setFollowersToggle]=useState(false)
  const [followingToggle,setFollowingToggle]=useState(false)
  const [following,setFollowing]=useState(false)
  const [myProfile,setMyProfile]=useState(false)
  const params=useParams()
  const followHandler=async()=>{
    setFollowing(!following)
    await dispatch(followAndUnfollowUser(users._id))
    dispatch(getUserProfile(params.id))
  }
  useEffect(() => {
    dispatch(getUserPosts(params.id))
    dispatch(getUserProfile(params.id))
  }, [dispatch,params.id])

  useEffect(()=>{
    if(me._id===params.id){
      setMyProfile(true)
    }
    if(users){
      users.followers.forEach((item)=>{
        if(item._id===me._id){
          setFollowing(true)
        }else{
          setFollowing(false)
        }
      })
    }
  },[users,me._id,params.id,dispatch])

  useEffect(() => {
    if (followError) {
      toast.error(followError);
      dispatch({ type: 'clearErrors' });
    }
    if (userError) {
      toast.error(userError);
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
  }, [followError,error, message,userError, dispatch]);
  return loading===true || userloading===true ? (<Loader />
  ) : (
    <div className='account'>
      <div className="accountleft">
        {
          posts && posts.length > 0 ? (posts.filter((post)=>post && post._id).map((post)=>(
            <Post key={post._id} postId={post._id} postImage={post.image?.url} comments={post.comments} caption={post.caption} ownerName={post.owner?.name} ownerImage={post.owner?.avatar?.url} ownerId={post.owner?._id} likes={post.likes} isUserProfile={true} />
          ))) : (<Typography variant='h6'>User has not made any post</Typography>)
        }
      </div>
     
      <div className="accountright">
        {users && (<>
            <Avatar src={users.avatar.url} sx={{height:'8vmax',width:'8vmax'}}/>
            <Typography variant='h5'>{users.name}</Typography>
        <div>
          <button onClick={()=>setFollowersToggle(!followersToggle)} ><Typography>Followers</Typography></button>
          <Typography>{users.followers.length}</Typography>
        </div>
        <div>
          <button onClick={()=>setFollowingToggle(!followingToggle)}><Typography>Following</Typography></button>
          <Typography>{users.following.length}</Typography>
        </div>
        <div>
          <Typography>Post</Typography>
          <Typography>{users.post.length}</Typography>
        </div>
        
        {myProfile ? null : (<Button disabled={followLoading} onClick={followHandler} style={{background:following ? "red":"blue"}} variant='contained'>{following ? "Unfollow":"Follow"}</Button>)}
        
         </>)}
        <Dialog open={followersToggle} onClose={()=>setFollowersToggle(!followersToggle)}>
        <div className="DialogBox">
          <Typography variant='h4'>Followers</Typography>
          {
            users && users?.followers?.length > 0 ? users?.followers?.map((follower)=>(
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
            users && users?.following?.length > 0 ? users?.following?.map((following)=>(
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
export default UserProfile

//user profile pe liked karney se liked increse nahi kar raha hai 