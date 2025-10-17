import type { Accessor, Component, Setter, Signal } from "solid-js";
import { createEffect, createMemo, For, onMount, Show } from "solid-js";
import { createSignal } from "solid-js";
import "./styles/style.scss";
import { ParentApi } from "./Lists";

export type ListItem = {
  name: string;
};

export type ListApi = {
  isEdit: () => boolean;
  stopEdit: () => void;
  getSelection: (all?: boolean) => ListItem[];
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
    e.preventDefault();
  };

  const getInput = () =>
    document.getElementById(selected().toString()) as HTMLInputElement;

  const defaultMap = (e: KeyboardEvent) => {
    switch (e.key) {
      case "j":
        set_selected(Math.min(selected() + count(), items().length - 1));
        break;
      case "k":
        set_selected(Math.max(selected() - count(), 0));
        break;
      case "d":
      case "x":
        items().splice(
          lower(),
          Math.abs(selected() - selectionStart()) + count(),
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

  const stopEdit = () => {
    items()[selected()].name = getInput().value;
    update_items();
    set_editing(-1);
  };

  props.getListApi({
    handleKey: (e) => defaultMap(e),
    getSelection: (all = false) =>
      all ? items() : items().slice(lower(), upper() + 1),
    isEdit: () => editing() >= 0,
    stopEdit: stopEdit,
    items: items,
    set_items: set_items,
  });

  return (
    <div classList={{ activeList: props.active(), listWrapper: true }}>
      <h3 class="header">{props.name}</h3>
      <ul class="list">
        <For each={items()}>
          {(item, index) => (
            <li
              classList={{
                active: selected() == index(),
                selection: index() <= upper() && index() >= lower(),
              }}
            >
              <span class="line-number">
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
