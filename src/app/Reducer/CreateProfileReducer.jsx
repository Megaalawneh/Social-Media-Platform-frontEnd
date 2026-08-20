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
        userBio:"",

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
      const { previewUrl, caption, User, mediaType } = action.payload || {};
      
      if (!previewUrl || !User?.userId) return state;

      const newPost = {
        idPost: uuidv4(),
        idUser: User.userId,
        postCaption: caption,
        data: moment().format("LLL"),
        media: previewUrl,
        mediaType: mediaType || "image",
        likedCount: [],
        CommentCount: [],
        ShareCount: [],
      };

      return { ...state, posts: [...state.posts, newPost] };
    }

    case "postLiked": {
      const { userId, idPost } = action.payload || {};

      return {
        ...state,
        posts: state.posts.map((post) => {
          if (post.idPost !== idPost) return post;
          const like = post.likedCount.some(
            (isLike) => isLike.userId === userId,
          );
          return {
            ...post,
            likedCount: like
              ? post.likedCount.filter((like) => like.userId !== userId)
              : [...post.likedCount, { userId }],
          };
        }),
      };
    }
    case "postShare": {
      const { userId, idPost } = action.payload || {};
      return {
        ...state,
        posts: state.posts.map((post) => {
          if (post.idPost !== idPost) return post;
          const share = post.ShareCount.some(
            (isShare) => isShare.userId === userId,
          );
          return {
            ...post,
            ShareCount: share
              ? post.ShareCount
              : [...post.ShareCount, { userId }],
          };
        }),
      };
    }

    case "deletePost": {
      const { idUser, idPost } = action.payload || {};

      return {
        ...state,
        posts: state.posts.filter(
          (post) => !(idUser === post.idUser && idPost === post.idPost),
        ),
      };
    }

    case "SearchProfile": {
      const query = action.payload?.inputData ?? "";
      const findUser = query
        ? state.users.filter((user) => (user.userName ?? "").startsWith(query))
        : [];

      return { ...state, Search: findUser };
    }
    case "addComment": {
      const { userId, idPost, textComment } = action.payload || {};
      return {
        ...state,
        posts: state.posts.map((post) => {
          const commentId = uuidv4();
          if (post.idPost !== idPost) return post;
          return {
            ...post,
            CommentCount: [
              ...post.CommentCount,
              {
                userId,
                textComment,
                commentId,
                likedCount: [],
                timeCreated: moment().format("LT"),
              },
            ],
          };
        }),
      };
    }
    case "commentLiked": {
      const { userId, idPost, commentId } = action.payload || {};
      return {
        ...state,
        posts: state.posts.map((post) => {
          if (post.idPost !== idPost) return post;
          return {
            ...post,
            CommentCount: post.CommentCount.map((c) => {
              if (c.commentId !== commentId) return c;
              const like = c.likedCount?.some(
                (isLiked) => isLiked.userId === userId,
              );
              return {
                ...c,
                likedCount: like
                  ? c.likedCount.filter((like) => like.userId !== userId)
                  : [...c.likedCount, { userId }],
              };
            }),
          };
        }),
      };
    }
    case "deleteComment": {
      const { idPost, userId, commentId } = action.payload || {};
      return {
        ...state,
        posts: state.posts.map((post) => {
          if (post.idPost !== idPost) return post;
          return {
            ...post,
            CommentCount: post.CommentCount.filter((c) => {
              if (c.commentId !== commentId) return c;
              if (c.userId === userId) {
                return false;
              }
              return true;
            }),
          };
        }),
      };
    }

    default:
      return state;
  }
}
