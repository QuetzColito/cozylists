import type { Accessor, Component } from "solid-js";
import { createMemo, createSignal, For, Show } from "solid-js";
import "./styles/style.scss";
import { Portal } from "solid-js/web";
import { List } from "./List";

export type SelectorApi = {
  set_okAction: (action: (selection: string) => void) => void;
  handler: (e: KeyboardEvent) => boolean;
  set_forColor: (forColor: boolean) => void;
  set_prev: (prev: string) => void;
  activate: () => void;
};

type SelectorProps = {
  get_api: (api: SelectorApi) => void;
  colours: Map<string, string>;
  decorators: Map<string, string>;
};

const Selector: Component<SelectorProps> = (props) => {
  const [selected, set_selected] = createSignal(0);
  const [forColor, set_forColor] = createSignal(true);
  const [active, set_active] = createSignal(false);
  let prev = "";
  let okAction = (select: string) => {};
  const select: Accessor<[string, string][]> = createMemo(() =>
    forColor() ? [...props.colours.entries()] : [...props.decorators.entries()],
  );

  props.get_api({
    set_okAction: (action) => (okAction = action),
    set_forColor: (forColor) => set_forColor(forColor),
    set_prev: (previous) => (prev = previous),
    activate: () => set_active(true),
    handler: (e: KeyboardEvent) => {
      if (/^\d$/.test(e.key) && select().length > parseInt(e.key)) {
        okAction(select()[parseInt(e.key)][0]);
        return true;
      }

      switch (e.key) {
        case "j":
          set_selected(Math.min(selected() + 1, select().length - 1));
          break;
        case "k":
          set_selected(Math.max(selected() - 1, 0));
          break;
        case "Escape":
          okAction(prev);
          set_active(false);
          break;
        case "Enter":
          okAction(select()[selected()][0]);
          set_active(false);
          break;
        default:
          return false;
      }
      return true;
    },
  });

  return (
    <Show when={active()}>
      <ul class="list">
        <For each={select()}>
          {([name, value], index) => (
            <li>
              <span
                classList={{
                  active: selected() == index(),
                }}
                class="name"
                style={{
                  "--item-color": `var(--${forColor() ? value : "fg"})`,
                }}
              >
                {name}
              </span>
              <Show when={!forColor()}>
                <span class="decorator"> {value} </span>
              </Show>
            </li>
          )}
        </For>
      </ul>
    </Show>
  );
};

export default Selector;
