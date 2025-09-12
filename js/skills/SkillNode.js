export class SkillNode {
    constructor({
        id,
        name = "???",
        description = "???",
        category = "default",
        unlocked = false,
        level = 0,
        maxLevel = 1,
        unlockRequirements = [], // array de funções de checagem
        effect,
        getCost = null,          // opcional: function(level) => number
        baseCost = null,         // opcional: número simples (custo fixo)
        targetMonkey = null,     // ligação com monkey (se houver)
        parents = [],            // array de IDs dos nós pais
        ...rest
    }) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.category = category;
        this.level = level;
        this.maxLevel = maxLevel;
        this.unlockRequirements = unlockRequirements;
        this.effect = effect;
        this.getCost = (typeof getCost === 'function') ? getCost : null;
        this.baseCost = (typeof baseCost === 'number') ? baseCost : null;
        this.parents = parents;
        this._unlocked = unlocked;
        this.targetMonkey = targetMonkey;
        Object.assign(this, rest);
    }

    // compat: unlocked só é true se realmente já foi liberado
    get unlocked() {
        return this._unlocked ?? false;
    }
    set unlocked(value) {
        this._unlocked = value;
    }

    // --- custos ---
    hasCost() {
        return (typeof this.getCost === 'function') || (typeof this.baseCost === 'number');
    }

    getNextCost(level = this.level) {
        if (typeof this.getCost === 'function') {
            try {
                return this.getCost(level);
            } catch (e) {
                console.error(`Erro em getCost do skill ${this.id}:`, e);
                return null;
            }
        }
        if (typeof this.baseCost === 'number') {
            return this.baseCost;
        }
        return null;
    }

    // --- requisitos ---
    canUnlock(player) {
        return this.unlockRequirements.every((fn, i) => {
            let result = false;
            try {
                result = fn(player);
            } catch (e) {
                console.error(`[SkillNode ${this.id}] Erro em unlockRequirement[${i}]`, e);
            }
            console.log(
                `[SkillNode ${this.id}] Req[${i}] ->`,
                result,
                fn.toString(),
                " PlayerState:",
                {
                    skills: player.skills?.map(s => ({ id: s.id, level: s.level })),
                    monkeys: player.upgradeMonkeys?.map(m => ({ name: m.name, level: m.level, unlocked: m.unlocked }))
                }
            );
            return result;
        });
    }

    // --- desbloqueio ---
    unlock(player, extra = null) {
        if (!this.unlocked && this.canUnlock(player)) {
            const cost = this.getNextCost(this.level);
            if (cost !== null && !player.spendBananas(cost)) return false;

            this.unlocked = true;
            this.level = 1;

            if (this.targetMonkey) {
                this.targetMonkey.unlocked = true;
            }

            if (this.effect) this.effect(player, this.level, extra);

            return true;
        }
        return false;
    }

    // --- upgrade ---
    upgrade(player, uiManager, extra = null) {
        if (!this.unlocked || this.level >= this.maxLevel) return false;

        const cost = this.getNextCost(this.level);
        if (cost !== null && !player.spendBananas(cost)) return false;

        this.level++;

        if (this.effect) this.effect(player, this.level, extra);
        if (player.recalculateBPS) player.recalculateBPS();

        if (uiManager && this.targetMonkey) {
            const monkey = this.targetMonkey;

            if (!document.querySelector(`.monkey[data-monkey="${monkey.name}"]`)) {
                uiManager.renderMonkey(monkey);
            }

            uiManager.updateMonkeyDescription(monkey);
            uiManager.checkAllUnlocks();
        }

        return true;
    }

    increaseMaxLevel(amount = 1) {
        this.maxLevel += amount;
    }
}
