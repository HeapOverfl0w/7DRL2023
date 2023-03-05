class RayCaster {
  constructor(maxViewDistance)
  {
    this.maxViewDistance = maxViewDistance;
    this.maxShadeDistance = maxViewDistance - 5;
    this.redShade = this.hexToRgbOffset("#f63f4c");
  }

  hexToRgbOffset(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if(result){
        var r= parseInt(result[1], 16);
        var g= parseInt(result[2], 16);
        var b= parseInt(result[3], 16);
        return {r : r-255, g : g-255, b : b-255};
    } 
    return null;
  }

  rgbaSum(c1, c2){
    var a = c1.a + c2.a*(1-c1.a);
    return {
      r: (c1.r * c1.a  + c2.r * c2.a * (1 - c1.a)) / a,
      g: (c1.g * c1.a  + c2.g * c2.a * (1 - c1.a)) / a,
      b: (c1.b * c1.a  + c2.b * c2.a * (1 - c1.a)) / a,
      a: a
    }
  }

  draw(ctx, camera, level, filter)
  {
    if (level.useShade)
      this.shadeColor = this.hexToRgbOffset(level.shadeColor);
    else
      this.shadeColor = {r: 0, g: 0, b: 0};

    let cvsWidth = ctx.canvas.width;
    let cvsHeight = ctx.canvas.height;
    this.renderBuffer = new Array(4 * cvsWidth * cvsHeight);
    let aspectRatio = cvsWidth / cvsHeight;
    ctx.fillStyle = this.shadeColor;
    ctx.fillRect(0,0, cvsWidth, cvsHeight);
    this.drawSkybox(ctx, camera, level);

    this.screenBuffer = ctx.getImageData(0,0,cvsWidth,cvsHeight);

    let zBuffer = [];

    for(let x = 0; x < cvsWidth; x++)
    {
      let rayAngle = camera.angle + camera.fov * (x / cvsWidth - 0.5);
      let rayData = this.cast(camera, rayAngle, level);
      let z = rayData.distance * Math.cos(camera.angle - rayAngle);
      let wallLength = cvsHeight / z * aspectRatio;
      let floor = (cvsHeight + 32) / 2 * (1 + 1/z)  - 12;
      if (rayData.texture !== undefined && rayData.texture.height > 32)
        wallLength *= 2;
      if (rayData.texture !== undefined && rayData.texture.height < 32)
        wallLength /= 2;
      let ceiling = floor - wallLength;

      rayData.height = wallLength;
      rayData.ceiling = Math.ceil(ceiling);
      rayData.rayAngle = rayAngle;
      rayData.column = x;

      if (rayData.distance != this.maxViewDistance)
      {
        let bufferHeight = Math.ceil(rayData.height);
        let bufferCeiling = Math.ceil(rayData.ceiling);
        if (rayData.height > cvsHeight)
          bufferHeight = cvsHeight;
        if (rayData.ceiling < 0)
          bufferCeiling = 0;
        for (let y = 0; y < bufferHeight; y++)
        {
          let ySample = Math.floor(y/rayData.height * rayData.texture.height);
          if (rayData.ceiling < 0)
            ySample = Math.round((y - rayData.ceiling)/rayData.height * rayData.texture.height);
          let xSample = Math.round(rayData.texture.width * rayData.sample);
          let textureSample = 4 * (ySample * rayData.texture.width + xSample);
          let screenBufferSample = 4 * ((bufferCeiling + y) * cvsWidth + x);

          let r = rayData.texture.data[textureSample] + (rayData.distance / this.maxShadeDistance) * this.shadeColor.r;
          let g = rayData.texture.data[textureSample+1] + (rayData.distance / this.maxShadeDistance) * this.shadeColor.g;
          let b = rayData.texture.data[textureSample+2] + (rayData.distance / this.maxShadeDistance) * this.shadeColor.b;
          this.screenBuffer.data[screenBufferSample] = r;
          this.screenBuffer.data[screenBufferSample + 1] = g;
          this.screenBuffer.data[screenBufferSample + 2] = b;
          this.screenBuffer.data[screenBufferSample + 3] = rayData.texture.data[textureSample + 3];
        }
        
        //ctx.drawImage(rayData.texture, Math.floor(rayData.texture.width * rayData.sample), 0, 1, rayData.texture.height, x, ceiling, 1, wallLength);
        if (this.useShade)
          this.drawLighting(ctx, rayData);
      }
      this.drawFloor(ctx, camera, floor, x, rayData, level);

      zBuffer.push(rayData);
    }

    this.drawBillboards(ctx, camera, level, zBuffer);

    camera.draw(this.screenBuffer);

    filter.filter(this.screenBuffer);

    ctx.putImageData(this.screenBuffer, 0,0);
  }

  cast(camera, angle, level)
  {
    let rayAngleX = Math.cos(angle);
    let rayAngleY = Math.sin(angle);
    let rayX = camera.x + rayAngleX;
    let rayY = camera.y + rayAngleY;
    let floorRayX = Math.floor(rayX);
    let floorRayY = Math.floor(rayY);
    let sampleX = 0;
    let distance = 0;
    let isHit = false;

    while(!isHit && distance < this.maxViewDistance)
    {
      distance += 0.05;
      rayX = camera.x + Math.cos(angle) * distance;
      rayY = camera.y + Math.sin(angle) * distance;
      floorRayX = Math.floor(rayX);
      floorRayY = Math.floor(rayY);

      //boundary check
      if (floorRayX < 0 || floorRayX >= level.width || floorRayY < 0 || floorRayY > level.height || distance >= this.maxViewDistance)
      {
        isHit = true;
        distance = this.maxViewDistance;
      }
      else
      {
        if (level.isWall(floorRayX, floorRayY))
        {
          isHit = true;

          let blockMidX = floorRayX + 0.5;
          let blockMidY = floorRayY + 0.5;
          let testAngle = Math.atan2(rayY - blockMidY, rayX - blockMidX);

          if (testAngle >= -Math.PI * 0.25 && testAngle < Math.PI * 0.25)
            sampleX = rayY - floorRayY;
          else if (testAngle >= Math.PI * 0.25 && testAngle < Math.PI * 0.75)
            sampleX = rayX - floorRayX;
          else if (testAngle < -Math.PI * 0.25 && testAngle >= -Math.PI * 0.75)
            sampleX = rayX - floorRayX;
          else if (testAngle >= Math.PI * 0.75 || testAngle < -Math.PI * 0.75)
            sampleX = rayY - floorRayY;
        }
      }
    }
    return {distance: distance, texture: level.wallTextureAt(floorRayX, floorRayY), sample: sampleX, rayAngleX: rayAngleX, rayAngleY: rayAngleY};
  }

  drawSkybox(ctx, camera, level)
  {
    let cvsHeight = ctx.canvas.height;
    let cvsWidth = ctx.canvas.width;
    let texture = level.skybox;
    var width = texture.width * (cvsHeight / texture.height) * 2;
    let angle = camera.angle;
    if (angle < 0)
      angle = 2*Math.PI + angle;
    var left = (angle / (2*Math.PI)) * -width;

    ctx.drawImage(texture, left, 0, width, cvsHeight);
    if (left < width - cvsWidth) {
      ctx.drawImage(texture, left + width, 0, width, cvsHeight);
    }
  }

  drawBillboards(ctx, camera, level, zBuffer)
  {
    let cvsWidth = ctx.canvas.width;
    let cvsHeight = ctx.canvas.height;

    let listOfBillboards = level.getAllBillboards();

    let billboardsToDraw = [];

    for (let i = 0; i < listOfBillboards.length; i++) {
      let x = listOfBillboards[i].x - camera.x;
      let y = listOfBillboards[i].y - camera.y;
      let distanceFromCamera = Math.sqrt(x * x + y * y);

      let cameraX = Math.cos(camera.angle);
      let cameraY = Math.sin(camera.angle);

      //Calculate the angle between the object and the player and see if it's in FOV
      let angle = Math.atan2(y, x) - Math.atan2(cameraY, cameraX);
      if (angle < -Math.PI)
        angle += 2 * Math.PI;
      if (angle > Math.PI)
        angle -= 2 * Math.PI;

      let inFov = Math.abs(angle) < camera.fov / 1.5;

      if (inFov && distanceFromCamera >= 0.5 && distanceFromCamera < this.maxViewDistance) {
        billboardsToDraw.push({ billboard: listOfBillboards[i], dist: distanceFromCamera, angle: angle });
      }
    }

    billboardsToDraw.sort((a, b) => {
      return b.dist - a.dist;
    });

    for (let i = 0; i < billboardsToDraw.length; i++)
    {
      let billboardTexture = billboardsToDraw[i].billboard.getImageBuffer();
      let z = billboardsToDraw[i].dist * Math.cos(billboardsToDraw[i].angle);
      let heightModifier = billboardsToDraw[i].billboard.isLarge ? 2.5 : 1;
      let height = (cvsHeight + billboardTexture.height - 96) / z * heightModifier;
      let floor = (cvsHeight + 32) / 2 * (1 + 1 / z) - 13;
      let ceiling = floor - height;
      
      let billboardAspectRatio = billboardTexture.height / billboardTexture.width;
      let width = height / billboardAspectRatio;
      let center = (0.5 * (billboardsToDraw[i].angle / (camera.fov / 2)) + 0.5) * cvsWidth;

      for (let ix = 0; ix < width; ix++)
      {
        let sampleX = ix / width;
        //let sampleY = iy / height;
        let column = Math.floor(center + ix - width / 2);
        if (column >= 0 && column < cvsWidth)
        {
          if (zBuffer[column].distance >= billboardsToDraw[i].dist)
          {
            let bufferHeight = Math.floor(height);
            let bufferCeiling = Math.ceil(ceiling);
            if (height > cvsHeight)
              bufferHeight = cvsHeight;
            if (ceiling < 0)
              bufferCeiling = 0;
            for (let y = 0; y < bufferHeight; y++)
            {
              let ySample = Math.floor(y/height * billboardTexture.height);
              if (ceiling < 0)
                ySample = Math.floor((y - ceiling)/height * billboardTexture.height);
              let xSample = Math.floor(billboardTexture.width * sampleX);
              let textureSample = 4 * (ySample * billboardTexture.width + xSample);
              let screenBufferSample = 4 * ((bufferCeiling + y) * cvsWidth + column);
              if (billboardTexture.data[textureSample + 3] != 0 && textureSample < billboardTexture.data.length) {
                let shadeColor = this.shadeColor;
                let shadeOffset = (billboardsToDraw[i].dist / this.maxShadeDistance);
                if (billboardsToDraw[i].billboard.isHit !== undefined && billboardsToDraw[i].billboard.isHit) {
                  shadeColor = this.redShade;
                  shadeOffset = 0.8;
                }

                  let r = billboardTexture.data[textureSample] + shadeOffset * shadeColor.r;
                  let g = billboardTexture.data[textureSample+1] + shadeOffset * shadeColor.g;
                  let b = billboardTexture.data[textureSample+2] + shadeOffset * shadeColor.b;
                  this.screenBuffer.data[screenBufferSample] = r;
                  this.screenBuffer.data[screenBufferSample + 1] = g;
                  this.screenBuffer.data[screenBufferSample + 2] = b;
                  this.screenBuffer.data[screenBufferSample + 3] = 255;
              }
            }
          }
        }
      }
    }
  }

  drawFloor(ctx, camera, floorStart, column, rayData, level)
  {
    let cvsHeight = ctx.canvas.height;
    let cvsWidth = ctx.canvas.width;
    let halfCvsHeight = (cvsHeight) >> 1;
    let floorFloorStart = Math.floor(floorStart);
    for (let iy = floorFloorStart; iy < cvsHeight; iy++)
    {
      let distance = (220 / (iy - halfCvsHeight));
      let x = distance * rayData.rayAngleX + camera.x;
      let y = distance * rayData.rayAngleY + camera.y;

      if (level.isInsideArray(x,y)) {
        let texture = level.getFloorTextureAt(Math.floor(x), Math.floor(y));
        let ceilingTexture = level.getCeilingTextureAt(Math.floor(x), Math.floor(y));

        if (texture != undefined) {
          let textureSample = 4 * (Math.floor((y % 1) * texture.height) * texture.width + Math.floor((x % 1) * texture.width));
          let screenBufferSampleFloor = 4 * (cvsWidth * iy + column);
          let screenBufferSampleCeiling = 4 * (cvsWidth * (cvsHeight - iy) + column);

          let r = texture.data[textureSample] + (distance / (this.maxShadeDistance - 3)) * this.shadeColor.r;
          let g = texture.data[textureSample+1] + (distance / (this.maxShadeDistance - 3)) * this.shadeColor.g;
          let b = texture.data[textureSample+2] + (distance / (this.maxShadeDistance - 3)) * this.shadeColor.b;
          this.screenBuffer.data[screenBufferSampleFloor] = r;
          this.screenBuffer.data[screenBufferSampleFloor + 1] = g;
          this.screenBuffer.data[screenBufferSampleFloor + 2] = b;
          this.screenBuffer.data[screenBufferSampleFloor + 3] = 255;

          if (ceilingTexture != undefined)
          {
            let r = ceilingTexture.data[textureSample] + (distance / (this.maxShadeDistance - 3)) * this.shadeColor.r;
            let g = ceilingTexture.data[textureSample+1] + (distance / (this.maxShadeDistance - 3)) * this.shadeColor.g;
            let b = ceilingTexture.data[textureSample+2] + (distance / (this.maxShadeDistance - 3)) * this.shadeColor.b;
            this.screenBuffer.data[screenBufferSampleCeiling] = r;
            this.screenBuffer.data[screenBufferSampleCeiling + 1] = g;
            this.screenBuffer.data[screenBufferSampleCeiling + 2] = b;
            this.screenBuffer.data[screenBufferSampleCeiling + 3] = 255;
          }
        }
      }
    }
  }
}