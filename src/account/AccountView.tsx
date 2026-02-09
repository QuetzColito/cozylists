import type { Signal, Component, Accessor } from "solid-js";
import { doDelete, doLogout, User } from "../api/user";

export type AccountViewProps = {
  user: User | null;
};

const AccountView: Component<AccountViewProps> = (props: AccountViewProps) => {
  return (
    <>
      <p> Loggend in as {props?.user?.name} </p>
      <br />
      <button onClick={doLogout}>Logout</button>
      <br />
      <button onClick={doDelete}>Delete</button>
    </>
  );
};

export default AccountView;
