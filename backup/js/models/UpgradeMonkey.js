export class UpgradeMonkey {
    constructor({ name, cost, baseProduction, unlockAt = {}, multiplier = 1, costExponent = 1.15 }) {
        this.name = name;
        this.baseCost = cost;
        this.cost = cost;
        this.baseProduction = baseProduction;
        this.unlocked = false;
        this.unlockAt = unlockAt;
        this.multiplier = multiplier;
        this.level = 0;
        this.isProducing = false;
        this.costExponent = costExponent;
        this.intervalID = null;
    }

    getProduction() {
        return this.baseProduction * this.level * this.multiplier;
    }

    hasUnlocked(player, upgrades) {
        if (this.unlocked) return false;
        let unlockedNow = false;

        if (this.unlockAt.bananas && player.bananas >= this.unlockAt.bananas) unlockedNow = true;
        if (this.unlockAt.monkey) {
            const requiredMonkey = upgrades.find(m => m.name === this.unlockAt.monkey.name);
            if (requiredMonkey && requiredMonkey.level >= this.unlockAt.monkey.level) unlockedNow = true;
        }

        if (unlockedNow) this.unlocked = true;
        return unlockedNow;
    }

    beginProduction(player) {
        if (this.level > 0 && !this.isProducing) {
            this.isProducing = true;
            this.intervalID = setInterval(() => {
                player.addBananas(this.getProduction());
            }, 1000);
        }
    }

    buy(player) {
        if (!player.spendBananas(this.cost)) return false;
        this.level++;
        this.updateCost();
        this.beginProduction(player);
        return true;
    }

    updateCost() {
        this.cost = Math.floor(this.baseCost * Math.pow(this.costExponent, this.level));
    }

    reset() {
        this.level = 0;
        this.unlocked = false;
        this.cost = this.baseCost;
        this.isProducing = false;
        if (this.intervalID) clearInterval(this.intervalID);
    }
}
