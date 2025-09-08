// sfxManager.js
// Sistema de SFX modular com pool automático

class SFXManager {
    constructor(poolSize = 5) {
        this.poolSize = poolSize;
        this.sounds = {}; // { key: [Audio, Audio, ...] }
        this.indices = {}; // { key: currentIndex }
    }

    // Registra um novo som
    register(key, src, volume = 0.5, loop = false) {
        this.sounds[key] = Array.from({ length: this.poolSize }, () => {
            const audio = new Audio(src);
            audio.volume = volume;
            audio.loop = loop;
            return audio;
        });
        this.indices[key] = 0;
    }

    // Toca o som (pega do pool automaticamente)
    play(key) {
        if (!this.sounds[key]) return;

        const pool = this.sounds[key];
        let index = this.indices[key];
        const sound = pool[index];

        sound.currentTime = 0;
        sound.play();

        this.indices[key] = (index + 1) % pool.length;
    }

    // Pausa/para um som que está em loop (como música de fundo)
    stop(key) {
        if (!this.sounds[key]) return;

        this.sounds[key].forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
    }

    // Checa se um som está tocando
    isPlaying(key) {
        if (!this.sounds[key]) return false;
        return this.sounds[key].some(audio => !audio.paused);
    }
}

// Exporta uma instância global
export const SFX = new SFXManager();
