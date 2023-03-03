class Cutscene {
    constructor(animationsAndText, skippable){
        this.animationsAndText = animationsAndText;
        this.currentIndex = -1;
        this.stringPlayIndex = 0;
        this.stringPlayTimeInbetween = 2;
        this.stringLineIndex = 0;
        this.maxStringLines = 12;
        this.skippable = skippable;
    }

    restart() {
        this.currentIndex = -1;
    }

    isOver(){
        return this.currentIndex >= this.animationsAndText.length;
    }

    update() {
        if (this.currentIndex == -1){
            this.currentIndex++;
            this.animationsAndText[this.currentIndex].start();
            return;
        }
        if (this.currentIndex >= this.animationsAndText.length)
            return;

        if (this.animationsAndText[this.currentIndex].length !== undefined) {
            if (this.stringPlayTimeInbetween == 2) {
                this.stringPlayIndex++;
                if (this.stringPlayIndex == this.animationsAndText[this.currentIndex][this.stringLineIndex].length) {
                    this.stringPlayIndex = 0;
                    this.stringLineIndex++;
                }
                this.stringPlayTimeInbetween = 0;
            }
            else
                this.stringPlayTimeInbetween++;
            
            if (this.stringLineIndex == this.animationsAndText[this.currentIndex].length) {
                this.currentIndex++;
                if (this.currentIndex < this.animationsAndText.length && this.animationsAndText[this.currentIndex].length === undefined) {
                    this.animationsAndText[this.currentIndex].start();
                }
            }
        }
        else {
            if (!this.animationsAndText[this.currentIndex].isAnimating()) {
                this.currentIndex++;
                if (this.currentIndex < this.animationsAndText.length) {
                    if (this.animationsAndText[this.currentIndex].length !== undefined) {
                        this.stringPlayIndex = 0;
                        this.stringLineIndex = 0;
                    }
                    else {
                        this.animationsAndText[this.currentIndex].start();
                    }
                }
            }
        }
    }

    draw(ctx) {
        if (this.currentIndex >= this.animationsAndText.length) {
            return;
        }

        if (this.animationsAndText[this.currentIndex].length !== undefined) {
            //always have animation first and then text so text will go on top of frame buffer of last animation
            let frameBuffer = this.animationsAndText[this.currentIndex - 1].getFrameBuffer();
            let canvasBuffer = ctx.getImageData(0,0,ctx.canvas.width,ctx.canvas.height);
            for (let i = 0; i < canvasBuffer.data.length; i++)
                canvasBuffer.data[i] = frameBuffer.data[i];
            ctx.putImageData(canvasBuffer, 0,0);
            ctx.fillStyle = "#eae1f0";
            for (let i = 0; i <= this.stringLineIndex; i++){
                if (i == this.stringLineIndex)
                    ctx.fillText(this.animationsAndText[this.currentIndex][i].slice(0,this.stringPlayIndex), 1, i * 10 + 10, ctx.canvas.width-1);
                else
                    ctx.fillText(this.animationsAndText[this.currentIndex][i], 1, i * 10 + 10, ctx.canvas.width-1);
            }
        }
        else {
            let frameBuffer = this.animationsAndText[this.currentIndex].getFrameBuffer();
            let canvasBuffer = ctx.getImageData(0,0,ctx.canvas.width,ctx.canvas.height);
            for (let i = 0; i < canvasBuffer.data.length; i = i + 4){
                if (frameBuffer.data[i+3] != 0) {
                    canvasBuffer.data[i] = frameBuffer.data[i];
                    canvasBuffer.data[i+1] = frameBuffer.data[i+1];
                    canvasBuffer.data[i+2] = frameBuffer.data[i+2];
                    canvasBuffer.data[i+3] = 255;
                }
            }
            ctx.putImageData(canvasBuffer, 0,0);
        }
    }
}