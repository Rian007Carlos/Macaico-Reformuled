import { GameState } from './GameState.js';
import { Player } from '../models/player.js';
import { UIManager } from '../ui/uiManager.js';
import { upgradeMonkeys } from '../models/Monkey.js';
import { Mine } from '../buildings/Mine.js';
import { Laboratory } from '../buildings/Laboratory.js';
import { Forge } from '../buildings/Forge.js';

// === Instâncias principais ===
const player = new Player();

// Substitui prédios padrão
player.mine = new Mine();
player.laboratory = new Laboratory();
player.forge = new Forge();

const buildings = [player.mine, player.laboratory, player.forge];
const upgrades = [...upgradeMonkeys];

// UIManager recebe referências
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

// Callbacks
ui.saveCallback = () => GameState.save(player, upgrades, buildings);
ui.loadCallback = () => {
    GameState.load(player, upgrades, buildings);
    startProductions();
    ui.updateAll();
};
ui.resetCallback = () => {
    GameState.reset(player, upgrades, buildings);
    ui.updateAll();
};

// === Funções auxiliares ===

// Inicia produção dos macacos com level > 0
function startProductions() {
    upgrades.forEach(monkey => {
        if (monkey.level > 0) monkey.beginProduction(player);
    });
}

// Checa unlocks de macacos e prédios
function checkAllMonkeyUnlocks() {
    upgrades.forEach(monkey => {
        if (monkey.hasUnlocked(player, upgrades)) {
            monkey.beginProduction(player);

            if (monkey.unlocksFeature) {
                const building = buildings.find(b => b.constructor.name.toLowerCase() === monkey.unlocksFeature);
                if (building) building.unlock();
            }
        }
    });
}

// === Inicialização ===
function initGame() {
    GameState.load(player, upgrades, buildings);

    // Ativa produções
    startProductions();

    // Atualiza a UI
    ui.updateAll();

    // Renderiza prédios desbloqueados
    buildings.forEach(b => {
        ui.renderBuilding(b, 'buildings-container', b.constructor.name, 'Upgrade', () => {
            if (b.upgrade) return b.upgrade(10, player.spendBananas.bind(player)); // exemplo de upgrade
            return false;
        });
    });
}

// === Loops contínuos ===

// Atualiza unlocks e HUD a cada segundo
setInterval(() => {
    checkAllMonkeyUnlocks();
    ui.updateAll();
}, 1000);

// Salva a cada 5 segundos
setInterval(() => {
    GameState.save(player, upgrades, buildings);
    console.log("Jogo salvo");
}, 5000);

// Inicializa
initGame();
