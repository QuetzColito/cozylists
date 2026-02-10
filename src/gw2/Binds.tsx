import { KeyBind, Mode } from "../shared/KeyBindProcessor";

export type Gw2State = {
  up: () => void,
  down: () => void,
  pick: () => void,
}

const makeBinds = (explanation: string
  , effect: (a: Gw2State) => void
  , binds: string[]
  , modes: Mode[] = ["Normal"]
  , prefix: string[] = []
): KeyBind<Gw2State>[] => {
  return modes.map((mode) => {
    return {
      mode: mode,
      prefix: prefix,
      binds: binds,
      explanation: explanation,
      effect: (a) => {
        effect(a);
        return undefined
      }
    }
  })
}

export const binds: KeyBind<Gw2State>[] = [
  makeBinds("Move Down", (a) => {
    a.down()
  }, ["j", "J", "ArrowDown"], ["Normal"]),
  makeBinds("Move Up", (a) => {
    a.up()
  }, ["k", "K", "ArrowUp"], ["Normal"]),
  makeBinds("Pick a random Encounter", (a) => {
    a.pick()
  }, ["Enter"], ["Normal"]),
].flat()
