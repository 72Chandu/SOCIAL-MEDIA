import React, { useEffect, useState } from 'react'
import '../UpdateProfile/UpdateProfile.css'
import { Avatar, Button, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { loadUser, updateProfile } from '../../Actions/User'
import Loader from '../Loader/Loader'
import { toast } from 'react-toastify' 
const UpdateProfile = () => {
    const { loading, error,user} = useSelector((state) => state.user);
    const { loading:updateLoading,error:updateError,message} = useSelector((state) => state.like);
    const dispatch = useDispatch()
    const [name, setName] = useState(user.name)
    const [email, setEmail] = useState(user.email)
    const [avatar, setAvatar] = useState("")
    const [avatarPrev, setAvatarPrev ] = useState(user.avatar.url)

    const submitHandler = async (e) => {
        e.preventDefault();
        await dispatch(updateProfile(name,email,avatar))
        dispatch(loadUser())
    }
    const handelImageChange = (e) => {
        const file = e.target.files[0];
        const Reader = new FileReader();
        Reader.readAsDataURL(file)
        Reader.onload = () => {
            if (Reader.readyState === 2) {
                setAvatarPrev(Reader.result)
                setAvatar(Reader.result)
            }
        }
    }
    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch({ type: 'clearErrors' });
        }
        if (updateError) {
            toast.error(updateError);
            dispatch({ type: 'clearErrors' });
        }
        if (message) {
            toast.success(message);
            dispatch({ type: 'clearMessage' });
        }
    }, [error,updateError,message, dispatch]);
    return (
        loading ? <Loader/> :(
            <div className='updateProfile'>
            <form className="updateProfileForm" onSubmit={submitHandler}>
                <Typography variant="h3" style={{ padding: "2vma" }}>Social App</Typography>
                <Avatar src={avatarPrev} alt='User' sx={{ height: "10vmax", width: "10vmax" }} />
                <input type="file" accept='image/*' onChange={handelImageChange} />
                <input className="updateProfileInputs" type="text" required placeholder='name' value={name} onChange={(e) => setName(e.target.value)} />
                <input className="updateProfileInputs" type="email" required placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                <Button disabled={updateLoading} type='submit'>Update</Button>
            </form>
        </div>
        )
    )
}
export default UpdateProfile