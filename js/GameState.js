export const GameState = {
    save(player, upgrades, buildings, skills) {
        const data = {
            player: {
                bananas: player.bananas,
                prismatics: player.prismatics,
                deck: [...player.deck],
                mine: { ...player.mine },
                laboratory: { ...player.laboratory },
                forge: { ...player.forge },
                skills: player.skills.map(s => ({
                    id: s.id,
                    level: s.level,
                    unlocked: s.unlocked
                }))
            },
            upgrades: upgrades.map(m => ({
                name: m.name,
                level: m.level,
                unlocked: m.unlocked,
                cost: m.cost,
                multiplier: m.multiplier,
                costExponent: m.costExponent
            })),
            buildings: buildings.map(b => ({ name: b.name, unlocked: b.unlocked })),

        };

        localStorage.setItem('monkeyGameState', JSON.stringify(data));
    },

    load(player, upgrades, buildings, ui) {
        const saved = localStorage.getItem('monkeyGameState');
        if (!saved) return;

        const data = JSON.parse(saved);

        // === Player ===
        player.bananas = data.player?.bananas ?? player.bananas ?? 0;
        player.prismatics = data.player?.prismatics ?? player.prismatics ?? 0;
        player.deck = [...(data.player?.deck ?? player.deck ?? [])];
        player.mine = { ...player.mine, ...(data.player?.mine ?? {}) };
        player.laboratory = { ...player.laboratory, ...(data.player?.laboratory ?? {}) };
        player.forge = { ...player.forge, ...(data.player?.forge ?? {}) };

        // === Upgrades ===
        (upgrades || []).forEach(monkey => {
            const savedMonkey = (data.upgrades || []).find(m => m.name === monkey.name);
            if (savedMonkey) {
                monkey.level = savedMonkey.level ?? monkey.level ?? 0;
                monkey.unlocked = savedMonkey.unlocked ?? monkey.unlocked ?? false;
                monkey.cost = savedMonkey.cost ?? monkey.cost ?? monkey.baseCost;
                monkey.multiplier = savedMonkey.multiplier ?? monkey.multiplier ?? 1;
                monkey.costExponent = savedMonkey.costExponent ?? monkey.costExponent ?? monkey.costExponent;
                if (monkey.level > 0 && typeof monkey.startProduction === 'function') monkey.startProduction(player, ui);
            }
        });

        // === Buildings ===
        (buildings || []).forEach(building => {
            const savedBuilding = (data.buildings || []).find(b => b.name === building.name);
            if (savedBuilding) building.unlocked = savedBuilding.unlocked ?? building.unlocked ?? false;
        });

        // === Skills ===
        // procura por id (salvo com id no save)
        const savedSkills = data.player?.skills || data.skills || [];
        (player.skills || []).forEach(skill => {
            const savedSkill = savedSkills.find(s => s.id === skill.id || s.name === skill.name);
            if (savedSkill) {
                skill.level = savedSkill.level ?? skill.level ?? 0;
                skill.unlocked = (typeof savedSkill.unlocked === 'boolean') ? savedSkill.unlocked : skill.unlocked;
                // reaplica efeito se necessário
                if (skill.level > 0 && typeof skill.effect === 'function') skill.effect(player, skill.level);
            }
        });

        // atualiza UI se informado
        if (ui) {
            ui.checkAllUnlocks();
            ui.renderAllUnlockedMonkeys();
            ui.updateAll(player);
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
        });


        buildings.forEach(b => b.unlocked = false);

        localStorage.removeItem('monkeyGameState');

        ui.clearMonkeys();
        ui.clearBuildings();
        ui.updateAll();
    }
};