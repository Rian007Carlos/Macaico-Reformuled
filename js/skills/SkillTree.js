import { SkillNode } from "./SkillNode.js";
import { Player } from "../player.js";

// Skill tree dinâmica

const skillTreeData = [
    {
        id: "bananaBoost1",
        name: "Banana Boost I",
        description: "Aumenta a produção de bananas em 10%",
        category: "bananas",
        maxLevel: 3,
        effect: (player, level) => {
            player.bananasPerSecond = player.bananasPerSecond * (1 + 0.1 * level);
        }
    },
    {
        id: "bananaBoost2",
        name: "Banana Boost II",
        description: "Aumenta a produção de bananas em +20%",
        category: "bananas",
        maxLevel: 2,
        unlockRequirements: [
            (player) => player.getSkillById("bananaBoost1")?.level >= 3
        ],
        effect: (player, level) => {
            player.bananasPerSecond = player.bananasPerSecond * (1 + 0.2 * level);
        }
    },
    {
        id: "mineEfficiency",
        name: "Mine Efficiency",
        description: "Aumenta produção da mina",
        category: "mine",
        maxLevel: 2,
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
    skillTreeData.forEach(data => {
        player.addSkillNode(new SkillNode(data));
    });
}
