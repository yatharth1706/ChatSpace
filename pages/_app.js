import "../styles/globals.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebaseConfig";
import Login from "./login";

function MyApp({ Component, pageProps }) {
  const [user] = useAuthState(auth);

  if (!user) return <Login />;

  return <Component {...pageProps} />;
}

export default MyApp;
