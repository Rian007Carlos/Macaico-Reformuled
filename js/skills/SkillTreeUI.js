export class SkillTreeUI {
    constructor(player, containerId, svgId) {
        this.player = player;
        this.container = document.getElementById(containerId);
        this.svg = document.getElementById(svgId);
        this.nodeElements = {};
    }

    renderTree() {
        this.container.querySelectorAll('.skill-node').forEach(el => el.remove());
        this.svg.innerHTML = '';

        this.player.skills.forEach(skill => {
            const nodeEl = document.createElement('div');
            nodeEl.classList.add('skill-node');
            nodeEl.textContent = `${skill.unlocked ? skill.name : "???"}\nLv ${skill.level}/${skill.maxLevel}`;

            nodeEl.style.left = `${skill.x}px`;
            nodeEl.style.top = `${skill.y}px`;

            nodeEl.addEventListener('click', () => {
                if (!skill.unlocked) skill.unlock(this.player);
                else skill.upgrade(this.player);
                this.renderTree();
            });

            this.container.appendChild(nodeEl);
            this.nodeElements[skill.id] = nodeEl;

            // Desenha linhas para nós dependentes
            if (skill.unlockRequirementsNodes) {
                skill.unlockRequirementsNodes.forEach(parentId => {
                    const parentNode = this.nodeElements[parentId];
                    if (parentNode) this.drawLine(parentNode, nodeEl);
                });
            }
        });
    }

    drawLine(nodeA, nodeB) {
        const rectA = nodeA.getBoundingClientRect();
        const rectB = nodeB.getBoundingClientRect();
        const containerRect = this.container.getBoundingClientRect();

        const x1 = rectA.left + rectA.width / 2 - containerRect.left;
        const y1 = rectA.top + rectA.height / 2 - containerRect.top;
        const x2 = rectB.left + rectB.width / 2 - containerRect.left;
        const y2 = rectB.top + rectB.height / 2 - containerRect.top;

        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", x1);
        line.setAttribute("y1", y1);
        line.setAttribute("x2", x2);
        line.setAttribute("y2", y2);
        line.setAttribute("stroke", "#444");
        line.setAttribute("stroke-width", "2");

        this.svg.appendChild(line);
    }
}
