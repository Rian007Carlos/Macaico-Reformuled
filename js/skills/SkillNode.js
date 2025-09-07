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
        effect = null,
        getCost = null,
        targetMonkey = null,// função que aplica efeito
        parents = [] // array de IDs dos nós pais
    }) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.category = category;
        this.unlocked = unlocked;
        this.level = level;
        this.maxLevel = maxLevel;
        this.unlockRequirements = unlockRequirements;
        this.effect = effect;
        this.getCost = getCost;
        this.targetMonkey = targetMonkey
        this.parents = parents; // IDs de nós que desbloqueiam este
    }

    canUnlock(player) {
        return this.unlockRequirements.every(fn => fn(player));
    }

    unlock(player, extra = null) {
        if (!this.unlocked && this.canUnlock(player)) {
            this.unlocked = true;
            this.level = 1;
            if (this.effect) this.effect(player, this.level, extra);
            return true;
        }
        return false;
    }

    upgrade(player, extra = null) {
        if (!this.unlocked) return false;
        if (this.level >= this.maxLevel) return false;

        this.level++;
        if (this.effect) this.effect(player, this.level, extra);
        return true;
    }

    increaseMaxLevel(amount = 1) {
        this.maxLevel += amount;
    }
}
