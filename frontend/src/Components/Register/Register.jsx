import React, { useEffect, useState } from 'react'
import '../Register/Register.css'
import { Avatar, Button, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser } from '../../Actions/User'
import { toast } from 'react-toastify'
const Register = () => {
    const dispatch = useDispatch()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [avatar, setAvatar] = useState("")
    const [password, setpassword] = useState("")
    const { loading, error } = useSelector((state) => state.user);

    const submitHandler = async (e) => {
        e.preventDefault();
        await dispatch(registerUser(name, email, password, avatar))
        // console.log(name,email,avatar,password);
    }
    const handelImageChange = (e) => {
        const file = e.target.files[0];
        const Reader = new FileReader();
        Reader.readAsDataURL(file)
        Reader.onload = () => {
            if (Reader.readyState === 2) {
                setAvatar(Reader.result)
            }
        }
    }
    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch({ type: 'clearErrors' });
        }
    }, [error, dispatch]);
    return (
        <div className='register'>
            <form className="registerForm" onSubmit={submitHandler}>
                <Typography variant="h3" style={{ padding: "2vma" }}>Social App</Typography>
                <Avatar src={avatar} alt='User' sx={{ height: "10vmax", width: "10vmax" }} />
                <input type="file" accept='image/*' onChange={handelImageChange} />
                <input className="registerInputs" type="text" required placeholder='name' value={name} onChange={(e) => setName(e.target.value)} />
                <input className="registerInputs" type="email" required placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                <input className="registerInputs" type="password" required placeholder='Password' value={password} onChange={(e) => setpassword(e.target.value)} />
                <Link to="/"><Typography>Already Signed Up? Login Now</Typography></Link>
                <Button disabled={loading} type='submit'>Sign Up</Button>
            </form>
        </div>

    )
}
export default Register