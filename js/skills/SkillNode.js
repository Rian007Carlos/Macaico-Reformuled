export class SkillNode {
    constructor({
        id,
        name = "???",
        description = "???",
        category = "default",
        isMonkey = false,
        unlocked = false,
        level = 0,
        maxLevel = 1,
        unlockRequirements = [], // array de funções de checagem
        effect,
        getCost = null,          // opcional: function(level) => number
        baseCost = null,         // opcional: número simples (custo fixo)
        targetMonkey = null,     // ligação com monkey (se houver)
        ...rest
    }) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.category = category;
        this.level = level;
        this.maxLevel = maxLevel;
        this.unlockRequirements = Array.isArray(unlockRequirements) ? unlockRequirements : [];
        this.effect = effect;
        this.getCost = (typeof getCost === 'function') ? getCost : null;
        this.baseCost = (typeof baseCost === 'number') ? baseCost : null;
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
        if (!Array.isArray(this.unlockRequirements) || this.unlockRequirements.length === 0) {
            return false; // evita liberar tudo automaticamente
        }

        return this.unlockRequirements.every((fn, i) => {
            try {
                return fn(player);
            } catch (e) {
                console.error(`[SkillNode ${this.id}] Erro em unlockRequirement[${i}]`, e);
                return false;
            }
        });
    }


    // --- desbloqueio ---
    unlock(player, uiManager = null, extra = null) {
        if (!this.unlocked && this.canUnlock(player)) {
            const cost = this.getNextCost(this.level);
            if (cost !== null && !player.spendBananas(cost)) return false;

            this.unlocked = true;
            this.level = 1;

            // Se for uma mastery de macaco, só aplica efeito
            if (this.isMonkey && this.effect) {
                this.effect(player, this.level, extra);
            }

            // Se tiver targetMonkey, mantém compatibilidade antiga
            if (this.targetMonkey) {
                this.targetMonkey.unlocked = true;
            }

            // Efeito padrão (skills comuns)
            if (!this.isMonkey && this.effect) {
                this.effect(player, this.level, extra);
            }

            // Atualiza UI via queue para upgrades
            if (uiManager) {
                uiManager.queueUIUpdate(UIUpdateType.BANANA);
                uiManager.queueUIUpdate(UIUpdateType.MONKEY);
            }

            return true;
        }
        return false;
    }

    checkUnlock(player) {
        if (!this.unlocked && this.canUnlock(player)) {
            this.unlocked = true;
            if (this.targetMonkey) this.targetMonkey.unlocked = true;
            return true;
        }
        return false;
    }

    // método estático para atualizar uma lista de nodes
    static updateAllUnlocks(nodes, player) {
        nodes.forEach(node => {
            if (typeof node.checkUnlock === 'function') { // safer than instanceof
                node.checkUnlock(player);
            }
        });
    }
    // --- upgrade ---
    upgrade(player, uiManager, extra = null) {
        if (!this.unlocked || this.level >= this.maxLevel) return false;

        const cost = this.getNextCost(this.level);
        if (cost !== null && !player.spendBananas(cost)) return false;

        this.level++;

        if (this.effect) this.effect(player, this.level, extra);
        if (player.recalculateBPS) player.recalculateBPS();

        // atualiza UI para monkey
        if (uiManager && this.isMonkey) {
            uiManager.queueUIUpdate(UIUpdateType.MONKEY);
            uiManager.queueUIUpdate(UIUpdateType.BANANA);
        }

        // atualiza descrição e checa unlocks
        if (uiManager && this.targetMonkey) {
            const monkey = this.targetMonkey;
            uiManager.updateMonkeyDescription(monkey);
            uiManager.checkAllUnlocks();
        }

        return true;
    }

    increaseMaxLevel(amount = 1) {
        this.maxLevel += amount;
    }
}
