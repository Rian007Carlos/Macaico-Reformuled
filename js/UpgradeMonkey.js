import { Mine } from "./Mine.js";

export class UpgradeMonkey {
    constructor({ name, cost, baseProduction, unlockAt = {}, unlocksFeature = null, multiplier = 1, costExponent = 1.15, skillTreeBaseCost }) {
        this.name = name;
        this.baseCost = cost;
        this.cost = cost;
        this.baseProduction = baseProduction;
        this.unlocked = false;
        this.unlockAt = unlockAt;
        this.unlocksFeature = unlocksFeature;
        this.multiplier = multiplier;
        this.level = 0;
        this.isProducing = false;
        this.costExponent = costExponent;
        this.intervalID = null;
        this.skillTreeBaseCost = skillTreeBaseCost;
    }

    getProduction() {
        return Math.floor((this.baseProduction * this.level) * this.multiplier);
    }

    // Apenas desbloqueia, não adiciona bananas
    hasUnlock(gameState) {
        if (this.unlocked) return false;

        let unlockedNow = false;

        if (this.unlockAt.bananas && gameState.player.bananas >= this.unlockAt.bananas) {
            this.unlocked = true;
            unlockedNow = true;
        }

        if (this.unlockAt.monkey) {
            const requiredMonkey = gameState.upgrades.find(m => m.name === this.unlockAt.monkey.name);
            if (requiredMonkey && requiredMonkey.level >= this.unlockAt.monkey.level) {
                this.unlocked = true;
                unlockedNow = true;
            }
        }

        // Renderiza o macaico se desbloqueado
        if (unlockedNow && gameState.uiManager) {
            gameState.uiManager.renderMonkey(this);
        }

        return unlockedNow;
    }

    startProduction(player, uiManager) {
        if (this.level > 0 && !this.isProducing) {
            this.isProducing = true;
            player.bananasPerSecond += this.getProduction();

            if (uiManager) {
                uiManager.up
                player.recalculateBPS();
                uiManager.updateAll(player);
            }
        }
    }

    buy(player, uiManager) {
        if (!player.spendBananas(this.cost)) return false;

        this.level++;
        this.updateCost();

        if (uiManager) {
            uiManager.updateMonkeyDescription(this);
            uiManager.updateAll(player);
            // Desbloqueio da mina ao comprar o primeiro Macaco-prego
            if (this.name === "Macaco-prego" && this.level === 1) {
                if (Mine.unlock(player.mine)) {
                    uiManager.renderMine();
                    player.recalculateBPS();
                    uiManager.updateAll(player);
                }
            }
        }

        // IMPORTANTE: passar uiManager aqui também
        this.startProduction(player, uiManager);
        return true;
    }

    updateCost() {
        this.cost = Math.floor(this.baseCost * Math.pow(this.costExponent, this.level));
    }
}
