import type { Accessor, Component, Setter, Signal } from "solid-js";
import { createEffect, createMemo, For, Show } from "solid-js";
import { createSignal } from "solid-js";
import Selector from "./Selector";
import { ListItem, StoredListItem } from "./items";
import { ListState, SelectorState } from "./Binds";
import { Mode } from "../shared/KeyBindProcessor";

export type ListProps = {
  name: string;
  active: Accessor<boolean>;
  readonly: boolean;
  initialItems: ListItem[];
  setListApi: (api: ListState) => void;
  activeMode: Accessor<Mode>
};

export const List: Component<ListProps> = (props: ListProps) => {
  const [items, set_items] = createSignal(props.initialItems, {
    equals: false,
  });

  const colours = new Map([
    ["", "fg"],
    ["Romance", "red"],
    ["RomCom", "orange"],
    ["Alternate History", "yellow"],
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
  const [selectionStart, set_selectionStart] = createSignal<number>(0);
  const editing = createMemo(() => props.activeMode() === "Editing")
  const visual = createMemo(() => props.activeMode() === "Visual")
  const lower = createMemo(() => visual() ? Math.min(selected(), selectionStart()) : selected());
  const upper = createMemo(() => visual() ? Math.max(selected(), selectionStart()) : selected());

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

  // createEffect(() => {
  //   if (!visual()) set_selectionStart(selected());
  // });

  // const update_items = (track = true) => {
  //   if (track) props.parent.updateHistory();
  //   set_items(items());
  // };

  // const edit = (e: KeyboardEvent) => {
  //   set_editing(selected());
  //   getInput().focus();
  //   set_visual(false);
  //   e.preventDefault();
  // };

  const getInput = () =>
    document.getElementById(selected().toString()) as HTMLInputElement;

  // const defaultMap = (e: KeyboardEvent) => {
  //   // Edit
  //   if (editing() >= 0) {
  //     // exit Editing
  //     if (e.key == "Enter" || e.key == "Escape") {
  //       items()[selected()].name = getInput().value.trim();
  //       update_items();
  //       set_editing(-1);
  //       return true;
  //     } else return false;
  //   }

  //   if (e.getModifierState("Control")) {
  //     let match = true;
  //     switch (e.key) {
  //       case "d":
  //       case "D": // Down Half-page
  //         set_selected(Math.min(selected() + 20, items().length - 1));
  //         break;
  //       case "u":
  //       case "U": // Up Half-page
  //         set_selected(Math.max(selected() - 25, 0));
  //         break;
  //       default:
  //         match = false;
  //     }
  //     if (match) {
  //       e.preventDefault();
  //       return true;
  //     }
  //   }

  //   // Read
  //   let match = true;
  //   switch (e.key) {
  //     case "J": // Down Half-page
  //       set_selected(Math.min(selected() + count() * 25, items().length - 1));
  //       break;
  //     case "j": // Down
  //       set_selected(Math.min(selected() + count(), items().length - 1));
  //       break;
  //     case "k": // Up
  //       set_selected(Math.max(selected() - count(), 0));
  //       break;
  //     case "K": // Up Half-page
  //       set_selected(Math.max(selected() - count() * 25, 0));
  //       break;
  //     case "g": // g submap, gg -> go to Top
  //       if (commandPrefix() == "g") set_selected(0);
  //       else return props.parent.appendCommand("g");
  //       break;
  //     case "G": // go to end
  //       set_selected(items().length - 1);
  //       break;
  //     case "y": // yank (copy)
  //       props.parent.setClipboard(items().slice(lower(), upper() + 1));
  //       set_visual(false);
  //       break;
  //     case "v": // toggle visual mode
  //       set_visual(!visual());
  //       break;
  //     case "Escape": // Exit visual mode
  //       set_visual(false);
  //       break;
  //     default:
  //       if (props.readonly) return false;
  //       else match = false;
  //   }
  //   if (match) return true;

  //   // Write
  //   switch (e.key) {
  //     case "d":
  //     case "x": // delete Selection (and save to clipboard)
  //       props.parent.setClipboard(
  //         items().splice(
  //           lower(),
  //           Math.abs(selected() - selectionStart()) + count(),
  //         ),
  //       );
  //       set_selected(Math.min(selected(), Math.max(items().length - 1, 0)));
  //       set_visual(false);
  //       update_items();
  //       break;
  //     case "c": // colour
  //       select(true, (color) => {
  //         if (color != undefined)
  //           items()
  //             .slice(lower(), upper() + 1)
  //             .forEach((item) => item.color[1](color));
  //       });
  //       break;
  //     case "r": // rate (apply decorator)
  //       select(false, (decorator) => {
  //         if (decorator != undefined)
  //           items()
  //             .slice(lower(), upper() + 1)
  //             .forEach((item) => item.decorator[1](decorator));
  //       });
  //       break;
  //     case "R": // Replace Selection with clipboard
  //       props.parent.useClipboard((clipboard) =>
  //         items().splice(
  //           lower(),
  //           Math.abs(selected() - selectionStart()) + count(),
  //           ...clipboard,
  //         ),
  //       );
  //       set_selected(Math.min(selected(), Math.max(items().length - 1, 0)));
  //       set_visual(false);
  //       update_items();
  //       break;
  //     case "o": // new Item below cursor
  //       const offset = Math.min(items().length, 1);
  //       items().splice(selected() + offset, 0, Item.create());
  //       update_items(false);
  //       set_selected(selected() + offset);
  //       edit(e);
  //       break;
  //     case "O": // new Item above cursor
  //       items().splice(selected(), 0, Item.create());
  //       update_items(false);
  //       edit(e);
  //       break;
  //     case "p": // paste below cursor
  //       props.parent.useClipboard((clipboard) => {
  //         const offsetp = Math.min(items().length, 1);
  //         items().splice(selected() + offsetp, 0, ...clipboard);
  //         update_items();
  //       });
  //       break;
  //     case "P": // paste above cursor
  //       props.parent.useClipboard((clipboard) => {
  //         items().splice(selected(), 0, ...clipboard);
  //         update_items();
  //       });
  //       break;
  //     case "I":
  //     case "i": // insert, cursor at start
  //       edit(e);
  //       getInput().setSelectionRange(Infinity, Infinity);
  //       break;
  //     case "A":
  //     case "a": // append, cursor at end
  //       edit(e);
  //       break;
  //     default:
  //       return false;
  //   }
  //   return true;
  // };

  // let currentMap = defaultMap;

  props.setListApi({
    selected: selected,
    set_selected: set_selected,
    selectionStart: selectionStart,
    set_selectionStart: set_selectionStart,
    items: items,
    bounds: [lower, upper],
    set_items: set_items,
    s: () => selectorApi
  });

  let selectorApi: SelectorState;
  // const select = (
  //   forColor: boolean,
  //   action: (item: string | undefined) => void,
  // ) => {
  //   selectorApi.set_forColor(forColor);
  //   selectorApi.set_okAction((item) => {
  //     action(item);
  //     // update_items();
  //     // currentMap = defaultMap;
  //     selectorActive = false;
  //   });
  //   // currentMap = selectorApi.handler;
  //   selectorActive = true;
  //   selectorApi.activate();
  // };

  return (
    <div
      classList={{
        activeList: props.active(),
        inActiveList: !props.active(),
        listWrapper: true,
      }}
    >
      <div>
        {
          // <div>editing: {editing()}</div>
          // <div>selected: {selected()}</div>
          // <div>selectionStart: {selectionStart()}</div>
          // <div>visual: {visual().toString()}</div>
          // <div>count: {count()}</div>
        }
        <h3 class="header">{props.name}</h3>
      </div>
      <Selector
        get_api={(api) => (selectorApi = api)}
        decorators={decorators}
        colours={colours}
        activeMode={props.activeMode}
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
              <Show when={!editing()}>
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
              <Show when={editing() && index() == selected()}>
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
