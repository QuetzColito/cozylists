import { createSignal, Match, Show, Switch, type Component } from "solid-js";
import "../styles/style.scss";
import Egg from "../shared/Egg";

const App: Component = () => {

  return (
    <>
      <h2> Welcome to quetz.dev! </h2>
      <p> This is currently under construction, but the following pages exist: </p>
      <a href="/lists/"> Cozy Lists </a>
      <br />
      <a href="/gw2/"> Cozy Gw2 Tools </a>
      <br />
      <a href="/account/"> Cozy Account </a>
      <br />
      <a href="/"> Cozy Home </a>
      <br />
      <Egg />
    </>
  );
};

export default App;
