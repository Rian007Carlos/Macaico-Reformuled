import { formatNumber } from './utils.js';
import { GameState } from './GameState.js';
import { Player } from './player.js';
import { Mine } from './Mine.js';
import { SFX } from './sfx/sfx.js';
import { bgmManager } from './sfx/bgmManager.js';
import { Telemetry } from './telemetry.js';


SFX.register("bananaClick", "../sfx/banana_splash.m4a", 0.2);
SFX.register("denied", "../sfx/denied.m4a", 0.1);
bgmManager.register("good night lofi", new Audio("../music/good-night-lofi.mp3"));
bgmManager.register("cheeky monkey", new Audio("../music/cheeky-monkey-392394.mp3"));
bgmManager.register("lost in dreams", new Audio("../music/lost-in-dreams.mp3"));
bgmManager.register("Monkeys Spinning Monkeys", new Audio("../music/Monkeys-Spinning-Monkeys.mp3"));
bgmManager.register("as cool as a cucumber", new Audio("../music/as-cool-as-a-cucumber-236004.mp3"));
bgmManager.register("animal", new Audio("../music/animal-252993.mp3"));
bgmManager.register("rain drops on the banana leaves", new Audio("../music/rain-drops-on-the-banana-leaves-south-china-folk-music-167331.mp3"));

// bgmManager.playBGM();

export class UIManager {
    constructor(player, config) {
        this.player = player;
        this.telemetry = new Telemetry(player);
        this.elements = config;
        this.elements.upgrades = config.upgrades || [];
        this.elements.buildings = config.buildings || [];
        this.GameStateEvents();
        this.ClickOnBanana();
        this.playlistInterval = null;
    }

    ClickOnBanana() {
        if (this.elements.bananaButton) {
            this.elements.bananaButton.addEventListener('click', () => {
                SFX.play("bananaClick");

                let isCrit = Math.random() < this.player.critChance;
                let clickValue = this.player.clickValue;

                if (isCrit && this.player.critMultiplier <= 1) {
                    isCrit = false;
                }
                if (isCrit) {
                    clickValue *= this.player.critMultiplier;
                }

                this.player.addBananas(clickValue, true);   // usa SEMPRE o valor calculado
                this.createFloatingText(clickValue, isCrit);
                this.checkAllUnlocks();
            });
        }
    }

    createFloatingText(value, isCrit) {
        const container = document.getElementById("banana-container");
        const text = document.createElement("div");

        text.className = "floating-text" + (isCrit ? " crit" : "");
        text.innerText = `+${Math.floor(value)}🍌`;

        const offsetX = (Math.random() - 0.5) * 200;
        const offsetY = (Math.random() - 0.5) * 50;

        text.style.left = `calc(50% + ${offsetX}px)`;
        text.style.top = `calc(50% + ${offsetY}px)`;
        text.style.position = "absolute";

        container.appendChild(text);

        setTimeout(() => {
            text.remove();
        }, 1000);
    }


    showDeniedFeedBack(element, duration = 500) {
        if (!element) return;

        element.classList.add("denied");
        setTimeout(() => {
            element.classList.remove("denied");
        }, duration);
    }

