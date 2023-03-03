/* Basic Animation class - only uses a single image for the whole animation where the 
animation starts at 0,0. */

class Animation {
    constructor(image, frameWidth, frameHeight, frameCount, frameTimeMs, repeats) {
        this.image = image;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.frameCount = frameCount;
        this.currentFrame = 0;
        this.animating = false;
        this.frameTimeMs = frameTimeMs;
        this.repeats = repeats;

        this.played = false;
        this.endRequested = false;
    }

    requestEnd() {
        this.endRequested = true;
    }

    start() {
        if (this.frameCount == 1)
            return;
        this.animating = true;
        this.currentFrame = 0;
        this.timer = setInterval((animation) => {
            animation.currentFrame++;
            if (animation.frameCount == animation.currentFrame && (!animation.repeats || animation.endRequested)){
                this.played = true;
                animation.stop();
            }
            else if (animation.frameCount == animation.currentFrame && animation.repeats){
                animation.currentFrame = 0;
            }
        }, 
            this.frameTimeMs,
            this);
    }

    stop() {
        clearInterval(this.timer);
        this.animating = false;
        this.currentFrame = this.frameCount - 1;
        this.endRequested = false;
    }

    isAnimating() {
        return this.animating;
    }

    getFrameBuffer() {
        if (this.frameCount == 1)
            return this.image;

        const startIndex = 4 * (this.currentFrame * this.frameWidth * this.frameHeight);
        const endIndex = 4 * (this.currentFrame * this.frameWidth * this.frameHeight + this.frameWidth * this.frameHeight);
        const returnData = { width: this.frameWidth, height: this.frameHeight };
        returnData.data = this.image.data.slice(startIndex, endIndex);

        return returnData;
    }

    copy() {
        return new Animation(this.image, this.frameWidth, this.frameHeight, this.frameCount, this.frameTimeMs, this.repeats);
    }
}