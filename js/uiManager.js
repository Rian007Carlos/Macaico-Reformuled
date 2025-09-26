import { formatNumber } from './utils.js';
import { GameState } from './GameState.js';
import { SFX } from './sfx/sfx.js';
import { bgmManager } from './sfx/bgmManager.js';
import { Telemetry } from './telemetry.js';
import { checkMonkeyUnlocks } from './skills/MonkeySkillNodes.js';
import { SkillNode } from './skills/SkillNode.js';



// --- Registro de sons ---
SFX.register("bananaClick", "../sfx/banana_splash.m4a", 0.2);
SFX.register("denied", "../sfx/denied.m4a", 0.1);

// --- Registro de BGM ---
bgmManager.register("good night lofi", new Audio("../music/good-night-lofi.mp3"));
bgmManager.register("cheeky monkey", new Audio("../music/cheeky-monkey-392394.mp3"));
bgmManager.register("lost in dreams", new Audio("../music/lost-in-dreams.mp3"));
bgmManager.register("Monkeys Spinning Monkeys", new Audio("../music/Monkeys-Spinning-Monkeys.mp3"));
bgmManager.register("as cool as a cucumber", new Audio("../music/as-cool-as-a-cucumber-236004.mp3"));
bgmManager.register("animal", new Audio("../music/animal-252993.mp3"));
bgmManager.register("rain drops on the banana leaves", new Audio("../music/rain-drops-on-the-banana-leaves-south-china-folk-music-167331.mp3"));

// bgmManager.playBGM(); // opcional, disparar manualmente depois

// --- Tipos de atualização para UI Loop ---
export const UIUpdateType = {
    BANANA: "banana",
    MONKEY: "monkey",
    SKILL: "skill",
    PLAYLIST: "playlist",
    BUILDING: "building", // futuro uso: Mine, Laboratory, Forge
};

// --- UIManager ---
export class UIManager {
    constructor(player, config) {
        this.player = player;
        this.telemetry = new Telemetry(player);
        this.elements = config;
        this.elements.upgrades = config.upgrades || [];
        this.elements.buildings = config.buildings || [];
        this.skillTreeContainer = config.skillTreeContainer || null;
        this.playlistInterval = null;
        this.pendingUpdates = new Set();
        this.skillTreeContainer = config.skillTreeContainer || document.getElementById("skill-tree");
        this.openSkillTreeBtn = document.getElementById("open-skill-tree");
        this.closeSkillTreeBtn = document.getElementById("close-skill-tree")
        this.GameStateEvents();
        this.ClickOnBanana();

        this.skillCard = document.getElementById("skill-card");
        this.cardTitle = document.getElementById("card-title");
        this.cardDescription = document.getElementById("card-description");
        this.cardPrice = document.getElementById("card-price");
        this.cardProgress = document.getElementById("card-progress");
        this.cardBuyBtn = document.getElementById("card-buy-btn");

        this.monkeyCard = document.getElementById("monkey-card");
        this.monkeyCardTitle = document.getElementById("monkey-card-title");
        this.monkeyCardDescription = document.getElementById("monkey-card-description");
        this.monkeyCardPrice = document.getElementById("monkey-card-price");
        this.monkeyCardProgress = document.getElementById("monkey-card-progress");
        this.monkeyCardBuyBtn = document.getElementById("monkey-card-buy-btn");

        // Listener do botão de compra do card de skill
        this.cardBuyBtn.addEventListener("click", () => {
            const skillId = this.skillCard.dataset.skillId;
            if (!skillId) return;

            const skill = this.player.getSkillById(skillId);
            if (!skill) return;

            console.group(`🟢 Clicou no botão Comprar para skillId = ${skillId}`);
            console.log("Objeto do skill antes da compra:", skill, "É SkillNode?", skill instanceof SkillNode);
            console.log("Level atual:", skill.level, "Max level:", skill.maxLevel);

            if (!skill.unlocked) {
                console.log("Skill estava bloqueada. Chamando unlock...");
                skill.unlock(this.player);
            } else {
                if (skill.isMonkey && skill.targetMonkey) {
                    console.log("🐵 Skill é monkey, tratando mastery...");
                    console.log("Level monkey antes:", skill.targetMonkey.level);

                    if (skill.level < skill.maxLevel) {
                        skill.level++;
                        skill.targetMonkey.level = skill.level; // sincroniza
                        console.log("Level monkey atualizado:", skill.targetMonkey.level);

                        skill.effect(this.player, skill.level); // aplica efeito
                        console.log("Efeito aplicado. Produção recalculada:", this.player.bananasPerSecond);
                    } else {
                        console.log("Skill monkey já está no nível máximo.");
                    }
                } else {
                    console.log("✨ Skill normal, chamando upgrade...");
                    skill.upgrade(this.player, this);
                }
            }

            // Atualiza card e árvore
            if (skill.isMonkey) {
                console.log("Atualizando card de monkey...");
                this.showMonkeyCard(skill);
            } else {
                console.log("Atualizando card de skill normal...");
                this.showNodeCard(skill);
            }

            console.groupEnd();
            this.renderSkillTree();
        });



        this.setupSkillTreeListeners();
        this.setupSkillTreeOutsideClick();

    }

