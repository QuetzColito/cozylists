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
  readonly: boolean;
  getListApi: (api: ListApi) => void;
  parent: ParentApi;
};

export const List: Component<ListProps> = (props: ListProps) => {
  const [items, set_items] = createSignal(
    [...Array(333).keys()]
      .map(
        () =>
          [
            {
              name: "Mushoku Tensei",
              color: "Fantasy",
              decorator: "Good",
            },
            {
              name: "Isekai Shikkaku",
              color: "Fantasy",
              decorator: "Best",
            },
            {
              name: "Steins;Gate",
              color: "Urban Fantasy",
              decorator: "Mid",
            },
          ] as ListItem[],
      )
      .flat(),
    { equals: false },
  );

  const colours = new Map([
    ["Not Categorized", "fg"],
    ["Romance", "red"],
    ["RomCom", "orange"],
    ["Comedy", "yellow"],
    ["Fantasy", "green"],
    ["Urban Fantasy", "blue"],
    ["Sci-Fi", "cyan"],
    ["Drama", "purple"],
  ]);

  const decorators = new Map([
    ["Not Rated", ""],
    ["Trash", "🗑️"],
    ["Bad", "👎"],
    ["Mid", "🤏"],
    ["Good", "👍"],
    ["Very Good", "⭐️"],
    ["Best", "✨"],
  ]);

  const [selected, set_selected] = createSignal(0);
  const [selectionStart, set_selectionStart] = createSignal(0);
  const lower = createMemo(() => Math.min(selected(), selectionStart()));
  const upper = createMemo(() => Math.max(selected(), selectionStart()));
  let preceding = "";
  const SCROLL_OFF = 50;
  createEffect(() => {
    const el = document.getElementById("item" + selected());
    const parent = document.getElementById(props.name.toString());
    if (
      (parent?.getBoundingClientRect().top ?? 0) >
      (el?.getBoundingClientRect().bottom ?? 0) - SCROLL_OFF
    )
      parent?.scrollTo(
        0,
        (el?.offsetTop ?? 0) -
          (parent.offsetTop ?? 0) -
          SCROLL_OFF +
          (el?.clientHeight ?? 0),
      );

    parent?.ontouchend;

    if (
      (parent?.getBoundingClientRect().bottom ?? 0) <
      (el?.getBoundingClientRect().top ?? 0) + SCROLL_OFF
    )
      parent?.scrollTo(
        0,
        (el?.offsetTop ?? 0) -
          (parent.clientHeight + (parent.offsetTop ?? 0)) +
          SCROLL_OFF,
      );
  });

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
    // Edit
    if (editing() >= 0) {
      if (e.key == "Enter" || e.key == "Escape") {
        items()[selected()].name = getInput().value;
        update_items();
        set_editing(-1);
      }
      return true;
    }

    if (e.getModifierState("Control")) {
      let match = true;
      switch (e.key) {
        case "d":
        case "D":
          set_selected(Math.min(selected() + 20, items().length - 1));
          break;
        case "u":
        case "U":
          set_selected(Math.max(selected() - 25, 0));
          break;
        case "p":
        case "P":
          set_selected(Math.max(selected() - 20, 0));
          break;
        case "n":
        case "N":
          set_selected(Math.max(selected() - 20, 0));
          break;
        default:
          match = false;
      }
      if (match) {
        e.preventDefault();
        return true;
      }
    }

    // Read
    let match = true;
    switch (e.key) {
      case "J":
        set_selected(Math.min(selected() + count() * 25, items().length - 1));
        break;
      case "j":
        set_selected(Math.min(selected() + count(), items().length - 1));
        break;
      case "k":
        set_selected(Math.max(selected() - count(), 0));
        break;
      case "K":
        set_selected(Math.max(selected() - count() * 25, 0));
        break;
      case "g":
        if (preceding == "g") set_selected(0);
        else {
          preceding = "g";
          return false;
        }
        break;
      case "G":
        set_selected(items().length - 1);
        break;
      case "k":
        set_selected(Math.max(selected() - count(), 0));
        break;
      case "y":
        props.parent.setClipboard(items().slice(lower(), upper() + 1));
        set_visual(false);
        break;
      case "v": {
        set_visual(!visual());
        break;
      }
      case "Escape": {
        set_visual(false);
        break;
      }
      default:
        if (props.readonly) return false;
        else match = false;
    }
    if (match) return true;

    // Write
    switch (e.key) {
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
      default:
        return false;
    }
    return true;
  };

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
      <div>count: {count()}</div>
      <h3 class="header">{props.name}</h3>
      <ul class="list" id={props.name}>
        <For each={items()}>
          {(item, index) => (
            <li id={`item${index()}`}>
              <span class="line-number">
                {selected() == index()
                  ? index()
                  : Math.abs(selected() - index())}
              </span>
              <Show when={index() != editing()}>
                <span
                  classList={{
                    active: selected() == index(),
                    selection:
                      index() <= upper() &&
                      index() >= lower() &&
                      selected() != index(),
                  }}
                  class="name"
                  style={{
                    "--item-color": `var(--${colours.get(item.color)})`,
                  }}
                >
                  {item.name}
                </span>
              </Show>
              <Show when={index() == editing()}>
                <input id={index().toString()} value={item.name} />
              </Show>
              <span class="decorator"> {decorators.get(item.decorator)} </span>
            </li>
          )}
        </For>
      </ul>
    </div>
  );
};
