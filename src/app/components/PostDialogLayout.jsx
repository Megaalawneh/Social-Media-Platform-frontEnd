import Container from "@mui/material/Container";

export default function PostDialogLayout({ children }) {
  return (
    <Container maxWidth="xl" className="mainPageContainer">
      <main className="pageMain">{children}</main>
    </Container>
  );
}