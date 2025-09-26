export const bananas = [
    {
        id: "banana-boost1",
        name: "Banana Boost I",
        description: "Aumenta a produção de bananas em +1 por clique.",
        category: "banana",
        maxLevel: 5,
        unlockRequirements: [(player) => player.getSkillById("click-boost2")?.level >= 3],
        baseCost: 100,
        getCost: (level) => Math.floor(100 * Math.pow(1.5, level)),
        effect: (player, level) => {
            player.bananaMultiplier = (player.bananaMultiplier || 1) + level * 0.1;
        }
    },
    {
        id: "banana-boost2",
        name: "Banana Boost II",
        description: "Aumenta a produção de bananas em +2 por clique.",
        category: "banana",
        maxLevel: 5,
        unlockRequirements: [
            (player) => player.getSkillById("banana-boost1")?.level >= 5
        ],
        baseCost: 500,
        getCost: (level) => Math.floor(500 * Math.pow(1.8, level)),
        effect: (player, level) => {
            player.bananaMultiplier = (player.bananaMultiplier || 1) + 0.5 + level * 0.2;
        }
    },
    {
        id: "banana-boost3",
        name: "Banana Boost III",
        description: "Aumenta a produção de bananas em +5 por clique.",
        category: "banana",
        maxLevel: 5,
        unlockRequirements: [
            (player) => player.getSkillById("banana-boost2")?.level >= 5
        ],
        baseCost: 2000,
        getCost: (level) => Math.floor(2000 * Math.pow(2, level)),
        effect: (player, level) => {
            player.bananaMultiplier = (player.bananaMultiplier || 1) + 1 + level * 0.5;
        }
    },
    {
        id: "banana-evo1",
        name: "Banana Evolution I",
        description: "Evolui as bananas, aumentando sua eficiência.",
        category: "banana",
        maxLevel: 5,
        unlockRequirements: [
            (player) => player.getSkillById("banana-boost3")?.level >= 5
        ],
        baseCost: 5000,
        getCost: (level) => Math.floor(5000 * Math.pow(2, level)),
        effect: (player, level) => {
            player.bananaEfficiency = (player.bananaEfficiency || 1) + 0.5 * level;
        }
    },
    {
        id: "banana-evo2",
        name: "Banana Evolution II",
        description: "Evolui ainda mais as bananas, aumentando a produção por clique.",
        category: "banana",
        maxLevel: 5,
        unlockRequirements: [
            (player) => player.getSkillById("banana-evo1")?.level >= 5
        ],
        baseCost: 10000,
        getCost: (level) => Math.floor(10000 * Math.pow(2.2, level)),
        effect: (player, level) => {
            player.bananaEfficiency = (player.bananaEfficiency || 1) + 1 * level;
        }
    }
];
