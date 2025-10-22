import type { Accessor, Component, Setter, Signal } from "solid-js";
import { createEffect, createMemo, For, Show } from "solid-js";
import { createSignal } from "solid-js";
import "./styles/style.scss";
import { ParentApi } from "./Lists";
import Selector, { SelectorApi } from "./Selector";

export type ListItem = {
  name: string;
  color: Signal<string>;
  decorator: Signal<string>;
};

export type StoredListItem = {
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
    color: createSignal(""),
    decorator: createSignal(""),
  };
};

const makeReactive = (stored: StoredListItem) => {
  return {
    name: stored.name,
    color: createSignal(stored.color),
    decorator: createSignal(stored.decorator),
  };
};

export const makeStatic = (item: ListItem) => {
  return {
    name: item.name,
    color: item.color[0](),
    decorator: item.decorator[0](),
  };
};

export const cloneList = (list: ListItem[]) => list.map((item) => clone(item));
export const clone = (item: ListItem) => {
  return {
    name: item.name,
    color: createSignal(item.color[0]()),
    decorator: createSignal(item.decorator[0]()),
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
  initialItems: StoredListItem[];
  getListApi: (api: ListApi) => void;
  parent: ParentApi;
};

export const List: Component<ListProps> = (props: ListProps) => {
  const [items, set_items] = createSignal(
    props.initialItems.map(makeReactive),
    {
      equals: false,
    },
  );

  const colours = new Map([
    ["", "fg"],
    ["Romance", "red"],
    ["RomCom", "orange"],
    ["Comedy", "yellow"],
    ["Fantasy", "green"],
    ["Urban Fantasy", "blue"],
    ["Sci-Fi", "cyan"],
    ["Drama", "purple"],
  ]);

  const decorators = new Map([
    ["", ""],
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

  // Automatic Scroll
  const SCROLL_OFF = 50;
  createEffect(() => {
    const el =
      document.getElementById(props.name + "." + selected()) ??
      document.getElementById("root")!;
    const parent =
      document.getElementById(props.name.toString()) ??
      document.getElementById("root")!;
    let pTop = parent.offsetTop;
    let eTop = el.offsetTop;
    if (
      parent.getBoundingClientRect().top >
      el.getBoundingClientRect().bottom - SCROLL_OFF
    )
      parent.scrollTo(0, eTop - pTop - SCROLL_OFF + el.clientHeight);

    if (
      parent.getBoundingClientRect().bottom <
      el.getBoundingClientRect().top + SCROLL_OFF
    )
      parent.scrollTo(0, eTop - parent.clientHeight + pTop + SCROLL_OFF);
  });

  const [editing, set_editing] = createSignal(-1);
  const [visual, set_visual] = createSignal(false);
  const count = props.parent.count;
  let selectorActive = false;
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
      // exit Editing
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
        case "D": // Down Half-page
          set_selected(Math.min(selected() + 20, items().length - 1));
          break;
        case "u":
        case "U": // Up Half-page
          set_selected(Math.max(selected() - 25, 0));
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
      case "J": // Down Half-page
        set_selected(Math.min(selected() + count() * 25, items().length - 1));
        break;
      case "j": // Down
        set_selected(Math.min(selected() + count(), items().length - 1));
        break;
      case "k": // Up
        set_selected(Math.max(selected() - count(), 0));
        break;
      case "K": // Up Half-page
        set_selected(Math.max(selected() - count() * 25, 0));
        break;
      case "g": // g submap, gg -> go to Top
        if (preceding == "g") set_selected(0);
        else {
          preceding = "g";
          return false;
        }
        break;
      case "G": // go to end
        set_selected(items().length - 1);
        break;
      case "y": // yank (copy)
        props.parent.setClipboard(items().slice(lower(), upper() + 1));
        set_visual(false);
        break;
      case "v": // toggle visual mode
        set_visual(!visual());
        break;
      case "Escape": // Exit visual mode
        set_visual(false);
        break;
      default:
        if (props.readonly) return false;
        else match = false;
    }
    if (match) return true;

    // Write
    switch (e.key) {
      case "d":
      case "x": // delete Selection (and save to clipboard)
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
      case "c": // colour
        select(true, (color) => {
          if (color)
            items()
              .slice(lower(), upper() + 1)
              .forEach((item) => item.color[1](color));
        });
        break;
      case "r": // rate (apply decorator)
        select(false, (decorator) => {
          if (decorator)
            items()
              .slice(lower(), upper() + 1)
              .forEach((item) => item.decorator[1](decorator));
        });
        break;
      case "R": // Replace Selection with clipboard
        props.parent.setClipboard(
          items().splice(
            lower(),
            Math.abs(selected() - selectionStart()) + count(),
            ...props.parent.getClipboard(),
          ),
        );
        set_selected(Math.min(selected(), Math.max(items().length - 1, 0)));
        set_visual(false);
        update_items();
        break;
      case "o": // new Item below cursor
        const offset = Math.min(items().length, 1);
        items().splice(selected() + offset, 0, newItem());
        update_items(false);
        set_selected(selected() + offset);
        edit(e);
        break;
      case "O": // new Item above cursor
        items().splice(selected(), 0, newItem());
        update_items(false);
        edit(e);
        break;
      case "p": // paste below cursor
        const offsetp = Math.min(items().length, 1);
        items().splice(selected() + offsetp, 0, ...props.parent.getClipboard());
        update_items();
        break;
      case "P": // paste above cursor
        items().splice(selected(), 0, ...props.parent.getClipboard());
        update_items();
        break;
      case "i": // insert, cursor at start
        edit(e);
        break;
      case "a": // append, cursor at end
        edit(e);
        getInput().setSelectionRange(Infinity, Infinity);
        break;
      default:
        return false;
    }
    return true;
  };

  let currentMap = defaultMap;

  props.getListApi({
    handleKey: (e) => currentMap(e),
    grabFocus: () => editing() >= 0 || selectorActive,
    items: items,
    set_items: set_items,
  });

  let selectorApi: SelectorApi;
  const select = (
    forColor: boolean,
    action: (item: string | undefined) => void,
  ) => {
    selectorApi.set_forColor(forColor);
    selectorApi.set_okAction((item) => {
      action(item);
      update_items();
      currentMap = defaultMap;
      selectorActive = false;
    });
    currentMap = selectorApi.handler;
    selectorActive = true;
    selectorApi.activate();
  };

  return (
    <div
      classList={{
        activeList: props.active(),
        inActiveList: !props.active(),
        listWrapper: true,
      }}
    >
      <div>
        <div>editing: {editing()}</div>
        <div>selected: {selected()}</div>
        <div>selectionStart: {selectionStart()}</div>
        <div>visual: {visual().toString()}</div>
        <div>count: {count()}</div>
        <h3 class="header">{props.name}</h3>
      </div>
      <Selector
        get_api={(api) => (selectorApi = api)}
        decorators={decorators}
        colours={colours}
      />
      <ul class="list" id={props.name}>
        <For each={items()}>
          {(item, index) => (
            <li id={`${props.name}.${index()}`}>
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
                    "--item-color": `var(--${colours.get(item.color[0]())})`,
                  }}
                >
                  {item.name}
                </span>
              </Show>
              <Show when={index() == editing()}>
                <input id={index().toString()} value={item.name} />
              </Show>
              <span class="decorator">
                {" "}
                {decorators.get(item.decorator[0]())}{" "}
              </span>
            </li>
          )}
        </For>
      </ul>
    </div>
  );
};
