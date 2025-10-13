import type { Component } from "solid-js";
import { createSignal } from "solid-js";
import "./styles/style.scss";
import Egg from "./Egg";

const App: Component = () => {
  return (
    <>
      <Egg />
    </>
  );
};

export default App;
