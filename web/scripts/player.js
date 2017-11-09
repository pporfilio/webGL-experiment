function Player() {
    this.camera = new Camera();
    this.groundPosition = vec3.create();
    this.speed = 500;
    this.forwardVector = vec3.fromValues(0, 0, -1);
    this.inputState = new InputState();
}

Player.prototype.getCamera = function() {
    return this.camera;
}

Player.prototype.tick = function(previousTime, currentTime) {
    console.log("camera look: " + this.camera.getLookVector());
    var frameTime = currentTime - previousTime;
    var speed = 500;
    if (this.inputState.isKeyDown("W".charCodeAt(0))) {
        this.camera.moveAlongLook(frameTime / speed);
    } 
    if (this.inputState.isKeyDown("S".charCodeAt(0))) {
        this.camera.moveAlongLook(-frameTime / speed);
    }
    if (this.inputState.isKeyDown("A".charCodeAt(0))) {
        this.camera.movePerpendicularToLook(-frameTime / speed);
    }
    if (this.inputState.isKeyDown("D".charCodeAt(0))) {
        this.camera.movePerpendicularToLook(frameTime / speed);
    }
}

Player.prototype.handleMouseMove = function(event) {
    this.camera.addYaw(-event.movementX / 100);
    this.camera.addPitch(-event.movementY / 100);
    this.forwardVector = this.camera.getLookVector()
}

// Note that keyDown events are sent continuously while a key is pressed
Player.prototype.handleKeyDown = function(event) {
    if (event.keyCode == "W".charCodeAt(0)) {
        // move forward
        // stop moving backward
    }
    if (event.keyCode == "S".charCodeAt(0)) {
        // move backward
        // stop moving forward
    }
    if (event.keyCode == "D".charCodeAt(0)) {
        // strafe right
        // strop strafing left
    }
    if (event.keyCode == "A".charCodeAt(0)) {
        // strafe left
        // stop strafing right
    }
    console.log("key down: " + event.keyCode);
    this.inputState.keyDown(event.keyCode);
}

Player.prototype.handleKeyUp = function(event) {
    if (event.keyCode == "W".charCodeAt(0)) {
        // stop moving forward
        // if move backward key is down, start moving backward
    }
    if (event.keyCode == "S".charCodeAt(0)) {
        // stop moving backward
        // if move forward key is down, start moving forward
    }
    if (event.keyCode == "D".charCodeAt(0)) {
        // stop strafing right
        // if strafe left key is down, start strafing left
    }
    if (event.keyCode == "A".charCodeAt(0)) {
        // stop strafing left
        // if strafe right key is down, start strafing right
    }
    console.log("key up: " + event.keyCode);
    this.inputState.keyUp(event.keyCode);
}

Player.prototype.handleMouseDown = function(event) {
    // TODO, handle button click
    // this.inputState.buttonDown(event.identifier);
}

Player.prototype.handleMouseUp = function(event) {
    // TODO, handle button release
    // this.inputState.buttonUp(event.identifier);
}
