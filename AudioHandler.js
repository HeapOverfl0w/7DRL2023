class AudioHandler {
    constructor() {
        const volume = 0.6;

        this.musicList = [];
        this.currentSong = 0;

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
        /*if (this.musicList[this.currentSong].ended) {
            this.playAndLoopMusic();
        }*/
    }

    playAndLoopMusic(){
        this.currentSong++;
        if (this.currentSong >= this.musicList.length)
            this.currentSong = 0;

        this.musicList[this.currentSong].currentTime = 0;
        this.musicList[this.currentSong].play();
    }

    playWeaponAttack(weaponName) {
        switch (weaponName) {
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
                this.playShot();
        }
    }

    /*
    playDarkMagic() {
        this.darkmagic.currentTime = 0;
        this.darkmagic.play();
    }
    */

    playAudio(src) {
        let audioCopy = new Audio();
        audioCopy.src = src;
        audioCopy.play();
    }   
}