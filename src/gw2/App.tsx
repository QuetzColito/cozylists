import { createSignal, For, Match, Show, Switch, type Component } from "solid-js";
import "../styles/style.scss";
import "../styles/gw2.scss";
import Egg from "../shared/Egg";
import { buildProcessor, process } from "../shared/KeyBindProcessor";
import { binds } from "./Binds";

const App: Component = () => {
  const encounters = [
    "Adina",
    "Aetherblade Hideout",
    "Boneskinner",
    "Cairn",
    "Cold War",
    "Conjured Amalgamate",
    "Cosmic Observatory",
    "Decima",
    "Deimos",
    "Dhuum",
    "Fraenir of Jormag",
    "Gates of Ahdashim",
    "Gorseval",
    "Greer",
    "Harvest Temple",
    "Kaineng Overlook",
    "Keep Construct",
    "Kela",
    "Matthias Gabrel",
    "Mursaat Overseer",
    "Old Lion's Court",
    "Prison Camp",
    "Qadim",
    "Qadim the Peerless",
    "River of Souls",
    "Sabetha",
    "Sabir",
    "Samarog",
    "Shiverpeaks Pass",
    "Siege the Stronghold",
    "Slothasor",
    "Soulless Horror",
    "Statues of Grenth",
    "Temple of Febe",
    "Twin Largos",
    "Twisted Castle",
    "Ura",
    "Vale Guardian",
    "Voice of the Fallen and Claw of the Fallen",
    "Whisper of Jormag",
    "Xera",
    "Xunlai Jade Junkyard",
  ]

  const [selected, set_selected] = createSignal(0)
  const [stepping, set_stepping] = createSignal(false)

  const down = () => set_selected((selected() + 1) % encounters.length);
  const up = () => set_selected((((selected() - 1) % encounters.length) + encounters.length) % encounters.length);
  const stepDown = (target: number) => {
    if (selected() < target) {
      down()
      setTimeout(() => stepDown(target), 15)
    } else
      set_stepping(false)

  }
  const stepUp = (target: number) => {
    if (selected() > target) {
      up()
      setTimeout(() => stepUp(target), 15)
    } else
      set_stepping(false)
  }
  const pick = () => {
    if (stepping())
      return
    const target = Math.floor(Math.random() * encounters.length)
    set_stepping(true)
    if (selected() < target)
      stepDown(target)
    else
      stepUp(target)
  }

  const bindProcessor = buildProcessor(binds)

  document.addEventListener("keydown", (e) => {
    process(bindProcessor, { up: up, down: down, pick: pick }, e)
  });
  document.addEventListener("wheel", (e) => {
    if (e.deltaY > 0)
      down()
    else
      up()
  });

  // background-image: linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url('../assets/${item[1]}');
  return (
    <>
      <ul class="gw2" style={`

margin-top: calc(${-5.3 * selected() - 2.5 - (selected() > 1 ? 1 : 0)}rem + 50vh);
height: calc(${+5.3 * selected() + 2.5 + (selected() > 1 ? 1 : 0)}rem + 50vh);
`}>
        <For each={encounters}>
          {(encounter, index) => (
            <li class={index() == selected() ? "selected" : "unselected"} id={index() + ""}> {encounter} </li>
          )}
        </For>
      </ul>
      <Egg />
    </>
  );
};

export default App;
