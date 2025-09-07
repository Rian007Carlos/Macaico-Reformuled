// import { SkillNode } from "./skillNode";
export class Player {
    constructor(uiManager) {
        this.uiManager = uiManager; // referência ao UIManager
        this.bananas = 0;
        this.prismatics = 0;
        this.bananasPerSecond = 0;
        this.upgrades = [];
        this.productionMultiplier = 1;
        this.skills = [];
        this.skillCategories = ["click", "bananas", "production", "mine", "lab", "forge", "multiplier", "monkeys", "rare"];
        this.deck = [];
        this.mine = { unlocked: false, level: 0, production: 0, multiplier: 0 };
        this.laboratory = { unlocked: false };
        this.forge = { unlocked: false };
    }

    addBananas(amount) {
        this.bananasFraction = (this.bananasFraction || 0) + amount;
        const whole = Math.floor(this.bananasFraction);
        if (whole > 0) {
            this.bananas += whole;
            this.bananasFraction -= whole;
        }
        this.refreshHUD();
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

        // Se upgrades existir e não estiver vazio, usa ele.
        // Se não, por segurança, cai em this.deck(compatibilidade).
        const source = (this.upgrades && this.upgrades.length) ? this.upgrades : this.deck;

        source.forEach(monkey => {
            // soma apenas macacos que reamlente produzem
            if (monkey && monkey.unlocked && monkey.level > 0 && typeof monkey.getProduction == "function") {
                bps += monkey.getProduction();
            }
        });

        if (this.mine?.unlocked) {
            const mineProduction = (this.mine.production || 0) * (this.mine.level || 0);
        }

        // segurança contra Nan/Infinity
        if (!isFinite(bps) || isNaN(bps)) bps = 0;

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
