import { GameState } from './GameState.js';
import { Player } from './player.js';
import { UIManager } from './uiManager.js';
import { upgradeMonkeys } from './Monkey.js';
import { createSkillTree, renderSkillTreeSVG } from './skills/SkillTree.js';
import { SkillNode } from './skills/SkillNode.js';

// === Instâncias principais ===
const player = new Player(null);
createSkillTree(player);

const upgrades = [...upgradeMonkeys];
player.upgrades = upgrades;
const buildings = [
    { name: 'mine', unlocked: player.mine.unlocked },
    { name: 'laboratory', unlocked: player.laboratory.unlocked },
    { name: 'forge', unlocked: player.forge.unlocked }
];

// UIManager recebe referências aos elementos do DOM
const ui = new UIManager(player, {
    bananaCount: document.getElementById('banana-count'),
    prismaticCount: document.getElementById('prismatics-count'),
    bananasPerSec: document.getElementById('bananas-per-second'),
    bananaButton: document.getElementById('banana-button'),
    saveButton: document.getElementById('save-button'),
    loadButton: document.getElementById('load-button'),
    resetButton: document.getElementById('reset-button'),
    upgrades: upgrades,
    buildings: buildings,

});

player.uiManager = ui;
ui.renderSkillTree();

// carrega estado salvo
function initGame() {
    GameState.load(player, upgrades, buildings, ui);
    ui.renderAllUnlockedMonkeys();
    ui.checkAllUnlocks();
    ui.updateAll();

    if (player.mine.unlocked) {
        ui.renderMine();
    }
}


ui.showReloadWarning();


initGame();
ui.startGameLoop();

setInterval(() => {
    GameState.save(player, upgrades, buildings);
    console.log("Jogo salvo");
}, 5000);
