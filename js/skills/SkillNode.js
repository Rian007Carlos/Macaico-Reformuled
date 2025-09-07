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
        effect = null, // função que aplica efeito
        x = 0, // coordenada horizontal na skill tree
        y = 0, // coordenada vertical na skill tree
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

        this.x = x;
        this.y = y;
        this.parents = parents; // IDs de nós que desbloqueiam este
    }

    canUnlock(player) {
        return this.unlockRequirements.every(fn => fn(player));
    }

    unlock(player) {
        if (!this.unlocked && this.canUnlock(player)) {
            this.unlocked = true;
            this.level = 1;
            if (this.effect) this.effect(player, this.level);
            return true;
        }
        return false;
    }

    upgrade(player) {
        if (!this.unlocked) return false;
        if (this.level >= this.maxLevel) return false;

        this.level++;
        if (this.effect) this.effect(player, this.level);
        return true;
    }

    increaseMaxLevel(amount = 1) {
        this.maxLevel += amount;
    }
}
