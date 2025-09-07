// import { SkillNode } from "./skillNode";
export class Player {
    constructor(uiManager) {
        this.uiManager = uiManager; // referência ao UIManager
        this.bananas = 0;
        this.prismatics = 0;
        this.bananasPerSecond = 0;
        this.skills = [];
        this.skillCategories = ["click", "bananas", "production", "mine", "lab", "forge", "multiplier", "monkeys", "rare"];
        this.deck = [];
        this.mine = { unlocked: false, level: 0, production: 0, multiplier: 0 };
        this.laboratory = { unlocked: false };
        this.forge = { unlocked: false };
    }

    addBananas(amount) {
        this.bananas += amount;
        this.refreshHUD(); // ⚡ sempre atualiza o HUD
    }

    spendBananas(amount) {
        if (this.bananas >= amount) {
            this.bananas -= amount;
            this.refreshHUD();
            return true;
        }
        return false;
    }

    addPrismatics(amount) {
        this.prismatics += amount;
        this.refreshHUD();
    }

    spendPrismatics(amount) {
        if (this.prismatics >= amount) {
            this.prismatics -= amount;
            this.refreshHUD();
            return true;
        }
        return false;
    }

    recalculateBPS() {
        let bps = 0;
        this.deck.forEach(monkey => {
            bps += monkey.getProduction();
        });
        if (this.mine.unlocked) {
            bps += this.mine.production * this.mine.level; // ou getProduction()
        }
        this.bananasPerSecond = bps;
    }

    addSkillNode(skillNode) {
        this.skills.push(skillNode);
    }

    getSkillById(id) {
        return this.skills.find(skill => skill.id === id);
    }

    refreshHUD() {
        if (this.uiManager) {
            this.uiManager.updateAll(this); // ⚡ Player avisa UIManager
        }
    }

    reset() {
        this.bananas = 0;
        this.prismatics = 0;
        this.bananasPerSecond = 0;
        this.deck = [];
        this.mine = { unlocked: false, level: 0, production: 0, multiplier: 0 };
        this.laboratory = { unlocked: false };
        this.forge = { unlocked: false };

        // Atualiza HUD completo
        this.refreshHUD();
    }

}
