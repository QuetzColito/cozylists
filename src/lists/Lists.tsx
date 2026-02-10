import type { Signal, Component, Accessor } from "solid-js";
import {
  createMemo,
  createSignal,
  For,
  Switch,
  Match,
} from "solid-js";
import { List } from "./List";
import { ListItem } from "./items";
import * as Item from "./items";
import * as Api from "../api/lists";
import { buildProcessor, process } from "../shared/KeyBindProcessor";
import { binds, ListsState, ListState } from "./Binds";

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
  let listApis: ListState[] = [];
  let [state, set_state] = createSignal<STATE>("LOADING");

  const lists = ["Watchable", "Watching", "Watched"];
  const [active, set_active] = createSignal(0);

  const [clipboard, set_clipboard] = createSignal<ListItem[]>([]);
  let current: ListItem[][];
  let history: ListItem[][][] = [];
  let reHistory: ListItem[][][] = [];

  const bindProcessor = buildProcessor(binds)

  const listsState: ListsState = {
    l: () => listApis[active()],
    listCount: lists.length,
    selected: active,
    set_selected: set_active,
    clipboard: clipboard,
    set_clipboard: set_clipboard,
    undo: () => {
      reHistory.push(current);
      current = history.pop() ?? current;
      listApis.map((l, i) => l.set_items(current[i]));
    },
    redo: () => {
      history.push(current);
      current = reHistory.pop() ?? current;
      listApis.map((l, i) => l.set_items(current[i]));
    },
    save: () => {
      Api.putItems(current.map((l) => l.map(Item.makeStatic)));
    },
    updateHistory: () => {
      history.push(Item.cloneLists(current));
      reHistory = [];
      current = listApis.map((l) => Item.cloneList(l.items()));
    },
  }

  document.addEventListener("keydown", (e) => {
    if (state() == "READY")
      process(bindProcessor, listsState, e)
  });

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
                activeMode={bindProcessor.activeMode}
              />
            )}
          </For>
        </div>
      </Match>
    </Switch>
  );
};

export default Lists;
