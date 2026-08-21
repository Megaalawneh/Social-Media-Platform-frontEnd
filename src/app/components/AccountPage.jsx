"use client";
import { Avatar, Typography } from "@mui/material";
import { useContext, useState, useEffect, useMemo } from "react";
import { CreateProfile } from "../Context/CreateProfileContext";
import Button from "@mui/material/Button";
import PicPost from "./PicPost";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function AccountPage() {
  const avatarSrc = undefined;
  const { state, User, dispatch } = useContext(CreateProfile);
  const [isMounted, setIsMounted] = useState(false);
  const params = useParams();
  const checkUserProvile = useMemo(
    () => User.userName === params.userId,
    [User.userName, params.userId],
  );
  const UserProfile = useMemo(
    () => state.users?.find((user) => user.userName === params.userId),
    [params.userId, state.users],
  );

  const postCount = useMemo(
    () => state.posts?.filter((p) => p.idUser === UserProfile.userId).length,
    [UserProfile, state.posts],
  );
  const isFollowing = User.following?.some(
    (u) => u.userId === UserProfile?.userId,
  );

  const isPending = User.pending?.some(
    (p) =>
      p.userFollower === User?.userId &&
      p.userFollowing === UserProfile?.userId,
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
  function handelFollowProfile({ type, payload }) {
    dispatch({ type: type, payload: payload });
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
                src={avatarSrc || UserProfile?.userProfilePic}
                sx={{ width: 150, height: 150 }}
              />
              {/* profilePic of the user*/}

              {/* information about username and name*/}
              <div className="profileInfo">
                <Typography sx={{ fontSize: "24px" }}>
                  {UserProfile?.userName || ""}
                </Typography>
                <Typography variant="h7">
                  {UserProfile?.userFullName || ""}
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
                  >
                    {`${UserProfile?.followers.length} followers` || ""}
                  </Typography>
                  <Typography
                    variant="h7"
                    sx={{ margin: "10px 10px 10px 0px" }}
                  >
                    {`${UserProfile?.following.length} followers` || ""}
                  </Typography>
                  {/* information about followers and following*/}
                </div>

                {/* information about bio*/}
                <div className="profileBio">
                  <Typography variant="h7">{UserProfile.userBio}</Typography>
                </div>
              </div>
              {/* information about bio*/}
            </div>
            {/* btn for edit the user account*/}
            <div className="profileBtn">
              <div>
                {UserProfile.userName == params.userId ? (
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
              {state.posts
                ?.filter((p) => p.idUser === UserProfile.userId)
                .map((p) => (
                  <PicPost key={p.idPost} img={p.media} id={p.idPost} />
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
                src={avatarSrc || UserProfile?.userProfilePic}
                sx={{ width: 150, height: 150 }}
              />
              {/* profilePic of the user*/}

              {/* information about username and name*/}
              <div className="profileInfo">
                <Typography sx={{ fontSize: "24px" }}>
                  {UserProfile?.userName || ""}
                </Typography>
                <Typography variant="h7">
                  {UserProfile?.userFullName || ""}
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
                  >
                    {`${UserProfile?.followers.length} followers` || ""}
                  </Typography>
                  <Typography
                    variant="h7"
                    sx={{ margin: "10px 10px 10px 0px" }}
                  >
                    {`${UserProfile?.following.length} followers` || ""}
                  </Typography>
                  {/* information about followers and following*/}
                </div>

                {/* information about bio*/}
                <div className="profileBio">
                  <Typography variant="h7">{UserProfile?.userBio}</Typography>
                </div>
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
                      handelFollowProfile({
                        type: "null",
                        payload: {
                          userFollower: User.userId,
                          userFollowing: UserProfile.userId,
                        },
                      });
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
                      handelFollowProfile({
                        type: "unfollowUser",
                        payload: {
                          userFollower: User.userId,
                          userFollowing: UserProfile.userId,
                        },
                      });
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
                      handelFollowProfile({
                        type: "followUser",
                        payload: {
                          userFollower: User.userId,
                          userFollowing: UserProfile.userId,
                        },
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
              {state.posts
                ?.filter((p) => p.idUser === UserProfile.userId)
                .map((p) => (
                  <PicPost key={p.idPost} img={p.media} id={p.idPost} />
                ))}
            </div>
          </div>
          {/* profile page side*/}
        </div>
      )}
    </>
  );
}
