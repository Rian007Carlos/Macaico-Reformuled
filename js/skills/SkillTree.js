import { SkillNode } from "./SkillNode.js";
import { Player } from "../player.js";
import { upgradeMonkeys } from "../Monkey.js";
import { createMonkeySkillNodes } from "./MonkeySkillNodes.js";

// Skill tree dinâmica com coordenadas e pais
// Skill tree organizada por categorias
export const skillTreeData = {
    bananas: [
        {
            id: "bananaBoost1",
            name: "Banana Boost I",
            description: "Aumenta a produção de bananas em 10% por nível.",
            category: "bananas",
            maxLevel: 10,
            unlockRequirements: [
                (player) => player.bananas >= 1_000
            ],
            parents: [],
            baseCost: 1_500,
            getCost: (level) => Math.floor(100 * Math.pow(2.4, level)), // cresce 20% por nível
            effect: (player, level) => {
                const bonusPerLevel = 0.1;
                player.globalProductionMultiplier = 1 + level * bonusPerLevel;
                console.log(player.globalProductionMultiplier)
            }
        },
        {
            id: "bananaBoost2",
            name: "Banana Boost II",
            description: "Aumenta a produção de bananas em +20% por nível.",
            category: "bananas",
            maxLevel: 10,
            parents: ["bananaBoost1"],
            unlockRequirements: [
                (player) => player.getSkillById("bananaBoost1")?.level >= 10
            ],
            baseCost: 500,
            getCost: (level) => Math.floor(500 * Math.pow(3.1, level)),
            effect: (player, level) => {
                const bonus = 0.2;
                player.globalProductionMultiplier += bonus * level;
                console.log(player.globalProductionMultiplier)

            }
        }
    ],

    click: [
        {
            id: "clickBoost1",
            name: "Click Boost",
            description: "Valor do click aumentado em +1 por nível.",
            category: "click",
            maxLevel: 100,
            unlocked: false,
            parents: [],
            baseCost: 1_000,
            getCost: (level) => Math.floor(100 * Math.pow(1.8, level)), // aumenta 10% por nível
            effect: (player, level) => {
                const base = player.baseClickValue || 1;
                player.clickValue = base + level;
            }
        },
        {
            id: "critChanceBoost",
            name: "Critical Chance",
            description: "Aumenta a chance de crítico do click em 1% por nível.",
            category: "click",
            maxLevel: 50,
            unlocked: false,
            parents: [],
            baseCost: 2500,
            getCost: (level) => Math.floor(2500 * Math.pow(1.12, level)), // cresce 12% por nível
            effect: (player, level) => {
                const baseChance = 0.04; // 4% inicial
                player.critChance = baseChance + 0.01 * level;
                if (player.critChance > 1) player.critChance = 1;
            }
        },
        {
            id: "critMultiplierBoost",
            name: "Critical Multiplier",
            description: "Aumenta o multiplicador dos críticos em +0.1 por nível.",
            category: "click",
            maxLevel: 50,
            unlocked: false,
            parents: [],
            baseCost: 10000,
            getCost: (level) => Math.floor(10000 * Math.pow(1.15, level)),
            effect: (player, level) => {
                const baseMultiplier = 2;
                player.critMultiplier = baseMultiplier + 0.1 * level;
            }
        }
    ],

    mine: [
        {
            id: "mineEfficiency",
            name: "Mine Efficiency",
            description: "Aumenta produção da mina",
            category: "mine",
            maxLevel: 5,
            parents: ["bananaBoost1"],
            unlockRequirements: [
                (player) => player.getSkillById("bananaBoost1")?.level >= 2
            ],
            baseCost: 2000,
            getCost: (level) => Math.floor(2000 * Math.pow(1.25, level)),
            effect: (player, level) => {
                const base = player.mine?.baseMultiplier || 1;
                player.mine.multiplier = base + 0.5 * level;
            }
        }
    ],

    rare: [
        {
            id: "mysteryNode",
            name: "???",
            description: "???",
            category: "rare",
            maxLevel: 1,
            parents: ["bananaBoost2"],
            unlockRequirements: [
                (player) => player.getSkillById("bananaBoost2")?.level >= 2
            ],
            baseCost: 5000,
            getCost: (level) => 5000,
            effect: (player, level) => {
                player.prismatics += 5;
            }
        }
    ]
};


export function createSkillTree(player) {
    getAllSkills().forEach(skillData => {
        const node = new SkillNode(skillData);
        player.addSkillNode(node);
    });

    // cria nodes de monkeys se houver
    createMonkeySkillNodes(player);

    // garante categories atualizadas
    player.skillCategories = Object.keys(skillTreeData);

    return player.skills;
}

// Helper para "achatar" tudo em um único array
export function getAllSkills() {
    return Object.values(skillTreeData).flat();
}
