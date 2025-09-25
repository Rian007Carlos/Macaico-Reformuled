import { UpgradeMonkey } from "./UpgradeMonkey.js";

export const upgradeMonkeys = [
    new UpgradeMonkey({
        id: "mk1",
        name: "Macaco-prego",
        baseProduction: 5,
        cost: 10,
        unlockRequirements: [
            (player) => player.getSkillById("click-boost1")?.level >= 3
        ],
        costExponent: 1.4,
        skillTreeBaseCost: 100
    }),
    new UpgradeMonkey({
        id: "mk2",
        name: "Bugio",
        baseProduction: 50,
        cost: 50,
        unlockRequirements: [
            (player) => player.getSkillById("click-boost1")?.level >= 5 &&
                player.getMonkeyByName("Macaco-prego")?.level >= 5
        ],
        costExponent: 1.25,
        skillTreeBaseCost: 1000
    }),
    new UpgradeMonkey({
        id: "mk3",
        name: "Mico-leão-dourado",
        baseProduction: 100,
        cost: 200,
        unlockRequirements: [
            (player) => player.getSkillById("click-boost1")?.level >= 5 &&
                player.getMonkeyByName("Bugio")?.level >= 10
        ],
        costExponent: 1.3,
        skillTreeBaseCost: 5000
    }),
    new UpgradeMonkey({
        id: "mk4",
        name: "Sagui",
        baseProduction: 250,
        cost: 1_000,
        unlockRequirements: [
            (player) => player.getSkillById("click-boost2")?.level >= 5 &&
                player.getMonkeyByName("Mico-leão-dourado")?.level >= 10
        ],
        costExponent: 1.35,
        skillTreeBaseCost: 25_000
    }),
    new UpgradeMonkey({
        id: "mk5",
        name: "Macaco-aranha",
        baseProduction: 500,
        cost: 5_000,
        unlockRequirements: [
            (player) => player.getSkillById("click-boost2")?.level >= 10 &&
                player.getMonkeyByName("Sagui")?.level >= 10
        ],
        costExponent: 1.4,
        skillTreeBaseCost: 75_000
    }),
    new UpgradeMonkey({
        id: "mk6",
        name: "Babuíno",
        baseProduction: 1_000,
        cost: 25_000,
        unlockRequirements: [
            (player) => player.getSkillById("banana-boost1")?.level >= 5 &&
                player.getMonkeyByName("Macaco-aranha")?.level >= 10
        ],
        costExponent: 1.45,
        skillTreeBaseCost: 250_000
    }),
    new UpgradeMonkey({
        id: "mk7",
        name: "Mandril",
        baseProduction: 5_000,
        cost: 100_000,
        unlockRequirements: [
            (player) => player.getSkillById("banana-boost1")?.level >= 10 &&
                player.getMonkeyByName("Babuíno")?.level >= 10
        ],
        costExponent: 1.5,
        skillTreeBaseCost: 420_000
    }),
    new UpgradeMonkey({
        id: "mk8",
        name: "Macaco-de-cheiro",
        baseProduction: 20_000,
        cost: 500_000,
        unlockRequirements: [
            (player) => player.getSkillById("banana-boost2")?.level >= 5 &&
                player.getMonkeyByName("Mandril")?.level >= 10
        ],
        costExponent: 1.55,
        skillTreeBaseCost: 810_000
    }),
    new UpgradeMonkey({
        id: "mk9",
        name: "Macaco-capuchinho",
        baseProduction: 100_000,
        cost: 2_500_000,
        unlockRequirements: [
            (player) => player.getSkillById("banana-boost2")?.level >= 10 &&
                player.getMonkeyByName("Macaco-de-cheiro")?.level >= 10
        ],
        costExponent: 1.6,
        skillTreeBaseCost: 1_240_000
    }),
    new UpgradeMonkey({
        id: "mk10",
        name: "Macaco-da-noite",
        baseProduction: 500_000,
        cost: 10_000_000,
        unlockRequirements: [
            (player) => player.getSkillById("banana-boost2")?.level >= 15 &&
                player.getMonkeyByName("Macaco-capuchinho")?.level >= 10
        ],
        costExponent: 1.65,
        skillTreeBaseCost: 2_000_000
    }),
    new UpgradeMonkey({
        id: "mk11",
        name: "Macaco-rabo-de-espinho",
        baseProduction: 2_000_000,
        cost: 50_000_000,
        unlockRequirements: [
            (player) => player.getSkillById("mine-eficiency1")?.level >= 1 &&
                player.getMonkeyByName("Macaco-da-noite")?.level >= 25
        ],
        costExponent: 1.7,
        skillTreeBaseCost: 5_300_000
    }),
    new UpgradeMonkey({
        id: "mk12",
        name: "Macaco-uacari",
        baseProduction: 10_000_000,
        cost: 250_000_000,
        unlockRequirements: [
            (player) => player.getSkillById("mine-eficiency2")?.level >= 3 &&
                player.getMonkeyByName("Macaco-rabo-de-espinho")?.level >= 25
        ],
        costExponent: 1.75,
        skillTreeBaseCost: 12_000_000
    }),
    new UpgradeMonkey({
        id: "mk13",
        name: "Macaco-barrigudo",
        baseProduction: 50_000_000,
        cost: 1_000_000_000,
        unlockRequirements: [
            (player) => player.getSkillById("mine-automation")?.level >= 5 &&
                player.getMonkeyByName("Macaco-uacari")?.level >= 25
        ],
        costExponent: 1.8,
        skillTreeBaseCost: 75_000_000
    }),
    new UpgradeMonkey({
        id: "mk14",
        name: "Macaco-fuliginoso",
        baseProduction: 200_000_000,
        cost: 5_000_000_000,
        unlockRequirements: [
            (player) => player.getSkillById("mine-automation")?.level >= 8 &&
                player.getMonkeyByName("Macaco-barrigudo")?.level >= 25
        ],
        costExponent: 1.85,
        skillTreeBaseCost: 240_000_000
    }),
    new UpgradeMonkey({
        id: "mk15",
        name: "Macaco-preto",
        baseProduction: 1_000_000_000,
        cost: 25_000_000_000,
        unlockRequirements: [
            (player) => player.getSkillById("mine-automation")?.level >= 10 &&
                player.getMonkeyByName("Macaco-fuliginoso")?.level >= 25
        ],
        costExponent: 1.9,
        skillTreeBaseCost: 1_000_000_000
    }),
];
