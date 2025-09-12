import { UIUpdateType } from "./uiManager.js";

export class UpgradeMonkey {
    constructor({
        name,
        cost,
        baseProduction,
        multiplier = 1,
        costExponent = 1.15,
        unlockRequirements = [],
        skillTreeBaseCost = 25
    }) {
        this.name = name;
        this.baseCost = cost;
        this.cost = cost;
        this.baseProduction = baseProduction;
        this.multiplier = multiplier;
        this.costExponent = costExponent;

        this.level = 0;
        this.unlocked = false;   // 🔑 Só vira true quando a skill tree liberar
        this.isProducing = false;

        this.unlockRequirements = unlockRequirements;
        this.skillTreeBaseCost = skillTreeBaseCost;
    }

    getProduction() {
        return Math.floor((this.baseProduction * this.level) * this.multiplier || 1);
    }

    startProduction(player) {
        if (this.level > 0 && !this.isProducing) {
            this.isProducing = true;
            player.recalculateBPS();
        }
    }

    buy(player, uiManager) {
        if (!this.unlocked) return false;
        if (!player.spendBananas(this.cost)) return false;

        this.level++;
        this.updateCost();
        this.startProduction(player);

        if (uiManager) {
            uiManager.queueUIUpdate(UIUpdateType.MONKEY);
            uiManager.queueUIUpdate(UIUpdateType.BANANA);
        }

        return true;
    }

    updateCost() {
        this.cost = Math.floor(this.baseCost * Math.pow(this.costExponent, this.level));
    }
}
