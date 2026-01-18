import { createSignal, Match, Show, Switch, type Component } from "solid-js";
import "../styles/style.scss";
import Egg from "../shared/Egg";
import AccountView from "./AccountView";
import LoginView from "./LoginView";
import * as Api from "./api";
import { User } from "./api";

const App: Component = () => {
  const [user, set_user] = createSignal<STATEFUL_USER>("LOADING");
  Api.currentUser()
    .then((returnedUser) => {
      if (returnedUser != null)
        set_user(returnedUser)
      else
        set_user("NOT_LOGGED_IN")
    })
    .catch(() => {
      set_user("NOT_LOGGED_IN")
    })
    .finally();

  type STATEFUL_USER = "LOADING" | "NOT_LOGGED_IN" | User
  return (
    <>
      <Switch>
        <Match when={user() == "LOADING"}>
          <p> Loading ... </p>
        </Match>
        <Match when={user() == "NOT_LOGGED_IN"}>
          <LoginView />
        </Match>
        <Match when={!(typeof user() === 'string')}>
          <AccountView user={user() as User} />
        </Match>
      </Switch>
      <Egg />
    </>
  );
};

export default App;
