'use client'
import Container from "@mui/material/Container";
import "../../../../styles/restPasswordPageStyle.css";
import Typography from "@mui/material/Typography";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Mybutton from "../../../../components/myButton";
import CustomTextFields from "../../../../components/customTextField";
import Link from "next/link";
import AuthGuard from "../../../../hooks/AuthGuard";
export default function page() {
  
  const goBackHome = "/";
  AuthGuard();
  return (
    <>
      <Container maxWidth="xl" className="resetPasswordContainer">
        <div className="resetPasswordCardInfo">
          <Link href={goBackHome}>
            <Mybutton startIcon={<ArrowBackIosIcon />} />
          </Link>
          <Typography
            gutterBottom
            variant="h6"
            style={{ marginTop: "15px", marginLeft: "15px" }}
          >
            Find your account
            <br />
            Enter your mobile number, username or email address
          </Typography>
          <CustomTextFields
            id={"outlined-basic"}
            label={"email address or username"}
            type={"text"}
            required={true}
          />

          <Typography
            gutterBottom
            variant="h6"
            style={{ marginTop: "15px", marginLeft: "15px" }}
          >
            You may receive Email and SMS notifications from us for security and
            login purposes.
          </Typography>

          <Mybutton
            name={"continue"}
            variant={"contained"}
            className={"btn"}
            type={"submit"}
          />
        </div>
      </Container>
    </>
  );
}