    // =========================
    // 1️⃣ Click na banana
    // =========================
    ClickOnBanana() {
        const bananaBtn = document.getElementById("banana-button");
        if (!bananaBtn) return;

        bananaBtn.addEventListener("click", (event) => {
            SFX.play("bananaClick");

            let isCrit = Math.random() < this.player.critChance;
            let clickValue = this.player.clickValue;

            if (isCrit && this.player.critMultiplier > 1) {
                clickValue *= this.player.critMultiplier;
            } else {
                isCrit = false;
            }

            this.player.addBananas(clickValue, true);
           // this.player.addBananas(1000, true);
            this.createFloatingText(clickValue, isCrit);
            this.updateBananaDisplay(this.player.bananas);
            this.queueUIUpdate(UIUpdateType.SKILL);
        });
    }


    createFloatingText(value, isCrit) {
        const container = document.getElementById("banana-container");
        if (!container) return;

        const text = document.createElement("div");
        text.className = "floating-text" + (isCrit ? " crit" : "");
        text.innerHTML = `+${Math.floor(value)} <img src="assets/banana-cat.png" alt="">`;

        const offsetX = (Math.random() - 0.5) * 200;
        const offsetY = (Math.random() - 0.5) * 50;
        text.style.left = `calc(50% + ${offsetX}px)`;
        text.style.top = `calc(50% + ${offsetY}px)`;
        text.style.position = "absolute";

        container.appendChild(text);

        setTimeout(() => text.remove(), 1000);
    }

    showDeniedFeedBack(element, duration = 500) {
        if (!element) return;
        element.classList.add("denied");
        setTimeout(() => element.classList.remove("denied"), duration);
    }


    // =========================
    // Auto Clicker Animation
    // =========================
    spawnAutoClickAnimation(clicker) {
        const banana = document.getElementById("banana-button");
        const container = document.getElementById("banana-container");
        if (!banana || !container || !clicker.element) return;

        const bananaRect = banana.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        const centerX = bananaRect.left + bananaRect.width / 2 - containerRect.left;
        const centerY = bananaRect.top + bananaRect.height / 2 - containerRect.top;

        const radius = 80;

        // calcula posição do clicker na órbita
        const x = centerX + radius * Math.cos((clicker.angle * Math.PI) / 180);
        const y = centerY + radius * Math.sin((clicker.angle * Math.PI) / 180);

        clicker.element.style.left = `${x}px`;
        clicker.element.style.top = `${y}px`;

        // anima "vai e vem" (mini clique na banana)
        clicker.element.animate([
            { transform: "scale(1)" },
            { transform: "scale(0.7)" },
            { transform: "scale(1)" }
        ], {
            duration: 500,
            easing: "ease-in-out"
        });

        // atualiza ângulo continuamente
        clicker.angle += clicker.speed * clicker.direction;
        if (clicker.angle > 360) clicker.angle -= 360;
        if (clicker.angle < 0) clicker.angle += 360;
    }


    // =========================
    // 2️⃣ Monkeys (Upgrades)
    // =========================
    renderMonkey(monkey) {

        const container = document.getElementById('upgrades-container');
        if (!container || container.querySelector(`[data-monkey="${monkey.id}"]`)) return;

        const monkeyEl = document.createElement('div');
        monkeyEl.classList.add('monkey');
        monkeyEl.setAttribute('data-monkey', monkey.id);

        const description = document.createElement('span');
        description.classList.add('description');

        const cost = monkey.getNextCost?.() ?? 0;
        this.cardPrice.textContent = formatNumber(cost)
        description.textContent = `Nome: ${monkey.name} | Custo: ${formatNumber(monkey.cost ?? 0)} | Level: ${monkey.level} | Produção: ${formatNumber(monkey.getProduction?.() ?? 0)} bananas/s`;
        monkeyEl.appendChild(description);

        const buyBtn = document.createElement('button');
        buyBtn.textContent = "Comprar";
        buyBtn.addEventListener('click', () => {
            const success = monkey.buy(this.player, this);
            if (!success) this.showDeniedFeedBack(buyBtn);

            // Atualiza apenas UI, unlocks serão processados pelo loop
            this.updateMonkeyUI(monkey);
            this.updateBananasFromMonkeys();
        });

        monkeyEl.appendChild(buyBtn);
        container.appendChild(monkeyEl);
    }

