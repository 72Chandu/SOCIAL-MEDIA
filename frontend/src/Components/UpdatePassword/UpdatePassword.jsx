import React, { useEffect, useState } from 'react'
import '../UpdatePassword/UpdatePassword.css'
import { Button, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { updatePassword } from '../../Actions/User'
import { toast } from 'react-toastify'
const UpdatePassword = () => {
    const [Oldpassword, setOldpassword] = useState("")
    const [newpassword, setNewpassword] = useState("")
    const dispatch = useDispatch();
    const {error,loading,message}=useSelector((state)=>state.like)
    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(updatePassword(Oldpassword, newpassword))
    }
    useEffect(() => {
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
        <div className="UpdatePassword">
            <form className="UpdatePasswordForm" onSubmit={submitHandler}>
                <Typography variant="h3" style={{ padding: "2vma" }}>Social App</Typography>
                <input className='UpdatePasswordInputs' type="password" placeholder='Old Password' required value={Oldpassword} onChange={(e) => setOldpassword(e.target.value)} />
                <input className='UpdatePasswordInputs' type="password" placeholder='New Password' required value={newpassword} onChange={(e) => setNewpassword(e.target.value)} />
                <Button disabled={loading} type='submit'>Change Password</Button>
            </form>
        </div>
    )
}
export default UpdatePassword