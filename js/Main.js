import { GameState } from './GameState.js';
import { UIManager } from './uiManager.js';
import { Player } from './player.js';
import { upgradeMonkeys } from './Monkey.js';
import { bgmManager } from './sfx/bgmManager.js';
import { initializeSkills } from './skills/initializeSkills.js';
import { createMonkeySkillNodes } from './skills/MonkeySkillNodes.js';

// === Instâncias principais ===
const player = new Player(null);
initializeSkills(player);
createMonkeySkillNodes(player);


// 2️⃣ Cria nodes da skill tree e adiciona ao player

player.skillCategories = [...new Set((player.skills || []).map(s => s.category || 'default'))];

// 3️⃣ Upgrades e buildings
const upgrades = [...upgradeMonkeys];
player.upgrades = upgrades;

const buildings = [
    { name: 'mine', unlocked: player.mine?.unlocked },
    { name: 'laboratory', unlocked: player.laboratory?.unlocked },
    { name: 'forge', unlocked: player.forge?.unlocked }
];

// 4️⃣ UIManager recebe referências aos elementos do DOM
const ui = new UIManager(player, {
    telemetryButtonContainer: document.getElementById('telemetryButtonContainer'),
    bananaCount: document.getElementById('banana-count'),
    prismaticCount: document.getElementById('prismatics-count'),
    bananasPerSec: document.getElementById('bananas-per-second'),
    bananaButton: document.getElementById('banana-button'),
    saveButton: document.getElementById('save-button'),
    loadButton: document.getElementById('load-button'),
    resetButton: document.getElementById('reset-button'),
    upgrades: upgrades,
    buildings: buildings,
    skills: player.skills,
    skillTreeContainer: document.getElementById("skill-tree")
});

player.uiManager = ui;

// 5️⃣ Renderização inicial
ui.clearMonkeys();
ui.renderAllUnlockedMonkeys();
ui.checkAllUnlocks();
ui.updateAllCounters(player);
ui.renderSkillTree();
ui.setupSkillTreeListeners();
ui.renderPlaylist();

// 7️⃣ Event listener para mudanças de música
bgmManager.onTrackChange = (trackName) => {
    const currentMusic = document.getElementById("current-music");
    if (currentMusic) currentMusic.textContent = trackName || "Nenhuma música";
    ui.updatePlaylistUI(); // atualiza também botão play/pause
};

// 8️⃣ Load estado salvo
function initGame() {
    GameState.load(player, upgrades, buildings, ui);

    ui.clearMonkeys();
    ui.renderAllUnlockedMonkeys();
    ui.checkAllUnlocks();
    ui.updateAllCounters(player);

    if (player.mine?.unlocked) ui.renderMine();
}

// 9️⃣ Inicia loops
initGame();
ui.startUIRenderLoop();
ui.startGameLoop();

// 10️⃣ Auto-save
setInterval(() => {
    GameState.save(player, upgrades, buildings);
    console.log("Jogo salvo");
}, 60000);
