"use client";
import { useState } from "react";
import ExpandButton from "./expandButton";
import HomeIcon from "@mui/icons-material/Home";
import MessageIcon from "@mui/icons-material/Message";
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from "@mui/icons-material/Logout";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddIcon from "@mui/icons-material/Add";
import "../styles/mainPageStyle.css";
import PostDialog from "./postDialog";
import PersonIcon from "@mui/icons-material/Person";
import { useContext } from "react";
import { NotificationsDrawerContext } from "../Context/NotificationsDrawerContext";
import { useRouter } from "next/navigation";
import { AuthGuardContext } from "../Context/AuthGuardContext";
import { logoutApi } from "../api/auth";
export default function Aside() {
  const router = useRouter();
  const [postDialogOpen, setPostDialogOpen] = useState(false);
  const { currentUser } = useContext(AuthGuardContext);
  const { toggleDrawer, hasUnreadNotifications } = useContext(
    NotificationsDrawerContext,
  );
  
  return (
    <aside className="asideButton">
      <div className="HomeButton">
        <ExpandButton
          name={"Home"}
          icon={<HomeIcon />}
          LinkTogo={"/mainPage"}
        />
      </div>

      <ExpandButton
        name={"Message"}
        icon={<MessageIcon />}
        LinkTogo={"/mainPage/direct"}
      />
      <ExpandButton
        name={"Search"}
        icon={<SearchIcon />}
        LinkTogo={"/mainPage/Search"}
      />
      <ExpandButton
        name={"Notifications"}
        icon={
          hasUnreadNotifications ? (
            <FavoriteIcon sx={{ color: "#ff3040" }} />
          ) : (
            <FavoriteBorderIcon />
          )
        }
        onClick={() => toggleDrawer(true)}
      />
      <ExpandButton
        name={"Post"}
        icon={<AddIcon />}
        onClick={() => setPostDialogOpen(true)}
      />
      {postDialogOpen && (
        <PostDialog
          me={true}
          open={postDialogOpen}
          onClose={() => setPostDialogOpen(false)}
        />
      )}
      {currentUser?.userProfilePic ? (
        <ExpandButton
          name={"Profile"}
          authorPic={currentUser?.userProfilePic}
          LinkTogo={`/mainPage/${currentUser?.userName}`}
        />
      ) : (
        <ExpandButton
          name={"Profile"}
          icon={<PersonIcon />}
          LinkTogo={`/mainPage/${currentUser?.userName}`}
        />
      )}
      <ExpandButton
        name={"Logout"}
        icon={<LogoutIcon />}
        onClick={async () => {
          try {
            await logoutApi();
            router.replace("/");
          } catch (error) {
            console.log(error);
          }
        }}
      />
    </aside>
  );
}
