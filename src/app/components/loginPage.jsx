"use client";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import "../styles/loginPageStyle.css";
import Link from "next/link";
import Mybutton from "./myButton";
import CustomTextFields from "./customTextField";
import { CreateProfile } from "../Context/CreateProfileContext";
import { useContext, useState } from "react";
export default function LoginPage() {
  const { users } = useContext(CreateProfile);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erorrLogin, setErorrLogin] = useState(null);
  function handleSubmit(event) {
    event.preventDefault();
    const findUser = users.find(
      (u) => u.userEmail === email && u.userPassword === password
    );
    if(findUser){
      console.log(findUser,"hi")
      setErorrLogin(null)
    }else{
       setErorrLogin(
          <Typography
            gutterBottom
            variant="h6"
            style={{
              display: "flex",
              color: "red",
              width: "100%",
              marginLeft: "60px",
            }}
          >
            The Email Or The Password Is Incorrect
          </Typography>,
        );
    }
  }
  return (
    <Container maxWidth="xl" className="loginPageContainer">
      <Card sx={{ width: "57em", background: "rgb(24, 23, 23)" }}>
        <div
          style={{
            minHeight: "100vh",
            padding: "20px",
            margin: "0px",
          }}
        >
          <section
            style={{
              textAlign: "center",
              color: "white",
              marginBottom: "30px",
            }}
          >
            <p
              style={{
                fontSize: "18px",
                maxWidth: "800px",
                margin: "20px auto",
              }}
            >
              React.js & Next.js & Node.js
              <br />
              <br />
              Social Media WebSite Project
            </p>
          </section>

          <div
            style={{
              background: "rgb(35, 34, 34)",
              padding: "30px",
              borderRadius: "20px",
              maxWidth: "900px",
              margin: "auto",
              boxShadow: "0 10px 25px rgba(53,114,165,0.25)",
            }}
          >
            <h2 style={{ color: "rgb(161, 166, 170)" }}>📚 social media</h2>

            <p>
              Welcome to social media, a modern web application where users can
              share media and videos and posts.
            </p>

            <h2
              style={{
                color: "rgb(161, 166, 170)",
                marginTop: "30px",
              }}
            >
              🚀 Features
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
                gap: "15px",
              }}
            >
              {[
                "🔎 Search books by title or author",
                "🌍 Filter by language",
                "⭐ Sort by popularity",
                "📖 View covers and summaries",
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    background: "rgb(161, 166, 170)",
                    padding: "15px",
                    borderRadius: "12px",
                    color: "rgb(39, 41, 42)",
                  }}
                >
                  {item}
                </div>
              ))}
            </div>

            <h2
              style={{
                color: "rgb(161, 166, 170)",
                marginTop: "30px",
              }}
            >
              💻 Technology Stack
            </h2>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              {[
                "Next.js",
                "React",
                "Node.js",
                "Express.js",
                "TypeScript",
                "Material UI",
              ].map((tech) => (
                <span
                  key={tech}
                  style={{
                    background: "rgb(161, 166, 170)",
                    color: "white",
                    padding: "10px 18px",
                    borderRadius: "20px",
                    fontSize: "15px",
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card
        sx={{ width: "44em", background: "rgb(35, 34, 34)" }}
        className="LoginCard"
      >
        <Typography
          gutterBottom
          variant="h6"
          style={{ display: "flex", width: "100%", marginLeft: "136px" }}
        >
          Log in to pathWebSite
        </Typography>

        <form className="loginPageCardInfo" onSubmit={handleSubmit}>
          <CustomTextFields
            id={"outlined-required"}
            label={"email address or username"}
            variant={"outlined"}
            type={"email"}
            required={true}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <CustomTextFields
            id={"outlined-password-input"}
            label={"password"}
            type={"password"}
            required={true}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          {erorrLogin ? erorrLogin : null}
          <Mybutton
            name={"Login"}
            variant={"contained"}
            className={"btn"}
            type={"submit"}
          />

          <Link
            href="/mainPage/accounts/password/reset"
            className="passwordbtn"
          >
            <Mybutton
              name={"Forgotten password?"}
              variant={"text"}
              className={"btnForgottenPassword"}
            />
          </Link>

          <Mybutton
            name={"Google"}
            variant={"outlined"}
            className={"btn"}
            startIcon={<GoogleIcon />}
          />
          <Mybutton
            name={"Facebook"}
            variant={"outlined"}
            className={"btn"}
            startIcon={<FacebookIcon />}
          />
        </form>
        <Link
          href={"/mainPage/accounts/emailsignup"}
          className="loginPageCardInfo"
        >
          <Mybutton
            name={"Create new account"}
            variant={"outlined"}
            className={"btnCreate"}
          />
        </Link>
      </Card>
    </Container>
  );
}
