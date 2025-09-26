import { UpgradeMonkey } from "./UpgradeMonkey.js";

export const upgradeMonkeys = [
    new UpgradeMonkey({
        id: "m1",
        name: "Macaco-prego",
        baseProduction: 5,
        // cost: 10,
        unlockRequirements: [
            (player) => player.getSkillById("click-boost2")?.level >= 2
        ],
        costExponent: 1.4,
        // skillTreeBaseCost: 100
    }),
    new UpgradeMonkey({
        id: "m2",
        name: "Bugio",
        baseProduction: 50,
        cost: 50,
        unlockRequirements: [
            (player) => player.getSkillById("crit-chance-boost")?.level >= 1
        ],
        costExponent: 1.25,
        skillTreeBaseCost: 1000
    }),
    new UpgradeMonkey({
        id: "m3",
        name: "Mico-leão-dourado",
        baseProduction: 100,
        cost: 200,
        unlockRequirements: [
            (player) => player.getSkillById("click-boost2")?.level >= 5
        ],
        costExponent: 1.3,
        skillTreeBaseCost: 5000
    }),
    new UpgradeMonkey({
        id: "m4",
        name: "Sagui",
        baseProduction: 250,
        cost: 1_000,
        unlockRequirements: [
            (player) => player.getSkillById("click-boost2")?.level >= 5
        ],
        costExponent: 1.35,
        skillTreeBaseCost: 25_000
    }),
    new UpgradeMonkey({
        id: "m5",
        name: "Macaco-aranha",
        baseProduction: 500,
        cost: 5_000,
        unlockRequirements: [
            (player) => player.getSkillById("click-boost2")?.level >= 10
        ],
        costExponent: 1.4,
        skillTreeBaseCost: 75_000
    }),
    new UpgradeMonkey({
        id: "m6",
        name: "Babuíno",
        baseProduction: 1_000,
        cost: 25_000,
        unlockRequirements: [
            (player) => player.getSkillById("banana-boost1")?.level >= 5
        ],
        costExponent: 1.45,
        skillTreeBaseCost: 250_000
    }),
    new UpgradeMonkey({
        id: "m7",
        name: "Mandril",
        baseProduction: 5_000,
        cost: 100_000,
        unlockRequirements: [
            (player) => player.getSkillById("banana-boost1")?.level >= 10
        ],
        costExponent: 1.5,
        skillTreeBaseCost: 420_000
    }),
    new UpgradeMonkey({
        id: "m8",
        name: "Macaco-de-cheiro",
        baseProduction: 20_000,
        cost: 500_000,
        unlockRequirements: [
            (player) => player.getSkillById("banana-boost2")?.level >= 5
        ],
        costExponent: 1.55,
        skillTreeBaseCost: 810_000
    }),
    new UpgradeMonkey({
        id: "m9",
        name: "Macaco-capuchinho",
        baseProduction: 100_000,
        cost: 2_500_000,
        unlockRequirements: [
            (player) => player.getSkillById("banana-boost2")?.level >= 10
        ],
        costExponent: 1.6,
        skillTreeBaseCost: 1_240_000
    }),
    new UpgradeMonkey({
        id: "m10",
        name: "Macaco-da-noite",
        baseProduction: 500_000,
        cost: 10_000_000,
        unlockRequirements: [
            (player) => player.getSkillById("banana-boost2")?.level >= 15
        ],
        costExponent: 1.65,
        skillTreeBaseCost: 2_000_000
    }),
    new UpgradeMonkey({
        id: "m11",
        name: "Macaco-rabo-de-espinho",
        baseProduction: 2_000_000,
        cost: 50_000_000,
        unlockRequirements: [
            (player) => player.getSkillById("mine-eficiency1")?.level >= 1
        ],
        costExponent: 1.7,
        skillTreeBaseCost: 5_300_000
    }),
    new UpgradeMonkey({
        id: "m12",
        name: "Macaco-uacari",
        baseProduction: 10_000_000,
        cost: 250_000_000,
        unlockRequirements: [
            (player) => player.getSkillById("mine-eficiency2")?.level >= 3
        ],
        costExponent: 1.75,
        skillTreeBaseCost: 12_000_000
    }),
    new UpgradeMonkey({
        id: "m13",
        name: "Macaco-barrigudo",
        baseProduction: 50_000_000,
        cost: 1_000_000_000,
        unlockRequirements: [
            (player) => player.getSkillById("mine-automation")?.level >= 5
        ],
        costExponent: 1.8,
        skillTreeBaseCost: 75_000_000
    }),
    new UpgradeMonkey({
        id: "m14",
        name: "Macaco-fuliginoso",
        baseProduction: 200_000_000,
        cost: 5_000_000_000,
        unlockRequirements: [
            (player) => player.getSkillById("mine-automation")?.level >= 8
        ],
        costExponent: 1.85,
        skillTreeBaseCost: 240_000_000
    }),
    new UpgradeMonkey({
        id: "m15",
        name: "Macaco-preto",
        baseProduction: 1_000_000_000,
        cost: 25_000_000_000,
        unlockRequirements: [
            (player) => player.getSkillById("mine-automation")?.level >= 10
        ],
        costExponent: 1.9,
        skillTreeBaseCost: 1_000_000_000
    }),
];
