import {
  sr2GetAccessoryModifier,
  sr2ComputeRecoilModifier,
  sr2GetCalledShotTargetNumberModifier,
} from "./attack-modifiers.js";
import { sr2StageDamageLevel } from "./combat-resolution.js";

function sr2NormalizeRequestedAttackType(requestedAttackType) {
  return String(requestedAttackType || "attack")
    .trim()
    .toLowerCase();
}

function sr2GetWeaponText(weapon) {
  return [weapon?.name, weapon?.system?.description, weapon?.system?.notes, weapon?.system?.mods]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

// SR2 weapons may support multiple fire modes; this normalizes slash-separated mode strings into a unique list.
export function sr2ParseWeaponModes(modeString) {
  const modes = String(modeString || "SS")
    .toUpperCase()
    .split(/[\/,\s]+/)
    .map((mode) => mode.trim())
    .filter(Boolean);

  return Array.from(new Set(modes.length > 0 ? modes : ["SS"]));
}

function sr2PickDefaultMode(modes) {
  for (const preferred of ["SS", "SA", "BF", "FA"]) {
    if (modes.includes(preferred)) return preferred;
  }
  return modes[0] || "SS";
}

// SR2 attack declarations pick a concrete firing profile: ammo spent, recoil, and damage bonuses depend on the chosen mode.
export function sr2ResolveWeaponAttackProfile({
  weaponModeString = "SS",
  requestedAttackType = "attack",
  ammoCurrent = 0,
} = {}) {
  const modes = sr2ParseWeaponModes(weaponModeString);
  const requested = sr2NormalizeRequestedAttackType(requestedAttackType);
  let modeUsed = sr2PickDefaultMode(modes);
  let ammoConsumed = 1;
  let shotsThisPhase = 1;
  let burstsThisPhase = 0;
  let roundsFiredThisPhase = 1;
  let damagePowerBonus = 0;
  let damageLevelBonus = 0;
  let calledShot = false;
  let calledShotMode = "damage";

  if (requested.startsWith("called-shot")) {
    calledShot = true;
    if (requested.includes("subtarget")) calledShotMode = "sub-target";
  }

  if (requested.includes("fullauto") && modes.includes("FA")) {
    modeUsed = "FA";
    const explicitRounds = Number.parseInt(requested.replace(/[^0-9]/g, ""), 10);
    ammoConsumed = Math.max(3, Number.isFinite(explicitRounds) ? explicitRounds : 3);
    roundsFiredThisPhase = ammoConsumed;
    damagePowerBonus = ammoConsumed;
    damageLevelBonus = Math.floor(ammoConsumed / 3);
  } else if (
    (requested.includes("burst") || requested === "bf") &&
    (modes.includes("BF") || modes.includes("FA"))
  ) {
    modeUsed = modes.includes("BF") ? "BF" : "FA";
    const shortBurst = requested.includes("short");
    ammoConsumed = shortBurst ? 2 : 3;
    burstsThisPhase = 1;
    roundsFiredThisPhase = ammoConsumed;
    damagePowerBonus = ammoConsumed;
    damageLevelBonus = shortBurst ? 0 : 1;
  } else if (requested.includes("semi") && modes.includes("SA")) {
    modeUsed = "SA";
    shotsThisPhase = requested.includes("second") || requested.includes("double") ? 2 : 1;
    ammoConsumed = 1;
    roundsFiredThisPhase = shotsThisPhase;
  } else if (requested.includes("single") && modes.includes("SS")) {
    modeUsed = "SS";
  } else if (modeUsed === "BF") {
    ammoConsumed = 3;
    burstsThisPhase = 1;
    roundsFiredThisPhase = 3;
    damagePowerBonus = 3;
    damageLevelBonus = 1;
  } else if (modeUsed === "FA") {
    ammoConsumed = 3;
    roundsFiredThisPhase = 3;
    damagePowerBonus = 3;
    damageLevelBonus = 1;
  } else if (modeUsed === "SA") {
    roundsFiredThisPhase = 1;
  }

  ammoConsumed = Math.max(
    1,
    Math.min(Math.max(0, Number(ammoCurrent) || 0) || ammoConsumed, ammoConsumed),
  );
  const calledShotAllowed = modeUsed !== "FA";

  return {
    requestedAttackType: requested,
    modeUsed,
    availableModes: modes,
    ammoConsumed,
    shotsThisPhase,
    burstsThisPhase,
    roundsFiredThisPhase,
    damagePowerBonus,
    damageLevelBonus,
    calledShot: calledShot && calledShotAllowed,
    calledShotMode,
    calledShotAllowed,
  };
}

function sr2ParseEmbeddedRecoilBonus(text) {
  const match = String(text || "").match(
    /(?:gas vent|recoil compensation|gyro mount|shock pads)\s*\((\d+)\)/i,
  );
  return match ? Math.max(0, Number.parseInt(match[1], 10) || 0) : 0;
}

// SR2 accessory automation uses the structured fields that exist plus cautious name-based inference for smartgun gear.
export function sr2InferWeaponAccessoryState(actor, weapon) {
  const equippedItems =
    actor?.items?.filter?.((item) => item.system?.equipped || item.system?.installed) || [];
  const equippedNames = equippedItems.map((item) => String(item.name || "").toLowerCase());
  const weaponText = sr2GetWeaponText(weapon);
  const actorHasSmartlink = equippedNames.some((name) => name.includes("smartlink"));
  const actorHasSmartGoggles = equippedNames.some((name) => name.includes("smart goggles"));
  const weaponHasSmartgun = /smartlink|smartlinked|smartscope/.test(weaponText);
  const laserSight = /laser sight/.test(weaponText);
  const recoilCompensation =
    Math.max(0, Number(weapon?.system?.recoil) || 0) || sr2ParseEmbeddedRecoilBonus(weaponText);

  return {
    accessoryModifier: sr2GetAccessoryModifier({
      smartlink: actorHasSmartlink && weaponHasSmartgun,
      smartGoggles: actorHasSmartGoggles && weaponHasSmartgun,
      laserSight,
    }),
    recoilCompensation,
    weaponHasSmartgun,
    laserSight,
  };
}

// SR2 firing profiles automatically produce recoil and called-shot TN modifiers from the declared mode and linked gear.
export function sr2BuildWeaponAttackModifiers({
  actor,
  weapon,
  requestedAttackType = "attack",
} = {}) {
  const profile = sr2ResolveWeaponAttackProfile({
    weaponModeString: weapon?.system?.mode,
    requestedAttackType,
    ammoCurrent: weapon?.system?.ammo?.current,
  });
  const accessoryState = sr2InferWeaponAccessoryState(actor, weapon);
  const heavyWeapon =
    /MMG|HMG|shotgun/i.test(String(weapon?.system?.rangeType || "")) ||
    /shotgun/i.test(String(weapon?.name || ""));

  return {
    profile,
    accessoryState,
    recoilModifier: sr2ComputeRecoilModifier({
      fireMode: profile.modeUsed,
      shotsThisPhase: profile.shotsThisPhase,
      burstsThisPhase: profile.burstsThisPhase,
      roundsFiredThisPhase: profile.roundsFiredThisPhase,
      recoilCompensation: accessoryState.recoilCompensation,
      heavyWeapon,
    }),
    accessoriesModifier: accessoryState.accessoryModifier,
    calledShotModifier: sr2GetCalledShotTargetNumberModifier(profile.calledShot),
  };
}

// SR2 burst and full-auto attacks change both Power and Damage Level before resistance.
export function sr2ApplyWeaponAttackProfileToDamage(parsedDamage, profile) {
  if (!parsedDamage) return null;

  const power = Math.max(
    0,
    (Number(parsedDamage.power) || 0) + (Number(profile?.damagePowerBonus) || 0),
  );
  const level =
    sr2StageDamageLevel(parsedDamage.level, Number(profile?.damageLevelBonus) || 0) ||
    parsedDamage.level;

  return {
    ...parsedDamage,
    power,
    level,
  };
}
