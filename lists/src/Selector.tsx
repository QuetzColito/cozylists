import type { Accessor, Component } from "solid-js";
import { createMemo, createSignal, For, Show } from "solid-js";
import "./styles/style.scss";

export type SelectorApi = {
  set_okAction: (action: (selection: string | undefined) => void) => void;
  handler: (e: KeyboardEvent) => boolean;
  set_forColor: (forColor: boolean) => void;
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
  let okAction: (result: string | undefined) => void;
  const select: Accessor<[string, string][]> = createMemo(() =>
    forColor() ? [...props.colours.entries()] : [...props.decorators.entries()],
  );

  props.get_api({
    set_okAction: (action) => (okAction = action),
    set_forColor: (forColor) => set_forColor(forColor),
    activate: () => set_active(true),
    handler: (e: KeyboardEvent) => {
      // Select directly via Id
      if (
        /^\d$/.test(e.key) &&
        parseInt(e.key) <= select().length &&
        parseInt(e.key) != 0
      ) {
        okAction(select()[parseInt(e.key) - 1][0]);
        set_active(false);
        return true;
      }

      switch (e.key) {
        case "j": // Down
          set_selected(Math.min(selected() + 1, select().length - 1));
          break;
        case "k": // Up
          set_selected(Math.max(selected() - 1, 0));
          break;
        case "Escape": // Cancel
          okAction(undefined);
          set_active(false);
          break;
        case "Enter": // Confirm
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
              <span> {index() + 1} </span>
              <span
                classList={{
                  active: selected() == index(),
                }}
                class="name"
                style={{
                  "--item-color": `var(--${forColor() ? value : "fg"})`,
                }}
              >
                {name || "None"}
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
