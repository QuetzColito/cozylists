import { createSignal, Signal } from "solid-js";

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

export const create = (name = "", color = "", decorator = "") => {
  return {
    name: name,
    color: createSignal(color),
    decorator: createSignal(decorator),
  };
};

export const saveToClipboard = (items: ListItem[]) => {
  navigator.clipboard.writeText(
    items
      .map(
        (i) =>
          i.name +
          (i.color[0]() ? ` [[${i.color[0]()}]]` : "") +
          (i.decorator[0]() ? ` <<${i.decorator[0]()}>>` : ""),
      )
      .reduce((acc, x) => acc + "\n" + x),
  );
};

export const readFromClipboard = async () => {
  return await navigator.clipboard.readText().then((text) => {
    return text.split(/\r?\n/).map((line) => {
      let decoratorMatch = line.match(/<<.*>>/);
      const decorator = decoratorMatch
        ? decoratorMatch[0].substring(2, decoratorMatch[0].length - 2)
        : "";

      let colorMatch = line.match(/\[\[.*]]/);
      const color = colorMatch
        ? colorMatch[0].substring(2, colorMatch[0].length - 2)
        : "";

      let name = line.replace(/<<.*>>/, "").replace(/\[\[.*]]/, "");

      return create(name, color, decorator);
    });
  });
};

export const makeReactive = (stored: StoredListItem) => {
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
export const cloneLists = (lists: ListItem[][]) =>
  lists.map((list) => cloneList(list));
export const clone = (item: ListItem) => {
  return {
    name: item.name,
    color: createSignal(item.color[0]()),
    decorator: createSignal(item.decorator[0]()),
  };
};
