// bgmManager.js
export const bgmManager = {
    defaltVolume: 0.6,
    tracks: [],       // array de Audio
    currentIndex: 0,  // qual música está tocando
    currentTrack: null,

    register(name, audio) {
        // opcional: adiciona um nome para facilitar playBGM('nome')
        audio.loop = false; // não queremos que cada música faça loop sozinho
        audio.addEventListener('ended', () => this.playNext());
        this.tracks.push({ name, audio });
    },

    playBGM(name = null) {
        if (name) {
            const trackObj = this.tracks.find(t => t.name === name);
            if (trackObj) {
                this.currentIndex = this.tracks.indexOf(trackObj);
            }
        }
        this.playNext();
    },

    playNext() {
        if (this.tracks.length === 0) return;

        // pausa track atual
        if (this.currentTrack) {
            this.currentTrack.pause();
            this.currentTrack.currentTime = 0;
        }

        // pega próxima música
        const trackObj = this.tracks[this.currentIndex];
        this.currentTrack = trackObj.audio;
        this.currentTrack.volume = this.defaltVolume;
        this.currentTrack.play();

        // incrementa índice (loopa a playlist)
        this.currentIndex = (this.currentIndex + 1) % this.tracks.length;
    },

    stop() {
        if (this.currentTrack) {
            this.currentTrack.pause();
            this.currentTrack.currentTime = 0;
        }
    }


};
