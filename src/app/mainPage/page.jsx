"use client";
import Container from "@mui/material/Container";
import "../styles/mainPageStyle.css";
import Post from "../components/Post";
import Weather from "../components/weatherPage";
import PageLayout from "../components/PageLayout";
import { AlertDialogProvider } from "../Context/alertDialogContext";
import { CommentDialogProvider } from "../Context/commentDialogContext";

export default function Page() {
  return (
    <>

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
    
    </>
  );
}
