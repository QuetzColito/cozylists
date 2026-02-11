import { Accessor, Setter } from "solid-js";
import { DefaultMode, KeyBind, makeBinds, makeChangeBinds } from "../shared/KeyBindProcessor";
import { Encounter } from "./Encounter";

export type Gw2State = {
  rowLength: Accessor<number>,
  selected: Accessor<number>,
  set_selected: Setter<number>,
  filteredSelected: Accessor<number>,
  set_filteredSelected: Setter<number>,
  encounters: Accessor<Encounter[]>,
  set_encounters: Setter<Encounter[]>,
  filteredEncounters: Accessor<Encounter[]>,
  set_filteredEncounters: Setter<Encounter[]>,
  pick: () => void,
}
const mod = (a: number, b: number) => (((a % b) + b) % b)

export type Gw2Mode = DefaultMode | "Unfiltering"
const makeGw2Binds = (explanation: string
  , effect: (a: Gw2State) => void
  , binds: string[]
  , modes: Gw2Mode[] = ["Normal"]
  , prefix: string[] = []
): KeyBind<Gw2State, Gw2Mode>[] => makeBinds(explanation, effect, binds, modes, prefix)

const makeGw2ChangeBinds = (explanation: string
  , effect: (a: Gw2State) => Gw2Mode
  , binds: string[]
  , modes: Gw2Mode[] = ["Normal"]
  , prefix: string[] = []
): KeyBind<Gw2State, Gw2Mode>[] => makeChangeBinds(explanation, effect, binds, modes, prefix)

export const binds: KeyBind<Gw2State, Gw2Mode>[] = [

  // Normal Binds

  makeGw2Binds("Move Down", (a) => {
    a.set_selected((a.selected() + 1) % a.encounters().length);
  }, ["j", "J", "ArrowDown"], ["Normal"]),
  makeGw2Binds("Move Up", (a) => {
    a.set_selected(mod(a.selected() - 1, a.encounters().length));
  }, ["k", "K", "ArrowUp"], ["Normal"]),
  makeGw2Binds("Pick a random Encounter", (a) => {
    a.pick()
  }, ["Enter"], ["Normal"]),
  makeGw2ChangeBinds("Swap to Filtered List", (a) => {
    return "Unfiltering"
  }, ["f"], ["Normal"]),

  // Unfiltering Binds
  //
  makeGw2Binds("Move Down", (a) => {
    if (a.filteredSelected() + a.rowLength() < a.filteredEncounters().length)
      a.set_filteredSelected(a.filteredSelected() + a.rowLength());
  }, ["j", "J", "ArrowDown"], ["Unfiltering"]),
  makeGw2Binds("Move Up", (a) => {
    if (a.filteredSelected() - a.rowLength() < a.filteredEncounters().length)
      a.set_filteredSelected(a.filteredSelected() - a.rowLength());
  }, ["k", "K", "ArrowUp"], ["Unfiltering"]),
  makeGw2Binds("Move Left", (a) => {
    a.set_filteredSelected(Math.max(a.filteredSelected() - 1, 0));
  }, ["h", "H", "ArrowLeft"], ["Unfiltering"]),
  makeGw2Binds("Move Right", (a) => {
    a.set_filteredSelected(Math.min(a.filteredSelected() + 1, a.filteredEncounters().length));
  }, ["l", "L", "ArrowRight"], ["Unfiltering"]),

  makeGw2ChangeBinds("Swap back to Main List", (a) => {
    return "Normal"
  }, ["f"], ["Unfiltering"]),
].flat()
