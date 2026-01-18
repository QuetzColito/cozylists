export type User = {
  name: string
}

export type Credentials = {
  username: string
  password: string
}

export const currentUser = async () => {
  const response = await fetch(`/api/user`);
  return response.json();
};

export const doLogin = async (user: Credentials) => {
  await fetch(`/api/user`, {
    method: "POST",
    body: JSON.stringify(user),
  }).then(() => window.location.reload());
};

export const doRegister = async (user: Credentials) => {
  await fetch(`/api/user`, {
    method: "PUT",
    body: JSON.stringify(user),
  }).then(() => window.location.reload());
};

export const doLogout = async () => {
  await fetch(`/api/logout`, {
  }).then(() => window.location.reload());
};

export const doDelete = async () => {
  await fetch(`/api/logout`, {
    method: "DELETE",
  }).then(() => window.location.reload());
};