    updateMonkeyUI(monkey) {
        const monkeyEl = document.querySelector(`.monkey[data-monkey="${monkey.id}"]`);
        if (!monkeyEl) return;

        const description = monkeyEl.querySelector('.description');
        if (!description) return;

        description.textContent = `Nome: ${monkey.name} | Custo: ${formatNumber(monkey.cost)} | Level: ${monkey.level} | Produção: ${formatNumber(monkey.getProduction())} bananas/s`;
    }


    clearMonkeys() {
        const container = document.getElementById('upgrades-container');
        if (container) container.innerHTML = '';
    }

    renderAllUnlockedMonkeys() {
        checkMonkeyUnlocks(this.player);
    }

    updateMonkeyDescription(monkey) {
        const monkeyEl = document.querySelector(`.monkey[data-monkey="${monkey.id}"]`);
        if (!monkeyEl) return;

        const description = monkeyEl.querySelector('.description');
        if (!description) return;

        description.textContent = `Nome: ${monkey.name} | Custo: ${formatNumber(monkey.cost)} | Level: ${monkey.level} | Produção: ${formatNumber(monkey.getProduction())} bananas/s`;
    }

    updateBananasFromMonkeys() {
        let total = 0;
        this.elements.upgrades.forEach(monkey => {
            if (monkey.unlocked) total += monkey.getProduction();
        });
        total *= (this.player.globalProductionMultiplier || 1);
        this.player.addBananas(total);
        this.queueUIUpdate(UIUpdateType.BANANA);
    }

    checkAllUnlocks() {
        this.elements.upgrades.forEach(monkey => {
            const node = monkey.skillNode;
            if (node) node.unlock(this.player); // tenta desbloquear
            if (monkey.unlocked) this.renderMonkey(monkey);
            // console.log(monkey.canUnlock(player))
        });

        // --- Buildings desbloqueadas ---
        if (this.player.mine?.unlocked) this.renderMine();
        if (this.player.laboratory?.unlocked) this.renderLaboratory();
        if (this.player.forge?.unlocked) this.renderForge();
    }

    // =========================
    // 3️⃣ HUD
    // =========================
    updateHUDCounter(counterElement, amount) {
        if (counterElement) counterElement.textContent = formatNumber(amount);
    }

    updateAllCounters(player = this.player) {
        this.updateBananaDisplay(player.bananas);
        this.updatePrismaticDisplay(player.prismatics);
        this.updateBananasPerSecondDisplay(player.bananasPerSecond);
    }

    updateBananaDisplay(amount) {
        if (this.elements.bananaCount) this.elements.bananaCount.textContent = formatNumber(amount);
    }

    updatePrismaticDisplay(amount) {
        if (this.elements.prismaticCount) this.elements.prismaticCount.textContent = formatNumber(amount);
    }

    updateBananasPerSecondDisplay(amount) {
        if (this.elements.bananasPerSecond) this.elements.bananasPerSecond.textContent = formatNumber(amount);
    }

    // =========================
    // 4️⃣ Buildings
    // =========================
    renderMine() {
        const container = document.getElementById('buildings-container');
        if (!container || !this.player.mine?.unlocked) return;
        if (container.querySelector('#mine')) return; // evita duplicar

        const mineEl = document.createElement('div');
        mineEl.id = 'mine';
        mineEl.classList.add('building');

        const info = document.createElement('span');
        info.classList.add('mine-info');
        info.textContent = `⛏️ Mina - Nível: ${this.player.mine.level}`;

        const miningBtn = document.createElement('button');
        miningBtn.textContent = "Mineirar";
        miningBtn.addEventListener('click', () => {
            if (this.player.mine.upgrade?.()) this.updateMineUI();
        });

        mineEl.appendChild(info);
        mineEl.appendChild(miningBtn);
        container.appendChild(mineEl);
    }

