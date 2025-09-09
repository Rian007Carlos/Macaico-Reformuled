import { SkillNode } from "./SkillNode.js";
import { Player } from "../player.js";
import { upgradeMonkeys } from "../Monkey.js";
import { createMonkeySkillNodes } from "./MonkeySkillNodes.js";

// Skill tree dinâmica com coordenadas e pais
const skillTreeData = [
    {
        id: "bananaBoost1",
        name: "Banana Boost I",
        description: "Aumenta a produção de bananas em 10% por nível.",
        category: "bananas",
        maxLevel: 10,
        unlocked: true,
        parents: [],
        effect: (player, level) => {
            player.bananasPerSecond += player.bananasPerSecond * (1 + 0.01 * level);
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
            (player) => player.getSkillById("bananaBoost1")?.level >= 3
        ],
        effect: (player, level) => {
            player.bananasPerSecond *= 1 + 0.01 * level;
        }
    },
    {
        id: "clickBoost1",
        name: "Click Boost",
        description: "Valor do click aumentado em +1 por nível.",
        category: "click",
        maxLevel: 10,
        unlocked: false,
        parents: [],
        effect: (player, level) => {
            const increment = 1;
            player.clickValue += increment;
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
        effect: (player, level) => {
            const baseChance = 0.04; // 4% inicial
            player.critChance = baseChance + 0.01 * level; // +1% por nível
            if (player.critChance > 1) player.critChance = 1; // limite 100%
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
        effect: (player, level) => {
            const baseMultiplier = 2; // crítico inicial vale 2x
            player.critMultiplier = baseMultiplier + 0.1 * level;
        }
    },
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
        effect: (player, level) => {
            player.mine.multiplier += 0.5 * level;
        }
    },
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
        effect: (player, level) => {
            player.prismatics += 5;
        }
    }
];

// Criação automática
export function createSkillTree(player) {
    skillTreeData.forEach(skill => {
        const node = new SkillNode(skill);
        player.addSkillNode(node);
    });

    createMonkeySkillNodes(player);


    // garante categories atualizadas
    player.skillCategories = [...new Set((player.skills || []).map(s => s.category || 'default'))];

    // retorna para conveniência (evita chamadas duplicadas)
    return player.skills;
}


