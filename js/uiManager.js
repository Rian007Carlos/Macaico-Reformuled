import { formatNumber } from './utils.js';
import { GameState } from './GameState.js';
import { Player } from './player.js';
import { Mine } from './Mine.js';
import { SFX } from './sfx/sfx.js';


SFX.register("bananaClick", "../sfx/banana_splash.m4a", 0.5);


export class UIManager {
    constructor(player, config) {
        this.player = player;
        this.elements = config;
        this.elements.upgrades = config.upgrades || [];
        this.elements.buildings = config.buildings || [];
        this.GameStateEvents();
        this.ClickOnBanana();
    }


    ClickOnBanana() {


        if (this.elements.bananaButton) {
            this.elements.bananaButton.addEventListener('click', () => {
                SFX.play("bananaClick");
                this.player.addBananas(1);

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
        description.textContent = `Nome: ${monkey.name}
        Custo: ${formatNumber(monkey.cost)} 
        Level: ${monkey.level} | Produção: ${formatNumber(monkey.getProduction())} bananas/s `;
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
                description.textContent = `Nome: ${monkey.name} | 
                Custo: ${formatNumber(monkey.cost)} | Level: ${monkey.level} | Produção: ${formatNumber(monkey.getProduction())}  bananas/s `;
            }
        }
    }

    updateBananasFromMonkeys() {
        let total = 0;

        this.elements.upgrades.forEach(monkey => {
            if (monkey.unlocked) {
                total += monkey.getProduction(); // pode multiplicar por tickRate se for fracionado
            }
        });

        this.player.addBananas(total);
    }

    // Atualiza ou renderiza todos os upgrades desbloqueados
    checkAllUnlocks() {
        this.elements.upgrades.forEach(monkey => {
            const unlocked = monkey.hasUnlock({
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

    updateHUDCounter(counterElement, amount) {
        if (counterElement) {
            counterElement.textContent = formatNumber(amount);
        }
    }

    updateAll(player = this.player) {
        this.updateBananaDisplay(player.bananas);
        this.updatePrismaticDisplay(player.prismatics);
        this.updateBananasPerSecondDisplay(player.bananasPerSecond);
    }

    updateBananaDisplay(amount) {
        if (this.elements.bananaCount) this.elements.bananaCount.textContent = formatNumber(amount);
    }

    updatePrismaticDisplay(amount) {
        if (this.elements.prismaticsCount) this.elements.prismaticsCount.textContent = formatNumber(amount);
    }

    updateBananasPerSecondDisplay(amount) {
        if (this.elements.bananasPerSecond) this.elements.bananasPerSecond.textContent = formatNumber(amount);
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
                if (Mine.upgrade()) {
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

    renderSkillTree() {
        const container = document.getElementById("skills-container");
        if (!container) return;
        container.innerHTML = '';

        this.player.skillCategories.forEach(category => {
            // Cria container da categoria
            const catDiv = document.createElement("div");
            catDiv.classList.add("skill-category");

            // Título da categoria
            const title = document.createElement("h3");
            title.textContent = category.toUpperCase();
            catDiv.appendChild(title);

            // Container dos nodes
            const categoryNodes = document.createElement("div");
            categoryNodes.classList.add("category__nodes");
            catDiv.appendChild(categoryNodes);

            // Adiciona cada skill da categoria
            this.player.skills
                .filter(skill => skill.category === category)
                .forEach(skill => {
                    const skillEl = document.createElement("div");
                    const levelEl = document.createElement("span");
                    const nameEl = document.createElement("span");
                    const descriptionEl = document.createElement("p");

                    skillEl.classList.add("skill-node");
                    nameEl.classList.add("skill-name");
                    nameEl.textContent = skill.unlocked ? skill.name : "???";
                    descriptionEl.textContent = skill.unlocked ? skill.description : "???";

                    levelEl.classList.add("skill-level");
                    levelEl.textContent = `Lv ${skill.level}/${skill.maxLevel}`;


                    skillEl.appendChild(nameEl);
                    skillEl.appendChild(levelEl);
                    skillEl.appendChild(descriptionEl);

                    // Se tiver custo
                    if (skill.getCost) {
                        const costEl = document.createElement("span");
                        costEl.classList.add("skill-cost");
                        costEl.textContent = `Custo: ${formatNumber(skill.getCost(skill.level))} bananas`;
                        skillEl.appendChild(costEl);
                    }

                    const btn = document.createElement("button");
                    btn.textContent = skill.unlocked ? "Upgrade" : "Unlock";

                    btn.addEventListener("click", () => {
                        if (!skill.unlocked) skill.unlock(this.player);
                        else skill.upgrade(this.player, this);

                        this.renderSkillTree();
                        this.updateAll();
                    });

                    skillEl.appendChild(btn);
                    categoryNodes.appendChild(skillEl);
                });

            container.appendChild(catDiv);
        });
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
                GameState.reset(this.player, this.elements.upgrades, this.elements.buildings, this);
                this.clearMonkeys();
                this.clearBuildings();
                this.checkAllUnlocks();
                this.renderAllUnlockedMonkeys();


            });
        }
    }

    initUI() {

        this.clearMonkeys();             // limpa o container
        this.elements.upgrades.forEach(monkey => {
            if (monkey.unlocked) {
                this.renderMonkey(monkey);
            }
        });
        // Atualiza HUD

        this.checkAllUnlocks();
        this.renderAllUnlockedMonkeys();
    }


    showReloadWarning() {
        const warning = document.createElement('div');
        warning.textContent = "⚠️ NÃO RECARREGUE A PÁGINA! O jogo salva automaticamente.";
        warning.style.color = 'red';
        warning.style.fontWeight = 'bold';
        warning.style.marginBottom = '10px';
        document.body.prepend(warning);
    }

    startGameLoop() {
        const tickRate = 1000; // 1 segundo por tick
        setInterval(() => {
            this.updateBananasFromMonkeys();
            this.updateAll(); // atualiza HUD
        }, tickRate);
    }

}
