type Encounter = {
  name: string,
  bgUrl: string,
  type: EncounterType,
  expac: Expansion
}

type EncounterType = "Event" | "Raid" | "Strike"
type Expansion = "Core" | "HoT" | "PoF" | "IBS" | "EoD" | "SotO" | "JW" | "VoE"

const encounter = (name: string, bgUrl: string, type: EncounterType, expac: Expansion) => {
  return {
    name: name,
    bgUrl: bgUrl,
    type: type,
    expac: expac
  }
}

export const encounters: Encounter[] = [
  encounter("Adina", "/assets/gw2/key_of_ahdashim.webp", "Raid", "PoF"),
  encounter("Aetherblade Hideout", "/assets/gw2/aetherblade_hideout.webp", "Strike", "EoD"),
  encounter("Boneskinner", "/assets/gw2/raven_sanctum.webp", "Strike", "IBS"),
  encounter("Cairn", "/assets/gw2/bastion_of_the_penitent.webp", "Raid", "HoT"),
  encounter("Cold War", "/assets/gw2/cold_war.webp", "Strike", "IBS"),
  encounter("Conjured Amalgamate", "/assets/gw2/mythwright_gambit.webp", "Raid", "PoF"),
  encounter("Cosmic Observatory", "/assets/gw2/cosmic_observatory.webp", "Strike", "SotO"),
  encounter("Decima", "/assets/gw2/mount_balrior.webp", "Raid", "JW"),
  encounter("Deimos", "/assets/gw2/bastion_of_the_penitent.webp", "Raid", "HoT"),
  encounter("Dhuum", "/assets/gw2/hall_of_chains.webp", "Raid", "PoF"),
  encounter("Fraenir of Jormag", "/assets/gw2/raven_sanctum.webp", "Strike", "IBS"),
  encounter("Gates of Ahdashim", "/assets/gw2/key_of_ahdashim.webp", "Event", "PoF"),
  encounter("Gorseval", "/assets/gw2/spirit_vale.webp", "Raid", "HoT"),
  encounter("Greer", "/assets/gw2/mount_balrior.webp", "Raid", "JW"),
  encounter("Harvest Temple", "/assets/gw2/harvest_temple.webp", "Strike", "EoD"),
  encounter("Kaineng Overlook", "/assets/gw2/kaineng_overlook.webp", "Strike", "EoD"),
  encounter("Keep Construct", "/assets/gw2/stronghold_of_the_faithful.webp", "Raid", "HoT"),
  encounter("Kela", "/assets/gw2/guardians_glade.webp", "Strike", "VoE"),
  encounter("Matthias Gabrel", "/assets/gw2/salvation_pass.webp", "Raid", "HoT"),
  encounter("Mursaat Overseer", "/assets/gw2/bastion_of_the_penitent.webp", "Raid", "HoT"),
  encounter("Old Lion's Court", "/assets/gw2/old_lions_court.webp", "Strike", "Core"),
  encounter("Prison Camp", "/assets/gw2/salvation_pass.webp", "Event", "HoT"),
  encounter("Qadim", "/assets/gw2/mythwright_gambit.webp", "Raid", "PoF"),
  encounter("Qadim the Peerless", "/assets/gw2/key_of_ahdashim.webp", "Raid", "PoF"),
  encounter("River of Souls", "/assets/gw2/hall_of_chains.webp", "Event", "PoF"),
  encounter("Sabetha", "/assets/gw2/spirit_vale.webp", "Raid", "HoT"),
  encounter("Sabir", "/assets/gw2/key_of_ahdashim.webp", "Raid", "PoF"),
  encounter("Samarog", "/assets/gw2/bastion_of_the_penitent.webp", "Raid", "HoT"),
  encounter("Shiverpeaks Pass", "/assets/gw2/shiverpeaks_pass.webp", "Strike", "IBS"),
  encounter("Siege the Stronghold", "/assets/gw2/stronghold_of_the_faithful.webp", "Event", "HoT"),
  encounter("Slothasor", "/assets/gw2/salvation_pass.webp", "Raid", "HoT"),
  encounter("Soulless Horror", "/assets/gw2/hall_of_chains.webp", "Raid", "PoF"),
  encounter("Spirit Woods", "/assets/gw2/spirit_vale.webp", "Event", "HoT"),
  encounter("Statues of Grenth", "/assets/gw2/hall_of_chains.webp", "Event", "PoF"),
  encounter("Temple of Febe", "/assets/gw2/temple_of_febe.webp", "Strike", "SotO"),
  encounter("Twin Largos", "/assets/gw2/mythwright_gambit.webp", "Raid", "PoF"),
  encounter("Twisted Castle", "/assets/gw2/stronghold_of_the_faithful.webp", "Event", "HoT"),
  encounter("Ura", "/assets/gw2/mount_balrior.webp", "Raid", "JW"),
  encounter("Vale Guardian", "/assets/gw2/spirit_vale.webp", "Raid", "HoT"),
  encounter("Voice of the Fallen and Claw of the Fallen", "/assets/gw2/raven_sanctum.webp", "Strike", "IBS"),
  encounter("Whisper of Jormag", "/assets/gw2/whisper_of_jormag.webp", "Strike", "IBS"),
  encounter("Xera", "/assets/gw2/stronghold_of_the_faithful.webp", "Raid", "HoT"),
  encounter("Xunlai Jade Junkyard", "/assets/gw2/xunlai_jade_junkyard.webp", "Strike", "EoD")
]
