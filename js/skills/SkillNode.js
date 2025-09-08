import { UIManager } from "../uiManager.js";

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
        getCost,
        baseCost = 25,
        targetMonkey = null,// função que aplica efeito
        parents = [], // array de IDs dos nós pais
        ...rest
    }) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.category = category;
        // this.unlocked = unlocked;
        this.level = level;
        this.maxLevel = maxLevel;
        this.unlockRequirements = unlockRequirements;
        this.effect = effect;
        this.getCost = getCost;
        this.baseCost = baseCost;
        this.targetMonkey = targetMonkey
        this.parents = parents; // IDs de nós que desbloqueiam este
        Object.assign(this, rest);
    }

    get unlocked() {
        return this.targetMonkey?.unlocked ?? false;
    }

    set unlocked(value) {
        if (this.targetMonkey) {
            this.targetMonkey.unlocked = value;
        }
    }

    canUnlock(player) {
        return this.unlockRequirements.every(fn => fn(player));
    }

    unlock(player, extra = null) {
        if (!this.unlocked && this.canUnlock(player)) {
            const cost = this.getCost(this.level);
            if (!player.spendBananas(cost)) return false;
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

        const cost = this.getCost(this.level);
        if (!player.spendBananas(cost)) return false;

        this.level++;
        if (this.effect) this.effect(player, this.level, extra);
        player.recalculateBPS();

        if (uiManager && this.targetMonkey) {
            const monkey = this.targetMonkey;
            if (monkey) uiManager.updateMonkeyDescription(monkey);

            uiManager.updateAll(player);
        }
        return true;
    }

    increaseMaxLevel(amount = 1) {
        this.maxLevel += amount;
    }
}
