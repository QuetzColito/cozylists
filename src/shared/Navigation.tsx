import type { Accessor, Component, Signal } from "solid-js";
import { createSignal } from "solid-js";
import "../styles/style.scss";
import { currentUser, User } from "../api/user";

type NavigationProps = {
  userSignal: Signal<User>
}

const Navigation: Component<NavigationProps> = (props) => {
  const [user, set_user] = props.userSignal;
  currentUser()
    .then((returnedUser) => {
      set_user(returnedUser)
    })
    .catch(() => { })
    .finally();

  const handleClick = () => {
    window.location.href = "/account/"
  };

  return (
    <div
      class="account-indicator"
    >
      <p
        onClick={handleClick}
      >
        {user()?.name || "No Login"}
      </p>
    </div>
  );
};

export default Navigation;
