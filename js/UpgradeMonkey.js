import { UIUpdateType } from "./uiManager.js";

export class UpgradeMonkey {
    constructor({
        id,
        name,
        cost,
        baseProduction,
        multiplier = 1,
        costExponent = 1.15,
        unlockRequirements = [],
        skillTreeBaseCost = 25
    }) {
        this.id = id;
        this.name = name;
        this.baseCost = cost ?? skillTreeBaseCost; // fallback
        this.cost = cost ?? skillTreeBaseCost;     // fallback
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
        if (this.level <= 0) return 0;  // nunca produz se level 0
        return Math.floor(this.baseProduction * this.level * this.multiplier);
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
        if (this.level > 0) {       // só começa produção se level >= 1
            this.startProduction(player);
        }


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
