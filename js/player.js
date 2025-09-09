import { SFX } from "./sfx/sfx.js";
SFX.register("denied", "../sfx/denied.m4a", 0.1);

// import { SkillNode } from "./skillNode";
export class Player {
    constructor(uiManager) {
        this.uiManager = uiManager; // referência ao UIManager
        this.bananas = 0;
        this.prismatics = 0;
        this.bananasPerSecond = 0;
        this.baseBananasPerSecond = this.bananasPerSecond || 0;
        this.baseClickValue = this.clickValue || 1;
        this.baseMineMultiplier = this.mine?.multiplier || 1;
        this.clickValue = 1;
        this.critChance = 0;
        this.critMultiplier = 0;
        this.upgrades = [];
        this.monkeys = [];
        this.globalProductionMultiplier = 1;
        this.productionMultiplier = 1;
        this.skills = [];
        this.skillCategories = ["click", "bananas", "production", "mine", "lab", "forge", "multiplier", "monkeys", "rare"];
        this.deck = [];
        this.mine = { unlocked: false, level: 0, production: 0, multiplier: 0 };
        this.laboratory = { unlocked: false };
        this.forge = { unlocked: false };
        this.startTime = Date.now();
        this.milestonesReached = {};
    }

    getPlayTimeSeconds() {
        return Math.floor((Date.now() - this.startTime) / 1000);
    }


    formatPlayTime() {
        const seconds = this.getPlayTimeSeconds();
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;

        if (h > 0) return `${h}h ${m}m ${s}s`;
        if (m > 0) return `${m}m ${s}s`;
        return `${s}s`;
    }

    checkMilestones() {
        const milestones = [1_000, 10_000, 100_000, 1_000_000, 10_000_000];
        for (const milestone of milestones) {
            if (this.bananas >= milestone && !this.milestonesReached[milestone]) {
                this.milestonesReached[milestone] = this.getPlayTimeSeconds();
                console.log(`🎯 Milestone atingido: ${milestone.toLocaleString()} bananas em ${this.formatPlayTime()}`);
            }
        }
    }
    addBananas(amount = 1, isCLick = false) {
        // calcula o total incluindo crítico
        let total = amount;

        // acumula fracionário
        this.bananasFraction = (this.bananasFraction || 0) + total;
        const whole = Math.floor(this.bananasFraction);

        if (whole > 0) {
            this.bananas += whole;
            this.bananasFraction -= whole;
        }
        this.checkMilestones();
        this.refreshHUD();
    }


    spendBananas(amount) {
        if (this.bananas >= amount) {
            this.bananas -= amount;
            this.refreshHUD();
            return true;
        } else {
            SFX.play("denied");
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

    getTotalMonkeyproduction() {
        const base = this.monkeys.reduce((sum, m) => sum + m.baseProduction, 0);
        return base * this.globalProductionMultiplier;
    }

    recalculateBPS() {
        let bps = 0;

        this.upgrades.forEach(monkey => {
            if (monkey.unlocked && monkey.level > 0 && typeof monkey.getProduction === "function") {
                bps += monkey.getProduction();
            }
        });

        if (this.mine?.unlocked) {
            const mineProduction = (this.mine.production || 0) * (this.mine.level || 0) * (this.mine.multiplier || 1);
            bps += mineProduction;
        }

        bps *= this.productionMultiplier || 1;
        bps *= this.globalProductionMultiplier || 1;

        if (!isFinite(bps) || isNaN(bps)) bps = 0;

        this.bananasPerSecond = bps;

        // Atualiza HUD
        this.refreshHUD();

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
