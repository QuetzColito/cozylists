import { Accessor, createSignal, Setter, Signal } from "solid-js";
import "../styles/style.scss";

export type KeyBind<A> = {
  prefix: string[],
  binds: string[],
  mode: string,
  explanation: string,
  effect: (api: A) => string | undefined
}

export type Action<A> = ((api: A) => string | undefined) | BindMap<A>
export type BindMap<A> = Map<string, Action<A>>
export type BindProcessor<A> = {
  count: number,
  activeMap: BindMap<A>,
  activeMode: Accessor<Mode>,
  set_activeMode: Setter<Mode>,
  modes: Map<string, BindMap<A>>
}

export type Mode = "Normal" | "Visual" | "Decorating" | "Coloring" | "Editing"

export function buildProcessor<A>(binds: KeyBind<A>[], defaultMode: Mode = "Normal"): BindProcessor<A> {
  const modeMap = new Map<string, BindMap<A>>;
  binds.forEach(bind => {
    if (!modeMap.has(bind.mode))
      modeMap.set(bind.mode, new Map<string, Action<A>>)
    let current = modeMap.get(bind.mode)!;

    bind.prefix.forEach(prefix => {
      if (!(current.get(prefix) instanceof Map)) {
        const nested = new Map<string, Action<A>>
        current.set(prefix, nested)
        current = nested
      } else
        current = current.get(prefix) as BindMap<A>
    })
    bind.binds.forEach(key => {
      current.set(key, bind.effect)
    })
  })
  const [activeMode, set_activeMode] = createSignal(defaultMode)
  return {
    count: 1,
    activeMap: modeMap.get(defaultMode)!,
    activeMode: activeMode,
    set_activeMode: set_activeMode,
    modes: modeMap
  }
}

export function process<A>(processor: BindProcessor<A>, bindApi: A, ev: KeyboardEvent) {
  // console.log(ev.key)
  // console.log(processor)

  // Add to Count If Number
  if (/^\d$/.test(ev.key)) {
    processor.count = parseInt(processor.count.toString() + ev.key);
    return
  }
  const doAction = (action: Action<A> | undefined): boolean => {
    if (action !== undefined) {
      if (action instanceof Map) {
        processor.activeMap = action
      } else {
        for (let i = 0; i < Math.max(processor.count, 1); i++) {
          processor.set_activeMode(action(bindApi) || processor.activeMode());
        }
        processor.activeMap = processor.modes.get(processor.activeMode())!
      }
      processor.count = 0
      ev.preventDefault()
    }
    return action !== undefined;
  }

  let action = processor.activeMap.get(ev.key)
  if (action === undefined && !["Shift", "Control", "Alt", "Meta"].includes(ev.key)) {
    processor.activeMap = processor.modes.get(processor.activeMode())!
    action = processor.activeMap.get(ev.key)
  }
  doAction(action)
}

type BindHelpProps<A> = {
  binds: [KeyBind<A>]
}

export const BindHelpPage = <A,>(props: BindHelpProps<A>) => {

  return (
    <div >
      Hier könnte ihre Hilfe sein.
    </div>
  );
};
