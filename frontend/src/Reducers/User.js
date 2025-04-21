import { createReducer } from "@reduxjs/toolkit";

// -------------------- USER REDUCER --------------------
const userInitialState = {
  loading: false,
  user: null,
  isAuthenticated: false,
  error: null,
};

export const userReducer = createReducer(userInitialState, (builder) => {
  builder
    .addCase("LoginRequest", (state) => {
      state.loading = true;
    })
    .addCase("LoginSuccess", (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    })
    .addCase("LoginFailure", (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    })
    .addCase("RegisterRequest", (state) => {
      state.loading = true;
    })
    .addCase("RegisterSuccess", (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    })
    .addCase("RegisterFailure", (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    })
    .addCase("LoadUserRequest", (state) => {
      state.loading = true;
    })
    .addCase("LoadUserSuccess", (state, action) => {
      // console.log("Loaded User Data: ", action.payload); // Check if data is populated correctly
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    })
    .addCase("LoadUserFailure", (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    })
    .addCase("LogoutUserRequest", (state) => {
      state.loading = true;
    })
    .addCase("LogoutUserSuccess", (state) => {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
    })
    .addCase("LogoutUserFailure", (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = true;
    })
    .addCase("clearErrors", (state) => {
      state.error = null;
    });
});

// -------------------- POSTS OF FOLLOWING REDUCER --------------------
const postsInitialState = {
  loading: false,
  posts: [],
  error: null,
};

export const postOfFollowingReducer = createReducer(postsInitialState, (builder) => {
  builder
    .addCase("postOfFollowingRequest", (state) => {
      state.loading = true;
    })
    .addCase("postOfFollowingSuccess", (state, action) => {
      state.loading = false;
      state.posts = action.payload;
    })
    .addCase("postOfFollowingFailure", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase("clearErrors", (state) => {
      state.error = null;
    });
});

const usersInitialState = {
  loading: false,
  users:null,
  error: null,
};

export const allUsersReducer = createReducer(usersInitialState, (builder) => {
  builder
    .addCase("allUsersRequest", (state) => {
      state.loading = true;
    })
    .addCase("allUsersSuccess", (state, action) => {
      state.loading = false;
      state.users = action.payload;
    })
    .addCase("allUsersFailure", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase("clearErrors", (state) => {
      state.error = null;
    });
});

export const UserProfileReducer = createReducer(usersInitialState, (builder) => {
  builder
    .addCase("UserProfileRequest", (state) => {
      state.loading = true;
    })
    .addCase("UserProfileSuccess", (state, action) => {
      state.loading = false;
      state.users = action.payload;
    })
    .addCase("UserProfileFailure", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase("clearErrors", (state) => {
      state.error = null;
    });
});