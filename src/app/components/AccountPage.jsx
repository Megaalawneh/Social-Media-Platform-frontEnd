"use client";
import { Avatar, Typography } from "@mui/material";
import { useContext, useState, useEffect, useMemo } from "react";
import Button from "@mui/material/Button";
import PicPost from "./PicPost";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FollowersDialogContext } from "../Context/FollowersDialogContext";
import { AuthGuardContext } from "../Context/AuthGuardContext";
import {
  checkUserNameApi,
  removePendingHandleApi,
  followUserHandleApi,
  handelRemoveFollowApi,
} from "../api/users";
export default function AccountPage() {
  const { currentUser, setCurrentUser, posts } =
    useContext(AuthGuardContext);
  const params = useParams();
  const { userId } = params;
  const [profileUser, setProfileUser] = useState("");
  useEffect(() => {
    async function checkUserName() {
      try {
        const res = await checkUserNameApi(userId);
        setProfileUser(res);
      } catch (error) {
        console.log(error);
      }
    }
    checkUserName();
  }, [userId]);

  const avatarSrc = undefined;

  const [isMounted, setIsMounted] = useState(false);
  const { handleClickOpen } = useContext(FollowersDialogContext);

  const checkUserProvile = currentUser?.userName === params.userId;

  const postCount = useMemo(
    () => posts?.filter((p) => p.userId === profileUser?._id).length,
    [profileUser?._id, posts],
  );

  const isFollowing = profileUser?.followers?.some(
    (f) => currentUser?._id == f.userFollower,
  );

  const isPending = currentUser?.pending?.some(
    (p) =>
      p.userFollower === currentUser?._id &&
      p.userFollowing === profileUser?._id,
  );
  useEffect(() => {
    function IsMounted() {
      setIsMounted(true);
    }
    IsMounted();
  }, []);

  if (!isMounted) {
    return null;
  }

  async function removePendingHandle({
    pendingId,
    userFollower,
    userFollowing,
  }) {
    try {
      const response = await removePendingHandleApi(
        pendingId,
        userFollower,
        userFollowing,
      );
      setCurrentUser(response);
    } catch (error) {
      console.log(error);
    }
  }
  async function followUserHandle({ userFollower, userFollowing }) {
    try {
      const res = await followUserHandleApi(userFollower, userFollowing);

      setCurrentUser(res);
    } catch (error) {
      console.log(error);
    }
  }
  async function handelRemoveFollow(userId) {
    try {
     const response = await handelRemoveFollowApi(userId);
      setCurrentUser(response)
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      {checkUserProvile ? (
        <div className="accountContainer">
          {/* profile page side*/}
          <div className="profile">
            {/* profilePic of the user*/}
            <div className="profileAvatar">
              <Avatar
                alt="Upload new avatar"
                src={avatarSrc || profileUser?.userProfilePic}
                sx={{ width: 150, height: 150 }}
              />
              {/* profilePic of the user*/}

              {/* information about username and name*/}
              <div className="profileInfo">
                <Typography sx={{ fontSize: "24px" }}>
                  {profileUser?.userName || ""}
                </Typography>
                <Typography variant="h7">
                  {profileUser?.userFullName || ""}
                </Typography>
                {/* information about username and name*/}

                {/* information about followers and following*/}
                <div className="profileFollow">
                  <Typography
                    variant="h7"
                    sx={{ margin: "10px 10px 10px 0px" }}
                  >
                    {`${postCount} posts`}
                  </Typography>
                  <Typography
                    variant="h7"
                    sx={{ margin: "10px 10px 10px 0px" }}
                    onClick={() => {
                      handleClickOpen("followers");
                    }}
                  >
                    {`${profileUser?.followers?.length} followers` || ""}
                  </Typography>
                  <Typography
                    variant="h7"
                    sx={{ margin: "10px 10px 10px 0px" }}
                    onClick={() => {
                      handleClickOpen("following");
                    }}
                  >
                    {`${profileUser?.following?.length} following` || ""}
                  </Typography>
                  {/* information about followers and following*/}
                </div>

                {/* information about bio*/}
                <div className="profileBio">
                  <Typography variant="h7">{profileUser.userBio}</Typography>
                </div>
              </div>
              {/* information about bio*/}
            </div>
            {/* btn for edit the user account*/}
            <div className="profileBtn">
              <div>
                {profileUser.userName == params.userId ? (
                  <Link href={`/mainPage/accounts/edit`}>
                    <Button
                      variant="contained"
                      sx={{
                        background: "#27292f",
                        color: "white",
                        width: "300px",
                        padding: "10px",
                        marginLeft: "330px",
                      }}
                    >
                      Edit profile
                    </Button>
                  </Link>
                ) : null}
              </div>
            </div>
            {/* btn for edit the user account*/}
            {/* user Posts*/}
            <div className="profilePosts">
              {posts
                ?.filter((p) => p.userId === profileUser?._id)
                .map((p) => (
                  <PicPost
                    key={p._id}
                    img={p.media}
                    id={p._id}
                    mediaType={p.mediaType}
                    p={p}
                  />
                ))}
            </div>
          </div>
          {/* profile page side*/}
        </div>
      ) : (
        <div className="accountContainer">
          {/* profile page side*/}
          <div className="profile">
            {/* profilePic of the user*/}
            <div className="profileAvatar">
              <Avatar
                alt="Upload new avatar"
                src={avatarSrc || profileUser?.userProfilePic}
                sx={{ width: 150, height: 150 }}
              />
              {/* profilePic of the user*/}

              {/* information about username and name*/}
              <div className="profileInfo">
                <Typography sx={{ fontSize: "24px" }}>
                  {profileUser?.userName || ""}
                </Typography>
                <Typography variant="h7">
                  {profileUser?.userFullName || ""}
                </Typography>
                {/* information about username and name*/}

                {/* information about followers and following*/}
                <div className="profileFollow">
                  <Typography
                    variant="h7"
                    sx={{ margin: "10px 10px 10px 0px" }}
                  >
                    {`${postCount} posts`}
                  </Typography>
                  <Typography
                    variant="h7"
                    sx={{ margin: "10px 10px 10px 0px" }}
                    onClick={() => {
                      handleClickOpen("followers");
                    }}
                  >
                    {`${profileUser?.followers?.length} followers` || ""}
                  </Typography>
                  <Typography
                    variant="h7"
                    sx={{ margin: "10px 10px 10px 0px" }}
                    onClick={() => {
                      handleClickOpen("following");
                    }}
                  >
                    {`${profileUser?.following?.length} following` || ""}
                  </Typography>
                  {/* information about followers and following*/}
                </div>

                {/* information about bio*/}
                <div className="profileBio">
                  <Typography variant="h7">{profileUser?.userBio}</Typography>
                </div>
                {profileUser?._id && (
                  <Link href={`/mainPage/direct?userId=${profileUser._id}`}>
                    <Button
                      variant="outlined"
                      sx={{ mt: 2, color: "white", borderColor: "white" }}
                    >
                      Message
                    </Button>
                  </Link>
                )}
              </div>
              {/* information about bio*/}
            </div>
            {/* btn for edit the user account*/}
            <div className="profileBtn">
              <div>
                {isFollowing ? (
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#25292e",
                      color: "white !important",
                      width: "550px",
                      padding: "10px",
                      marginLeft: "150px",
                    }}
                    onClick={() => {
                      handelRemoveFollow(profileUser._id);
                    }}
                  >
                    Following
                  </Button>
                ) : isPending ? (
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#25292e",
                      color: "white !important",
                      width: "550px",
                      padding: "10px",
                      marginLeft: "150px",
                    }}
                    onClick={() => {
                      const pendingRequest = currentUser.pending?.find(
                        (p) =>
                          p.userFollower === currentUser._id &&
                          p.userFollowing === profileUser._id,
                      );

                      if (pendingRequest) {
                        removePendingHandle({
                          pendingId: pendingRequest._id,
                          userFollower: currentUser._id,
                          userFollowing: profileUser._id,
                        });
                      }
                    }}
                  >
                    Pending Request
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    sx={{
                      color: "white",
                      width: "550px",
                      padding: "10px",
                      marginLeft: "150px",
                    }}
                    onClick={() => {
                      followUserHandle({
                        userFollower: currentUser._id,
                        userFollowing: profileUser._id,
                      });
                    }}
                  >
                    Follow
                  </Button>
                )}
              </div>
            </div>

            {/* btn for edit the user account*/}
            {/* user Posts*/}
            <div className="profilePosts">
              {posts
                ?.filter((p) => p.userId === profileUser?._id)
                .map((p) => (
                  <PicPost
                    key={p._id}
                    img={p.media}
                    id={p._id}
                    mediaType={p.mediaType}
                    p={p}
                  />
                ))}
            </div>
          </div>
          {/* profile page side*/}
        </div>
      )}
    </>
  );
}
