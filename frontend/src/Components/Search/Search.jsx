import React, {useState } from 'react'
import '../Search/Search.css'
import {Button, Typography } from '@mui/material'
import { getAllUsers } from '../../Actions/User'
import { useDispatch, useSelector } from 'react-redux'
import User from '../User/User'
const Search = () => {
    const [name,setName]=useState("")
    const { users, loading} = useSelector((state) => state.allUsers);
    const dispatch=useDispatch()
    const submitHandler=(e)=>{
        e.preventDefault()
        dispatch(getAllUsers(name ))
    }
  return (
    <div className='search'>
            <form className="searchFom" onSubmit={submitHandler}>
                <Typography variant="h3" style={{ padding: "2vma" }}>Social App</Typography>
                <input  type="text" required placeholder='name' value={name} onChange={(e) => setName(e.target.value)} />
                <Button disabled={loading}  type='submit'>Search</Button>

                <div className="searchResults">
                {
                    users && users.map((user)=>(
                        <User
                        key={user._id}
                        userId={user._id}
                        name={user.name}
                        avatar={user.avatar.url}
                        />
                    ))
                }
            </div>
            </form>
            
    </div>
  )
}
export default Search