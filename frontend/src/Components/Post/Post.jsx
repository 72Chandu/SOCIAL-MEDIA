import React, {useEffect, useState } from 'react'
import "../Post/Post.css"
import { Avatar, Button, Typography,Dialog } from '@mui/material'
import { Link } from 'react-router-dom'
import { MoreVert, Favorite, FavoriteBorder, ChatBubbleOutline, DeleteOutline } from '@mui/icons-material'
import { useDispatch, useSelector} from 'react-redux';
import {addCommentOnPost, deletePost, likePost, updatePost} from '../../Actions/Post'
import { getFollowingPosts, getMyPosts, getUserPosts, loadUser } from '../../Actions/User'
import User from '../User/User'
import CommentCard from '../CommentCard/CommentCard'
const Post = ({ postId, caption, postImage, likes = [], comments = [], ownerImage, ownerName, ownerId, isDelete = false, isAccount = false,isUserProfile = false }) => {
  const dispatch=useDispatch()
  const [liked, setLiked] = useState(false)
  const {user}=useSelector(state=>state.user);
  const[LikesUser,setLikesUser]=useState(false);
  const[commentToggle,setCommentToggle]=useState(false);
  const[commentValue,setCommentValue]=useState(caption);
  const[captionToggle,setCaptionToggle]=useState(false);
  const[captionValue,setCaptionValue]=useState("");
  // console.log(liked)
  
  const handelLike = async () => {
    setLiked(!liked)
    await dispatch(likePost(postId))
    if(isAccount){
      dispatch(getMyPosts())
      console.log('Bring me my posts')
    }else if(isUserProfile){
      dispatch(getUserPosts(ownerId));
    }else{
      dispatch(getFollowingPosts());
    }
  };

  const addCommentHandler = async (e)=>{
    e.preventDefault()
    // console.log('Add Comment')
    await dispatch(addCommentOnPost(postId,commentValue))
    if(isAccount){
      dispatch(getMyPosts())
      console.log('Bring me my comment')
    }else if(isUserProfile){
      dispatch(getUserPosts(ownerId));
    }else{
      dispatch(getFollowingPosts());
    }
  }
  const updateCaptionHandler=(e)=>{
    e.preventDefault()
    dispatch(updatePost(captionValue,postId))
    dispatch(getMyPosts())
  }
  const deletePostHandler=async ()=>{
    await dispatch(deletePost(postId))
    dispatch(getMyPosts())
    dispatch(loadUser())
  }  

  useEffect(()=>{
    likes.forEach(item=>{
      if(item._id===user._id){
        setLiked(true)
      }
    });
  },[likes,user._id])

  return (
    <div className='post'>
      <div className="postHeader">{isAccount ? (<Button onClick={()=>setCaptionToggle(!captionToggle)}><MoreVert/></Button>):null}</div>
      
      <img src={postImage} alt="post" />
      
      <div className="postDetails">
        <Avatar src={ownerImage} alt='User' sx={{ height: "3vmax", width: "3vmax" }} />
        <Link to={`/user/${ownerId}`}><Typography fontWeight={700}>{ownerName}</Typography></Link>
        <Typography fontWeight={100} color='rgba(0,0,0,0.582)' style={{ alignSelf: "center" }}>{caption}</Typography>
      </div>
      
      <button style={{ border: 'none', backgroundColor: 'white', cursor: 'pointer', margin: '1vmax 2vmax' }} onClick={()=>setLikesUser(!LikesUser)} disabled={likes.length===0 ? true :false}><Typography>{likes.length} Like</Typography></button>
      
      <div className="postFooter">
        <Button onClick={handelLike}>{liked ? <Favorite style={{ color: 'red' }} /> : <FavoriteBorder />}</Button>
        <Button onClick={()=>setCommentToggle(!commentToggle)}><ChatBubbleOutline /></Button>
        {isDelete ? (<Button onClick={deletePostHandler}><DeleteOutline /></Button>) : null}
      </div>

      <Dialog open={LikesUser} onClose={()=>setLikesUser(!LikesUser)}>
        <div className="DialogBox">
          <Typography variant='h4'>Liked By</Typography>
          {
            likes.map(like=>(
              <User
              key={like._id}
              userId={like._id}
              name={like.name}
              avatar={like.avatar.url}
            />
            ))
          }
        </div>
      </Dialog>

      <Dialog open={commentToggle} onClose={()=>setCommentToggle(!commentToggle)}>
        <div className="DialogBox">
          <Typography variant='h4'>Comments</Typography>
          <form className="commentForm" onSubmit={addCommentHandler}>
            <input type="text" className="text" value={commentValue} onChange={(e)=>setCommentValue(e.target.value)}placeholder='Comment Here...' required/>
            <Button type='submit' variant='contained'>Add</Button>
          </form>
          {
            comments.length>0 ? comments.map((item)=>(<CommentCard key={item._id} userId={item.user._id} name={item.user.name} avatar={item.user.avatar.url} comment={item.comment} commentId={item._id} postId={postId} isAccount={isAccount}  isUserProfile={isUserProfile} // ✅ Add this
              ownerId={ownerId} />)) : (<Typography>No Comment Yet</Typography>)
          }
        </div>
      </Dialog>

      <Dialog open={captionToggle} onClose={()=>setCaptionToggle(!captionToggle)}>
        <div className="DialogBox">
          <Typography variant='h4'>Update Caption</Typography>
          <form className="commentForm" onSubmit={updateCaptionHandler }>
            <input type="text" className="text" value={captionValue} onChange={(e)=>setCaptionValue(e.target.value)}placeholder='Caption Here...' required/>
            <Button type='submit' variant='contained'>Update</Button>
          </form>
        </div>
      </Dialog>
    
    </div>
  )
}

export default Post