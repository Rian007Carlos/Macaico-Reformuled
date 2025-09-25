import { SkillNode } from "./SkillNode.js";
import { createMonkeySkillNodes } from "./MonkeySkillNodes.js";
import { click } from "./click.js";
import { bananas } from "./bananas.js";
import { mine } from "./mine.js";
import { rare } from "./rare.js";
// Skill tree organizada por categorias e progressão
export const skillTreeData = {
    click,
    bananas,
    mine,
    rare

};



// Cria a árvore de skills do player
export function createSkillTree(player) {
    getAllSkills().forEach(skillData => {
        const node = new SkillNode(skillData);
        player.addSkillNode(node);
    });

    // cria nodes de monkeys se houver
    createMonkeySkillNodes(player);

    // garante categories atualizadas
    player.skillCategories = Object.keys(skillTreeData);

    return player.skills;
}

// Helper para "achatar" tudo em um único array
export function getAllSkills() {
    return Object.values(skillTreeData).flat();
}
