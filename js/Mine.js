// Mine.js
export class Mine {
    constructor() {
        this.unlocked = false;
        this.level = 0;

        // Produção
        this.baseProduction = 1;        // prismáticas por coleta
        this.productionMultiplier = 1;  // multiplicador vindo de skills/upgrades

        // Tempo
        this.collectionInterval = 300000; // 5 minutos em ms
        this.lastCollected = null;        // timestamp da última coleta

        // Coleta automática
        this.autoCollect = false; // começa manual
    }

    // Desbloqueia a mina
    unlock() {
        if (!this.unlocked) {
            this.unlocked = true;
            this.level = 1;
            this.lastCollected = Date.now();
            return true;
        }
        return false;
    }

    // Sobe de nível a mina (aumenta produção)
    upgrade(player) {
        if (!this.unlocked) return false;

        const cost = 50 * (this.level + 1); // custo escalável
        if (player.bananas >= cost) {
            player.bananas -= cost;
            this.level++;
            return true;
        }
        return false;
    }

    // Produção por coleta, já considerando multiplicadores
    getProduction() {
        return this.baseProduction * this.level * this.productionMultiplier;
    }

    // Checa se a mina está pronta para coletar
    isReady() {
        if (!this.unlocked || this.lastCollected === null) return false;
        return (Date.now() - this.lastCollected) >= this.collectionInterval;
    }

    // Coleta prismáticas (manual ou automática)
    collect(player) {
        if (!this.isReady()) return false;

        const amount = this.getProduction();
        player.addPrismatics(amount); // usa Player para atualizar HUD

        this.lastCollected = Date.now(); // reseta timer
        return amount;
    }

    // Tick chamado a cada segundo pelo GameLoop
    tick(player) {
        if (!this.unlocked) return;

        if (this.autoCollect && this.isReady()) {
            this.collect(player);
        }
    }

    // Aplica modificadores de skills ou upgrades
    applySkillModifier({ type, value }) {
        switch (type) {
            case 'productionMultiplier':
                this.productionMultiplier = (this.productionMultiplier || 1) * value;
                break;
            case 'reduceInterval':
                this.collectionInterval = Math.max(1000, this.collectionInterval * value); // nunca menor que 1s
                break;
            case 'autoCollect':
                this.autoCollect = true;
                break;
            default:
                console.warn("Skill modifier desconhecido para a Mina:", type);
        }
    }

    // Reset da mina (para GameState.reset)
    reset() {
        this.unlocked = false;
        this.level = 0;
        this.baseProduction = 1;
        this.productionMultiplier = 1;
        this.collectionInterval = 300000;
        this.lastCollected = null;
        this.autoCollect = false;
    }
}
