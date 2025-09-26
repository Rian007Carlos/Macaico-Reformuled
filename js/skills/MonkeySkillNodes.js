import { SkillNode } from "./SkillNode.js";
import { upgradeMonkeys } from "../Monkey.js";
import { UIUpdateType } from "../uiManager.js";

export function createMonkeySkillNodes(player) {
    upgradeMonkeys.forEach(monkey => {
        const node = new SkillNode({
            id: monkey.id,
            name: `${monkey.name} Mastery`,
            description: `Aumenta a produção do ${monkey.name} em +10% por nível.`,
            category: "monkey",
            isMonkey: true,
            level: monkey.level || 0,
            maxLevel: 10,
            targetMonkey: monkey,
            baseCost: monkey.skillTreeBaseCost || 25,
            unlockRequirements: Array.isArray(monkey.unlockRequirements) ? monkey.unlockRequirements : [],
            effect: (player, level) => {
                monkey.multiplier = 1 + 0.1 * level;
                player.recalculateBPS();

                if (player.uiManager) {
                    player.uiManager.queueUIUpdate(UIUpdateType.MONKEY);
                    player.uiManager.queueUIUpdate(UIUpdateType.BANANA);
                }
            }
        });

        // vincula o node ao monkey
        monkey.skillNode = node;
        // inicializa o custo do monkey e a função de cálculo do próximo custo
        monkey.cost = node.baseCost;
        monkey.getNextCost = (level = node.level) => Math.floor(node.baseCost * Math.pow(1.45, level));
        node.getNextCost = () => monkey.getNextCost(node.level);


        // adiciona o node ao player
        player.addSkillNode(node);
    });
}

// checa e aplica unlocks de todos os monkeys via seus nodes
export function checkMonkeyUnlocks(player) {
    player.upgrades.forEach(monkey => {
        const node = monkey.skillNode;
        if (node && !monkey.unlocked && node.canUnlock(player)) {
            node.unlock(player);
        }
    });
}
