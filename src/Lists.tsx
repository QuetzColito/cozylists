import type { Signal, Component, Accessor } from "solid-js";
import { createMemo, createSignal, For, onMount } from "solid-js";
import { List, ListApi, ListItem } from "./List";
import "./styles/style.scss";

export type ParentApi = {
  getClipboard: () => ListItem[];
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
    current = listApis.map((l) => structuredClone(l.items()));
  });

  const handleKeyEvent = (e: KeyboardEvent) => {
    if (list().isEdit()) {
      if (e.key == "Enter" || e.key == "Escape") list().stopEdit();
      return true;
    }

    if (/^\d$/.test(e.key)) {
      set_count(parseInt(internalCount().toString() + e.key));
      return false;
    }

    switch (e.key) {
      case "y":
        clipboard = list().getSelection();
        break;
      case "l":
        set_active(Math.min(active() + count(), lists.length - 1));
        break;
      case "h":
        set_active(Math.max(active() - count(), 0));
        break;
      case "u": {
        reHistory.push(listApis.map((l) => l.items()));
        current = history.pop() ?? current;
        listApis.map((l, i) => l.set_items(current[i]));
        break;
      }
      case "U": {
        history.push(listApis.map((l) => l.items()));
        current = reHistory.pop() ?? current;
        listApis.map((l, i) => l.set_items(current[i]));
        break;
      }
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
    count: count,
    updateHistory: () => {
      history.push(current);
      reHistory = [];
      current = listApis.map((l) => structuredClone(l.items()));
    },
  };

  return (
    <div class="lists">
      <For each={lists}>
        {(name, index) => (
          <List
            name={name}
            active={createMemo(() => index() == active())}
            getListApi={(api) => (listApis[index()] = api)}
            parent={api}
          />
        )}
      </For>
    </div>
  );
};

export default Lists;
