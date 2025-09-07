import { Mine } from "../buildings/Mine.js";
import { Laboratory } from "../buildings/Laboratory.js";
import { Forge } from "../buildings/Forge.js";

export class Player {
    constructor() {
        this.bananas = 0;
        this.prismatics = 0;
        this.bananasPerSecond = 0;
        this.deck = [];

        this.mine = new Mine();
        this.laboratory = new Laboratory();
        this.forge = new Forge();
    }

    addBananas(amount) {
        this.bananas += amount;
        return true;
    }

    spendBananas(amount) {
        if (this.bananas >= amount) {
            this.bananas -= amount;
            return true;
        }
        return false;
    }

    addPrismatics(amount) {
        this.prismatics += amount;
        return true;
    }

    spendPrismatics(amount) {
        if (this.prismatics >= amount) {
            this.prismatics -= amount;
            return true;
        }
        return false;
    }

    reset() {
        this.bananas = 0;
        this.prismatics = 0;
        this.deck = [];
        this.mine.reset();
        this.laboratory.reset();
        this.forge.reset();
        this.bananasPerSecond = 0;
    }
}
