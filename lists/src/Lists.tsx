import type { Signal, Component, Accessor } from "solid-js";
import {
  createMemo,
  createResource,
  createSignal,
  For,
  Switch,
  Match,
  createEffect,
} from "solid-js";
import { List, ListApi } from "./List";
import "./styles/style.scss";
import { ListItem } from "./items";
import * as Item from "./items";
import * as Api from "./api";

export type ParentApi = {
  useClipboard: (action: (items: ListItem[]) => void) => void;
  setClipboard: (items: ListItem[]) => void;
  count: Accessor<number>;
  commandPrefix: Accessor<string>;
  appendCommand: (command: string) => boolean;
  updateHistory: () => void;
};

type STATE = "LOADING" | "ERROR" | "READY";

const Lists: Component = () => {
  let listApis: ListApi[] = [];
  let [state, set_state] = createSignal<STATE>("LOADING");

  const lists = ["Watchable", "Watching", "Watched"];
  const [active, set_active] = createSignal(0);
  const countSignal = createSignal(0);
  const [internalCount, set_count] = countSignal;
  const commandPrefixSignal = createSignal("");
  const [commandPrefix, set_commandPrefix] = commandPrefixSignal;
  const count = createMemo(() => Math.max(internalCount(), 1));

  let clipboard: ListItem[] = [];
  let current: ListItem[][];
  let history: ListItem[][][] = [];
  let reHistory: ListItem[][][] = [];

  const handleKeyEvent = (e: KeyboardEvent) => {
    if (listApis[active()].grabFocus()) return listApis[active()].handleKey(e);

    // Read Count if Number
    if (/^\d$/.test(e.key)) {
      set_count(parseInt(internalCount().toString() + e.key));
      return false;
    }

    switch (e.key) {
      case " ":
        set_commandPrefix(" ");
        e.preventDefault();
        return false;
      case "L":
      case "l": // move right
        set_active(Math.min(active() + count(), lists.length - 1));
        break;
      case "H":
      case "h": // move left
        set_active(Math.max(active() - count(), 0));
        break;
      case "w": // move left
        if (commandPrefix() == " ")
          Api.putItems(current.map((l) => l.map(Item.makeStatic)));
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
        return listApis[active()].handleKey(e);
    }
    return true;
  };

  document.addEventListener("keydown", (e) => {
    if (state() == "READY")
      if (handleKeyEvent(e)) {
        set_count(0);
        set_commandPrefix("");
        e.preventDefault();
      }
  });

  const api = {
    useClipboard: (action: (items: ListItem[]) => void) => {
      if (commandPrefix() == " ") Item.readFromClipboard().then(action);
      else action(clipboard);
    },
    setClipboard: (items: ListItem[]) => {
      if (commandPrefix() == " ") Item.saveToClipboard(items);
      else clipboard = Item.cloneList(items);
    },
    count: count,
    commandPrefix: commandPrefix,
    appendCommand: (command: string) => {
      set_commandPrefix((prev) => prev + command);
      return false;
    },
    updateHistory: () => {
      history.push(Item.cloneLists(current));
      reHistory = [];
      current = listApis.map((l) => Item.cloneList(l.items()));
    },
  };

  let initialItems: ListItem[][] = [];
  Api.fetchItems()
    .then((items) => {
      initialItems = items.map((list: Item.StoredListItem[]) =>
        list.map(Item.makeReactive),
      );
      current = Item.cloneLists(initialItems);
      set_state("READY");
    })
    .catch((err) => {
      console.error("Couldnt load Initial Items", err);
      set_state("ERROR");
    })
    .finally();

  return (
    <Switch>
      <Match when={state() == "LOADING"}>
        <p> Loading ... </p>
      </Match>
      <Match when={state() == "ERROR"}>
        <p> Error {} </p>
      </Match>
      <Match when={state() == "READY"}>
        <div class="lists">
          <For each={initialItems}>
            {(list, index) => (
              <List
                name={lists[index()]}
                initialItems={list}
                active={createMemo(() => index() == active())}
                readonly={false}
                setListApi={(api) => (listApis[index()] = api)}
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
