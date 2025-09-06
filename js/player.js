import { formatNumber } from "./utils.js";

export class Player {
    constructor() {
        this.bananas = 0;
        this.prismatics = 0;
        this.bananasPerSecond = 0;
        this.deck = [];
        this.mine = { unlocked: false, level: 0, production: 0, multiplier: 0 };
        this.laboratory = { unlocked: false };
        this.forge = { unlocked: false };

        // Referências ao DOM
        this.bananaCountElement = document.getElementById("banana-count");
        this.prismaticsCountElement = document.getElementById("prismatics-count"); // opcional, se tiver
        this.bananasPerSecondElement = document.getElementById("bananas-per-second");
    }

    // Adiciona bananas
    addBananas(amount) {
        this.bananas += amount;
        this.updateDisplay();
    }

    // Remove bananas
    spendBananas(amount) {
        if (this.bananas >= amount) {
            this.bananas -= amount;
            this.updateDisplay();
            return true;
        }
        return false;
    }

    // Adiciona prismatics
    addPrismatics(amount) {
        this.prismatics += amount;
        this.updateDisplay();
    }

    // Remove prismatics
    spendPrismatics(amount) {
        if (this.prismatics >= amount) {
            this.prismatics -= amount;
            this.updateDisplay();
            return true;
        }
        return false;
    }

    // Atualiza o display de bananas e prismatics
    updateDisplay() {
        if (this.bananaCountElement) {
            this.bananaCountElement.textContent = formatNumber(this.bananas);
        }
        if (this.prismaticsCountElement) {
            this.prismaticsCountElement.textContent = formatNumber(this.prismatics);
        }

        if (this.bananasPerSecondElement) {
            this.bananasPerSecondElement.textContent = formatNumber(this.bananasPerSecond);
        }

    }

    // Verifica se o jogador pode desbloquear algo
    unlockBuilding(building) {
        switch (building) {
            case "mine":
                this.mine.unlocked = true;
                break;
            case "laboratory":
                this.laboratory.unlocked = true;
                break;
            case "forge":
                this.forge.unlocked = true;
                break;
        }
    }

    // Reset completo do player

    unlockMine() {
        if (!this.mine.unlocked) {
            this.mine.unlocked = true;
            this.mine.level = 1;
            this.mine.production = 0;
            return true;
        }
        return false;
    }

    upgradeMine() {
        if (!this.mine.unlocked) return false;

        const cost = 50 * (this.mine.level + 1);
        if (this.spendBananas(cost)) {
            this.mine.level++;
            console.log(this.mine.level);
            this.updateDisplay();
            return true;
        }
        return false;
    }

    reset() {
        this.bananas = 0;
        this.prismatics = 0;
        this.deck = [];
        this.mine = { unlocked: false, level: 0, production: 0, multiplier: 0 };
        this.laboratory = { unlocked: false };
        this.forge = { unlocked: false };
        this.updateDisplay();
    }

}
