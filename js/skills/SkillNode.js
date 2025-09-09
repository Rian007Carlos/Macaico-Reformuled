// SkillNode.js
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
        this.unlocked = unlocked;
        Object.assign(this, rest);
    }

    // compat com sua implementação antiga de unlocked baseada no targetMonkey
    get unlocked() {
        return this._unlocked ?? false;
    }
    set unlocked(value) {
        this._unlocked = value;
    }

    // utilitários de custo (públicos)
    hasCost() {
        return (typeof this.getCost === 'function') || (typeof this.baseCost === 'number');
    }

    /**
     * Retorna o custo para o nível passado (por padrão usa this.level).
     * Retorna `null` se não existir custo definido.
     * Observação: se você quer comportamento de escala, passe um getCost na criação do nó.
     */
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

    canUnlock(player) {
        return this.unlockRequirements.every(fn => fn(player));
    }

    unlock(player, extra = null) {
        if (!this.unlocked && this.canUnlock(player)) {
            const cost = this.getNextCost(this.level); // cost pode ser null
            if (cost !== null) {
                if (!player.spendBananas(cost)) return false;
            }
            this.unlocked = true;
            this.level = 1;
            if (this.effect) this.effect(player, this.level, extra);
            return true;
        }
        return false;
    }

    upgrade(player, uiManager, extra = null) {
        if (!this.unlocked) return false;
        if (this.level >= this.maxLevel) return false;

        const cost = this.getNextCost(this.level);
        if (cost !== null) {
            if (!player.spendBananas(cost)) return false;
        }

        this.level++;
        if (this.effect) this.effect(player, this.level, extra);
        if (player.recalculateBPS) player.recalculateBPS();

        if (uiManager && this.targetMonkey) {
            const monkey = this.targetMonkey;
            if (monkey && uiManager.updateMonkeyDescription) uiManager.updateMonkeyDescription(monkey);
            if (uiManager.updateAll) uiManager.updateAll(player);
        }
        return true;
    }

    increaseMaxLevel(amount = 1) {
        this.maxLevel += amount;
    }
}
