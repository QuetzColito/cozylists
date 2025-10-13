import type { Component } from "solid-js";
import { createSignal } from "solid-js";
import "./styles/style.scss";
import Egg from "./Egg";
import List from "./List";

const App: Component = () => {
  return (
    <>
      <Egg />
      <List />
    </>
  );
};

export default App;
