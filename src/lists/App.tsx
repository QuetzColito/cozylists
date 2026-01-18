import type { Component } from "solid-js";
import "../styles/style.scss"
import Egg from "../shared/Egg";
import Lists from "./Lists";

const App: Component = () => {
  return (
    <>
      <Egg />
      <Lists />
    </>
  );
};

export default App;
