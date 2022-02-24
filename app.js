const canvas = document.querySelector('canvas');

canvas.width = 1024;
canvas.height = 576;

const ctx = canvas.getContext('2d');

// track player progress
let tracker  = 0;

// player gravity
let gravity = 2;

class Player {
    constructor () {
        this.position = {
            x: 100,
            y: canvas.height - 350
        }

        this.velocity = {
            x: 0,
            y: 0
        }
        this.width = 66;
        this.height = 150;
        this.currentImge = createImage("/img/spriteStandRight.png");
        this.currentCropFactor = 177;
        this.currentWidth = 177;
        this.currentFrameLimit = 29;
        this.status = {
            run: {
                rightImg: createImage("/img/spriteRunRight.png"),
                leftImg: createImage("/img/spriteRunLeft.png"),
                cropFactor: 340,
                width: 127.875,
                framesLimit: 40
            },
            stand: {
                rightImg: createImage("/img/spriteStandRight.png"),
                leftImg: createImage("/img/spriteStandLeft.png"),
                cropFactor: 177,
                width: 66,
                framesLimit: 29
            }
        }       

        //we use this to move the crop fowards.
        // we increase it by 1 on each cycle
        this.frame = 0;
    }

    draw() {

        //crop image by adding four more arguments: 

        // 1. top x: you increase this with this.frame property to move it right and then back to 0
        // 2. top y
        // 3. width of image portion
        // 4. height image portion

        ctx.drawImage(
            this.currentImge,
            this.currentCropFactor * this.frame,
            0,
            this.currentWidth,
            400,
            this.position.x, 
            this.position.y,
             this.width, 
             this.height);
    }

    update() {
        this.draw();
        if (this.position.y + this.height + this.velocity.y <= canvas.height) {
            this.position.y += this.velocity.y;
            this.velocity.y += gravity;
        } else {
            this.position.y += this.velocity.y;
        }

        this.position.x += this.velocity.x;

        if (this.frame > this.currentFrameLimit) {
            this.frame = 0;
        }
        this.frame++;        
    }
}

class Platform {
    constructor ({x, y, image}) {
        this.position = {
            x: x,
            y: y
        }
        this.image = image;
        this.width = image.width;
        this.height = image.height;
        this.touchedSurface = false;
    }

    draw() {
        ctx.drawImage(this.image, this.position.x, this.position.y);
    }
}

class GenericObject {
    constructor ({x, y, image}) {
        this.position = {
            x: x,
            y: y
        }
        this.image = image;
        this.awwidth = image.width;
        this.height = image.height;
        this.touchedSurface = false;
    }

    draw() {
        ctx.drawImage(this.image, this.position.x, this.position.y);
    }
}

function createImage (src) {
    const image = new Image();
    image.src = src;
    return image;
}

let genericObject = [
 new GenericObject({x: -1, y: -1, image: createImage('/img/background.png')}),
 new GenericObject({x: 100, y: 10, image: createImage('/img/hills.png')})
];

let player = new Player();

let platformImg = createImage("/img/platform.png");

let platforms = [new Platform({x: -1, y: 455, image: platformImg}), new Platform({x: platformImg.width -3, y: 455, image: platformImg}), new Platform({x: platformImg.width * 2 + 200, y: 455, image: platformImg}), new Platform({x: platformImg.width * 3 - 100, y: 200, image: createImage("/img/platformSmallTall.png")})];

function init () {
    player = new Player();

    platformImg = createImage("/img/platform.png");

    platforms = [new Platform({x: -1, y: 455, image: platformImg}), new Platform({x: platformImg.width -3, y: 455, image: platformImg}), new Platform({x: platformImg.width * 2 + 200, y: 455, image: platformImg}), new Platform({x: platformImg.width * 3 - 100, y: 200, image: createImage("/img/platformSmallTall.png")})];

    genericObject = [
        new GenericObject({x: -1, y: -1, image: createImage('/img/background.png')}),
        new GenericObject({x: 100, y: 10, image: createImage('/img/hills.png')})
       ];
}

const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }, up: {
        pressed: false
    }
}

let playerState = 0;

function animate() {
    requestAnimationFrame(animate);
    
    ctx.fillStyle = 'white';

    ctx.fillRect(0, 0, canvas.width, canvas.height);

    genericObject.forEach(genericO => {
        genericO.draw();
    })
    
    platforms.forEach(platform => {
        platform.draw();
    });
    
    player.update(playerState);


    // left and right movement
    if(keys.right.pressed && player.position.x < 400) {
        player.velocity.x = 5;
    } else if (keys.left.pressed && player.position.x > 100) {
        player.velocity.x = -5;
    } else {
        player.velocity.x = 0;

        if(keys.right.pressed) {
            platforms.forEach(platform => {
                platform.position.x -= 5;
                tracker -= 5;
            });
            // move background oposite player movement
            genericObject[0].position.x -= 0.5;
            // hills movement oposite to player
            genericObject[1].position.x -= 1;   
        } else if (keys.left.pressed) {
            platforms.forEach(platform => {
                platform.position.x += 5;
                tracker += 5;
            });
            // move background oposite player movement
            genericObject[0].position.x += 0.5;
             // hills movement oposite to player
             genericObject[1].position.x += 1;
        }

        if (player.position.y > canvas.height) {
              init();  
        }
    }

    // touches platform
    platforms.forEach(platform => {
        if(player.position.y + player.height <= platform.position.y && player.position.y + player.height + player.velocity.y >= platform.position.y && player.position.x + player.width >= platform.position.x && player.position.x <= platform.position.x + platform.width) {       
            
            player.velocity.y = 0;
            player.touchedSurface = true;
    
        }
    });


}

animate();

window.addEventListener('keydown', ({key}) => {
    switch(key.toLowerCase()) {
        case 'a':
            keys.left.pressed = true;
            player.currentImge = player.status.run.leftImg;
            player.currentCropFactor = player.status.run.cropFactor;
            player.currentWidth = player.status.run.cropFactor;
            player.width = player.status.run.width;
            player.currentFrameLimit = player.status.run.framesLimit;
            break;
        case 'd':
            keys.right.pressed = true;
            player.currentImge = player.status.run.rightImg;
            player.currentCropFactor = player.status.run.cropFactor;
            player.currentWidth = player.currentCropFactor;
            player.width = player.status.run.width;
            player.currentFrameLimit = player.status.run.framesLimit;
            break;
        case 'w':
            if (player.touchedSurface) {
                player.velocity.y -= 40;
                player.touchedSurface = false;
            }
            keys.up.pressed = true;      
    }
});

window.addEventListener('keyup', ({key}) => {
    switch(key.toLowerCase()) {
        case 'a':
            keys.left.pressed = false;
            player.currentImge = player.status.stand.leftImg;
            player.currentCropFactor = player.status.stand.cropFactor;
            player.currentWidth = player.status.stand.cropFactor;
            player.width = player.status.stand.width;
            player.currentFrameLimit = player.status.run.framesLimit;
            break;
        case 'd':
            keys.right.pressed = false;
            player.currentImge = player.status.stand.rightImg;
            player.currentCropFactor = player.status.stand.cropFactor;
            player.currentWidth = player.status.stand.cropFactor;
            player.width = player.status.stand.width;
            player.currentFrameLimit = player.status.run.framesLimit;
            break;
        case 'w':
            keys.up.pressed = false;       
    }
});