import { createSignal, Match, Show, Switch, type Component } from "solid-js";
import "../styles/style.scss";
import Egg from "../shared/Egg";

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

  const [encounter, set_encounter] = createSignal("")

  const pick = () => set_encounter(encounters[Math.floor(Math.random() * encounters.length)])

  return (
    <>
      <button on:click={pick}>Get an Encounter</button>
      <div> {encounter()} </div>
      <Egg />
    </>
  );
};

export default App;
