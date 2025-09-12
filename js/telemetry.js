export class Telemetry {
    constructor(player) {
        this.player = player;
        this.data = {
            startTime: Date.now(),
            milestones: {},
            upgrades: [],
            skills: [],
        };
    }

    // Utilitário: converte segundos em hh:mm:ss
    formatTime(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;

        if (h > 0) {
            return `${h}h ${m}m ${s}s`;
        } else if (m > 0) {
            return `${m}m ${s}s`;
        } else {
            return `${s}s`;
        }
    }

    // Milestones: registra tempo para alcançar certos valores
    checkMilestones() {
        const milestones = [10, 1_000, 10_000, 100_000, 1_000_000, 10_000_000];
        for (const milestone of milestones) {
            if (this.player.bananas >= milestone && !this.data.milestones[milestone]) {
                const seconds = Math.floor((Date.now() - this.data.startTime) / 1000);
                this.data.milestones[milestone] = seconds;
                console.log(
                    `🏆 Milestone ${milestone} atingido em ${this.formatTime(seconds)}`
                );
            }
        }
    }

    // Captura o estado atual do jogador
    updateSnapshot() {
        this.data.skills = Array.isArray(this.player.skills)
            ? this.player.skills.map(skill => ({
                id: skill.id,
                level: skill.level,
                unlocked: skill.unlocked,
            }))
            : [];

        this.data.upgrades = Array.isArray(this.player.upgrades)
            ? this.player.upgrades.map(upg => ({
                name: upg.name,
                level: upg.level,
                unlocked: upg.unlocked,
                production:
                    typeof upg.getProduction === "function"
                        ? upg.getProduction()
                        : 0,
                cost: upg.cost || 0,
            }))
            : [];
    }

    // Tick: só milestones automáticas
    tick() {
        this.checkMilestones();
    }

    // Print manual
    printNow() {
        this.updateSnapshot();
        console.log("📊 Telemetry snapshot:", {
            bananas: this.player.bananas,
            bananasPerSecond: this.player.bananasPerSecond,
            milestones: Object.fromEntries(
                Object.entries(this.data.milestones).map(([m, secs]) => [
                    m,
                    this.formatTime(secs),
                ])
            ),
            upgrades: this.data.upgrades,
            skills: this.data.skills,
        });
    }
}
