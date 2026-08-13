import Container from "@mui/material/Container";
import "../styles/mainPageStyle.css";
import Post from "../components/Post";
import Weather from "../components/weatherApi";
import PageLayout from "../components/PageLayout";
import { CreateProfileProvider } from "../Context/CreateProfileContext";
import { AlertDialogProvider } from "../Context/alertDialogContext";
export default function page() {
  return (
    <>
      <CreateProfileProvider>
        <PageLayout>
          <Container maxWidth="xl" className="mainPageContainer">
            <main>
              <AlertDialogProvider>
                <Post />
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
