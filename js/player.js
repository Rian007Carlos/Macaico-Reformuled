import { SFX } from "./sfx/sfx.js";
import { Mine } from "./Mine.js";
import { UIUpdateType } from "./uiManager.js"; // para marcar updates

SFX.register("denied", "../sfx/denied.m4a", 0.1);

export class Player {
    constructor(uiManager) {
        this.uiManager = uiManager;

        // Recursos
        this.bananas = 0;
        this.prismatics = 0;

        // Produção
        this.bananasPerSecond = 0;
        this.clickValue = 1;
        this.critChance = 0;
        this.critMultiplier = 0;

        // Unidades e upgrades
        this.upgrades = [];  // lista de UpgradeMonkeys
        this.monkeys = [];   // se for separado
        this.skills = [];
        this.skillCategories = [
            "click", "bananas", "production", "mine",
            "lab", "forge", "multiplier", "monkeys", "rare"
        ];

        // Estruturas
        this.mine = new Mine();
        this.laboratory = { unlocked: false };
        this.forge = { unlocked: false };

        // Multiplicadores globais
        this.globalProductionMultiplier = 1;
        this.productionMultiplier = 1;

        // Outros
        this.deck = [];
        this.startTime = Date.now();
        this.milestonesReached = {};
    }

    getMonkeyByName(name) {
        return this.upgrades.find(m => m.name === name);
    }

    // === Recursos comuns ===
    addBananas(amount = 1) {
        let total = amount;

        // acumula frações para evitar perda
        this.bananasFraction = (this.bananasFraction || 0) + total;
        const whole = Math.floor(this.bananasFraction);

        if (whole > 0) {
            this.bananas += whole;
            this.bananasFraction -= whole;
        }

        this.refreshHUD(UIUpdateType.BANANA);
    }

    spendBananas(amount) {
        if (this.bananas >= amount) {
            this.bananas -= amount;
            this.refreshHUD(UIUpdateType.BANANA);
            return true;
        } else {
            SFX.play("denied");
        }
        return false;
    }

    addPrismatics(amount) {
        this.prismatics += amount;
        this.refreshHUD(UIUpdateType.BANANA);
    }

    spendPrismatics(amount) {
        if (this.prismatics >= amount) {
            this.prismatics -= amount;
            this.refreshHUD(UIUpdateType.BANANA);
            return true;
        }
        return false;
    }

    // === Produção ===
    getTotalMonkeyProduction() {
        return this.upgrades.reduce((sum, m) => {
            if (m.unlocked && m.level > 0 && typeof m.getProduction === "function") {
                return sum + m.getProduction();
            }
            return sum;
        }, 0) * this.globalProductionMultiplier;
    }

    recalculateBPS() {
        let bps = this.getTotalMonkeyProduction();

        // multiplicadores globais
        bps *= this.productionMultiplier || 1;
        bps *= this.globalProductionMultiplier || 1;

        if (!isFinite(bps) || isNaN(bps)) bps = 0;

        this.bananasPerSecond = bps;

        // UI: só atualizar o HUD, não a lista inteira
        this.refreshHUD(UIUpdateType.BANANA);
    }

    // === Skills ===
    addSkillNode(skillNode) {
        this.skills.push(skillNode);
    }

    getSkillById(id) {
        return this.skills.find(skill => skill.id === id);
    }

    // === HUD ===
    refreshHUD(updateType = UIUpdateType.BANANA) {
        if (this.uiManager) {
            this.uiManager.queueUIUpdate(updateType);
        }
    }

    // === Reset ===
    reset() {
        this.bananas = 0;
        this.prismatics = 0;
        this.bananasPerSecond = 0;
        this.deck = [];

        this.mine = new Mine();
        this.laboratory = { unlocked: false };
        this.forge = { unlocked: false };

        this.refreshHUD(UIUpdateType.BANANA);
    }
}
