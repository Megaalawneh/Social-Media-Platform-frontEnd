"use client";
import { useState } from "react";
import ExpandButton from "./expandButton";
import HomeIcon from "@mui/icons-material/Home";
import MessageIcon from "@mui/icons-material/Message";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import "../styles/mainPageStyle.css";
import PostDialog from "./postDialog";
import PersonIcon from "@mui/icons-material/Person";
import { CreateProfile } from "../Context/CreateProfileContext";
import { useContext ,useEffect} from "react";
export default function Aside() {
  const [postDialogOpen, setPostDialogOpen] = useState(false);
   const {User } = useContext(CreateProfile);
    
    const [isMounted, setIsMounted] = useState(false);


  useEffect(() => {
    function Moun(){
      setIsMounted(true);
    }
    Moun()
  }, []);
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
     {isMounted && User?.userProfilePic? <ExpandButton
        name={"Profile"}
        authorPic={User?.userProfilePic}
        LinkTogo={`/mainPage/${User?.userName}`}
      />: <ExpandButton
        name={"Profile"}
        icon={<PersonIcon/>}
        LinkTogo={`/mainPage/${User?.userName}`}
      />}
    </aside>
  );
}
