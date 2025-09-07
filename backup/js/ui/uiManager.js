import { formatNumber } from '../core/utils.js';

export class UIManager {
    constructor(player, config) {
        this.player = player;
        this.elements = config;

        this.initEvents();
        this.showReloadWarning();
        this.updateAll();
    }

    initEvents() {
        if (this.elements.bananaButton) {
            this.elements.bananaButton.addEventListener('click', () => {
                this.player.addBananas(1);
                this.updateAll();
            });
        }

        if (this.elements.saveButton) {
            this.elements.saveButton.addEventListener('click', () => {
                if (this.saveCallback) this.saveCallback();
            });
        }

        if (this.elements.loadButton) {
            this.elements.loadButton.addEventListener('click', () => {
                if (this.loadCallback) this.loadCallback();
                this.updateAll();
            });
        }

        if (this.elements.resetButton) {
            this.elements.resetButton.addEventListener('click', () => {
                if (this.resetCallback) this.resetCallback();
                this.updateAll();
            });
        }
    }

    updateBananas() {
        if (this.elements.bananaCount) {
            this.elements.bananaCount.textContent = formatNumber(this.player.bananas);
        }
    }

    updatePrismatics() {
        if (this.elements.prismaticCount) {
            this.elements.prismaticCount.textContent = formatNumber(this.player.prismatics);
        }
    }

    updateBananasPerSec() {
        if (this.elements.bananasPerSec) {
            this.elements.bananasPerSec.textContent = formatNumber(this.player.bananasPerSecond);
        }
    }

    updateAll() {
        this.updateBananas();
        this.updatePrismatics();
        this.updateBananasPerSec();
    }

    renderBuilding(building, containerId, label, actionLabel, actionCallback) {
        const container = document.getElementById(containerId);
        if (!container || !building.unlocked) return;
        if (container.querySelector(`#${building.constructor.name}`)) return;

        const buildingEl = document.createElement('div');
        buildingEl.classList.add('building');
        buildingEl.id = building.constructor.name;

        const info = document.createElement('span');
        info.textContent = `${label} - Nível: ${building.level}`;

        const actionButton = document.createElement('button');
        actionButton.textContent = actionLabel;
        actionButton.addEventListener('click', () => {
            if (actionCallback()) {
                info.textContent = `${label} - Nível: ${building.level}`;
                this.updateAll();
            }
        });

        buildingEl.appendChild(info);
        buildingEl.appendChild(actionButton);
        container.appendChild(buildingEl);
    }

    showReloadWarning() {
        const warning = document.createElement('div');
        warning.textContent = "⚠️ NÃO RECARREGUE A PÁGINA! O jogo salva automaticamente.";
        warning.style.color = 'red';
        warning.style.fontWeight = 'bold';
        warning.style.marginBottom = '10px';
        document.body.prepend(warning);
    }
}
