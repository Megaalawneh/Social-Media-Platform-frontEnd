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
  const { state } = useContext(CreateProfile);
  const User = state.users?.[0] || {};
  const [isMounted, setIsMounted] = useState(false);
  const params = useParams();
  const postCount = useMemo(
    () => state.posts?.filter((p) => p.idUser === User.userId).length,
    [User.userId, state.posts],
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

  console.log(postCount);
  return (
    <div className="accountContainer">
      {/* profile page side*/}
      <div className="profile">
        {/* profilePic of the user*/}
        <div className="profileAvatar">
          <Avatar
            alt="Upload new avatar"
            src={avatarSrc || User?.userProfilePic}
            sx={{ width: 150, height: 150 }}
          />
          {/* profilePic of the user*/}

          {/* information about username and name*/}
          <div className="profileInfo">
            <Typography sx={{ fontSize: "24px" }}>
              {User?.userName || ""}
            </Typography>
            <Typography variant="h7">{User?.userFullName || ""}</Typography>
            {/* information about username and name*/}

            {/* information about followers and following*/}
            <div className="profileFollow">
              <Typography variant="h7" sx={{ margin: "10px 10px 10px 0px" }}>
                {`${postCount} posts`}
              </Typography>
              <Typography variant="h7" sx={{ margin: "10px 10px 10px 0px" }}>
                100 followers
              </Typography>
              <Typography variant="h7" sx={{ margin: "10px 10px 10px 0px" }}>
                500 following
              </Typography>
              {/* information about followers and following*/}
            </div>

            {/* information about bio*/}
            <div className="profileBio">
              <Typography variant="h7">{User.userBio}</Typography>
            </div>
          </div>
          {/* information about bio*/}
        </div>
        {/* btn for edit the user account*/}
        <div className="profileBtn">
          <div>
            {User.userName == params.userId ? (
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
            ?.filter((p) => p.idUser === User.userId)
            .map((p) => (
              <PicPost key={p.idPost} img={p.media} id={p.idPost} />
            ))}
        </div>
      </div>
      {/* profile page side*/}
    </div>
  );
}
