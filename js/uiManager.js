import { formatNumber } from './utils.js';
import { GameState } from './GameState.js';

export class UIManager {
    constructor(player, config) {
        this.player = player;
        this.elements = config;
        this.elements.upgrades = config.upgrades || [];
        this.elements.buildings = config.buildings || [];
        this.GameStateEvents();
        this.ClickOnBanana();
    }

    initUI() {

        this.clearMonkeys();             // limpa o container
        this.elements.upgrades.forEach(monkey => {
            if (monkey.unlocked) {
                this.renderMonkey(monkey);
            }
        });
        // Atualiza HUD
        this.updateAll();

        // Renderiza upgrades desbloqueados
        this.checkAllUnlocks();

        this.renderAllUnlockedMonkeys();
    }

    ClickOnBanana() {
        if (this.elements.bananaButton) {
            this.elements.bananaButton.addEventListener('click', () => {
                this.player.addBananas(1);
                this.updateBananas();
                this.checkAllUnlocks();

            });
        }

    }

    showReloadWarning() {
        const warning = document.createElement('div');
        warning.textContent = "⚠️ NÃO RECARREGUE A PÁGINA! O jogo salva automaticamente.";
        warning.style.color = 'red';
        warning.style.fontWeight = 'bold';
        warning.style.marginBottom = '10px';
        document.body.prepend(warning);
    }

    // SAVE / LOAD / RESET
    GameStateEvents() {



        // Botão de carregar
        if (this.elements.loadButton) {
            this.elements.loadButton.addEventListener('click', () => {
                GameState.load(this.player, this.elements.upgrades, this.elements.buildings);
                this.checkAllUnlocks(); // garante que os macacos desbloqueados apareçam
                this.renderAllUnlockedMonkeys();
                this.updateAll();        // atualiza HUD
            });
        }

        // Botão de salvar
        if (this.elements.saveButton) {
            this.elements.saveButton.addEventListener('click', () => {
                GameState.save(this.player, this.elements.upgrades, this.elements.buildings);
            });
        }

        // Botão de resetar

        if (this.elements.resetButton) {
            this.elements.resetButton.addEventListener('click', () => {
                GameState.reset(this.player, this.elements.upgrades, this.elements.buildings);
                this.clearMonkeys();
                this.clearBuildings();
                this.updateAll();
                this.checkAllUnlocks();



            });
        }
    }

    renderMonkey(monkey) {
        const container = document.getElementById('upgrades-container');
        const buyBtn = document.createElement('button');
        const description = document.createElement('span');



        if (!container) return;
        if (container.querySelector(`[data-monkey="${monkey.name}"]`)) return;

        const monkeyEl = document.createElement('div');
        monkeyEl.classList.add('monkey');
        monkeyEl.setAttribute('data-monkey', monkey.name);

        monkeyEl.appendChild(description);

        description.classList.add('description');
        description.textContent = `Nome: ${monkey.name} | Custo: ${monkey.cost} | Level: ${monkey.level} | Produção: ${monkey.getProduction()} bananas/s `;
        monkeyEl.appendChild(buyBtn);

        buyBtn.textContent = "Comprar";

        buyBtn.addEventListener('click', () => {
            monkey.buy(this.player, this);


        });

        container.appendChild(monkeyEl);
    }

    clearMonkeys() {
        const container = document.getElementById('upgrades-container');
        if (container) {
            container.innerHTML = '';
        }
    }

    renderAllUnlockedMonkeys() {
        this.elements.upgrades.forEach(monkey => {
            if (monkey.unlocked) {
                this.renderMonkey(monkey);
            }
        })
    }

    updateMonkeyDescription(monkey) {
        const monkeyEl = document.querySelector(`.monkey[data-monkey="${monkey.name}"]`);
        if (monkeyEl) {
            const description = monkeyEl.querySelector('.description');
            if (description) {
                description.textContent = `Nome: ${monkey.name} | Custo: ${monkey.cost} | Level: ${monkey.level} | Produção: ${monkey.getProduction()}  bananas/s `;
            }
        }
    }

    // Atualiza ou renderiza todos os upgrades desbloqueados
    checkAllUnlocks() {
        this.elements.upgrades.forEach(monkey => {
            const unlocked = monkey.checkUnlock({
                player: this.player,
                upgrades: this.elements.upgrades,
                uiManager: this
            });

            if (unlocked) {
                this.renderMonkey(monkey);
            } else {
                // opcional: remover monkey da tela se travou/desbloqueio reverso
            }
        });

        // Verifica prédios
        if (this.player.mine.unlocked) {
            this.renderMine();
        }

        if (this.player.laboratory?.unlocked) {
            this.renderLaboratory();
        }

        if (this.player.forge?.unlocked) {
            this.renderForge();
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

    updateAll() {
        this.updateBananas();
        this.updatePrismatics();
    }

    // Renderiza a Mina
    // Dentro da classe UIManager
    renderMine() {
        const container = document.getElementById('buildings-container');
        if (!container) return;

        // Evita duplicar
        if (this.player.mine.unlocked && !container.querySelector('#mine')) {
            const mineEl = document.createElement('div');
            mineEl.id = 'mine';
            mineEl.classList.add('building');

            const info = document.createElement('span');
            info.classList.add('mine-info');
            info.textContent = `⛏️ Mina - Nível: ${this.player.mine.level}`;

            const mininingButton = document.createElement('button');
            mininingButton.textContent = "Mineirar";
            mininingButton.addEventListener('click', () => {
                if (this.player.upgradeMine()) {
                    this.updateMineUI();
                }
            });

            mineEl.appendChild(info);
            mineEl.appendChild(mininingButton);
            container.appendChild(mineEl);
        }
    }

    updateMineUI() {
        const info = document.querySelector('#mine .mine-info');
        if (info) {
            info.textContent = `⛏️ Mina - Nível: ${this.player.mine.level}`;
        }
    }

    clearBuildings() {
        const container = document.getElementById('buildings-container');
        if (container) {
            container.innerHTML = '';
        }
    }
}
