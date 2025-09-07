// Mine.js
export const Mine = {
    unlock(mineData) {
        if (!mineData.unlocked) {
            mineData.unlocked = true;
            mineData.level = 1;
            mineData.production = 0;
            mineData.multiplier = 0;
            return true;
        }
        return false;
    },

    upgrade(mineData, player) {
        if (!mineData.unlocked) return false;

        const cost = 50 * (mineData.level + 1);
        if (player.bananas >= cost) {
            player.bananas -= cost;
            mineData.level++;
            return true;
        }
        return false;
    },

    getProduction(mineData) {
        return mineData.production * mineData.level;
    }
};
