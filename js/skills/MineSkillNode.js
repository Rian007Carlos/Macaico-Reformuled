import { SkillNode } from "./SkillNode.js";

export function createMineSkillNodes(player) {
    const mineSkills = [
        {
            id: "mineBoost1",
            name: "Mine Boost I",
            description: "Aumenta produção da mina em +50%",
            category: "mine",
            maxLevel: 3,
            parents: [],
            baseCost: 1000,
            effect: (player, level) => {
                player.mine.applySkillModifier({ type: "productionMultiplier", value: 1 + 0.5 * level });
            }
        },
        {
            id: "mineSpeed1",
            name: "Mine Speed I",
            description: "Reduz tempo de coleta da mina em 20%",
            category: "mine",
            maxLevel: 3,
            parents: ["mineBoost1"],
            baseCost: 1500,
            effect: (player, level) => {
                player.mine.applySkillModifier({ type: "reduceInterval", value: 0.8 ** level });
            }
        },
        {
            id: "mineAuto1",
            name: "Mine Automation",
            description: "Habilita coleta automática",
            category: "mine",
            maxLevel: 1,
            parents: ["mineSpeed1"],
            unlockRequirements: [
                (player) => player.getSkillById("mineAutomation")?.level >= 4
            ],
            baseCost: 5000,
            effect: (player, level) => {
                player.mine.applySkillModifier({ type: "autoCollect", value: true });
            }
        }
    ];

    mineSkills.forEach(skillData => {
        const node = new SkillNode(skillData);
        player.addSkillNode(node);
    });
}
