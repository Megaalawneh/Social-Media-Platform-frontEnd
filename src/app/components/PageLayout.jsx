import Container from "@mui/material/Container";
import AsideButtons from "./asideButtons";
export default function PageLayout({ children }) {
  return (
    <Container maxWidth="xl" className="mainPageContainer">
      <AsideButtons />
       <main className="pageMain">{children}</main>
    </Container>
  );
}