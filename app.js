const canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d');

// player gravity
let gravity = 2;

class Player {
    constructor () {
        this.position = {
            x: 100,
            y: canvas.height - 100
        }

        this.velocity = {
            x: 0,
            y: 0
        }

        this.width = 50;
        this.height = 50;
    }

    draw() {
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
        ctx.stroke()
    }

    update() {
        this.draw();
        if (this.position.y + this.height + this.velocity.y <= canvas.height) {
            this.position.y += this.velocity.y;
            this.velocity.y += gravity;
        } else {
            this.velocity.y = 0;
            this.touchedSurface = true;
        }

        this.position.x += this.velocity.x;
    }
}

class Platform {
    constructor ({x, y}) {
        this.position = {
            x: x,
            y: y
        }

        this.width = 200;
        this.height = 20;
        this.touchedSurface = false;
    }

    draw() {
        ctx.fillStyle = 'dodgerblue';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

const player = new Player();

const platforms = [new Platform({x: 200, y: 300}), new Platform({x: 500, y: 370})]

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

// console.log(player);

function animate() {
    requestAnimationFrame(animate);
    //clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    player.update();

    platforms.forEach(platform => {
        platform.draw();
    });



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
            });    
        } else if (keys.left.pressed) {
            platforms.forEach(platform => {
                platform.position.x += 5;
            });    
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

player.draw();
animate();

window.addEventListener('keydown', ({key}) => {
    switch(key.toLowerCase()) {
        case 'a':
            keys.left.pressed = true;
            break;
        case 'd':
            console.log('moving right');
            keys.right.pressed = true;
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
            break;
        case 'd':
            keys.right.pressed = false;
            break;
        case 'w':
            keys.up.pressed = false;       
    }
});