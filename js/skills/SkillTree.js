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
            player.bananasPerSecond += player.bananasPerSecond * (1 + 0.02 * level);
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
}


