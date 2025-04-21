import React, { useEffect } from 'react';
import "../Home/Home.css";
import User from '../User/User';
import Post from '../Post/Post';
import Loader from '../Loader/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers, getFollowingPosts } from '../../Actions/User';
import { Typography } from '@mui/material';
import { toast } from 'react-toastify';

const Home = () => {
  const dispatch = useDispatch();
  const { loading, posts ,error} = useSelector((state) => state.postOfFollowing);
  const { users, loading: usersLoading } = useSelector((state) => state.allUsers);
  const { error:LikeError, message } = useSelector((state) => state.like);
  
  // console.log(posts)
  useEffect(() => {
    dispatch(getFollowingPosts());
    dispatch(getAllUsers());
  }, [dispatch]);

  useEffect(() => {
    // console.log("error:", error, "message:", message); // debug
    if (LikeError) {
      toast.error(LikeError);
      dispatch({ type: 'clearErrors' });
    }
    if (message) {
      toast.success(message); 
      dispatch({ type: 'clearMessage' });
    }
  }, [LikeError, message, dispatch]);

  return loading || usersLoading ? (
    <Loader />
  ) : (
    <div className='home'>
      <div className="homeleft">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <Post key={post._id} postId={post._id} postImage={post.image.url} comments={post.comments} caption={post.caption} ownerName={post.owner.name} ownerImage={post.owner.avatar.url} ownerId={post.owner._id} likes={post.likes}/>
          ))
        ) : (
          <Typography variant='h6'>No posts yet</Typography>
        )}
      </div>
      <div className="homeright">
        {users && users.length > 0 ? (
          users.map((user) => (
            <User key={user._id} userId={user._id} name={user.name} avatar={user.avatar.url}/>
          ))
        ) : (
          <Typography variant='h6'>No users yet</Typography>
        )}
      </div>
    </div>
  );
};

export default Home;
