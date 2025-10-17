import type { Component } from "solid-js";
import { createEffect, createSignal, For, onMount, Show } from "solid-js";
import { List, ListItem } from "./List";
import "./styles/style.scss";

const Lists: Component = () => {
  let childHandler: ((e: KeyboardEvent) => void)[] = [];
  let getSelection: (() => ListItem[])[] = [];
  let isEdit: (() => boolean)[] = [];

  let clipboard: ListItem[] = [];

  const lists = ["Watchable", "Watching", "Watched"];
  const [active, set_active] = createSignal(0);
  const countSignal = createSignal(0);
  const [count, set_count] = countSignal;

  const handleKeyEvent = (e: KeyboardEvent) => {
    if (isEdit[active()]()) childHandler[active()](e);

    switch (e.key) {
      case "y":
        clipboard = getSelection[active()]();
        break;
      case "l":
        set_active(active() + (1 % lists.length));
        break;
      case "h":
        set_active(Math.max(active() - 1, 0));
        break;
      default:
        childHandler[active()](e);
    }
  };

  document.addEventListener("keydown", handleKeyEvent);

  return (
    <>
      <For each={lists}>
        {(name, index) => (
          <List
            name={name}
            active={index() == active()}
            getClipboard={() => clipboard}
            countSignal={countSignal}
            getSelection={(f) => (getSelection[index()] = f)}
            handleKey={(f) => (childHandler[index()] = f)}
            isEdit={(f) => (isEdit[index()] = f)}
          />
        )}
      </For>
    </>
  );
};

export default Lists;
