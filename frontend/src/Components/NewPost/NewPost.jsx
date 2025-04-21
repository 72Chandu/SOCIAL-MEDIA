import React, { useEffect, useState } from 'react'
import '../NewPost/NewPost.css'  
import {Button, Typography} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux';
import { createnewPost } from '../../Actions/Post';
import { toast } from 'react-toastify';
import { loadUser } from '../../Actions/User';

function NewPost() {
    const [image,setImage]=useState(null)
    const [caption,setCaption]=useState("")
    const {loading,error,message }=useSelector((state)=>state.like);
    const dispatch=useDispatch();
    const handelImageChange=(e)=>{
        const file=e.target.files[0];
        const Reader=new FileReader();
        Reader.readAsDataURL(file)
        Reader.onload=()=>{
            if(Reader.readyState===2){
                setImage(Reader.result)
            }
        }
    }
    const submitHandler =async (e)=>{
        e.preventDefault()
        await dispatch(createnewPost(caption,image))
        dispatch(loadUser())
    }
    useEffect(() => {
        // console.log("error:", error, "message:", message); // debug
        if (error) {
          toast.error(error);
          dispatch({ type: 'clearErrors' });
        }
        if (message) {
          toast.success(message); 
          dispatch({ type: 'clearMessage' });
        }
      }, [error, message, dispatch]);
    

  return (
    <div className='newPost'>
        <form className="newPostForm" onSubmit={submitHandler}>
            <Typography variant='h3'>New Post</Typography>
            {image && <img src={image} alt='post'/>}
            <input type="file" accept='image/*' onChange={handelImageChange} />
            <input type="text" placeholder='Caption..' value={caption} onChange={(e)=>setCaption(e.target.value)} />
            <Button type='submit' disabled={loading}>Post</Button>
        </form>
      
    </div>
  )
}

export default NewPost
