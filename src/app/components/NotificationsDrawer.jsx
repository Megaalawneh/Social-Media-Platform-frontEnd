import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { useContext } from "react";
import { NotificationsDrawerContext } from "../Context/NotificationsDrawerContext";
import { CreateProfile } from "../Context/CreateProfileContext";
import { Avatar, Typography, Button } from "@mui/material";
import "../styles/loginPageStyle.css";
export default function NotificationsDrawer() {
  const { open, toggleDrawer } = useContext(NotificationsDrawerContext);
  const { state, User, dispatch } = useContext(CreateProfile);
  function handleFollowNotification({ type, payload }) {
    dispatch({ type: type, payload: payload });
  }
  const DrawerList = (
    <Box sx={{ width: 450 }} role="presentation">
      {state.users?.map((u) =>
        User?.userId === u?.userId
          ? u.Notifications.map((n) => {
              const author = state.users?.find(
                (u) => u?.userId === n?.userFollower,
              );
              const authorProfilePic = author
                ? author.userProfilePic
                : undefined;
              const authorName = author ? author.userName : "Unknown User";
              return (
                <div
                  key={n?.userFollower}
                  style={{ display: "flex", margin: "15px 0px 10px 10px " }}
                >
                  <Avatar
                    alt={authorName}
                    src={authorProfilePic}
                    sx={{ width: 45, height: 45, border: "2px solid #2c2f36" }}
                  />
                  <div style={{ marginLeft: "15px" }}>
                    <Typography
                      variant="caption"
                      sx={{ color: "white" }}
                    >{`${author?.userName} ${n?.message}`}</Typography>
                  </div>
                  <Button
                    variant="contained"
                    sx={{
                      margin: "10px 5px 0px 40px",
                      width: "70px",
                      height: "30px",
                      fontSize: "11px",
                    }}
                    onClick={() => {
                      handleFollowNotification({
                        type: "ConfirmFollow",
                        payload: {
                          userId: User?.userId,
                          userFollower: n?.userFollower,
                        },
                      });
                    }}
                  >
                    Confirm
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      margin: "10px 5px 0px 0px",
                      width: "70px",
                      height: "30px",
                      fontSize: "11px",
                      backgroundColor: "#25292e",
                    }}
                    onClick={() => {
                      handleFollowNotification({
                        type: "DeleteFollow",
                        payload: {
                          userId: User?.userId,
                          userFollower: n?.userFollower,
                        },
                      });
                    }}
                  >
                    Delete
                  </Button>
                </div>
              );
            })
          : "",
      )}
    </Box>
  );

  return (
    <div style={{ backgroundColor: "rgb(35, 34, 34) !important" }}>
      <Drawer open={open} onClose={toggleDrawer(false)} disableScrollLock>
        {DrawerList}
      </Drawer>
    </div>
  );
}
