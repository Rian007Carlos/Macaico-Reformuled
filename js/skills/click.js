export const click = [
    {
        id: "click-boost1",
        name: "Click Boost I",
        description: "Aumenta o valor de cada clique em +1, +2, +3... até 100.",
        category: "click",
        maxLevel: 100,
        unlockRequirements: [(player) => player.bananas >= 10],
        baseCost: 100,
        getCost: (level) => Math.floor(100 * Math.pow(1.2, level)), // curva mais suave para 100 níveis
        effect: (player, level) => {
            // Soma aritmética: 1 + 2 + ... + level = level*(level+1)/2
            const boost = (level * (level + 1)) / 2;
            player.clickBoost1 = boost;
            player.updateClickValue();
        }
    },
    {
        id: "click-boost2",
        name: "Click Boost II",
        description: "Aumenta o valor de clique em múltiplos de 5 (+5, +10, +15...).",
        category: "click",
        maxLevel: 50,
        unlockRequirements: [
            (player) => player.getSkillById("click-boost1")?.level >= 20
        ],
        baseCost: 500,
        getCost: (level) => Math.floor(500 * Math.pow(1.4, level)),
        effect: (player, level) => {
            // Soma aritmética em múltiplos de 5: 5*(1+2+...+level) = 5 * level*(level+1)/2
            const boost = 5 * (level * (level + 1)) / 2;
            player.clickBoost2 = boost;
            player.updateClickValue();
        }
    },
    {
        id: "click-boost3",
        name: "Click Boost III",
        description: "Aumenta o valor do clique em múltiplos de 10 (+10, +20, +30...).",
        category: "click",
        maxLevel: 25,
        unlockRequirements: [
            (player) => player.getSkillById("click-boost2")?.level >= 25
        ],
        baseCost: 5000,
        getCost: (level) => Math.floor(5000 * Math.pow(1.6, level)),
        effect: (player, level) => {
            const boost = 10 * (level * (level + 1)) / 2;
            player.clickBoost3 = boost;
            player.updateClickValue();
        }
    },
    {
        id: "click-evo",
        name: "Click Evolution",
        description: "Evolui todos os boosts de clique em um multiplicador poderoso.",
        category: "click",
        maxLevel: 10,
        unlockRequirements: [
            (player) => player.getSkillById("click-boost3")?.level >= 10
        ],
        baseCost: 50, // mas esse vai custar prismatics
        getCost: (level) => (level + 1) * 5, // exemplo: 5,10,15 prismatics
        effect: (player, level) => {
            // Soma todos os boosts
            const totalBoost = (player.clickBoost1 || 0) +
                (player.clickBoost2 || 0) +
                (player.clickBoost3 || 0);

            // Multiplicador progressivo
            const multiplier = 1 + 0.2 * level; // exemplo: 1.2x, 1.4x, até 3x
            player.clickEvolution = totalBoost * multiplier;

            player.updateClickValue();
        }
    },
    {
        id: "crit-chance-boost",
        name: "Critical Chance",
        description: "Aumenta a chance de acerto crítico em 1% por nível.",
        category: "click",
        maxLevel: 10,
        unlockRequirements: [
            (player) => player.getSkillById("click-boost2")?.level >= 5
        ],
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
        description: "Aumenta o multiplicador de críticos em 50% por nível.",
        category: "click",
        maxLevel: 10,
        unlockRequirements: [
            (player) => player.getSkillById("click-boost2")?.level >= 5
        ],
        baseCost: 1000,
        getCost: (level) => Math.floor(1000 * Math.pow(1.15, level)),
        effect: (player, level) => {
            player.critMultiplier = 2 + 0.5 * level;
        }
    },
    {
        id: "auto-click1",
        name: "Auto Click I",
        description: "Habilita clique automático lento. Reduz o tempo com upgrades posteriores.",
        category: "click",
        maxLevel: 5,
        unlockRequirements: [
            (player) => player.getSkillById("banana-boost2")?.level >= 3
        ],
        baseCost: 1000,
        getCost: (level) => Math.floor(1000 * Math.pow(2, level)),
        effect: (player, level) => {
            player.autoClickEnabled = false;
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
            (player) => player.getSkillById("auto-click2")?.level >= 5
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
            (player) => player.getSkillById("auto-click2")?.level >= 5
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