    updateMineUI() {
        const info = document.querySelector('#mine .mine-info');
        if (info) info.textContent = `⛏️ Mina - Nível: ${this.player.mine.level}`;
    }

    clearBuildings() {
        const container = document.getElementById('buildings-container');
        if (container) container.innerHTML = '';
    }

    // Pontos de extensão futura: renderLaboratory(), renderForge()
    renderLaboratory() { /* similar à renderMine */ }
    renderForge() { /* similar à renderMine */ }

    // =========================
    // 5️⃣ Skill Tree
    // =========================
    // =========================
    renderSkillTree() {
        if (!Array.isArray(this.player?.allNodes)) {
            console.warn("⚠️ player.allNodes não é um array ou não existe", this.player?.allNodes);
            return;
        }

        console.log("🔹 Atualizando skill tree...");
        SkillNode.updateAllUnlocks(this.player.allNodes, this.player);

        this.player.allNodes.forEach(node => {
            // console.log("🔸 Processando node:", node.id, node);

            const button = document.getElementById(node.id);
            if (!button) {
                console.warn(`⚠️ Botão não encontrado para node.id = ${node.id}`);
                return;
            }

            // reset listeners
            const newButton = button.cloneNode(true);
            button.replaceWith(newButton);

            // classes visuais
            newButton.classList.toggle("locked", !node.unlocked);
            newButton.classList.toggle("unlocked", node.unlocked);

            // clique genérico
            newButton.addEventListener("click", (ev) => {
                ev.stopPropagation();
                console.log(`➡️ Clicou no node: ${node.id}`, node);

                if (!node.unlocked) {
                    console.log("🔒 Node ainda bloqueado!");
                    this.showDeniedFeedBack(newButton);
                    return;
                }

                if (node.isMonkey) {
                    console.log("🐵 Node é monkey, chamando showMonkeyCard");
                    this.queueUIUpdate(UIUpdateType.MONKEY);
                    this.queueUIUpdate(UIUpdateType.BANANA);
                    this.showMonkeyCard(node);
                } else {
                    console.log("✨ Node não é monkey, chamando showNodeCard");
                    this.showNodeCard(node);
                }

                // só mostra [MAX] quando atingir nível máximo
                if (node.level >= node.maxLevel) {
                    newButton.textContent = "[MAX]";
                }
            });

            // tooltip/descrição visível no hover
            newButton.title = node.unlocked ? node.description : "???";

            // aplica texto [MAX] inicial se necessário
            if (node.level >= node.maxLevel) {
                newButton.textContent = "[MAX]";
            }

            this.checkAllUnlocks();
        });
    }


    showMonkeyCard(node) {
        console.group(`🟨 showMonkeyCard chamado para node.id = ${node.id}`);
        if (!node) {
            console.error("❌ node é undefined ou null!");
            return;
        } else {
            console.log("Objeto completo do node:", node);
            console.log("Nome:", node.name);
            console.log("Descrição:", node.description);
            console.log("Level atual:", node.level);
            console.log("Max level:", node.maxLevel);
            console.log("Custo próximo (getNextCost):", node.getNextCost?.());
        }
        console.groupEnd();

        if (!node.unlocked) {
            this.showDeniedFeedBack(document.getElementById(node.id));
            return;
        }

        // Atualiza o skill card
        this.skillCard.dataset.skillId = node.id;
        this.cardTitle.textContent = node.name;
        this.cardDescription.textContent = "";

        // Se for monkey
        if (node.isMonkey && node.targetMonkey) {
            this.cardPrice.textContent = node.level >= node.maxLevel ? "[MAX]" : `Custo: ${formatNumber(node.getNextCost?.() || 0)}`;
            this.cardProgress.textContent = `[${node.level} / ${node.maxLevel}]`;
            this.cardBuyBtn.classList.toggle("hidden", node.level >= node.maxLevel);

            // Modificadores ativos
            const modifiers = this.player.getMonkeyModifiers?.(node.id) || [];
            if (modifiers.length > 0) {
                this.cardDescription.textContent = "Modificadores ativos:\n- " + modifiers.join("\n- ");
            } else {
                this.cardDescription.textContent = "Nenhum modificador aplicado ainda.";
            }

        } else {
            // fallback caso não seja monkey
            this.cardPrice.textContent = "";
            this.cardProgress.textContent = "";
            this.cardBuyBtn.classList.add("hidden");
        }

        this.skillCard.classList.remove("hidden");
    }



