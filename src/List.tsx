import type { Accessor, Component, Signal } from "solid-js";
import { createEffect, For, onMount, Show } from "solid-js";
import { createSignal } from "solid-js";
import "./styles/style.scss";

export type ListItem = {
  name: string;
};

export type ListProps = {
  name: string;
  active: boolean;
  getClipboard: () => ListItem[];
  countSignal: Signal<number>;
  handleKey: (handler: (e: KeyboardEvent) => void) => void;
  getSelection: (getter: (all?: boolean) => ListItem[]) => void;
  isEdit: (signal: () => boolean) => void;
};

export const List: Component<ListProps> = (props: ListProps) => {
  const [items, set_items] = createSignal(
    [
      {
        name: "Mushoku Tensei",
      },
      {
        name: "Isekai Shikkaku",
      },
      {
        name: "Steins;Gate",
      },
    ] as ListItem[],
    { equals: false },
  );

  const [selected, set_selected] = createSignal(0);
  const [selectionStart, set_selectionStart] = createSignal(0);
  const [editing, set_editing] = createSignal(-1);
  const [visual, set_visual] = createSignal(false);
  const [count, set_count] = props.countSignal;
  createEffect(() => {
    if (!visual()) set_selectionStart(selected());
  });
  const history: ListItem[][] = [structuredClone(items())];
  const reHistory: ListItem[][] = [];

  const update_items = (track = true) => {
    if (track) history.push(structuredClone(items()));
    if (track) console.log(history);
    set_items(items());
  };

  const edit = (e: KeyboardEvent) => {
    set_editing(selected());
    getInput().focus();
    e.preventDefault();
    currentMap = editMap;
  };

  const getInput = () =>
    document.getElementById(selected().toString()) as HTMLInputElement;

  const defaultMap = (e: KeyboardEvent) => {
    switch (e.key) {
      case "j":
        set_selected(
          Math.min(selected() + Math.max(count(), 1), items().length - 1),
        );
        break;
      case "k":
        set_selected(Math.max(selected() - Math.max(count(), 1), 0));
        break;
      case "d":
      case "x":
        items().splice(
          Math.min(selected(), selectionStart()),
          Math.abs(selected() - selectionStart()) + 1,
        );
        update_items();
        break;
      case "o":
        const offset = Math.min(items().length, 1);
        items().splice(selected() + offset, 0, { name: "" });
        update_items(false);
        set_selected(selected() + offset);
        edit(e);
        break;
      case "O":
        items().splice(selected(), 0, { name: "" });
        update_items(false);
        edit(e);
        break;
      case "p":
        const offsetp = Math.min(items().length, 1);
        items().splice(selected() + offsetp, 0, ...props.getClipboard());
        update_items();
        break;
      case "P":
        items().splice(selected(), 0, ...props.getClipboard());
        update_items();
        break;
      case "i": {
        edit(e);
        break;
      }
      case "a": {
        edit(e);
        getInput().setSelectionRange(Infinity, Infinity);
        break;
      }
      case "v": {
        set_visual(!visual());
        break;
      }
      case "u": {
        reHistory.push(history.pop() ?? []);
        set_items(history.pop() ?? items());
        break;
      }
      case "U": {
        history.push(items());
        set_items(reHistory.pop() ?? items());
        break;
      }
      case "Escape": {
        set_visual(false);
        break;
      }
      default:
        return false;
    }
    return true;
  };
  let currentMap = defaultMap;

  const editMap = (e: KeyboardEvent) => {
    if (e.key == "Enter" || e.key == "Escape") {
      items()[selected()].name = getInput().value;
      update_items();
      set_editing(-1);
      currentMap = defaultMap;
      return true;
    }
    return false;
  };

  props.handleKey((e) => {
    if (currentMap(e)) set_count(0);
  });
  props.getSelection((all = false) =>
    all
      ? items()
      : items().slice(
          Math.min(selected(), selectionStart()),
          Math.max(selected(), selectionStart()) + 1,
        ),
  );
  props.isEdit(() => editing() >= 0);

  return (
    <div class={props.active ? "activeList" : ""}>
      <For each={items()}>
        {(item, index) => (
          <li
            class={`${selected() == index() ? "active" : ""} ${index() <= Math.max(selected(), selectionStart()) && index() >= Math.min(selected(), selectionStart()) ? "selection" : ""}`}
          >
            <span>
              {selected() == index() ? index() : Math.abs(selected() - index())}
            </span>
            <Show when={index() != editing()}>
              <span> {item.name} </span>
            </Show>
            <Show when={index() == editing()}>
              <input id={index().toString()} value={item.name} />
            </Show>
          </li>
        )}
      </For>
    </div>
  );
};
