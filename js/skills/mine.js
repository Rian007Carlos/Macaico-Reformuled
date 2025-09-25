export const mine = [
    {
        id: "mine-eficiency1",
        name: "Mine Efficiency I",
        description: "Aumenta a eficiência das minas em +1 por nível.",
        category: "mine",
        maxLevel: 5,
        unlockRequirements: [(player) => player.bananas >= 1000],
        baseCost: 500,
        getCost: (level) => Math.floor(500 * Math.pow(1.5, level)),
        effect: (player, level) => {
            player.mineEfficiency = (player.mineEfficiency || 1) + 0.1 * level;
        }
    },
    {
        id: "mine-eficiency2",
        name: "Mine Efficiency II",
        description: "Aumenta a produção das minas em +2 por nível.",
        category: "mine",
        maxLevel: 5,
        unlockRequirements: [(player) => player.getSkillById("mine-eficiency1")?.level >= 5],
        baseCost: 2000,
        getCost: (level) => Math.floor(2000 * Math.pow(1.7, level)),
        effect: (player, level) => {
            player.mineEfficiency = (player.mineEfficiency || 1) + 0.2 * level;
        }
    },
    {
        id: "mine-automation",
        name: "Mine Automation",
        description: "Automatiza a coleta de minas.",
        category: "mine",
        maxLevel: 5,
        unlockRequirements: [(player) => player.getSkillById("mine-eficiency2")?.level >= 5],
        baseCost: 5000,
        getCost: (level) => Math.floor(5000 * Math.pow(2, level)),
        effect: (player, level) => {
            player.mineAutoEnabled = true;
            player.mineAutoSpeed = Math.max(5 - level * 0.5, 0.5);
        }
    }
];
