import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from './Components/Header/Header';
import Login from './Components/Login/Login';
import { loadUser } from './Actions/User';
import Home from './Components/Home/Home';
import Account from './Components/Account/Account';
import NewPost from './Components/NewPost/NewPost';
import Register from './Components/Register/Register';
import UpdateProfile from './Components/UpdateProfile/UpdateProfile';
import UpdatePassword from './Components/UpdatePassword/UpdatePassword';
import ForgotPassword from './Components/ForgotPassword/ForgotPassword';
import ResetPassword from './Components/ResetPassword/ResetPassword';
import UserProfile from './Components/UserProfile/UserProfile';
import Search from './Components/Search/Search';
import NotFound from './Components/NotFound/NotFound';
function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);
  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);
  return (
    <Router>
      {isAuthenticated && <Header />}
      <Routes><Route path="/" element={isAuthenticated ? <Home/> :<Login />} /></Routes>
      <Routes><Route path="/account" element={isAuthenticated ? <Account/> :<Login/>} /></Routes>
      <Routes><Route path="/register" element={isAuthenticated ? <Account/> :<Register/>} /></Routes>
      <Routes><Route path="/newpost" element={isAuthenticated ? <NewPost/> :<Login/>} /></Routes>
      <Routes><Route path="/update/profile" element={isAuthenticated ? <UpdateProfile/> :<Login/>} /></Routes>
      <Routes><Route path="/update/password" element={isAuthenticated ? <UpdatePassword/> :<Login/>} /></Routes>
      <Routes><Route path="/forgot/password" element={isAuthenticated ? <UpdatePassword/> :<ForgotPassword/>} /></Routes>
      <Routes><Route path="/password/reset/:token" element={<ResetPassword/>} /></Routes>
      <Routes><Route path="/user/:id" element={isAuthenticated ? <UserProfile/> :<Login/>} /></Routes>
      <Routes><Route path="search" element={isAuthenticated ? <Search/> :<Login/> } /></Routes>
      <Routes><Route path="*" element={<NotFound/>} /></Routes>
    </Router>
  );
}
export default App;