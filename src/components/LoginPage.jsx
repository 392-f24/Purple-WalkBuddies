import { Button } from "@mui/material";
import { signInWithGoogle, signOut, useAuthState, useDbUpdate } from "../firebase";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const { Guser, user, auth } = useAuthState();
  const [update, result] = useDbUpdate(`/owners/${Guser?.uid}`);

  useEffect(() => {
    if (result?.error) {
      window.alert("Failed to register:\n\n" + result.message);
    }  else {
      if (result?.timestamp) {
        window.alert(result.message);
      }
    }
  }, [result]);

  useEffect(() => {
    if (auth) {
      navigate("/");
    }
  }, [auth]);

  return (
    <div className="LinearLayout">
      <span>Login Page</span>
      {Guser
        ? user === null
          ? <Button onClick={() => {
              update({
                hello: "world"
              });
            }}>Register</Button>
          : "Directing to main page..."
        : <Button onClick={() => signInWithGoogle()}>Log in</Button>}
      <Button onClick={() => signOut()}>Log out</Button>
    </div>
  );
}

export default LoginPage;