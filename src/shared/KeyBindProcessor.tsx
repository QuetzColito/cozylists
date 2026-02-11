import { Accessor, createSignal, Setter, Signal } from "solid-js";
import "../styles/style.scss";

export type KeyBind<A, M> = {
  prefix: string[],
  binds: string[],
  mode: M,
  explanation: string,
  effect: (api: A) => M | undefined
}

export type Action<A, M> = ((api: A) => M | undefined) | BindMap<A, M>
export type BindMap<A, M> = Map<string, Action<A, M>>
export type BindProcessor<A, M> = {
  count: number,
  activeMap: BindMap<A, M>,
  activeMode: Accessor<M>,
  set_activeMode: Setter<M>,
  modes: Map<M, BindMap<A, M>>
}

export type DefaultMode = "Normal"

export function buildProcessor<A, M>(binds: KeyBind<A, M>[], defaultMode: M = "Normal" as M): BindProcessor<A, M> {
  const modeMap = new Map<M, BindMap<A, M>>;
  binds.forEach(bind => {
    if (!modeMap.has(bind.mode))
      modeMap.set(bind.mode, new Map<string, Action<A, M>>)
    let current = modeMap.get(bind.mode)!;

    bind.prefix.forEach(prefix => {
      if (!(current.get(prefix) instanceof Map)) {
        const nested = new Map<string, Action<A, M>>
        current.set(prefix, nested)
        current = nested
      } else
        current = current.get(prefix) as BindMap<A, M>
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

export function process<A, M>(processor: BindProcessor<A, M>, bindApi: A, ev: KeyboardEvent) {
  // console.log(ev.key)
  // console.log(processor)

  // Add to Count If Number
  if (/^\d$/.test(ev.key)) {
    processor.count = parseInt(processor.count.toString() + ev.key);
    return
  }
  const doAction = (action: Action<A, M> | undefined): boolean => {
    if (action !== undefined) {
      if (action instanceof Map) {
        processor.activeMap = action
      } else {
        for (let i = 0; i < Math.max(processor.count, 1); i++) {
          processor.set_activeMode((action as any)(bindApi) || processor.activeMode());
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

export const makeBinds = <A, M>(explanation: string
  , effect: (a: A) => void
  , binds: string[]
  , modes: M[] = ["Normal" as M]
  , prefix: string[] = []
): KeyBind<A, M>[] => {
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

export const makeChangeBinds = <A, M>(explanation: string
  , effect: (a: A) => M
  , binds: string[]
  , modes: M[] = ["Normal" as M]
  , prefix: string[] = []
): KeyBind<A, M>[] => {
  return modes.map((mode) => {
    return {
      mode: mode,
      prefix: prefix,
      binds: binds,
      explanation: explanation,
      effect: effect
    }
  })
}

type BindHelpProps<A, M> = {
  binds: [KeyBind<A, M>]
}

export const BindHelpPage = <A, M>(props: BindHelpProps<A, M>) => {

  return (
    <div >
      Hier könnte ihre Hilfe sein.
    </div>
  );
};
