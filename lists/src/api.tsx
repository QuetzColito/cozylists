import { StoredListItem } from "./items";

const apiUrl = import.meta.env.VITE_GOZY_URL;

export const fetchItems = async () => {
  const response = await fetch(`${apiUrl}/items`);
  return response.json();
};

export const putItems = async (items: StoredListItem[][]) => {
  fetch(`${apiUrl}/items`, {
    method: "PUT",
    body: JSON.stringify(items),
  });
};
