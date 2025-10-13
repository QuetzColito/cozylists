import type { Component } from "solid-js";
import { For, Show } from "solid-js";
import { createSignal } from "solid-js";
import "./styles/style.scss";

const List: Component = () => {
  const [items, setItems] = createSignal([
    {
      name: "Mushoku Tensei",
    },
    {
      name: "Isekai Shikkaku",
    },
    {
      name: "Steins;Gate",
    },
  ]);

  const [selected, set_selected] = createSignal(0);
  const [editing, set_editing] = createSignal(-1);

  document.addEventListener("keydown", (e) => {
    if (editing != null) {
      if (e.key == "Enter" || e.key == "Escape") {
        setItems(
          items().map((item, index) =>
            index != selected()
              ? item
              : {
                  name: (
                    document.getElementById(
                      editing().toString(),
                    ) as HTMLInputElement
                  ).value,
                },
          ),
        );
        set_editing(-1);
      }
    }
    if (e.key == "j") set_selected((selected() + 1) % items().length);
    if (e.key == "k") set_selected((selected() - 1) % items().length);
    if (e.key == "i") {
      set_editing(selected());
      document.getElementById(selected().toString())?.focus();
    }
  });

  return (
    <>
      <For each={items()}>
        {(item, index) => (
          <li class={selected() == index() ? "active" : ""}>
            <Show when={index() != editing()}>
              <span> {item.name} </span>
            </Show>
            <Show when={index() == editing()}>
              <input id={index().toString()} value={item.name} />
            </Show>
          </li>
        )}
      </For>
    </>
  );
};

export default List;
