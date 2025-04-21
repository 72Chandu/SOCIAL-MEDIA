import React, { useEffect, useState } from 'react'
import '../ResetPassword/ResetPassword.css'
import { Button, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { resetPassword } from '../../Actions/User'
import { Link, useParams } from 'react-router-dom'
const ResetPassword = () => {
    const [newpassword, setNewpassword] = useState("")
    const dispatch = useDispatch();
    const params = useParams()

    // console.log(params)//give object constin token
    // console.log(params.token)//give token

    const { error, loading, message } = useSelector((state) => state.like)
    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(resetPassword(params.token, newpassword))
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
        <div className="resetPassword">
            <form className="resetPasswordForm" onSubmit={submitHandler}>
                <Typography variant="h3" style={{ padding: "2vma" }}>Social App</Typography>
                <input className='resetPasswordInputs' type="password" placeholder='New Password' required value={newpassword} onChange={(e) => setNewpassword(e.target.value)} />
                <Link to="/"><Typography>Login</Typography> </Link>
                <Typography>Or</Typography>
                <Link to="/forgot/password"><Typography>Request Another Token</Typography> </Link>
                <Button disabled={loading} type='submit'>Reset Password</Button>
            </form>
        </div>
    )
}

export default ResetPassword