    // =========================
    showNodeCard(node) {
        if (!node.unlocked) {
            this.showDeniedFeedBack(document.getElementById(node.id));
            return;
        }

        this.skillCard.dataset.skillId = node.id;
        this.cardTitle.textContent = node.name;
        this.cardDescription.textContent = node.description || "";

        if (node.isMonkey) {
            // === Mastery dos macacos ===
            this.cardDescription.textContent = "";
            this.cardPrice.textContent = "";
            this.cardProgress.textContent = "";
            this.cardBuyBtn.classList.add("hidden");

            const modifiers = this.player.getMonkeyModifiers?.(node.id) || [];

            this.cardDescription.textContent += "\n\nModificadores ativos:";
            if (modifiers.length > 0) {
                this.cardDescription.textContent += "\n- " + modifiers.join("\n- ");
            } else {
                this.cardDescription.textContent += "\nNenhum modificador aplicado ainda.";
            }

        } else if (typeof node.getNextCost === "function") {
            // === Skills comuns ===
            const cost = node.getNextCost();
            if (node.level >= node.maxLevel) {
                this.cardPrice.textContent = "[MAX]";
                this.cardProgress.textContent = `[${node.level} / ${node.maxLevel}]`;
                this.cardBuyBtn.classList.add("hidden");
            } else {
                this.cardPrice.textContent = cost !== null ? `Custo: ${formatNumber(cost)}` : "";
                this.cardProgress.textContent = `[${node.level} / ${node.maxLevel}]`;
                this.cardBuyBtn.classList.remove("hidden");
            }
        } else {
            // fallback
            this.cardPrice.textContent = "";
            this.cardProgress.textContent = "";
            this.cardBuyBtn.classList.add("hidden");
        }

        this.skillCard.classList.remove("hidden");
    }



    setupSkillTreeListeners() {
        // Botões de abrir/fechar skill tree
        if (this.openSkillTreeBtn) {
            this.openSkillTreeBtn.addEventListener("click", () => this.openSkillTree());
        }
        if (this.closeSkillTreeBtn) {
            this.closeSkillTreeBtn.addEventListener("click", () => this.closeSkillTree());
        }

        this.cardCloseBtn = document.getElementById("card-close-btn");
        if (this.cardCloseBtn) {
            this.cardCloseBtn.addEventListener("click", (ev) => {
                ev.stopPropagation(); // não deixa passar pro container
                this.skillCard.classList.add("hidden");
                delete this.skillCard.dataset.skillId;
            });
        }

    }

    // Fecha o card quando clicar "fora" de um node (ou quando clicar no próprio modal/card)
    setupSkillTreeOutsideClick() {
        if (!this.skillTreeContainer) return;
        // garante que não adicionamos múltiplos listeners acidentalmente
        if (this._skillTreeOutsideClickAdded) return;
        this._skillTreeOutsideClickAdded = true;

        this.skillTreeContainer.addEventListener("click", (event) => {
            // se o clique foi num node, NÃO fecha (node já lida com abrir)
            if (event.target.closest(".skill-node")) return;
            if (event.target.closest("#skill-card")) return;

            if (!this.skillCard.classList.contains("hidden")) {
                this.skillCard.classList.add("hidden");
                delete this.skillCard.dataset.skillId;
            }
        });
    }


    openSkillTree() {
        this.skillTreeContainer.classList.remove("hidden");
        this.renderSkillTree();

    }

    closeSkillTree() {
        this.skillTreeContainer.classList.add("hidden");
    }




    // =========================
    // 6️⃣ Playlist / BGM
    // =========================
    renderPlaylist() {
        const playlistContainer = document.getElementById("playlist-container");
        const playlistActions = document.getElementById("playlist-actions");
        const progressContainer = document.getElementById("playlist-progress");
        if (!playlistContainer || !playlistActions || !progressContainer) return;

        let currentMusic = document.getElementById("current-music");
        if (!currentMusic) {
            currentMusic = document.createElement("span");
            currentMusic.id = "current-music";
            currentMusic.textContent = bgmManager.getCurrentTrackName() || "Nenhuma música";
            playlistContainer.appendChild(currentMusic);
        }

        if (!playlistActions.querySelector("button")) {
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

            // volume
            const volumeSlider = document.createElement("input");
            volumeSlider.type = "range";
            volumeSlider.min = 0;
            volumeSlider.max = 1;
            volumeSlider.step = 0.01;
            volumeSlider.value = bgmManager.defaltVolume;
            volumeSlider.oninput = e => bgmManager.setVolume(parseFloat(e.target.value));

            playlistActions.append(previousButton, playPauseButton, nextButton, volumeSlider);
        }

        let progressBar = document.getElementById("bgm-progress");
        if (!progressBar) {
            progressBar = document.createElement("progress");
            progressBar.id = "bgm-progress";
            progressBar.max = 1;
            progressBar.value = 0;
            progressContainer.appendChild(progressBar);
        }

        clearInterval(this.playlistInterval);
        this.playlistInterval = setInterval(() => {
            if (bgmManager.currentTrack) {
                progressBar.value = bgmManager.currentTrack.currentTime / bgmManager.currentTrack.duration || 0;
                this.updatePlaylistUI();
            }
        }, 200);
    }

