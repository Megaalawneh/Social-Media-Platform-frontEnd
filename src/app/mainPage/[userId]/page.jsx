import PageLayout from "../../components/PageLayout";
import { CreateProfileProvider } from "../../Context/CreateProfileContext";
import { AlertDialogProvider } from "../../Context/alertDialogContext";
import { CommentDialogProvider } from "../../Context/commentDialogContext";
import "../../styles/AccountPageStyle.css";
import AccountPage from "../../components/AccountPage";
export default function page() {
  return (
    <CreateProfileProvider>
      <AlertDialogProvider>
        <CommentDialogProvider>
          <PageLayout>
            <AccountPage />
          </PageLayout>
        </CommentDialogProvider>
      </AlertDialogProvider>
    </CreateProfileProvider>
  );
}
