import type { Accessor, Component } from "solid-js";
import { createMemo, createSignal, For, Show } from "solid-js";
import { SelectorState } from "./Binds";
import { Mode } from "../shared/KeyBindProcessor";

type SelectorProps = {
  get_api: (api: SelectorState) => void;
  colours: Map<string, string>;
  decorators: Map<string, string>;
  activeMode: Accessor<Mode>
};

const Selector: Component<SelectorProps> = (props) => {
  const [selected, set_selected] = createSignal(0);
  const [forColor, set_forColor] = createSignal<boolean>(false);
  const items: Accessor<[string, string][]> = createMemo(() =>
    forColor() ? [...props.colours.entries()] : [...props.decorators.entries()],
  );

  props.get_api({
    selected: selected,
    set_selected: set_selected,
    set_forColor: set_forColor,
    items: items
  });

  return (
    <Show when={["Decorating", "Coloring"].includes(props.activeMode())}>
      <ul class="list">
        <For each={items()}>
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
