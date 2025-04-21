import { configureStore } from '@reduxjs/toolkit';
import { postOfFollowingReducer, userReducer ,allUsersReducer, UserProfileReducer } from './Reducers/User';
import { likeReducer, myPostReducer, userPostsReducer } from './Reducers/Post';

const store = configureStore({
  reducer: {
    user: userReducer, 
    postOfFollowing:postOfFollowingReducer,
    allUsers:allUsersReducer,
    like:likeReducer,
    myPost:myPostReducer,
    userProfile:UserProfileReducer,
    userPosts:userPostsReducer,
  },
});

export default store;
