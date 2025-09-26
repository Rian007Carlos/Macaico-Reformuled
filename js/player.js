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
        this.baseClickValue = 1;
        this.clickValue = this.baseClickValue;
        this.critChance = 0;
        this.critMultiplier = 0;

        // Autoclick
        this.autoClickEnabled = false;
        this.autoClickSpeed = 5;
        this.autoClickMultiplier = 1;
        this.autoClickCritChance = 0;
        this.autoClickCritMultiplier = 1.5;
        this.autoClickTimer = null;
        this.autoClickIntervalID = null;
        // Array com referência a cada upgrade do autoClick
        this.autoClickers = [];


        // Mouse hold Production
        this.holdClickEnabled = false;
        this.holdClickMultiplier = 1;
        this.holdClickTimer = null;

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

    // getMonkeyByName(name) {
    //     return this.upgrades.find(m => m.name === name);
    // }

    getMonkeyById(id) {
        return this.upgrades.find(m => m.id === id);
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

    updateClickValue() {
        const base = this.baseClickValue || 1;

        const boost1 = this.clickBoost1 || 0;
        const boost2 = this.clickBoost2 || 0;
        const boost3 = this.clickBoost3 || 0;
        const evo = this.clickEvolution || 0;

        this.clickValue = base + boost1 + boost2 + boost3 + evo;
    }


    // === Mouse Hold Production
    startHoldClick() {
        if (!this.holdClickEnabled) return;
        if (this.holdClickTimer) clearInterval(this.holdClickTimer);

        const interval = 1000; // 1 vez por segundo
        this.holdClickTimer = setInterval(() => {
            if (!this.holdClickEnabled) return;

            let holdValue = this.clickValue * this.holdClickMultiplier;

            // checa crit
            if (Math.random() < this.critChance || 0) {
                holdValue *= this.critMultiplier || 1;
            }

            this.addBananas(holdValue);
        }, interval);
    }

    stopHoldClick() {
        if (this.holdClickTimer) {
            clearInterval(this.holdClickTimer);
            this.holdClickTimer = null;
        }
    }
    // === Auto-click
    startAutoClick() {
        // Desativa temporariamente
        console.warn("Auto-click desabilitado temporariamente.");
        // Se houver um loop rodando, cancelamos
        if (this.autoClickIntervalID) {
            cancelAnimationFrame(this.autoClickIntervalID);
            this.autoClickIntervalID = null;
        }
    }


    stopAutoClick() {
        if (this.autoClickIntervalID) {
            cancelAnimationFrame(this.autoClickIntervalID);
            this.autoClickIntervalID = null;
        }
    }

    stopAutoClick() {
        if (this.autoClickIntervalID) {
            clearInterval(this.autoClickIntervalID);
            this.autoClickIntervalID = null;
        }
    }

    // === Criar um novo clicker (adiciona à rotação) ===
    addAutoClicker(level = 1) {
        console.warn("Auto-click desativado, nenhum clicker será adicionado.");
        // Não adiciona novos clickers
    }

    get allNodes() {
        return [
            ...this.skills,
            ...this.upgrades.map(monkey => monkey.skillNode).filter(Boolean)
        ];
    }

    // === Skills ===
    addSkillNode(skillNode) {
        this.skills.push(skillNode);
    }

    getSkillById(id) {
        const upgradeMonkey = this.upgrades.find(monkey => monkey.id === id);
        if (upgradeMonkey?.skillNode) return upgradeMonkey.skillNode; // <--- Prioriza o skillNode do monkey
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
