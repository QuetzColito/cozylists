import type { Signal, Component, Accessor } from "solid-js";
import { createMemo, createSignal, For, onMount } from "solid-js";
import { cloneList, List, ListApi, ListItem } from "./List";
import "./styles/style.scss";

export type ParentApi = {
  getClipboard: () => ListItem[];
  setClipboard: (items: ListItem[]) => void;
  count: Accessor<number>;
  updateHistory: () => void;
};

const Lists: Component = () => {
  let listApis: ListApi[] = [];
  let list: Accessor<ListApi>;

  const lists = ["Watchable", "Watching", "Watched"];
  const [active, set_active] = createSignal(0);
  const countSignal = createSignal(0);
  const [internalCount, set_count] = countSignal;
  const count = createMemo(() => Math.max(internalCount(), 1));

  let clipboard: ListItem[] = [];
  let current: ListItem[][];
  let history: ListItem[][][] = [];
  let reHistory: ListItem[][][] = [];

  onMount(() => {
    list = createMemo(() => listApis[active()]);
    current = listApis.map((l) => cloneList(l.items()));
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
    <div class="lists">
      <For each={lists}>
        {(name, index) => (
          <List
            name={name}
            active={createMemo(() => index() == active())}
            readonly={false}
            getListApi={(api) => (listApis[index()] = api)}
            parent={api}
          />
        )}
      </For>
    </div>
  );
};

export default Lists;
