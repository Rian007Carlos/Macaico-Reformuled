export class Telemetry {
    constructor(uiManager) {
        this.uiManager = uiManager;
        this.startTime = Date.now();
        this.milestones = [1000, 10000, 100000, 1000000];
        this.reached = new Set();
        this.logs = [];
    }

    // Tempo total de jogo em segundos
    getPlayTimeSeconds() {
        return Math.floor((Date.now() - this.startTime) / 1000);
    }

    // Formatar tempo (hh:mm:ss)
    formatTime(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h}h ${m}m ${s}s`;
    }

    // Captura snapshot do estado atual
    captureSnapshot(player, milestone) {
        const elapsed = this.getPlayTimeSeconds();

        const snapshot = {
            milestone,
            bananas: player.bananas,
            timeElapsed: elapsed,
            monkeys: player.monkeys.map(m => ({
                name: m.name,
                level: m.level,
                production: m.production
            })),
            skills: player.skills.map(s => ({
                id: s.id,
                level: s.level
            }))
        };

        this.logs.push(snapshot);

        console.log(`🎯 Milestone atingido: ${milestone.toLocaleString()} bananas em ${this.formatTime(elapsed)}`);

        this.updateUI();
    }

    // Checa milestones
    check(player) {
        this.milestones.forEach(m => {
            if (player.bananas >= m && !this.reached.has(m)) {
                this.reached.add(m);
                this.captureSnapshot(player, m);
            }
        });
    }

    // Atualiza HUD de telemetria
    updateUI() {
        const container = document.getElementById("telemetry");
        if (!container) return;

        let html = `<p>⏱ Tempo de jogo: ${this.formatTime(this.getPlayTimeSeconds())}</p>`;
        for (const log of this.logs) {
            const minutes = (log.timeElapsed / 60).toFixed(2);
            html += `<p>${log.milestone.toLocaleString()} bananas: ${minutes} min</p>`;
        }

        container.innerHTML = html;
    }

    // Exporta JSON
    export() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.logs, null, 2));
        const dlAnchor = document.createElement("a");
        dlAnchor.setAttribute("href", dataStr);
        dlAnchor.setAttribute("download", "telemetry.json");
        dlAnchor.click();
    }
}
