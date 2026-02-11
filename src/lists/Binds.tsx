import { Accessor, Setter } from "solid-js";
import { ListItem } from "./items";
import { DefaultMode, KeyBind, makeBinds, makeChangeBinds } from "../shared/KeyBindProcessor";

export type ListsState = {
  l: () => ListState,
  listCount: number,
  selected: Accessor<number>,
  set_selected: Setter<number>,
  clipboard: Accessor<ListItem[]>,
  set_clipboard: Setter<ListItem[]>,
  undo: () => void,
  redo: () => void,
  save: () => void,
  updateHistory: () => void,
}

export type ListState = {
  selected: Accessor<number>
  set_selected: Setter<number>
  selectionStart: Accessor<number>
  set_selectionStart: Setter<number>
  items: Accessor<ListItem[]>
  bounds: [Accessor<number>, Accessor<number>]
  set_items: Setter<ListItem[]>
  s: () => SelectorState
}

export type SelectorState = {
  selected: Accessor<number>
  set_selected: Setter<number>
  set_forColor: Setter<boolean>
  items: Accessor<[string, string][]>
}

export type ListMode = DefaultMode | "Visual" | "Decorating" | "Coloring" | "Editing"

const makeListBinds = (explanation: string
  , effect: (a: ListsState) => void
  , binds: string[]
  , modes: ListMode[] = ["Normal"]
  , prefix: string[] = []
): KeyBind<ListsState, ListMode>[] => makeBinds(explanation, effect, binds, modes, prefix)

const makeListChangeBinds = (explanation: string
  , effect: (a: ListsState) => ListMode
  , binds: string[]
  , modes: ListMode[] = ["Normal"]
  , prefix: string[] = []
): KeyBind<ListsState, ListMode>[] => makeChangeBinds(explanation, effect, binds, modes, prefix)

export const binds: KeyBind<ListsState, ListMode>[] = [

  // Global Binds

  makeListBinds("Move Left", (a) => {
    a.set_selected(Math.max(a.selected() - 1, 0))
  }, ["h", "H", "ArrowLeft"], ["Normal", "Visual"]),

  makeListBinds("Move Right", (a) => {
    a.set_selected(Math.min(a.selected() + 1, a.listCount - 1))
  }, ["l", "L", "ArrowRight"], ["Normal", "Visual"]),

  makeListBinds("Undo the last Change to the List", (a) => {
    a.undo()
  }, ["u"]),

  makeListBinds("Redo the last Undo", (a) => {
    a.redo()
  }, ["U"]),

  makeListBinds("Save Contents of the Lists in the Database (requires to be Owner))", (a) => {
    a.save()
  }, ["w"], ["Normal"], [" "]),

  // List-Level Binds

  makeListBinds("Move Up", (a) => {
    a.l().set_selected(Math.max(a.l().selected() - 1, 0))
  }, ["k", "ArrowUp"], ["Normal", "Visual"]),

  makeListBinds("Move Up 25", (a) => {
    a.l().set_selected(Math.max(a.l().selected() - 25, 0))
  }, ["K"], ["Normal", "Visual"], [" "]),

  makeListBinds("Move Down", (a) => {
    a.l().set_selected(Math.min(a.l().selected() + 1, a.l().items().length - 1))
  }, ["j", "ArrowDown"], ["Normal", "Visual"]),

  makeListBinds("Move Up 25", (a) => {
    a.l().set_selected(Math.min(a.l().selected() + 25, a.l().items().length - 1))
  }, ["J"], ["Normal", "Visual"]),

  makeListChangeBinds("Swap to Visual Mode", (a) => {
    a.l().set_selectionStart(a.l().selected())
    return "Visual"
  }, ["v", "V"], ["Normal"]),

  makeListChangeBinds("Back to Normal Mode", (a) => {
    return "Normal"
  }, ["v", "V", "Escape"], ["Visual"]),

  // Selector Binds

  makeListBinds("Move Up", (a) => {
    a.l().s().set_selected(Math.max(a.l().s().selected() - 1, 0))
  }, ["k", "K", "ArrowUp"], ["Decorating", "Coloring"]),

  makeListBinds("Move Down", (a) => {
    a.l().s().set_selected(Math.min(a.l().s().selected() + 1, a.l().s().items().length - 1))
  }, ["j", "J", "ArrowDown"], ["Decorating", "Coloring"]),

  makeListChangeBinds("Exit", () => {
    return "Normal"
  }, ["Escape"], ["Decorating", "Coloring"]),

  makeListChangeBinds("Select current Color", (a) => {
    const s = a.l().s()
    const [lower, upper] = [a.l().bounds[0](), a.l().bounds[1]()]
    a.l().items()
      .slice(lower, upper + 1)
      .forEach(item =>
        item.color[1](s.items()[s.selected()][0]));
    a.updateHistory()
    return "Normal"
  }, ["Enter"], ["Coloring"]),

  makeListChangeBinds("Select current Color", (a) => {
    const s = a.l().s()
    const [lower, upper] = [a.l().bounds[0](), a.l().bounds[1]()]
    a.l().items()
      .slice(lower, upper + 1)
      .forEach(item =>
        item.decorator[1](s.items()[s.selected()][0]));
    a.updateHistory()
    return "Normal"
  }, ["Enter"], ["Decorating"]),

  //     case "Enter": // Confirm
  //       okAction(select()[selected()][0]);
  //       set_active(false);
  //       break;
  //     default:
  //       return false;
  //   }

].flat()
