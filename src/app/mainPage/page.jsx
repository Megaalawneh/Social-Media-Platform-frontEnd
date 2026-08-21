import Container from "@mui/material/Container";
import "../styles/mainPageStyle.css";
import Post from "../components/Post";
import Weather from "../components/weatherApi";
import PageLayout from "../components/PageLayout";
import { CreateProfileProvider } from "../Context/CreateProfileContext";
import { AlertDialogProvider } from "../Context/alertDialogContext";
import { CommentDialogProvider } from "../Context/commentDialogContext";
export default function page() {
  return (
    <>
      <CreateProfileProvider>
        <PageLayout>
     
            <Container maxWidth="xl" className="mainPageContainer">
              <main>
                <AlertDialogProvider>
                  <CommentDialogProvider>
                    <Post />
                  </CommentDialogProvider>
                </AlertDialogProvider>
              </main>
              <aside>
                <Weather />
              </aside>
            </Container>
          
        </PageLayout>
      </CreateProfileProvider>
    </>
  );
}
