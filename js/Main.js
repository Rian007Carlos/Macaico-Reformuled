import { GameState } from './GameState.js';
import { Player } from './player.js';
import { UIManager } from './uiManager.js';
import { upgradeMonkeys } from './Monkey.js';
import { createSkillTree } from './skills/SkillTree.js';
import { SkillNode } from './skills/SkillNode.js';
import { bgmManager } from './sfx/bgmManager.js';

// === Instâncias principais ===
const player = new Player(null);
player.skills = createSkillTree(player);
player.skillCategories = [...new Set((player.skills || []).map(s => s.category || 'default'))];


const upgrades = [...upgradeMonkeys];
player.upgrades = upgrades;
const buildings = [
    { name: 'mine', unlocked: player.mine.unlocked },
    { name: 'laboratory', unlocked: player.laboratory.unlocked },
    { name: 'forge', unlocked: player.forge.unlocked }
];

// UIManager recebe referências aos elementos do DOM
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
    skills: player.skills
});

player.uiManager = ui;
ui.renderSkillTree();
ui.startUIRenderLoop();

// carrega estado salvo
function initGame() {
    GameState.load(player, upgrades, buildings, ui);

    // === Renderização inicial ===
    ui.clearMonkeys();              // limpa antes de re-renderizar
    ui.renderAllUnlockedMonkeys();  // recria todos os macacos desbloqueados
    ui.checkAllUnlocks();           // garante que unlocks dependentes sejam verificados
    ui.updateAllCounters(player);   // counters (bananas, prismatics, BPS)

    // Skills: reaplicar visual dos nós (locked/unlocked/level)
    ui.renderSkillTree();
    ui.updateSkillTreeUI(player);

    // Buildings
    if (player.mine.unlocked) {
        ui.renderMine();
    }
}



// ui.showReloadWarning();
ui.renderPlaylist();

bgmManager.onTrackChange = (trackName) => {
    const currentMusic = document.getElementById("current-music");
    if (currentMusic) currentMusic.textContent = trackName || "Nenhuma música";
    ui.updatePlaylistUI(); // atualiza também botão play/pause
};


initGame();
ui.startGameLoop();

setInterval(() => {
    GameState.save(player, upgrades, buildings);
    console.log("Jogo salvo");
}, 60000);
