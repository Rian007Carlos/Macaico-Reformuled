import { SkillNode } from "./SkillNode.js";
import { upgradeMonkeys } from "../Monkey.js";

export function createMonkeySkillNodes(player) {
    upgradeMonkeys.forEach(monkey => {
        if (!monkey.unlocked) return;

        const node = new SkillNode({
            id: `skill_${monkey.name}`,
            name: `${monkey.name} Mastery`,
            description: `Aumenta a produção do ${monkey.name} em +1% por nível`,
            category: "monkeys",
            maxLevel: 100,
            targetMonkey: monkey,

            // custo polinomial baseado no nível do nó
            getCost: (level) => {
                const base = 25;
                const p = 2.2;
                const nextLevel = level + 1;
                return Math.floor(base * Math.pow(nextLevel, p));
            },

            effect: (player, level) => {
                monkey.multiplier = 1 + 0.01 * level;
            }
        });

        player.addSkillNode(node);
    });
}