    handlePurchase(actionCallback, element) {
        const success = actionCallback(); // retorna true/false
        if (!success) this.showDeniedFeedBack(element);
        return success;
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
            const success = monkey.buy(this.player, this);
            if (!success) this.showDeniedFeedBack(buyBtn);


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

        total *= (this.player.globalProductionMultiplier || 1);

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
            // this.renderMine();
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
    // renderMine() {
    //     const container = document.getElementById('buildings-container');
    //     if (!container) return;

    //     // Evita duplicar
    //     if (this.player.mine.unlocked && !container.querySelector('#mine')) {
    //         const mineEl = document.createElement('div');
    //         mineEl.id = 'mine';
    //         mineEl.classList.add('building');

    //         const info = document.createElement('span');
    //         info.classList.add('mine-info');
    //         info.textContent = `⛏️ Mina - Nível: ${this.player.mine.level}`;

    //         const mininingButton = document.createElement('button');
    //         mininingButton.textContent = "Mineirar";
    //         mininingButton.addEventListener('click', () => {
    //             if (Mine.upgrade()) {
    //                 this.updateMineUI();
    //             }
    //         });

    //         mineEl.appendChild(info);
    //         mineEl.appendChild(mininingButton);
    //         container.appendChild(mineEl);
    //     }
    // }

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

        // segurança: garante arrays válidos
        const skills = Array.isArray(this.player?.skills) ? this.player.skills : [];
        const categories = Array.isArray(this.player?.skillCategories) && this.player.skillCategories.length > 0
            ? this.player.skillCategories
            : [...new Set(skills.map(s => s.category || 'default'))];

        categories.forEach(category => {
            const catDiv = document.createElement("div");
            catDiv.classList.add("skill-category");

            const title = document.createElement("h3");
            title.textContent = (category || 'DEFAULT').toString().toUpperCase();
            catDiv.appendChild(title);

            const categoryNodes = document.createElement("div");
            categoryNodes.classList.add("category__nodes");
            catDiv.appendChild(categoryNodes);

            skills
                .filter(skill => skill && skill.category === category)
                .forEach(skill => {
                    const skillEl = document.createElement("div");
                    const levelEl = document.createElement("span");
                    const nameEl = document.createElement("span");
                    const descriptionEl = document.createElement("p");
                    const costEl = document.createElement("span"); // criado sempre

                    skillEl.classList.add("skill-node");

                    nameEl.classList.add("skill-name");
                    nameEl.textContent = skill.unlocked ? skill.name : "???";

                    descriptionEl.textContent = skill.unlocked ? skill.description : "???";

                    levelEl.classList.add("skill-level");
                    levelEl.textContent = `Lv ${skill.level}/${skill.maxLevel}`;

                    skillEl.appendChild(nameEl);
                    skillEl.appendChild(levelEl);
                    skillEl.appendChild(descriptionEl);

                    // dentro de renderSkillTree, para exibir custo:
                    if (skill.hasCost && skill.hasCost()) {
                        costEl.classList.add("skill-cost");
                        const lvl = (typeof skill.level === 'number') ? skill.level : 0;
                        const nextCost = skill.getNextCost(lvl);
                        costEl.textContent = `Custo: ${formatNumber(nextCost)} bananas`;
                        skillEl.appendChild(costEl);
                    }

                    const btn = document.createElement("button");
                    btn.textContent = skill.unlocked ? "Atualizar" : "Desbloquear";

                    btn.addEventListener("click", () => {
                        let success = false;
                        if (!skill.unlocked) {
                            success = skill.unlock(this.player);
                        } else {
                            success = skill.upgrade(this.player, this);
                        }

                        if (!success) {
                            this.showDeniedFeedBack(btn);
                        }

                        // Atualiza só este node
                        levelEl.textContent = `Lv ${skill.level}/${skill.maxLevel}`;
                        nameEl.textContent = skill.unlocked ? skill.name : "???";
                        descriptionEl.textContent = skill.unlocked ? skill.description : "???";
                        // depois do action:
                        if (skill.hasCost && skill.hasCost()) {
                            const lvl = (typeof skill.level === 'number') ? skill.level : 0;
                            costEl.textContent = `Custo: ${formatNumber(skill.getNextCost(lvl))} bananas`;
                        } else {
                            costEl.textContent = ''; // ou remova o elemento
                        }
                        btn.textContent = skill.unlocked ? "Atualizar" : "Desbloquear";

                        this.updateAll();
                    });

                    skillEl.appendChild(btn);
                    categoryNodes.appendChild(skillEl);
                });

            container.appendChild(catDiv);
        });
    }


