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

    load(player, upgrades, buildings) {
        const saved = localStorage.getItem('monkeyGameState');
        if (!saved) return;

        const data = JSON.parse(saved);

        // Carrega player
        Object.assign(player, data.player);

        // Carrega upgrades
        upgrades.forEach(monkey => {
            const savedMonkey = data.upgrades.find(m => m.name === monkey.name);
            if (savedMonkey) {
                monkey.level = savedMonkey.level;
                monkey.unlocked = savedMonkey.unlocked;
                monkey.cost = savedMonkey.cost;
                monkey.multiplier = savedMonkey.multiplier;
                monkey.costExponent = savedMonkey.costExponent;

                // inicia produção automática se o nível > 0
                if (monkey.level > 0) monkey.startProduction(player);
            }
        });

        // Carrega prédios
        buildings.forEach(building => {
            const savedBuilding = data.buildings.find(b => b.name === building.name);
            if (savedBuilding) building.unlocked = savedBuilding.unlocked;
        });

        if (player.mine.unlocked && window.ui) {
            ui.renderMine();
        }
    },

    reset(player, upgrades, buildings) {
        player.reset();

        upgrades.forEach(m => {
            m.level = 0;
            m.unlocked = false;
            m.cost = m.baseCost;
            m.multiplier = 1;

            // para qualquer produção ativa
            m.isProducing = false;
            if (m.intervalID) clearInterval(m.intervalID);
        });

        buildings.forEach(b => b.unlocked = false);

        // limpa o save
        localStorage.removeItem('monkeyGameState');
    }
};
