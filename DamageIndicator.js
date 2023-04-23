class DamageIndicator {
    constructor(angle) {
        this.damageIndicatorImage = document.getElementById("damageIndicator");
        this.angle = angle;
        this.createTime = Date.now();
    }

    draw(ctx) {
        let centerX = ctx.canvas.width / 2;
        let centerY = ctx.canvas.height / 2;

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(this.angle);
        ctx.drawImage(this.damageIndicatorImage, 0, -150);
        ctx.restore();
    }
}