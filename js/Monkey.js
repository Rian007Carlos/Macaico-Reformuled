import { UpgradeMonkey } from "./UpgradeMonkey.js";

export const upgradeMonkeys = [
    new UpgradeMonkey({
        id: "m1",
        name: "Macaco-prego",
        baseProduction: 5,
        unlockRequirements: [
            (player) => player.getSkillById("click-boost2")?.level >= 2
        ],
        costExponent: 1.4,
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
            (player) => player.getSkillById("click-boost3")?.level >= 5
        ],
        costExponent: 1.3,
        skillTreeBaseCost: 5000
    }),
    new UpgradeMonkey({
        id: "m4",
        name: "Sagui",
        baseProduction: 250,
        cost: 1000,
        unlockRequirements: [
            (player) => player.getSkillById("click-boost3")?.level >= 5
        ],
        costExponent: 1.35,
        skillTreeBaseCost: 25000
    }),
    new UpgradeMonkey({
        id: "m5",
        name: "Macaco-aranha",
        baseProduction: 500,
        cost: 5000,
        unlockRequirements: [
            (player) => player.getSkillById("click-boost2")?.level >= 10
        ],
        costExponent: 1.4,
        skillTreeBaseCost: 75000
    }),
    new UpgradeMonkey({
        id: "m6",
        name: "Babuíno",
        baseProduction: 1000,
        cost: 25000,
        unlockRequirements: [
            (player) => player.getSkillById("banana-boost1")?.level >= 5
        ],
        costExponent: 1.45,
        skillTreeBaseCost: 250000
    }),
    new UpgradeMonkey({
        id: "m7",
        name: "Mandril",
        baseProduction: 5000,
        cost: 100000,
        unlockRequirements: [
            (player) => player.getSkillById("banana-boost3")?.level >= 5
        ],
        costExponent: 1.5,
        skillTreeBaseCost: 420000
    }),
    new UpgradeMonkey({
        id: "m8",
        name: "Macaco-de-cheiro",
        baseProduction: 20000,
        cost: 500000,
        unlockRequirements: [
            (player) => player.getSkillById("banana-boost2")?.level >= 5
        ],
        costExponent: 1.55,
        skillTreeBaseCost: 810000
    }),
    new UpgradeMonkey({
        id: "m9",
        name: "Macaco-capuchinho",
        baseProduction: 100000,
        cost: 2500000,
        unlockRequirements: [
            (player) => player.getSkillById("banana-boost3")?.level >= 20
        ],
        costExponent: 1.6,
        skillTreeBaseCost: 1240000
    }),
    new UpgradeMonkey({
        id: "m10",
        name: "Macaco-da-noite",
        baseProduction: 500000,
        cost: 10000000,
        unlockRequirements: [
            (player) => player.getSkillById("banana-boost2")?.level >= 15
        ],
        costExponent: 1.65,
        skillTreeBaseCost: 2000000
    }),
    new UpgradeMonkey({
        id: "m11",
        name: "Macaco-rabo-de-espinho",
        baseProduction: 2000000,
        cost: 50000000,
        unlockRequirements: [
            (player) => player.getSkillById("mine-eficiency1")?.level >= 1
        ],
        costExponent: 1.7,
        skillTreeBaseCost: 5300000
    }),
    new UpgradeMonkey({
        id: "m12",
        name: "Macaco-uacari",
        baseProduction: 10000000,
        cost: 250000000,
        unlockRequirements: [
            (player) => player.getSkillById("mine-eficiency2")?.level >= 3
        ],
        costExponent: 1.75,
        skillTreeBaseCost: 12000000
    }),
    new UpgradeMonkey({
        id: "m13",
        name: "Macaco-barrigudo",
        baseProduction: 50000000,
        cost: 1000000000,
        unlockRequirements: [
            (player) => player.getSkillById("mine-automation")?.level >= 5
        ],
        costExponent: 1.8,
        skillTreeBaseCost: 75000000
    }),
    new UpgradeMonkey({
        id: "m14",
        name: "Macaco-fuliginoso",
        baseProduction: 200000000,
        cost: 5000000000,
        unlockRequirements: [
            (player) => player.getSkillById("mine-automation")?.level >= 8
        ],
        costExponent: 1.85,
        skillTreeBaseCost: 240000000
    }),
    new UpgradeMonkey({
        id: "m15",
        name: "Macaco-preto",
        baseProduction: 1000000000,
        cost: 25000000000,
        unlockRequirements: [
            (player) => player.getSkillById("mine-automation")?.level >= 10
        ],
        costExponent: 1.9,
        skillTreeBaseCost: 1000000000
    }),
];
