import { SkillNode } from './SkillNode.js';
import { click } from './click.js';
import { bananas } from './bananas.js';
import { mine } from './mine.js';
import { upgradeMonkeys } from '../Monkey.js';
// ... importe outras categorias se tiver

/**
 * Inicializa todas as skills do jogador.
 * Converte os dados em SkillNode e adiciona ao player.
 */
export function initializeSkills(player) {
    const allSkills = [...click, ...bananas, ...mine, ...upgradeMonkeys /*, outras categorias */];

    allSkills.forEach(skillData => {
        const skillNode = new SkillNode(skillData);
        player.addSkillNode(skillNode);
    });
}
