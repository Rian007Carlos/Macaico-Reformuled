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
            buildings: buildings.map(b => ({
                name: b.constructor.name,
                unlocked: b.unlocked,
                level: b.level ?? 0
            }))
        };

        localStorage.setItem('monkeyGameState', JSON.stringify(data));
    },

    load(player, upgrades, buildings) {
        const saved = localStorage.getItem('monkeyGameState');
        if (!saved) return;

        const data = JSON.parse(saved);

        player.bananas = data.player.bananas ?? 0;
        player.prismatics = data.player.prismatics ?? 0;
        player.deck = [...(data.player.deck ?? [])];
        player.mine = { ...player.mine, ...(data.player.mine ?? {}) };
        player.laboratory = { ...player.laboratory, ...(data.player.laboratory ?? {}) };
        player.forge = { ...player.forge, ...(data.player.forge ?? {}) };

        upgrades.forEach(monkey => {
            const savedMonkey = data.upgrades.find(m => m.name === monkey.name);
            if (savedMonkey) {
                monkey.level = savedMonkey.level ?? 0;
                monkey.unlocked = savedMonkey.unlocked ?? false;
                monkey.cost = savedMonkey.cost ?? monkey.baseCost;
                monkey.multiplier = savedMonkey.multiplier ?? 1;
                monkey.costExponent = savedMonkey.costExponent ?? 1.15;
            }
        });

        buildings.forEach(building => {
            const savedBuilding = data.buildings.find(b => b.name === building.constructor.name);
            if (savedBuilding) {
                building.unlocked = savedBuilding.unlocked ?? false;
                if (building.level !== undefined) {
                    building.level = savedBuilding.level ?? 0;
                }
            }
        });
    },

    reset(player, upgrades, buildings) {
        player.reset();

        upgrades.forEach(m => m.reset());
        buildings.forEach(b => {
            b.unlocked = false;
            if (b.level !== undefined) b.level = 0;
        });

        localStorage.removeItem('monkeyGameState');
    }
};
