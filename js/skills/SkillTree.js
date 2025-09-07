import { SkillNode } from "./SkillNode.js";
import { Player } from "../player.js";
import { upgradeMonkeys } from "../Monkey.js";

// Skill tree dinâmica com coordenadas e pais
const skillTreeData = [
    upgradeMonkeys.map(monkey => ({
        id: `skill_${monkey.name}`,
        name: monkey.name,
        description: `Aumenta a produção de ${monkey.name} em 1% por nível`,
        category: "monkeys",
        maxLevel: 100,
        parents: [],
        targetMonkey: monkey,
        effect: (player, level, monkey) => {
            if (!monkey) return;

            monkey.multiplier = 1 + 0.01 * level;

            player.recalculateBPS();
            player.refreshHUD();
        }
    })),
    {
        id: "bananaBoost1",
        name: "Banana Boost I",
        description: "Aumenta a produção de bananas em 10%",
        category: "bananas",
        maxLevel: 3,
        unlocked: true,
        parents: [],
        effect: (player, level) => {
            player.bananasPerSecond = player.bananasPerSecond * (1 + 10.1 * level);
        }
    },
    {
        id: "bananaBoost2",
        name: "Banana Boost II",
        description: "Aumenta a produção de bananas em +20%",
        category: "bananas",
        maxLevel: 2,
        parents: ["bananaBoost1"],
        unlockRequirements: [
            (player) => player.getSkillById("bananaBoost1")?.level >= 3
        ],
        effect: (player, level) => {
            player.bananasPerSecond = player.bananasPerSecond * (1 + 0.2 * level);
        }
    },
    {
        id: "mineEfficiency",
        name: "Mine Efficiency",
        description: "Aumenta produção da mina",
        category: "mine",
        maxLevel: 2,
        parents: ["bananaBoost1"],
        unlockRequirements: [
            (player) => player.getSkillById("bananaBoost1")?.level >= 2
        ],
        effect: (player, level) => {
            player.mine.multiplier += 0.5 * level;
        }
    },
    {
        id: "mysteryNode",
        name: "???",
        description: "???",
        category: "rare",
        maxLevel: 1,
        parents: ["bananaBoost2"],
        unlockRequirements: [
            (player) => player.getSkillById("bananaBoost2")?.level >= 2
        ],
        effect: (player, level) => {
            player.prismatics += 5;
        }
    }
];

// Criação automática
export function createSkillTree(player) {
    skillTreeData.forEach(data => {
        player.addSkillNode(new SkillNode(data));
    });
}

// Renderiza a skill tree com SVG
export function renderSkillTreeSVG(player, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Limpa o container
    container.innerHTML = '';

    // Cria o SVG
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");

    // Desenha linhas entre nós (parents)
    player.skills.forEach(node => {
        node.parents.forEach(parentId => {
            const parentNode = player.getSkillById(parentId);
            if (parentNode) {
                const line = document.createElementNS(svgNS, "line");
                line.setAttribute("x1", parentNode.x);
                line.setAttribute("y1", parentNode.y);
                line.setAttribute("x2", node.x);
                line.setAttribute("y2", node.y);
                line.setAttribute("stroke", "#888");
                line.setAttribute("stroke-width", "2");
                svg.appendChild(line);
            }
        });
    });

    // Desenha os nós
    player.skills.forEach(node => {
        const circle = document.createElementNS(svgNS, "circle");
        circle.setAttribute("cx", node.x);
        circle.setAttribute("cy", node.y);
        circle.setAttribute("r", 20);
        circle.setAttribute("fill", node.unlocked ? "#ff0" : "#555");
        circle.setAttribute("stroke", "#000");
        circle.setAttribute("stroke-width", "2");
        svg.appendChild(circle);

        const text = document.createElementNS(svgNS, "text");
        text.setAttribute("x", node.x);
        text.setAttribute("y", node.y + 5);
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("fill", "#000");
        text.setAttribute("font-size", "10");
        text.textContent = node.unlocked ? node.name : "???";
        svg.appendChild(text);
    });

    container.appendChild(svg);
}
