import { SkillNode } from "./SkillNode.js";
import { createMonkeySkillNodes } from "./MonkeySkillNodes.js";
import { createMineSkillNodes } from "./MineSkillNode.js";

// Skill tree organizada por categorias e progressão
export const skillTreeData = {
    // ===================== BANANAS =====================
    bananas: [
        {
            id: "bananaBoost1",
            name: "Banana Boost I",
            description: "Aumenta sua produção de bananas em 10% por nível.",
            category: "bananas",
            maxLevel: 5,
            parents: [],
            unlockRequirements: [(player) => player.bananas >= 10_000],
            baseCost: 500,
            getCost: (level) => Math.floor(500 * Math.pow(1.8, level)),
            effect: (player, level) => {
                player.globalProductionMultiplier = 1 + level * 0.1;
            }
        },
        {
            id: "bananaBoost2",
            name: "Banana Boost II",
            description: "Aumenta sua produção de bananas em 20% por nível.",
            category: "bananas",
            maxLevel: 5,
            parents: ["bananaBoost1"],
            unlockRequirements: [
                (player) => player.getSkillById("bananaBoost1")?.level >= 5
            ],
            baseCost: 2000,
            getCost: (level) => Math.floor(2000 * Math.pow(2, level)),
            effect: (player, level) => {
                player.globalProductionMultiplier += level * 0.2;
            }
        },
        {
            id: "bananaBoost3",
            name: "Banana Boost III",
            description: "Aumenta produção de bananas em +30% por nível. Mais potente que Boost II.",
            category: "bananas",
            maxLevel: 5,
            parents: ["bananaBoost2"],
            unlockRequirements: [
                (player) => player.getSkillById("bananaBoost2")?.level >= 5
            ],
            baseCost: 3000,
            getCost: (level) => Math.floor(3000 * Math.pow(2.5, level)),
            effect: (player, level) => {
                player.globalProductionMultiplier += level * 0.3;
            }
        },
        {
            id: "bananaEvo1",
            name: "Banana Evolution",
            description: "Evolução sutil que multiplica seus Banana Boosts anteriores.",
            category: "bananas",
            maxLevel: 1,
            parents: ["bananaBoost2"],
            unlockRequirements: [
                (player) => player.getSkillById("bananaBoost2")?.level >= 5
            ],
            baseCost: 1,
            getCost: () => 1, // custo em prismáticas
            effect: (player, level) => {
                const current = player.globalProductionMultiplier || 1;
                player.globalProductionMultiplier = current * 1.3;
            }
        },
        {
            id: "bananaEvo2",
            name: "Banana Evolution II",
            description: "Multiplica todos os Banana Boosts anteriores em +50% (prismáticas).",
            category: "bananas",
            maxLevel: 1,
            parents: ["bananaBoost3"],
            unlockRequirements: [
                (player) => player.getSkillById("bananaBoost3")?.level >= 5
            ],
            baseCost: 2, // prismáticas
            getCost: () => 2,
            effect: (player, level) => {
                const current = player.globalProductionMultiplier || 1;
                player.globalProductionMultiplier = current * 1.5;
            }
        }
    ],

    // ===================== CLIQUES =====================
    click: [
        {
            id: "clickBoost1",
            name: "Click Boost I",
            description: "Aumenta o valor de cada clique em +1.",
            category: "click",
            maxLevel: 5,
            parents: [],
            unlockRequirements: [(player) => player.bananas >= 100],
            baseCost: 100,
            getCost: (level) => Math.floor(100 * Math.pow(1.5, level)),
            effect: (player, level) => {
                const base = player.baseClickValue || 1;
                player.clickValue = base + level;
            }
        },
        {
            id: "clickBoost2",
            name: "Click Boost II",
            description: "Aumenta o valor do clique em +2.",
            category: "click",
            maxLevel: 5,
            parents: ["clickBoost1"],
            unlockRequirements: [
                (player) => player.getSkillById("clickBoost1")?.level >= 5
            ],
            baseCost: 500,
            getCost: (level) => Math.floor(500 * Math.pow(1.8, level)),
            effect: (player, level) => {
                const base = player.baseClickValue || 1;
                player.clickValue = base + 5 + level * 2;
            }
        },
        {
            id: "clickBoost3",
            name: "Click Boost III",
            description: "Aumenta o valor do clique manual em +5 por nível.",
            category: "click",
            maxLevel: 5,
            parents: ["clickBoost2"],
            unlockRequirements: [
                (player) => player.getSkillById("clickBoost2")?.level >= 5
            ],
            baseCost: 5000,
            getCost: (level) => Math.floor(5000 * Math.pow(2, level)),
            effect: (player, level) => {
                const base = player.baseClickValue || 1;
                player.clickValue = base + 10 + level * 5;
            }
        },
        {
            id: "critChanceBoost",
            name: "Critical Chance",
            description: "Aumenta a chance de acerto crítico em 1% por nível.",
            category: "click",
            maxLevel: 10,
            parents: [],
            unlockRequirements: [(player) => player.bananas >= 2000],
            baseCost: 250,
            getCost: (level) => Math.floor(250 * Math.pow(1.12, level)),
            effect: (player, level) => {
                const baseChance = 0.04;
                player.critChance = Math.min(baseChance + 0.01 * level, 1);
            }
        },
        {
            id: "critMultiplierBoost",
            name: "Critical Multiplier",
            description: "Aumenta o multiplicador de críticos em +0.1 por nível.",
            category: "click",
            maxLevel: 10,
            parents: ["critChanceBoost"],
            unlockRequirements: [
                (player) => player.getSkillById("critChanceBoost")?.level >= 5
            ],
            baseCost: 1000,
            getCost: (level) => Math.floor(1000 * Math.pow(1.15, level)),
            effect: (player, level) => {
                player.critMultiplier = 2 + 0.1 * level;
            }
        },
        {
            id: "autoClick1",
            name: "Auto Click I",
            description: "Habilita clique automático lento. Reduz o tempo com upgrades posteriores.",
            category: "click",
            maxLevel: 5,
            parents: ["clickBoost2"],
            unlockRequirements: [
                (player) => player.getSkillById("clickBoost1")?.level >= 3
            ],
            baseCost: 10,
            getCost: (level) => Math.floor(1000 * Math.pow(2, level)),
            effect: (player, level) => {
                player.autoClickEnabled = true;
                player.autoClickSpeed = Math.max(5 - level * 0.8, 0.5); // segundos por clique
                player.autoClickMultiplier = 1 + 0.1 * level;
                const newClicker = {
                    angle: Math.random() * 360,
                    direction: Math.random() > 0.5 ? 1 : -1,
                    speed: 0.5 + Math.random() * 0.5, // graus por frame
                    id: `autoClicker_${Date.now()}`,
                    element: null
                };


                // cria o elemento fixo
                const el = document.createElement("div");
                el.classList.add("auto-click");
                document.getElementById("banana-container").appendChild(el);
                newClicker.element = el;

                player.autoClickers.push(newClicker);
                console.log(newClicker);


                if (!player.autoClickIntervalID) player.startAutoClick();
            }
        },
        {
            id: "autoClick2",
            name: "Auto Click II",
            description: "Clique automático mais rápido. Reduz o tempo base e aumenta eficiência.",
            category: "click",
            maxLevel: 5,
            parents: ["autoClick1"],
            unlockRequirements: [
                (player) => player.getSkillById("autoClick1")?.level >= 5
            ],
            baseCost: 2000,
            getCost: (level) => Math.floor(2000 * Math.pow(1.8, level)),
            effect: (player, level) => {
                player.autoClickSpeed = Math.max(3 - level * 0.4, 0.2);
                player.autoClickMultiplier = 1 + 0.1 * level; // aumenta produção do auto click
            }
        },
        {
            id: "autoClickChance",
            name: "Auto Click Chance",
            description: "Aumenta a chance de crit do auto click em 10%.",
            category: "click",
            maxLevel: 5,
            parents: ["autoClick2"],
            unlockRequirements: [
                (player) => player.getSkillById("autoClick2")?.level >= 3
            ],
            baseCost: 5000,
            getCost: (level) => 5000 * Math.pow(2, level),
            effect: (player, level) => {
                player.autoClickCritChance = 0.1 * level;       // 10%, 20%, ... 50%
                player.startAutoClick();
            }
        },
        {
            id: "autoClickCrit",
            name: "Auto Click Crit",
            description: "Aumenta o multiplicador crit do auto click.",
            category: "click",
            maxLevel: 5,
            parents: ["autoClick2"],
            unlockRequirements: [
                (player) => player.getSkillById("autoClick2")?.level >= 3
            ],
            baseCost: 5000,
            getCost: (level) => 5000 * Math.pow(2, level),
            effect: (player, level) => {
                player.autoClickCritMultiplier = 1.5 + 0.1 * level; // 1.6, 1.7, ... 2.0x
                player.startAutoClick();
            }
        },
        {
            id: "holdClick1",
            name: "Hold Click I",
            description: "Segurando o botão você gera bananas automaticamente.",
            category: "click",
            maxLevel: 5,
            parents: ["autoClick2"], // desbloqueia após auto click avançado
            unlockRequirements: [
                (player) => player.getSkillById("autoClick2")?.level >= 5
            ],
            baseCost: 10000,
            getCost: (level) => 10000 * Math.pow(1.8, level),
            effect: (player, level) => {
                player.holdClickEnabled = true;
                player.holdClickMultiplier = 0.5 + 0.1 * level; // produção mais baixa que click normal
                player.startHoldClick();
            }
        }


        // hold



    ],

    // ===================== MINA =====================
    mine: [
        {
            id: "mineEfficiency1",
            name: "Mine Efficiency I",
            description: "Aumenta a produção da Mina.",
            category: "mine",
            maxLevel: 3,
            parents: ["bananaBoost2"],
            unlockRequirements: [
                (player) => player.getSkillById("bananaBoost2")?.level >= 4
            ],
            baseCost: 2000,
            getCost: (level) => Math.floor(2000 * Math.pow(1.25, level)),
            effect: (player, level) => {
                const base = player.mine?.multiplier || 1;
                player.mine.multiplier = base + 0.5 * level;
            }
        },
        {
            id: "mineEfficiency2",
            name: "Mine Efficiency II",
            description: "Aumenta a produção da mina ainda mais.",
            category: "mine",
            maxLevel: 3,
            parents: ["mineEfficiency1"],
            unlockRequirements: [
                (player) => player.getSkillById("mineEfficiency1")?.level >= 3
            ],
            baseCost: 5000,
            getCost: (level) => Math.floor(5000 * Math.pow(1.4, level)),
            effect: (player, level) => {
                const base = player.mine?.multiplier || 1;
                player.mine.multiplier = base + 1 * level;
            }
        },
        {
            id: "mineAutomation",
            name: "Mine Automation",
            description: "Permite que a mina funcione sozinha por períodos automáticos. Reduz tempo com upgrades.",
            category: "mine",
            maxLevel: 5,
            parents: ["mineEfficiency2"],
            unlockRequirements: [
                (player) => player.getSkillById("mineEfficiency2")?.level >= 3
            ],
            baseCost: 3000,
            getCost: (level) => Math.floor(3000 * Math.pow(2, level)),
            effect: (player, level) => {
                player.mine.autoMultiplier = 1 + 0.2 * level;
                player.mine.autoInterval = Math.max(10 - level * 1.5, 1); // segundos
            }
        }
    ],

    // ===================== RARES =====================
    rare: [
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
};



// Cria a árvore de skills do player
export function createSkillTree(player) {
    getAllSkills().forEach(skillData => {
        const node = new SkillNode(skillData);
        player.addSkillNode(node);
    });

    // cria nodes de monkeys se houver
    createMonkeySkillNodes(player);
    createMineSkillNodes(player);

    // garante categories atualizadas
    player.skillCategories = Object.keys(skillTreeData);

    return player.skills;
}

// Helper para "achatar" tudo em um único array
export function getAllSkills() {
    return Object.values(skillTreeData).flat();
}
