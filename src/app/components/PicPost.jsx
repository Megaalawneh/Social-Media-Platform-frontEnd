import { CardMedia } from "@mui/material";
import "../styles/AccountPageStyle.css";
import { CommentDialogContext } from "../Context/commentDialogContext";
import { useContext } from "react";
export default function PicPost({ img ,id}) {
    const {handleClickOpen,setPostId} =useContext(CommentDialogContext)
  return (
    <div className="postPic">
      <CardMedia
        component="img"
        onClick={()=>{
            handleClickOpen()
            setPostId(id)
        }}
        sx={{
          width: "100%",
          height: 380,
          objectFit: "cover",
        }}
        image={img || "https://via.placeholder.com/470x300"}
        alt="post Share"
      />
    </div>
  );
}
