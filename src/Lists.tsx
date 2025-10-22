import type { Signal, Component, Accessor } from "solid-js";
import {
  createMemo,
  createResource,
  createSignal,
  For,
  onMount,
  Switch,
  Match,
  createEffect,
} from "solid-js";
import {
  cloneList,
  List,
  ListApi,
  ListItem,
  makeStatic,
  StoredListItem,
} from "./List";
import "./styles/style.scss";

export type ParentApi = {
  getClipboard: () => ListItem[];
  setClipboard: (items: ListItem[]) => void;
  count: Accessor<number>;
  updateHistory: () => void;
};

const apiUrl = import.meta.env.VITE_GOZY_URL;

const fetchItems = async () => {
  const response = await fetch(`${apiUrl}/items`);
  return response.json();
};

const putItems = async (items: StoredListItem[][]) => {
  fetch(`${apiUrl}/items`, {
    method: "PUT",
    body: JSON.stringify(items),
  });
};

const Lists: Component = () => {
  let listApis: ListApi[] = [];
  let list: Accessor<ListApi>;

  const [items] = createResource(fetchItems);

  const lists = ["Watchable", "Watching", "Watched"];
  const [active, set_active] = createSignal(0);
  const countSignal = createSignal(0);
  const [internalCount, set_count] = countSignal;
  const count = createMemo(() => Math.max(internalCount(), 1));

  let clipboard: ListItem[] = [];
  let current: ListItem[][];
  let history: ListItem[][][] = [];
  let reHistory: ListItem[][][] = [];

  createEffect(() => {
    if (items()) {
      list = createMemo(() => listApis[active()]);
      current = listApis.map((l) => cloneList(l.items()));
    }
  });

  const handleKeyEvent = (e: KeyboardEvent) => {
    if (list().grabFocus()) return list().handleKey(e);

    // Read Count if Number
    if (/^\d$/.test(e.key)) {
      set_count(parseInt(internalCount().toString() + e.key));
      return false;
    }

    switch (e.key) {
      case "L":
      case "l": // move right
        set_active(Math.min(active() + count(), lists.length - 1));
        break;
      case "H":
      case "h": // move left
        set_active(Math.max(active() - count(), 0));
        break;
      case "w": // move left
        putItems(current.map((l) => l.map(makeStatic)));
        break;
      case "u": // Undo
        reHistory.push(current);
        current = history.pop() ?? current;
        listApis.map((l, i) => l.set_items(current[i]));
        break;
      case "U": // Redo
        history.push(current);
        current = reHistory.pop() ?? current;
        listApis.map((l, i) => l.set_items(current[i]));
        break;
      default:
        return list().handleKey(e);
    }
    return true;
  };

  document.addEventListener("keydown", (e) => {
    if (handleKeyEvent(e)) set_count(0);
  });

  const api = {
    getClipboard: () => clipboard,
    setClipboard: (items: ListItem[]) => (clipboard = cloneList(items)),
    count: count,
    updateHistory: () => {
      history.push(current);
      reHistory = [];
      current = listApis.map((l) => cloneList(l.items()));
    },
  };

  return (
    <Switch>
      <Match when={items.loading}>
        <p> Loading ... </p>
      </Match>
      <Match when={items.error}>
        <p> Error: {items.error} </p>
      </Match>
      <Match when={items()}>
        <div class="lists">
          <For each={items()}>
            {(list, index) => (
              <List
                name={lists[index()]}
                initialItems={list}
                active={createMemo(() => index() == active())}
                readonly={false}
                getListApi={(api) => (listApis[index()] = api)}
                parent={api}
              />
            )}
          </For>
        </div>
      </Match>
    </Switch>
  );
};

export default Lists;
