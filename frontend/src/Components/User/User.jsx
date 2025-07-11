import React from 'react';
import "../Home/Home.css";
import { Link } from 'react-router-dom';
import { Typography } from '@mui/material';
const User = ({ userId, name, avatar }) => {
  //console.log(name)
  return (
    <Link to={`/user/${userId}`} className='homeUser'>
      <img src={avatar} alt={name} />
      <Typography>{name}</Typography>
    </Link>
  );
};
export default User;