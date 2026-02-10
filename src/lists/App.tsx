import { createSignal, Signal, type Component } from "solid-js";
import "../styles/lists.scss"
import Egg from "../shared/Egg";
import Lists from "./Lists";
import Navigation from "../shared/Navigation";
import { User } from "../api/user";

const App: Component = () => {
  const user = createSignal<User>(null)
  return (
    <>
      <Egg />
      <Lists user={user[0]} />
      <Navigation userSignal={user} />
    </>
  );
};

export default App;
