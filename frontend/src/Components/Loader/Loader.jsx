import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { Typography } from '@mui/material';
import '../Loader/Loader.css';

const Loader = () => {
  return (
    <div className="loader">
      <CircularProgress />
      <Typography variant="h6" style={{ marginTop: '1vmax' }}>
        Loading, please wait...
      </Typography>
    </div>
  );
};

export default Loader;
