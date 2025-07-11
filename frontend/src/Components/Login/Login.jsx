import React, { useEffect, useState } from 'react'
import "../Login/Login.css"
import { Link } from "react-router-dom"
import { Button, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../../Actions/User'
import { toast } from 'react-toastify'
const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setpassword] = useState("")
  const dispatch = useDispatch();
  const {error}=useSelector((state)=>state.user)
  const {message}=useSelector((state)=>state.like)
  const loginHandler = (e) => {
    e.preventDefault();
    // console.log(email,password)
    dispatch(loginUser(email, password))
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
  }, [error,message, dispatch]);
  return (
    <div className="login">
      <form className="loginForm" onSubmit={loginHandler}>
        <Typography variant="h3" style={{ padding: "2vma" }}>Social App</Typography>
        <input type="email" placeholder='Email' required value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder='Password' required value={password} onChange={(e) => setpassword(e.target.value)} />
        <Link to="/forgot/password"><Typography>Forgot Password ?</Typography></Link>
        <Button type='submit'>Login</Button>
        <Link to="/register"><Typography>New User?</Typography></Link>
      </form>
    </div>
  )
}

export default Login