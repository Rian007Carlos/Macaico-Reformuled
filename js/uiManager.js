import { formatNumber } from './utils.js';
import { GameState } from './GameState.js';
import { Player } from './player.js';
import { Mine } from './Mine.js';
import { SFX } from './sfx/sfx.js';
import { bgmManager } from './sfx/bgmManager.js';
import { Telemetry } from './telemetry.js';
import { checkMonkeyUnlocks } from './skills/MonkeySkillNodes.js';


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
        this.playlistInterval = null;
        this.pendingUpdates = new Set();

        this.GameStateEvents();
        this.ClickOnBanana();
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

            this.player.addBananas(100000000000000000000, true);
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
        text.innerText = `+${Math.floor(value)}🍌`;

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
    // 2️⃣ Monkeys (Upgrades)
    // =========================
    renderMonkey(monkey) {

        const container = document.getElementById('upgrades-container');
        if (!container || container.querySelector(`[data-monkey="${monkey.name}"]`)) return;

        const monkeyEl = document.createElement('div');
        monkeyEl.classList.add('monkey');
        monkeyEl.setAttribute('data-monkey', monkey.name);

        const description = document.createElement('span');
        description.classList.add('description');
        description.textContent = `Nome: ${monkey.name} | Custo: ${formatNumber(monkey.cost)} | Level: ${monkey.level} | Produção: ${formatNumber(monkey.getProduction())} bananas/s`;
        monkeyEl.appendChild(description);

        const buyBtn = document.createElement('button');
        buyBtn.textContent = "Comprar";
        buyBtn.addEventListener('click', () => {
            const success = monkey.buy(this.player, this);
            if (!success) this.showDeniedFeedBack(buyBtn);

            // Atualiza apenas UI, unlocks serão processados pelo loop
            this.queueUIUpdate(UIUpdateType.MONKEY);
            this.queueUIUpdate(UIUpdateType.BANANA);
        });

        monkeyEl.appendChild(buyBtn);
        container.appendChild(monkeyEl);
    }

    updateMonkeyUI(monkey) {
        const monkeyEl = document.querySelector(`.monkey[data-monkey="${monkey.name}"]`);
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
        const monkeyEl = document.querySelector(`.monkey[data-monkey="${monkey.name}"]`);
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
    renderSkillTree() {
        const container = document.getElementById("skills-container");
        if (!container) return;
        container.innerHTML = '';

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

            skills.filter(skill => skill?.category === category).forEach(skill => {
                const skillEl = document.createElement("div");
                skillEl.classList.add("skill-node");

                const nameEl = document.createElement("span");
                nameEl.classList.add("skill-name");
                nameEl.textContent = skill.unlocked ? skill.name : "???";

                const levelEl = document.createElement("span");
                levelEl.classList.add("skill-level");
                levelEl.textContent = `Lv ${skill.level}/${skill.maxLevel}`;

                const descriptionEl = document.createElement("p");
                descriptionEl.textContent = skill.unlocked ? skill.description : "???";

                const costEl = document.createElement("span");
                if (skill.hasCost?.()) {
                    costEl.classList.add("skill-cost");
                    costEl.textContent = `Custo: ${formatNumber(skill.getNextCost(skill.level))} bananas`;
                }

                const btn = document.createElement("button");
                btn.textContent = skill.unlocked ? "Atualizar" : "Desbloquear";
                btn.addEventListener("click", () => {
                    let success = !skill.unlocked ? skill.unlock(this.player) : skill.upgrade(this.player, this);
                    if (!success) this.showDeniedFeedBack(btn);


                    this.updateSkillNode(skill, { nameEl, levelEl, descriptionEl, costEl, btn });
                    // Refatorado: remove updates diretas, deixa o UI loop atualizar
                    this.queueUIUpdate(UIUpdateType.BANANA);
                    this.queueUIUpdate(UIUpdateType.MONKEY);
                });

                skillEl.append(nameEl, levelEl, descriptionEl, costEl, btn);
                categoryNodes.appendChild(skillEl);
            });

            container.appendChild(catDiv);
        });
    }

    updateSkillTreeUI(player) {
        player.skills.forEach(skill => {
            const nodeEl = document.getElementById(`skill-${skill.id}`);
            if (!nodeEl) return;

            // locked/unlocked
            nodeEl.classList.toggle("locked", !skill.unlocked);
            nodeEl.classList.toggle("unlocked", skill.unlocked);

            // mostrar nível
            const levelEl = nodeEl.querySelector(".skill-level");
            if (levelEl) {
                levelEl.textContent = `Lvl ${skill.level}`;
            }

            // custo dinâmico
            const costEl = nodeEl.querySelector(".skill-cost");
            if (costEl && skill.hasCost) {
                costEl.textContent = `Custo: ${skill.getNextCost(skill.level)}`;
            }

            // descrição
            const descEl = nodeEl.querySelector(".skill-description");
            if (descEl) {
                descEl.textContent = skill.getDescription(skill.level);
            }
        });
    }


    updateSkillNode(skill, elements) {
        // elements = { nameEl, levelEl, descriptionEl, costEl, btn }
        const { nameEl, levelEl, descriptionEl, costEl, btn } = elements;

        if (!nameEl || !levelEl || !descriptionEl || !btn) return;

        nameEl.textContent = skill.unlocked ? skill.name : "???";
        levelEl.textContent = `Lv ${skill.level}/${skill.maxLevel}`;
        descriptionEl.textContent = skill.unlocked ? skill.description : "???";

        if (skill.hasCost && skill.hasCost()) {
            const lvl = (typeof skill.level === 'number') ? skill.level : 0;
            costEl.textContent = `Custo: ${formatNumber(skill.getNextCost(lvl))} bananas`;
        } else {
            costEl.textContent = '';
        }

        btn.textContent = skill.unlocked ? "Atualizar" : "Desbloquear";

        this.updateAllCounters(); // atualiza contadores globais
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