export type Encounter = {
  name: string,
  short: string,
  bgUrl: string,
  type: EncounterType,
  expac: Expansion
}

type EncounterType = "Event" | "Raid" | "Strike"
type Expansion = "Core" | "HoT" | "PoF" | "IBS" | "EoD" | "SotO" | "JW" | "VoE"

const encounter = (short: string, name: string, bgUrl: string, type: EncounterType, expac: Expansion) => {
  return {
    name: name,
    short: short,
    bgUrl: bgUrl,
    type: type,
    expac: expac
  }
}

export const allEncounters: Encounter[] = [
  encounter("Adina", "Adina", "/assets/gw2/key_of_ahdashim.webp", "Raid", "PoF"),
  encounter("AH", "Aetherblade Hideout", "/assets/gw2/aetherblade_hideout.webp", "Strike", "EoD"),
  encounter("Bone", "Boneskinner", "/assets/gw2/raven_sanctum.webp", "Strike", "IBS"),
  encounter("Cairn", "Cairn", "/assets/gw2/bastion_of_the_penitent.webp", "Raid", "HoT"),
  encounter("CW", "Cold War", "/assets/gw2/cold_war.webp", "Strike", "IBS"),
  encounter("CA", "Conjured Amalgamate", "/assets/gw2/mythwright_gambit.webp", "Raid", "PoF"),
  encounter("CO", "Cosmic Observatory", "/assets/gw2/cosmic_observatory.webp", "Strike", "SotO"),
  encounter("Decima", "Decima", "/assets/gw2/mount_balrior.webp", "Raid", "JW"),
  encounter("Deimos", "Deimos", "/assets/gw2/bastion_of_the_penitent.webp", "Raid", "HoT"),
  encounter("Dhuum", "Dhuum", "/assets/gw2/hall_of_chains.webp", "Raid", "PoF"),
  encounter("Fraenir", "Fraenir of Jormag", "/assets/gw2/raven_sanctum.webp", "Strike", "IBS"),
  encounter("Gate", "Gates of Ahdashim", "/assets/gw2/key_of_ahdashim.webp", "Event", "PoF"),
  encounter("Gorse", "Gorseval", "/assets/gw2/spirit_vale.webp", "Raid", "HoT"),
  encounter("Greer", "Greer", "/assets/gw2/mount_balrior.webp", "Raid", "JW"),
  encounter("HT", "Harvest Temple", "/assets/gw2/harvest_temple.webp", "Strike", "EoD"),
  encounter("KO", "Kaineng Overlook", "/assets/gw2/kaineng_overlook.webp", "Strike", "EoD"),
  encounter("KC", "Keep Construct", "/assets/gw2/stronghold_of_the_faithful.webp", "Raid", "HoT"),
  encounter("Kela", "Kela", "/assets/gw2/guardians_glade.webp", "Strike", "VoE"),
  encounter("Matt", "Matthias Gabrel", "/assets/gw2/salvation_pass.webp", "Raid", "HoT"),
  encounter("MO", "Mursaat Overseer", "/assets/gw2/bastion_of_the_penitent.webp", "Raid", "HoT"),
  encounter("OLC", "Old Lion's Court", "/assets/gw2/old_lions_court.webp", "Strike", "Core"),
  encounter("Trio", "Prison Camp", "/assets/gw2/salvation_pass.webp", "Event", "HoT"),
  encounter("Q1", "Qadim", "/assets/gw2/mythwright_gambit.webp", "Raid", "PoF"),
  encounter("Q2", "Qadim the Peerless", "/assets/gw2/key_of_ahdashim.webp", "Raid", "PoF"),
  encounter("River", "River of Souls", "/assets/gw2/hall_of_chains.webp", "Event", "PoF"),
  encounter("Sab", "Sabetha", "/assets/gw2/spirit_vale.webp", "Raid", "HoT"),
  encounter("Sabir", "Sabir", "/assets/gw2/key_of_ahdashim.webp", "Raid", "PoF"),
  encounter("Sama", "Samarog", "/assets/gw2/bastion_of_the_penitent.webp", "Raid", "HoT"),
  encounter("Shiver", "Shiverpeaks Pass", "/assets/gw2/shiverpeaks_pass.webp", "Strike", "IBS"),
  encounter("Escort", "Siege the Stronghold", "/assets/gw2/stronghold_of_the_faithful.webp", "Event", "HoT"),
  encounter("Sloth", "Slothasor", "/assets/gw2/salvation_pass.webp", "Raid", "HoT"),
  encounter("SH", "Soulless Horror", "/assets/gw2/hall_of_chains.webp", "Raid", "PoF"),
  encounter("SW", "Spirit Woods", "/assets/gw2/spirit_vale.webp", "Event", "HoT"),
  encounter("Statues", "Statues of Grenth", "/assets/gw2/hall_of_chains.webp", "Event", "PoF"),
  encounter("ToF", "Temple of Febe", "/assets/gw2/temple_of_febe.webp", "Strike", "SotO"),
  encounter("TL", "Twin Largos", "/assets/gw2/mythwright_gambit.webp", "Raid", "PoF"),
  encounter("TC", "Twisted Castle", "/assets/gw2/stronghold_of_the_faithful.webp", "Event", "HoT"),
  encounter("Ura", "Ura", "/assets/gw2/mount_balrior.webp", "Raid", "JW"),
  encounter("VG", "Vale Guardian", "/assets/gw2/spirit_vale.webp", "Raid", "HoT"),
  encounter("Kodans", "Voice and Claw of the Fallen", "/assets/gw2/raven_sanctum.webp", "Strike", "IBS"),
  encounter("WoJ", "Whisper of Jormag", "/assets/gw2/whisper_of_jormag.webp", "Strike", "IBS"),
  encounter("Xera", "Xera", "/assets/gw2/stronghold_of_the_faithful.webp", "Raid", "HoT"),
  encounter("XJJ", "Xunlai Jade Junkyard", "/assets/gw2/xunlai_jade_junkyard.webp", "Strike", "EoD")
]
