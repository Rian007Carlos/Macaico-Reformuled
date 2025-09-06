export const GameState = {
    save(player, upgrades, buildings) {
        const data = {
            player: {
                bananas: player.bananas,
                prismatics: player.prismatics,
                deck: [...player.deck],
                mine: { ...player.mine },
                laboratory: { ...player.laboratory },
                forge: { ...player.forge }
            },
            upgrades: upgrades.map(m => ({
                name: m.name,
                level: m.level,
                unlocked: m.unlocked,
                cost: m.cost,
                multiplier: m.multiplier,
                costExponent: m.costExponent
            })),
            buildings: buildings.map(b => ({ name: b.name, unlocked: b.unlocked }))
        };

        localStorage.setItem('monkeyGameState', JSON.stringify(data));
    },

    load(player, upgrades, buildings, ui) {
        const saved = localStorage.getItem('monkeyGameState');
        if (!saved) return;

        const data = JSON.parse(saved);

        // === Player ===
        player.bananas = data.player.bananas ?? 0;
        player.prismatics = data.player.prismatics ?? 0;
        player.deck = [...(data.player.deck ?? [])];
        player.mine = { ...player.mine, ...(data.player.mine ?? {}) };
        player.laboratory = { ...player.laboratory, ...(data.player.laboratory ?? {}) };
        player.forge = { ...player.forge, ...(data.player.forge ?? {}) };

        // === Upgrades ===
        upgrades.forEach(monkey => {
            const savedMonkey = data.upgrades.find(m => m.name === monkey.name);
            if (savedMonkey) {
                monkey.level = savedMonkey.level ?? 0;
                monkey.unlocked = savedMonkey.unlocked ?? false;
                monkey.cost = savedMonkey.cost ?? monkey.baseCost;
                monkey.multiplier = savedMonkey.multiplier ?? 1;
                monkey.costExponent = savedMonkey.costExponent ?? 1.15;

                if (monkey.level > 0) monkey.startProduction(player, ui);
            }
        });



        // === Buildings ===
        buildings.forEach(building => {
            const savedBuilding = data.buildings.find(b => b.name === building.name);
            if (savedBuilding) building.unlocked = savedBuilding.unlocked ?? false;
        });

        // Renderiza prédios desbloqueados
        if (player.mine.unlocked) ui.renderMine();

        // Atualiza HUD
        ui.updateAll();
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

        buildings.forEach(b => b.unlocked = false);

        localStorage.removeItem('monkeyGameState');

        ui.clearMonkeys();
        ui.clearBuildings();
        ui.updateAll();
    }
};