    updatePlaylistUI() {
        const currentMusic = document.getElementById("current-music");
        const playPauseButton = document.querySelector("#playlist-actions button:nth-child(2)");
        if (currentMusic) currentMusic.textContent = bgmManager.getCurrentTrackName() || "Nenhuma música";
        if (playPauseButton) playPauseButton.textContent = bgmManager.isPlaying() ? "Pause" : "Play";

        if (currentMusic.scrollWidth > currentMusic.clientWidth) currentMusic.classList.add("scroll");
        else currentMusic.classList.remove("scroll");
    }

    // =========================
    // 7️⃣ Save / Load / Reset
    // =========================
    GameStateEvents() {
        if (this.elements.loadButton) {
            this.elements.loadButton.addEventListener('click', () => {
                GameState.load(this.player, this.elements.upgrades, this.elements.buildings, this);
                this.queueUIUpdate(UIUpdateType.MONKEY);
                this.queueUIUpdate(UIUpdateType.BANANA);
                this.queueUIUpdate(UIUpdateType.SKILL);
                this.queueUIUpdate(UIUpdateType.BUILDING);
            });
        }

        if (this.elements.saveButton) {
            this.elements.saveButton.addEventListener('click', () => {
                GameState.save(this.player, this.elements.upgrades, this.elements.buildings);
            });
        }

        if (this.elements.resetButton) {
            this.elements.resetButton.addEventListener('click', () => {
                GameState.reset(this.player, this.elements.upgrades, this.elements.buildings, this);
                this.queueUIUpdate(UIUpdateType.MONKEY);
                this.queueUIUpdate(UIUpdateType.BUILDING);
                this.queueUIUpdate(UIUpdateType.BANANA);
                this.queueUIUpdate(UIUpdateType.SKILL);
            });
        }

        if (this.elements.telemetryButtonContainer) {
            const printBtn = document.createElement("button");
            printBtn.textContent = "Print Telemetry";
            printBtn.addEventListener("click", () => this.telemetry.printNow());
            this.elements.telemetryButtonContainer.appendChild(printBtn);
        }
    }

    // =========================
    // 8️⃣ UI Loop e Game Loop
    // =========================

    queueUIUpdate(updateType) {
        this.pendingUpdates.add(updateType);
    }

    startUIRenderLoop() {
        const fps = 30;
        setInterval(() => {
            if (this.pendingUpdates.size === 0) return;

            this.pendingUpdates.forEach(updateType => {
                switch (updateType) {
                    case UIUpdateType.MONKEY:
                        checkMonkeyUnlocks(this.player); // garante unlocks antes de render
                        this.elements.upgrades.forEach(monkey => {
                            if (monkey.unlocked) {
                                if (!document.querySelector(`.monkey[data-monkey="${monkey.name}"]`)) {
                                    this.renderMonkey(monkey);
                                } else {
                                    this.updateMonkeyUI(monkey);
                                }
                            }
                        });
                        break;
                    case UIUpdateType.SKILL: this.renderSkillTree(); break;
                    case UIUpdateType.PLAYLIST: this.renderPlaylist(); break;
                    case UIUpdateType.BUILDING:
                        if (this.player.mine?.unlocked) this.renderMine();
                        if (this.player.laboratory?.unlocked) this.renderLaboratory();
                        if (this.player.forge?.unlocked) this.renderForge();
                        break;
                }
            });

            this.pendingUpdates.clear();
        }, 1000 / fps);
    }
    startGameLoop() {
        const tickRate = 1000;
        setInterval(() => {
            this.updateBananasFromMonkeys();
            this.telemetry.tick();
            this.updateAllCounters();
        }, tickRate);
    }


}
