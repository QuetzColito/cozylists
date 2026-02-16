import { createSignal, For, Match, onMount, Show, Switch, type Component } from "solid-js";
import "../styles/style.scss";
import "../styles/gw2.scss";
import Egg from "../shared/Egg";
import { buildProcessor, process } from "../shared/KeyBindProcessor";
import { binds, Gw2State } from "./Binds";
import { allEncounters, Encounter } from "./Encounter";

const App: Component = () => {
  const bindProcessor = buildProcessor(binds)

  const [selected, set_selected] = createSignal(0)
  const [filteredSelected, set_filteredSelected] = createSignal(0)
  const [stepping, set_stepping] = createSignal(false)

  const [encounters, set_encounters] = createSignal(allEncounters);
  const [filteredEncounters, set_filteredEncounters] = createSignal<Encounter[]>([]);
  const [rowLength, set_rowLength] = createSignal(1)

  const mod = (a: number, b: number) => (((a % b) + b) % b)
  const stepDown = (target: number) => {
    if (selected() < target) {
      set_selected((selected() + 1) % encounters().length);
      setTimeout(() => stepDown(target), 15)
    } else
      set_stepping(false)

  }
  const stepUp = (target: number) => {
    if (selected() > target) {
      set_selected(mod(selected() - 1, encounters().length));
      setTimeout(() => stepUp(target), 15)
    } else
      set_stepping(false)
  }
  const pick = () => {
    if (stepping())
      return
    const target = Math.floor(Math.random() * encounters().length)
    set_stepping(true)
    if (selected() < target)
      stepDown(target)
    else
      stepUp(target)
  }

  document.addEventListener("keydown", (e) => {
    process(bindProcessor, {
      rowLength: rowLength,
      selected: selected,
      set_selected: set_selected,
      filteredSelected: filteredSelected,
      set_filteredSelected: set_filteredSelected,
      encounters: encounters,
      set_encounters: set_encounters,
      filteredEncounters: filteredEncounters,
      set_filteredEncounters: set_filteredEncounters,
      pick: pick,
    }, e)
  });
  document.addEventListener("wheel", (e) => {
    if (e.deltaY > 0)
      set_selected((selected() + 1) % encounters().length);
    else
      set_selected(mod(selected() - 1, encounters().length));
  });

  const determineRowLength = () => {
    let base = document.getElementById("standby.0")?.offsetTop || 0
    for (let i = 1; i < filteredEncounters().length; i++) {
      if ((document.getElementById("standby." + i)?.offsetTop || base) > base) {
        set_rowLength(i);
        return;
      }
    }
  }

  const resizeObserver = new ResizeObserver(determineRowLength)
  onMount(() => {
    determineRowLength()
    resizeObserver.observe(document.getElementById('standby')!);
  })

  // background-image: linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url('../assets/${item[1]}');
  return (
    <>
      <div class="layout">
        <div class="standby-area" id="standby">
          <For each={filteredEncounters()}>
            {(encounter, index) => (
              <div
                class={(index() == filteredSelected() && bindProcessor.activeMode() == "Unfiltering" ? "selected" : "unselected") + " item"}
                id={"standby." + index()}
                style={`background-image: url('${encounter.bgUrl}'); `}
              >
                <div class="shadow">
                  {encounter.short}
                </div>
              </div>
            )}
          </For>

        </div>
        <ul class="encounters" style={`
            margin-top: calc(${-5.3 * selected() - 2.5 - (selected() > 1 ? 1 : 0)}rem + 50vh);
            height: calc(${+5.3 * selected() + 2.5 + (selected() > 1 ? 1 : 0)}rem + 50vh); `}
        >
          <For each={encounters()}>
            {(encounter, index) => (
              <li
                class={index() == selected() && bindProcessor.activeMode() == "Normal" ? "selected" : "unselected"}
                id={"encounter." + index()}
                style={`background-image: url('${encounter.bgUrl}'); `}
              >
                <div class="shadow">
                  {encounter.name}
                </div>
              </li>
            )}
          </For>
        </ul>
        <div />
      </div>
      <Egg />
    </>
  );
};

export default App;
