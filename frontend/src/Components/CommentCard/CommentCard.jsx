import React from 'react'
import '../CommentCard/CommentCard.css'
import { Link } from 'react-router-dom'
import { Button, Typography } from '@mui/material'
import { Delete } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { deleteCommentOnPost} from '../../Actions/Post'
import { getFollowingPosts, getMyPosts, getUserPosts} from '../../Actions/User'
const CommentCard = ({userId,name,avatar,comment,commentId,postId ,isAccount,isUserProfile, ownerId}) => {
    const {user}=useSelector(state=>state.user);
    const dispatch=useDispatch()
    const deleteCommentHandel = async ()=>{
        // console.log("please delete this comment");
        await dispatch(deleteCommentOnPost(postId,commentId))
        if(isAccount){
              dispatch(getMyPosts());
              // console.log('Delete my posts')
            }else if (isUserProfile) {
              dispatch(getUserPosts(ownerId)); // ✅ Fetch updated posts of profile
          }else{
              dispatch(getFollowingPosts());
        }
    }
    return (
    <div className='commentUser'>
        <Link to={`/user/${userId}`}>
        <img src={avatar} alt={name} />
        <Typography style={{minWidth:'6vmax'}}>{name}</Typography>
        </Link>
        <Typography>{comment}</Typography>
        {isAccount ? (<Button onClick={deleteCommentHandel}><Delete/></Button>):(userId===user._id ? (<Button onClick={deleteCommentHandel}><Delete/></Button>):(null))}
    </div>
  )
}
export default CommentCard