import type { Accessor, Component, Setter, Signal } from "solid-js";
import { createEffect, createMemo, For, onMount, Show } from "solid-js";
import { createSignal } from "solid-js";
import "./styles/style.scss";
import { ParentApi } from "./Lists";

export type ListItem = {
  name: string;
  color: string;
  decorator: string;
};
export type Entry = {
  name: string;
  decoratorId: number;
  colorId: number;
};

const newItem = () => {
  return {
    name: "",
    color: "",
    decorator: "",
  };
};

export type ListApi = {
  grabFocus: () => boolean;
  handleKey: (e: KeyboardEvent) => boolean;
  items: Accessor<ListItem[]>;
  set_items: Setter<ListItem[]>;
};

export type ListProps = {
  name: string;
  active: Accessor<boolean>;
  getListApi: (api: ListApi) => void;
  parent: ParentApi;
};

export const List: Component<ListProps> = (props: ListProps) => {
  const [items, set_items] = createSignal(
    [
      {
        name: "Mushoku Tensei",
        color: "Fantasy",
      },
      {
        name: "Isekai Shikkaku",
        color: "Fantasy",
      },
      {
        name: "Steins;Gate",
        color: "Urban Fantasy",
      },
    ] as ListItem[],
    { equals: false },
  );

  const colours = new Map([
    ["default", "fg"],
    ["Romance", "red"],
    ["RomCom", "orange"],
    ["Comedy", "yellow"],
    ["Fantasy", "green"],
    ["Urban Fantasy", "blue"],
    ["Sci-Fi", "cyan"],
    ["Drama", "purple"],
  ]);

  const [selected, set_selected] = createSignal(0);
  const [selectionStart, set_selectionStart] = createSignal(0);
  const lower = createMemo(() => Math.min(selected(), selectionStart()));
  const upper = createMemo(() => Math.max(selected(), selectionStart()));
  const [editing, set_editing] = createSignal(-1);
  const [visual, set_visual] = createSignal(false);
  const count = props.parent.count;
  createEffect(() => {
    if (!visual()) set_selectionStart(selected());
  });

  const update_items = (track = true) => {
    if (track) props.parent.updateHistory();
    set_items(items());
  };

  const edit = (e: KeyboardEvent) => {
    set_editing(selected());
    getInput().focus();
    set_visual(false);
    e.preventDefault();
  };

  const getInput = () =>
    document.getElementById(selected().toString()) as HTMLInputElement;

  const defaultMap = (e: KeyboardEvent) => {
    if (editing() >= 0) {
      if (e.key == "Enter" || e.key == "Escape") {
        items()[selected()].name = getInput().value;
        update_items();
        set_editing(-1);
      }
      return true;
    }
    switch (e.key) {
      case "j":
        set_selected(Math.min(selected() + count(), items().length - 1));
        break;
      case "k":
        set_selected(Math.max(selected() - count(), 0));
        break;
      case "d":
      case "x":
        props.parent.setClipboard(
          items().splice(
            lower(),
            Math.abs(selected() - selectionStart()) + count(),
          ),
        );
        set_selected(Math.min(selected(), Math.max(items().length - 1, 0)));
        set_visual(false);
        update_items();
        break;
      case "o":
        const offset = Math.min(items().length, 1);
        items().splice(selected() + offset, 0, newItem());
        update_items(false);
        set_selected(selected() + offset);
        edit(e);
        break;
      case "O":
        items().splice(selected(), 0, newItem());
        update_items(false);
        edit(e);
        break;
      case "y":
        props.parent.setClipboard(items().slice(lower(), upper() + 1));
        break;
      case "p":
        const offsetp = Math.min(items().length, 1);
        items().splice(selected() + offsetp, 0, ...props.parent.getClipboard());
        update_items();
        break;
      case "P":
        items().splice(selected(), 0, ...props.parent.getClipboard());
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
      case "Escape": {
        set_visual(false);
        break;
      }
      default:
        return false;
    }
    return true;
  };

  const stopEdit = () => {};

  props.getListApi({
    handleKey: (e) => defaultMap(e),
    grabFocus: () => editing() >= 0,
    items: items,
    set_items: set_items,
  });

  return (
    <div
      classList={{
        activeList: props.active(),
        inActiveList: !props.active(),
        listWrapper: true,
      }}
    >
      <div>editing: {editing()}</div>
      <div>selected: {selected()}</div>
      <div>selectionStart: {selectionStart()}</div>
      <h3 class="header">{props.name}</h3>
      <ul class="list">
        <For each={items()}>
          {(item, index) => (
            <li
              classList={{
                active: selected() == index(),
                selection:
                  index() <= upper() &&
                  index() >= lower() &&
                  selected() != index(),
              }}
            >
              <span
                class="line-number"
                style={{
                  color: selected() == index() ? "var(--bg2)" : "var(--fg2)",
                }}
              >
                {selected() == index()
                  ? index()
                  : Math.abs(selected() - index())}
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
      </ul>
    </div>
  );
};
