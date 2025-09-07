export class Mine {
    constructor() {
        this.unlocked = false;
        this.level = 0;
        this.production = 0;
        this.multiplier = 0;
    }

    unlock() {
        if (!this.unlocked) {
            this.unlocked = true;
            this.level = 1;
            return true;
        }
        return false;
    }

    upgrade(cost, spendFunction) {
        if (!this.unlocked) return false;
        if (!spendFunction(cost)) return false;

        this.level++;
        return true;
    }

    reset() {
        this.unlocked = false;
        this.level = 0;
        this.production = 0;
        this.multiplier = 0;
    }
}
