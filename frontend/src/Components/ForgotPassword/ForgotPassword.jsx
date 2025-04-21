import React, { useEffect, useState } from 'react'
import '../ForgotPassword/ForgotPassword.css'
import { Button, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { forgotPassword } from '../../Actions/User'
import { toast } from 'react-toastify'
const ForgotPassword = () => {
    const [email, setEmail] = useState("")
    const dispatch = useDispatch()
    const {error,loading,message}=useSelector((state)=>state.like)

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(forgotPassword(email))
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
        <div className="forgotPassword">
            <form className="forgotPasswordForm" onSubmit={submitHandler}>
                <Typography variant="h3" style={{ padding: "2vma" }}>Social App</Typography>
                <input className='forgotPasswordInputs' type="email" placeholder='Email' required value={email} onChange={(e) => setEmail(e.target.value)} />
                <Button disabled={loading} type='submit'>send Token</Button>
            </form>
        </div>
    )
}

export default ForgotPassword