    renderPlaylist() {
        const playlistContainer = document.getElementById("playlist-container");
        const playlistActions = document.getElementById("playlist-actions");
        const progressContainer = document.getElementById("playlist-progress");

        if (!playlistContainer || !playlistActions || !progressContainer) return;

        // --- Nome da música (apenas se não existir) ---
        let currentMusic = document.getElementById("current-music");
        if (!currentMusic) {
            currentMusic = document.createElement("span");
            currentMusic.id = "current-music";
            currentMusic.textContent = bgmManager.getCurrentTrackName() || "Nenhuma música";
            playlistContainer.appendChild(currentMusic);
        }

        // --- Botões ---
        if (!playlistActions.querySelector("button")) { // evita duplicar
            const previousButton = document.createElement("button");
            previousButton.textContent = "<<";
            previousButton.onclick = () => { bgmManager.previous(); this.updatePlaylistUI(); };

            const playPauseButton = document.createElement("button");
            playPauseButton.textContent = bgmManager.isPlaying() ? "Pause" : "Play";
            playPauseButton.onclick = () => {
                if (bgmManager.isPlaying()) bgmManager.currentTrack.pause();
                else bgmManager.currentTrack?.play() || bgmManager.playNext();
                this.updatePlaylistUI();
            };

            const nextButton = document.createElement("button");
            nextButton.textContent = ">>";
            nextButton.onclick = () => { bgmManager.next(); this.updatePlaylistUI(); };

            playlistActions.appendChild(previousButton);
            playlistActions.appendChild(playPauseButton);
            playlistActions.appendChild(nextButton);

            // slider volume
            const volumeSlider = document.createElement("input");
            volumeSlider.type = "range";
            volumeSlider.min = 0;
            volumeSlider.max = 1;
            volumeSlider.step = 0.01;
            volumeSlider.value = bgmManager.defaltVolume;
            volumeSlider.oninput = e => bgmManager.setVolume(parseFloat(e.target.value));
            playlistActions.appendChild(volumeSlider);
        }

        // --- Barra de progresso ---
        let progressBar = document.getElementById("bgm-progress");
        if (!progressBar) {
            progressBar = document.createElement("progress");
            progressBar.id = "bgm-progress";
            progressBar.max = 1;
            progressBar.value = 0;
            progressContainer.appendChild(progressBar);
        }

        // Atualiza barra a cada 200ms
        clearInterval(this.playlistInterval);
        this.playlistInterval = setInterval(() => {
            if (bgmManager.currentTrack) {
                progressBar.value = bgmManager.currentTrack.currentTime / bgmManager.currentTrack.duration || 0;
                this.updatePlaylistUI(); // atualiza nome e botão play/pause
            }
        }, 200);
    }

    // Atualiza nome e estado do play/pause sem recriar tudo
    updatePlaylistUI() {
        const currentMusic = document.getElementById("current-music");
        const playPauseButton = document.querySelector("#playlist-actions button:nth-child(2)");
        if (currentMusic) currentMusic.textContent = bgmManager.getCurrentTrackName() || "Nenhuma música";
        if (playPauseButton) playPauseButton.textContent = bgmManager.isPlaying() ? "Pause" : "Play";

        // verifica se precisa animar
        if (currentMusic.scrollWidth > currentMusic.clientWidth) {
            currentMusic.classList.add("scroll");
        } else {
            currentMusic.classList.remove("scroll");
        }
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

        // Botão de print manual de telemetria
        if (this.elements.telemetryButtonContainer) {
            const printBtn = document.createElement("button");
            printBtn.textContent = "Print Telemetry";
            printBtn.addEventListener("click", () => {
                this.telemetry.printNow();
            });
            this.elements.telemetryButtonContainer.appendChild(printBtn);
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
        this.renderPlaylist();
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
            this.telemetry.tick();
            this.updateAll(); // atualiza HUD

        }, tickRate);
    }

}
