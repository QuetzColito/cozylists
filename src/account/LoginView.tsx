import type { Signal, Component, Accessor } from "solid-js";
import { doLogin, doRegister } from "../api/user";

const LoginView: Component = () => {
  const getInput = (id: string) =>
    document.getElementById(id) as HTMLInputElement;
  const collectCredentials = () => {
    return {
      username: getInput("username").value,
      password: getInput("password").value
    }
  }
  const handleLogin = () => {
    doLogin(collectCredentials())
  }
  const handleRegister = () => {
    doRegister(collectCredentials())
  }
  return (
    <>
      <p> Login </p>
      <label for="username">Username</label>
      <br />
      <input id="username" value="" />
      <br />
      <label for="password">Password</label>
      <br />
      <input id="password" value="" />
      <br />
      <button onClick={handleLogin}>Login</button>
      <br />
      <button onClick={handleRegister}>Register</button>
    </>
  );
};

export default LoginView;
