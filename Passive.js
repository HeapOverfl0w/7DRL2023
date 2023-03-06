class Passive {
    constructor(cardName) {
        this.cardName = cardName;
        this.image = document.getElementById(cardName);
        this.value = 0;
    }

    setRandomValue() {
        if (this.cardName === 'speedCard') {
            this.value = 1 + Math.round(Math.random());
        } else if (this.cardName === 'healthCard') {
            this.value = 4 + Math.round(Math.random() * 4);
        } else if (this.cardName === 'manaCard') {
            this.value = 4 + Math.round(Math.random() * 4);
        } else if (this.cardName === 'slashCard' || this.cardName === 'bluntCard' || 
                this.cardName === 'lightningCard' || this.cardName === 'fireCard') {
            this.value = Math.round(Math.random() * 10) / 100;
        }
    }

    addValueToCamera(camera) {
        if (this.cardName === 'speedCard') {
            camera.speed += this.value;
        } else if (this.cardName === 'healthCard') {
            camera.playerMaxHealth += this.value;
            camera.playerHealth += this.value;
        } else if (this.cardName === 'manaCard') {
            camera.playerMaxMana += this.value;
            camera.playerMana += this.value;
        } else if (this.cardName === 'slashCard') {
            camera.resistSlash += this.value;
        } else if (this.cardName === 'bluntCard') {
            camera.resistBlunt += this.value;
        } else if (this.cardName === 'lightningCard') {
            camera.resistLightning += this.value;
        } else if (this.cardName === 'fireCard') {
            camera.resistFire += this.value;
        }
    }

    drawCard(x, y, ctx) {
        ctx.drawImage(this.image, x, y);
        let value = this.value.toString();

        if (this.cardName === 'slashCard' || this.cardName === 'bluntCard' || 
            this.cardName === 'lightningCard' || this.cardName === 'fireCard') {
                value = `${this.value * 100} %`;
            }

        ctx.fillText(value, x + 48, y + 102);
    }
}