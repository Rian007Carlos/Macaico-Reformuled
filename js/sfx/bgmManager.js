// bgmManager.js
export const bgmManager = {
    defaltVolume: 0.6,
    tracks: [],       // array de {name, audio}
    currentIndex: 0,  // qual música está tocando
    currentTrack: null,
    onTrackChange: null, // callback

    register(name, audio) {
        audio.loop = false; // cada música não faz loop sozinho
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

        if (this.currentTrack) {
            this.currentTrack.pause();
            this.currentTrack.currentTime = 0;
        }

        const trackObj = this.tracks[this.currentIndex];
        this.currentTrack = trackObj.audio;
        this.currentTrack.volume = this.defaltVolume;
        this.currentTrack.play();

        if (this.onTrackChange) this.onTrackChange(trackObj.name);

        this.currentIndex = (this.currentIndex + 1) % this.tracks.length;
    },

    stop() {
        if (this.currentTrack) {
            this.currentTrack.pause();
            this.currentTrack.currentTime = 0;
        }
    },

    // Métodos para integração com UIManager
    isPlaying() {
        return this.currentTrack && !this.currentTrack.paused;
    },

    getCurrentTrackName() {
        if (!this.currentTrack) return null;
        const trackObj = this.tracks.find(t => t.audio === this.currentTrack);
        return trackObj ? trackObj.name : null;
    },

    previous() {
        if (this.tracks.length === 0) return;
        this.currentIndex = (this.currentIndex - 1 + this.tracks.length) % this.tracks.length;
        if (this.currentTrack) {
            this.currentTrack.pause();
            this.currentTrack.currentTime = 0;
        }

        const trackObj = this.tracks[this.currentIndex];
        this.currentTrack = trackObj.audio;
        this.currentTrack.volume = this.defaltVolume;
        this.currentTrack.play();

        if (this.onTrackChange) this.onTrackChange(trackObj.name);
    },

    next() {
        this.playNext();
    },

    setVolume(vol) {
        this.defaltVolume = vol;
        if (this.currentTrack) this.currentTrack.volume = vol;
    }
};
