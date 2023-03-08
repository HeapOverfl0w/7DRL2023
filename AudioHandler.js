class AudioHandler {
    constructor() {
        const volume = 0.1;
        this.musicMenu = document.getElementById("musicMenu")
        this.musicLetsGo = document.getElementById("musicLetsGo")
        this.musicBaroque = document.getElementById("musicBaroque")
        this.musicMenu.volume = volume + 0.3;
        this.musicLetsGo.volume = volume + 0.3;
        this.musicBaroque.volume = volume + 0.3;
        this.musicPlaying = false;

        this.musicList = [
            this.musicMenu,
            this.musicLetsGo,
            this.musicBaroque
        ];
        this.currentSong = 0;

        this.punch1 = document.getElementById("punch1")
        this.punch2 = document.getElementById("punch2")
        this.punch3 = document.getElementById("punch3")
        this.gorgonScream = document.getElementById("gorgonScream")
        this.gorgonDeath = document.getElementById("gorgonDeath")
        this.demonAttack = document.getElementById("demonAttack")
        this.demonDeath = document.getElementById("demonDeath")
        this.spell = document.getElementById("spell")

        this.punch1.volume = volume;
        this.punch2.volume = volume;
        this.punch3.volume = volume;
        this.gorgonScream.volume = volume;
        this.gorgonDeath.volume = volume;
        this.demonAttack.volume = volume;
        this.demonDeath.volume = volume;
        this.spell.volume = volume;
        /*this.darkmagic = document.getElementById("darkmagic");
        this.darkmagic.volume = volume;*/
    }

    toggleMute() {
        document.querySelectorAll("audio").forEach( (elem) => 
        {
            elem.muted = !elem.muted; 
        });
    }

    update() {
        if (this.musicList[this.currentSong].ended) {
            this.playAndLoopMusic();
        }
    }

    playAndLoopMusic(){
        this.currentSong++;
        if (this.currentSong >= this.musicList.length)
            this.currentSong = 0;

        this.musicList[this.currentSong].currentTime = 0;
        this.musicList[this.currentSong].play();
        this.musicPlaying = true;
    }

    playWeaponAttack(weaponName) {
        switch (weaponName) {
            case "Fists":
                this.playPunch();
                break;
            case "Knuckles":
                this.playPunch();
                break;
            case "Magic Fists":
                this.playSpell();
                break;
            case "shotgun":
                this.playShotgunFire();
                break;
            case "introtoc":
            case "fireaxe":
            case "os2floppy":
                this.playSpell();
                break;
            case "screwdriver":
                this.playDrill();
                break;
            default:
                //this.playShot();
        }
    }

    
    playSpell() {
        this.spell.currentTime = 0;
        this.spell.play();
    }

    playGorgonScream() {
        this.gorgonScream.play();
    }

    playGorgonDeath() {
        this.gorgonDeath.play();
    }

    playDemonAttack() {
        this.demonAttack.play();
    }

    playDemonDeath() {
        this.demonDeath.play();
    }

    playPunch() {
        const rand = Math.random()
        if (rand < 0.33) {
            this.punch1.currentTime = 0;
            return this.punch1.play();
        }
        if (rand > 0.33 && rand < 0.66) {
            this.punch2.currentTime = 0;
            return this.punch2.play();
        }
        if (rand > 0.66) {
            this.punch3.currentTime = 0;
            return this.punch3.play();
        }
    }

    playAudio(src) {
        let audioCopy = new Audio();
        audioCopy.src = src;
        audioCopy.play();
    }   
}
