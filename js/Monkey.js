import { UpgradeMonkey } from "./UpgradeMonkey.js";

export const upgradeMonkeys = [
    new UpgradeMonkey({
        name: "Macaco-prego",
        cost: 10,
        baseProduction: 1,
        unlockAt: { bananas: 10 },

        costExponent: 1.2
    }),
    new UpgradeMonkey({
        name: "Bugio",
        cost: 50,
        baseProduction: 5,
        unlockAt: { monkey: { name: "Macaco-prego", level: 10 } },
        costExponent: 1.25,
        skillTreeBaseCost: 1000
    }),
    new UpgradeMonkey({
        name: "Mico-leão-dourado",
        cost: 200,
        baseProduction: 20,
        unlockAt: { monkey: { name: "Bugio", level: 10 } },
        unlocksFeature: "laboratory", // desbloqueia laboratório
        costExponent: 1.3,
        skillTreeBaseCost: 100000
    }),
    new UpgradeMonkey({
        name: "Sagui",
        cost: 1000,
        baseProduction: 50,
        unlockAt: { monkey: { name: "Mico-leão-dourado", level: 10 } },
        unlocksFeature: "mine",   // desbloqueia a mina
        costExponent: 1.35,
        skillTreeBaseCost: 1000000
    }),
    new UpgradeMonkey({
        name: "Macaco-aranha",
        cost: 5000,
        baseProduction: 200,
        unlockAt: { monkey: { name: "Sagui", level: 10 } },
        costExponent: 1.4,
        skillTreeBaseCost: 10000000
    }),
    new UpgradeMonkey({
        name: "Babuíno",
        cost: 25000,
        baseProduction: 1000,
        unlockAt: { monkey: { name: "Macaco-aranha", level: 10 } },
        costExponent: 1.45,
        skillTreeBaseCost: 50000000
    }),
    new UpgradeMonkey({
        name: "Mandril",
        cost: 100000,
        baseProduction: 5000,
        unlockAt: { monkey: { name: "Babuíno", level: 10 } },
        costExponent: 1.5,
        skillTreeBaseCost: 500000000
    }),
    new UpgradeMonkey({
        name: "Macaco-de-cheiro",
        cost: 500000,
        baseProduction: 20000,
        unlockAt: { monkey: { name: "Mandril", level: 10 } },
        costExponent: 1.55,
        skillTreeBaseCost: 1000000000
    }),
    new UpgradeMonkey({
        name: "Macaco-capuchinho",
        cost: 2_500_000,
        baseProduction: 100_000,
        unlockAt: { monkey: { name: "Macaco-de-cheiro", level: 10 } },
        costExponent: 1.6,
        skillTreeBaseCost: 1500000000
    }),
    new UpgradeMonkey({
        name: "Macaco-da-noite",
        cost: 10_000_000,
        baseProduction: 500_000,
        unlockAt: { monkey: { name: "Macaco-capuchinho", level: 10 } },
        costExponent: 1.65,
        skillTreeBaseCost: 2000000000
    }),
    new UpgradeMonkey({
        name: "Macaco-rabo-de-espinho",
        cost: 50_000_000,
        baseProduction: 2_000_000,
        unlockAt: { monkey: { name: "Macaco-da-noite", level: 25 } },
        costExponent: 1.7,
        skillTreeBaseCost: 10000000000
    }),
    new UpgradeMonkey({
        name: "Macaco-uacari",
        cost: 250_000_000,
        baseProduction: 10_000_000,
        unlockAt: { monkey: { name: "Macaco-rabo-de-espinho", level: 25 } },
        costExponent: 1.75,
        skillTreeBaseCost: 25000000000
    }),
    new UpgradeMonkey({
        name: "Macaco-barrigudo",
        cost: 1_000_000_000,
        baseProduction: 50_000_000,
        unlockAt: { monkey: { name: "Macaco-uacari", level: 25 } },
        costExponent: 1.8,
        skillTreeBaseCost: 50000000000
    }),
    new UpgradeMonkey({
        name: "Macaco-fuliginoso",
        cost: 5_000_000_000,
        baseProduction: 200_000_000,
        unlockAt: { monkey: { name: "Macaco-barrigudo", level: 25 } },
        costExponent: 1.85,
        skillTreeBaseCost: 75000000000
    }),
    new UpgradeMonkey({
        name: "Macaco-preto",
        cost: 25_000_000_000,
        baseProduction: 1_000_000_000,
        unlockAt: { monkey: { name: "Macaco-fuliginoso", level: 25 } },
        unlocksFeature: "forge",  // desbloqueia forge
        costExponent: 1.9,
        skillTreeBaseCost: 100000000000
    }),
];
