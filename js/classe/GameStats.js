class GameStats {
    score
    multiplier

    constructor() {
        this.resetMultiplier();
        this.resetScore();
    }

    resetScore = () => {
        this.score = 0;
    }

    resetMultiplier = () => {
        this.multiplier = 1;
    }

    getScore = () => {
        return this.score;
    }

    getMultiplier = () => {
        return this.multiplier;
    }

    addPoints = (points) => {
        this.score += points;
    }

    addMultiplier = (coeff) => {
        this.multiplier += coeff;
    }
}