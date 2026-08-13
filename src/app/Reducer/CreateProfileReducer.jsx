"use client";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
export default function CreateProfileReducer(state, action) {
  switch (action.type) {
    case "createProfile": {
      const { inputData } = action.payload || {};

      if (!inputData) return state;
      const newUser = {
        userId: uuidv4(),
        userName: inputData.userName,
        userEmail: inputData.userEmail,
        userPassword: inputData.userPassword,
        userBirthDay: inputData.userBirthDay,
        userBirthMonth: inputData.userBirthMonth,
        userBirthYear: inputData.userBirthYear,
        userFullName: inputData.userFullName,
        userProfilePic: inputData.userProfilePic,
      };
      return { ...state, users: [...state.users, newUser] };
    }
    case "editProfile": {
      const { inputEdit } = action.payload || {};

      if (!inputEdit?.userId) return state;
      return {
        ...state,
        users: state.users.map((user) =>
          user.userId === inputEdit.userId ? { ...user, ...inputEdit } : user,
        ),
      };
    }
    case "post": {
      const { previewUrl, caption, user } = action.payload || {};
      const newPost = {
        idPost: uuidv4(),
        idUser: user.userId,
        ProfilePic: user.userProfilePic,
        postCaption: caption,
        data: moment().format("LLL"),
        media: previewUrl,
        liked: false,
        likedCount: 0,
        CommentCount: 0,
        ShareCount: 0,
      };
      return { ...state, posts: [...state.posts, newPost] };
    }
    case "postLiked": {
      const { userId, idPost } = action.payload || {};

      return {
        ...state,
        posts: state.posts.map((p) =>
          p.idUser == userId && p.idPost === idPost
            ? {
                ...p,
                liked: !p.liked,
                likedCount: p.liked ? p.likedCount - 1 : p.likedCount + 1,
              }
            : p,
        ),
      };
    }
    case "deletePost": {
      const id = action.payload || {};
      console.log(id);
      return {
        ...state,
        posts: state.posts.filter((p) =>
          id.idUser === p.idUser && id.idPost === p.idPost ? false : true,
        ),
      };
    }
    case "SearchProfile": {
      const query = (action.payload?.inputData ?? "");
      const findUser = query
        ? state.users.filter((user) => (user.userName ?? "").startsWith(query),
          )
        : [];
      return { ...state, Search: findUser };
   
    }

    default:
      return state;
  }
}
