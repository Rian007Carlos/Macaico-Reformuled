export const click = [
    {
        id: "click-boost1",
        name: "Click Boost I",
        description: "Aumenta o valor de cada clique em +1.",
        category: "click",
        maxLevel: 5,
        unlockRequirements: [(player) => player.bananas >= 100],
        baseCost: 100,
        getCost: (level) => Math.floor(100 * Math.pow(1.5, level)),
        effect: (player, level) => {
            const base = player.baseClickValue || 1;
            player.clickValue = base + level;
        }
    },
    {
        id: "click-boost2",
        name: "Click Boost II",
        description: "Aumenta o valor do clique em +2.",
        category: "click",
        maxLevel: 5,
        unlockRequirements: [
            (player) => player.getSkillById("click-boost1")?.level >= 5
        ],
        baseCost: 500,
        getCost: (level) => Math.floor(500 * Math.pow(1.8, level)),
        effect: (player, level) => {
            const base = player.baseClickValue || 1;
            player.clickValue = base + 5 + level * 2;
        }
    },
    {
        id: "click-boost3",
        name: "Click Boost III",
        description: "Aumenta o valor do clique manual em +5 por nível.",
        category: "click",
        maxLevel: 5,
        unlockRequirements: [
            (player) => player.getSkillById("click-boost2")?.level >= 5
        ],
        baseCost: 5000,
        getCost: (level) => Math.floor(5000 * Math.pow(2, level)),
        effect: (player, level) => {
            const base = player.baseClickValue || 1;
            player.clickValue = base + 10 + level * 5;
        }
    },
    {
        id: "crit-chance-boost",
        name: "Critical Chance",
        description: "Aumenta a chance de acerto crítico em 1% por nível.",
        category: "click",
        maxLevel: 10,
        unlockRequirements: [(player) => player.bananas >= 2000],
        baseCost: 250,
        getCost: (level) => Math.floor(250 * Math.pow(1.12, level)),
        effect: (player, level) => {
            const baseChance = 0.04;
            player.critChance = Math.min(baseChance + 0.01 * level, 1);
        }
    },
    {
        id: "crit-multiplier-boost",
        name: "Critical Multiplier",
        description: "Aumenta o multiplicador de críticos em +0.1 por nível.",
        category: "click",
        maxLevel: 10,
        unlockRequirements: [
            (player) => player.getSkillById("crit-chance-boost")?.level >= 5
        ],
        baseCost: 1000,
        getCost: (level) => Math.floor(1000 * Math.pow(1.15, level)),
        effect: (player, level) => {
            player.critMultiplier = 2 + 0.1 * level;
        }
    },
    {
        id: "auto-click1",
        name: "Auto Click I",
        description: "Habilita clique automático lento. Reduz o tempo com upgrades posteriores.",
        category: "click",
        maxLevel: 5,
        unlockRequirements: [
            (player) => player.getSkillById("click-boost1")?.level >= 3
        ],
        baseCost: 1000,
        getCost: (level) => Math.floor(1000 * Math.pow(2, level)),
        effect: (player, level) => {
            player.autoClickEnabled = true;
            player.autoClickSpeed = Math.max(5 - level * 0.8, 0.5);
            player.autoClickMultiplier = 1 + 0.1 * level;
            const newClicker = {
                angle: Math.random() * 360,
                direction: Math.random() > 0.5 ? 1 : -1,
                speed: 0.5 + Math.random() * 0.5,
                id: `autoClicker_${Date.now()}`,
                element: null
            };
            const el = document.createElement("div");
            el.classList.add("auto-click");
            document.getElementById("banana-container").appendChild(el);
            newClicker.element = el;
            player.autoClickers.push(newClicker);
            if (!player.autoClickIntervalID) player.startAutoClick();
        }
    },
    {
        id: "auto-click2",
        name: "Auto Click II",
        description: "Clique automático mais rápido. Reduz o tempo base e aumenta eficiência.",
        category: "click",
        maxLevel: 5,
        unlockRequirements: [
            (player) => player.getSkillById("auto-click1")?.level >= 5
        ],
        baseCost: 2000,
        getCost: (level) => Math.floor(2000 * Math.pow(1.8, level)),
        effect: (player, level) => {
            player.autoClickSpeed = Math.max(3 - level * 0.4, 0.2);
            player.autoClickMultiplier = 1 + 0.1 * level;
        }
    },
    {
        id: "auto-click-chance",
        name: "Auto Click Chance",
        description: "Aumenta a chance de crit do auto click em 10%.",
        category: "click",
        maxLevel: 5,
        unlockRequirements: [
            (player) => player.getSkillById("auto-click2")?.level >= 3
        ],
        baseCost: 5000,
        getCost: (level) => 5000 * Math.pow(2, level),
        effect: (player, level) => {
            player.autoClickCritChance = 0.1 * level;
            player.startAutoClick();
        }
    },
    {
        id: "auto-click-crit",
        name: "Auto Click Crit",
        description: "Aumenta o multiplicador crit do auto click.",
        category: "click",
        maxLevel: 5,
        unlockRequirements: [
            (player) => player.getSkillById("auto-click2")?.level >= 3
        ],
        baseCost: 5000,
        getCost: (level) => 5000 * Math.pow(2, level),
        effect: (player, level) => {
            player.autoClickCritMultiplier = 1.5 + 0.1 * level;
            player.startAutoClick();
        }
    },
    {
        id: "hold-click1",
        name: "Hold Click I",
        description: "Segurando o botão você gera bananas automaticamente.",
        category: "click",
        maxLevel: 5,
        unlockRequirements: [
            (player) => player.getSkillById("auto-click2")?.level >= 5
        ],
        baseCost: 10000,
        getCost: (level) => 10000 * Math.pow(1.8, level),
        effect: (player, level) => {
            player.holdClickEnabled = true;
            player.holdClickMultiplier = 0.5 + 0.1 * level;
            player.startHoldClick();
        }
    }
];
