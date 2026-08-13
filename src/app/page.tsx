{
  /* components imports  */
}

import LoginPage from "./components/loginPage";
import { CreateProfileProvider } from "./Context/CreateProfileContext";
export default function Home() {
  return (
    <>
      <CreateProfileProvider>
        <LoginPage />
      </CreateProfileProvider>
    </>
  );
}
