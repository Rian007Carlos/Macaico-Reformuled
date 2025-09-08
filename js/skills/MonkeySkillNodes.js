import { SkillNode } from "./SkillNode.js";
import { upgradeMonkeys } from "../Monkey.js";
import { formatNumber } from "../utils.js";

export function createMonkeySkillNodes(player) {
    upgradeMonkeys.forEach(monkey => {
        // if (!monkey.unlocked) return;

        const node = new SkillNode({
            id: `skill_${monkey.name}`,
            name: `${monkey.name} Mastery`,
            description: `Aumenta a produção do ${monkey.name} em +1%`,
            category: "monkeys",
            level: 0,
            maxLevel: 100,
            targetMonkey: monkey,
            baseCost: monkey.skillTreeBaseCost || 25,

            // custo polinomial baseado no nível do nó
            getCost: function (level) {
                const base = this.baseCost || 25;
                const nextLevel = level + 1;
                const thresholds = [
                    { level: 0, p: 1.2 },
                    { level: 11, p: 3.5 },
                    { level: 26, p: 4.2 },
                    { level: 51, p: 4.9 },
                    { level: 100, p: 10 }
                ];
                let currentThreshold = thresholds[0];
                let nextThreshold = thresholds[1];

                for (let i = 0; i < thresholds.length - 1; i++) {
                    if (level >= thresholds[i].level && level < thresholds[i + 1].level) {
                        currentThreshold = thresholds[i];
                        nextThreshold = thresholds[i + 1];
                    } else {
                        break;
                    }
                }

                const levelIsInRange = nextThreshold.level - currentThreshold.level;
                const levelProgress = level - currentThreshold.level;

                const p = currentThreshold.p + ((nextThreshold.p - currentThreshold.p) / levelIsInRange) * levelProgress;


                return Math.floor(base * Math.pow(nextLevel, p));
            },

            effect: (player, level) => {
                const monkeyObj = player.upgrades.find(m => m.name === monkey.name);

                if (!monkeyObj) return;

                monkeyObj.multiplier = 1 + 0.1 * level;
                player.recalculateBPS();

                if (player.uiManager) {
                    player.uiManager.updateMonkeyDescription(monkeyObj);
                    player.uiManager.updateAll(player);
                }
            }


        });

        player.addSkillNode(node);

    });
}
