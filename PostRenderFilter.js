class PostRenderFilter {
    constructor() {
        this.type = "none";
    }

    filter(bufferArray) {
        if (this.type !== "none") {
            if (this.type === "negative") {
                for (let i = 0; i < bufferArray.data.length; i+=4) {
                    bufferArray.data[i] = 255 - bufferArray.data[i];
                    bufferArray.data[i+1] = 255 - bufferArray.data[i+1];
                    bufferArray.data[i+2] = 255 - bufferArray.data[i+2];
                }
            } else if (this.type === "red") {
                for (let i = 0; i < bufferArray.data.length; i+=4) {
                    bufferArray.data[i] = bufferArray.data[i];
                    bufferArray.data[i+1] = 0;
                    bufferArray.data[i+2] = 0;
                }
            } else if (this.type === "blue") {
                for (let i = 0; i < bufferArray.data.length; i+=4) {
                    bufferArray.data[i] = 0;
                    bufferArray.data[i+1] = 0;
                    bufferArray.data[i+2] = bufferArray.data[i+2];
                }
            } else if (this.type === "green") {
                for (let i = 0; i < bufferArray.data.length; i+=4) {
                    bufferArray.data[i] = 0;
                    bufferArray.data[i+1] = bufferArray.data[i+1];
                    bufferArray.data[i+2] = 0;
                }
            }           
        }      
    }
}