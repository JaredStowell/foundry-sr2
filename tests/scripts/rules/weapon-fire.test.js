import { describe, expect, it } from "vitest";

import {
  sr2ApplyWeaponAttackProfileToDamage,
  sr2BuildWeaponAttackModifiers,
  sr2InferWeaponAccessoryState,
  sr2ParseWeaponModes,
  sr2ResolveWeaponAttackProfile,
} from "../../../scripts/rules/weapon-fire.js";

describe("weapon-fire rules", () => {
  it("parses weapon mode strings and resolves default profiles", () => {
    expect(sr2ParseWeaponModes("SS/SA/BF")).toEqual(["SS", "SA", "BF"]);
    expect(
      sr2ResolveWeaponAttackProfile({
        weaponModeString: "BF",
        requestedAttackType: "attack",
        ammoCurrent: 30,
      }),
    ).toMatchObject({
      modeUsed: "BF",
      ammoConsumed: 3,
      damagePowerBonus: 3,
      damageLevelBonus: 1,
    });
  });

  it("handles explicit full-auto and called-shot requests", () => {
    expect(
      sr2ResolveWeaponAttackProfile({
        weaponModeString: "FA",
        requestedAttackType: "fullauto-6",
        ammoCurrent: 20,
      }),
    ).toMatchObject({
      modeUsed: "FA",
      ammoConsumed: 6,
      roundsFiredThisPhase: 6,
      damagePowerBonus: 6,
      damageLevelBonus: 2,
    });

    expect(
      sr2ResolveWeaponAttackProfile({
        weaponModeString: "SS/SA",
        requestedAttackType: "called-shot-subtarget",
        ammoCurrent: 10,
      }),
    ).toMatchObject({
      calledShot: true,
      calledShotMode: "sub-target",
      calledShotAllowed: true,
    });

    expect(
      sr2ResolveWeaponAttackProfile({
        weaponModeString: "FA",
        requestedAttackType: "called-shot-damage",
        ammoCurrent: 10,
      }),
    ).toMatchObject({
      modeUsed: "FA",
      calledShot: false,
      calledShotAllowed: false,
    });
  });

  it("clamps ammo consumption when ammo is low and chooses sensible defaults", () => {
    expect(
      sr2ResolveWeaponAttackProfile({
        weaponModeString: "BF",
        requestedAttackType: "burst",
        ammoCurrent: 1,
      }),
    ).toMatchObject({
      modeUsed: "BF",
      ammoConsumed: 1,
      roundsFiredThisPhase: 3,
    });

    expect(
      sr2ResolveWeaponAttackProfile({
        weaponModeString: "FA/BF/SA",
        requestedAttackType: "attack",
        ammoCurrent: 30,
      }),
    ).toMatchObject({
      modeUsed: "SA",
    });
  });

  it("infers smartgun accessories and recoil compensation from current repo state", () => {
    const actor = {
      items: {
        filter(predicate) {
          return [
            { name: "Smartlink II", system: { installed: true } },
            { name: "Smart Goggles", system: { equipped: true } },
          ].filter(predicate);
        },
      },
    };
    const weapon = {
      name: "Ares Predator Smartlinked",
      system: {
        recoil: 2,
        mode: "SA",
        ammo: { current: 15 },
        rangeType: "pistol",
      },
    };

    expect(sr2InferWeaponAccessoryState(actor, weapon)).toEqual({
      accessoryModifier: -2,
      recoilCompensation: 2,
      weaponHasSmartgun: true,
      laserSight: false,
    });
  });

  it("infers embedded recoil compensation from weapon text when field is empty", () => {
    const actor = {
      items: {
        filter() {
          return [];
        },
      },
    };
    const weapon = {
      name: "Ares Alpha",
      system: {
        recoil: 0,
        description: "Factory setup includes Gas Vent (3), Smartlink II",
      },
    };

    expect(sr2InferWeaponAccessoryState(actor, weapon)).toMatchObject({
      recoilCompensation: 3,
      weaponHasSmartgun: true,
    });
  });

  it("builds attack modifiers and applies burst damage changes", () => {
    const actor = {
      items: {
        filter() {
          return [];
        },
      },
    };
    const weapon = {
      name: "Ingram Smartgun",
      system: {
        recoil: 1,
        mode: "BF",
        ammo: { current: 20 },
        rangeType: "smg",
      },
    };

    const modifiers = sr2BuildWeaponAttackModifiers({
      actor,
      weapon,
      requestedAttackType: "burst",
    });

    expect(modifiers.recoilModifier).toBe(2);
    expect(modifiers.accessoriesModifier).toBe(0);
    expect(modifiers.calledShotModifier).toBe(0);
    expect(
      sr2ApplyWeaponAttackProfileToDamage(
        { power: 8, level: "M", damageType: "physical" },
        modifiers.profile,
      ),
    ).toEqual({
      power: 11,
      level: "S",
      damageType: "physical",
    });
  });

  it("handles heavy-weapon recoil and null damage parsing safely", () => {
    const actor = {
      items: {
        filter() {
          return [];
        },
      },
    };
    const weapon = {
      name: "Defiance Shotgun",
      system: {
        recoil: 0,
        mode: "FA",
        ammo: { current: 20 },
        rangeType: "shotgun",
      },
    };

    const modifiers = sr2BuildWeaponAttackModifiers({
      actor,
      weapon,
      requestedAttackType: "fullauto-4",
    });

    expect(modifiers.recoilModifier).toBe(8);
    expect(sr2ApplyWeaponAttackProfileToDamage(null, modifiers.profile)).toBeNull();
  });
});
