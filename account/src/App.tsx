import type { Component } from "solid-js";
import "./styles/style.scss";
import Egg from "./Egg";

const App: Component = () => {
  return (
    <>
      <p>Hello Account!</p>
      <Egg />
      <p>Hello Account!</p>
    </>
  );
};

export default App;
