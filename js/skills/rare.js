export const rare = [
    {
        id: "prismaticReward1",
        name: "Mysterious Reward",
        description: "Receba 5 prismáticas como recompensa por desbloquear esta habilidade.",
        category: "rare",
        maxLevel: 1,
        parents: ["bananaBoost2"],
        unlockRequirements: [
            (player) => player.getSkillById("bananaBoost2")?.level >= 5
        ],
        baseCost: 5000,
        getCost: () => 5000,
        effect: (player, level) => {
            player.prismatics += 5;
        }
    },
    {
        id: "prismaticReward2",
        name: "Prismatic Booster",
        description: "Receba 10 prismáticas e multiplica efeitos das skills principais.",
        category: "rare",
        maxLevel: 1,
        parents: ["bananaEvo2"],
        unlockRequirements: [
            (player) => player.getSkillById("bananaEvo2")?.level >= 1
        ],
        baseCost: 5,
        getCost: () => 5,
        effect: (player, level) => {
            player.prismatics += 10;
            player.globalProductionMultiplier *= 1.2;
            player.clickValue += 5;
        }
    }
]