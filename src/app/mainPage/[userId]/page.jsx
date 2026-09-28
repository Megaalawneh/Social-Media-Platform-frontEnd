import PageLayout from "../../components/PageLayout";
import { AlertDialogProvider } from "../../Context/alertDialogContext";
import { CommentDialogProvider } from "../../Context/commentDialogContext";
import "../../styles/AccountPageStyle.css";
import AccountPage from "../../components/AccountPage";
export default function page() {
  return (

      <AlertDialogProvider>
        <CommentDialogProvider>
          <PageLayout>
            <AccountPage />
          </PageLayout>
        </CommentDialogProvider>
      </AlertDialogProvider>

  );
}
