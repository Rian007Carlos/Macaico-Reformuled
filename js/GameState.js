import { Mine } from "./Mine.js";

export const GameState = {
    save(player, upgrades, buildings) {
        const data = {
            player: {
                bananas: player.bananas,
                prismatics: player.prismatics,
                deck: [...player.deck],
                mine: {
                    level: player.mine.level,
                    unlocked: player.mine.unlocked,
                    autoCollect: player.mine.autoCollect
                },
                laboratory: { ...player.laboratory },
                forge: { ...player.forge },
                skills: player.skills.map(s => ({
                    id: s.id,
                    level: s.level,
                    unlocked: s.unlocked,
                    cost: s.hasCost ? s.getNextCost(s.level) : null
                    // 👆 só salva estado dinâmico, nome/descrição ficam no template
                }))
            },
            upgrades: upgrades.map(m => ({
                name: m.name,
                level: m.level,
                unlocked: m.unlocked,
                cost: m.cost,
                multiplier: m.multiplier,
                costExponent: m.costExponent,
                production: m.getProduction()
            })),
            buildings: buildings.map(b => ({
                name: b.name,
                unlocked: b.unlocked
            }))
        };

        localStorage.setItem("monkeyGameState", JSON.stringify(data));
    },

    load(player, upgrades, buildings, ui) {
        const saved = localStorage.getItem("monkeyGameState");
        if (!saved) return;

        const data = JSON.parse(saved);

        // =====================
        // 1️⃣ Restaurar Player
        // =====================
        player.bananas = data.player?.bananas ?? 0;
        player.prismatics = data.player?.prismatics ?? 0;
        player.deck = [...(data.player?.deck ?? [])];

        // Mine
        player.mine = new Mine();
        if (data.player?.mine) {
            player.mine.level = data.player.mine.level ?? 0;
            player.mine.unlocked = data.player.mine.unlocked ?? false;
            player.mine.autoCollect = data.player.mine.autoCollect ?? false;
        }

        // Laboratory e Forge
        player.laboratory = { ...player.laboratory, ...(data.player?.laboratory ?? {}) };
        player.forge = { ...player.forge, ...(data.player?.forge ?? {}) };

        // =====================
        // 2️⃣ Restaurar Skills
        // =====================
        const savedSkills = data.player?.skills || [];
        player.skills.forEach(skill => {
            const savedSkill = savedSkills.find(s => s.id === skill.id);
            if (savedSkill) {
                skill.level = savedSkill.level ?? 0;
                skill.unlocked = savedSkill.unlocked ?? false;
                skill.currentCost = savedSkill.cost ?? skill.getNextCost(skill.level);

                // Aplica efeito imediatamente se necessário
                if (skill.level > 0 && typeof skill.effect === "function") {
                    skill.effect(player, skill.level);
                }
            }
        });

        // =====================
        // 3️⃣ Restaurar Monkeys / Upgrades
        // =====================
        upgrades.forEach(monkey => {
            const savedMonkey = (data.upgrades || []).find(m => m.name === monkey.name);

            // Defaults
            if (monkey.cost == null) monkey.cost = monkey.baseCost ?? 0;
            if (!monkey.getProduction) monkey.getProduction = function () {
                return (this.baseProduction ?? 0) * (this.multiplier ?? 1);
            };

            if (savedMonkey) {
                monkey.level = savedMonkey.level ?? 0;
                monkey.unlocked = savedMonkey.unlocked ?? false;
                monkey.cost = savedMonkey.cost ?? monkey.cost;
                monkey.multiplier = savedMonkey.multiplier ?? 1;
                monkey.costExponent = savedMonkey.costExponent ?? monkey.costExponent;

                if (monkey.level > 0 && typeof monkey.startProduction === "function") {
                    monkey.startProduction(player);
                }
            }
        });

        // Reforça unlocks dependentes de skills/outros monkeys
        upgrades.forEach(monkey => {
            if (typeof monkey.hasUnlock === "function") {
                monkey.hasUnlock({ player, upgrades });
            }
        });

        // =====================
        // 4️⃣ Restaurar Buildings
        // =====================
        buildings.forEach(building => {
            const savedBuilding = (data.buildings || []).find(b => b.name === building.name);
            if (savedBuilding) building.unlocked = savedBuilding.unlocked ?? false;
        });

        // =====================
        // 5️⃣ Recalcular produção
        // =====================
        player.recalculateBPS();

        // =====================
        // 6️⃣ Atualizar UI
        // =====================
        if (ui) {
            ui.checkAllUnlocks();
            ui.updateAllCounters(player);
        }
    },

    reset(player, upgrades, buildings, ui) {
        player.reset();

        upgrades.forEach(m => {
            m.level = 0;
            m.unlocked = false;
            m.cost = m.baseCost;
            m.multiplier = 1;
            m.isProducing = false;
            if (m.intervalID) clearInterval(m.intervalID);
        });

        player.skills.forEach(s => {
            s.level = 0;
            s.unlocked = false;
            s.currentCost = s.hasCost ? s.getNextCost(0) : null;
        });

        buildings.forEach(b => b.unlocked = false);

        player.mine = new Mine();
        localStorage.removeItem("monkeyGameState");

        if (ui) {
            ui.clearMonkeys();
            ui.checkAllUnlocks();
            ui.updateAllCounters(player);
        }
    }
};
