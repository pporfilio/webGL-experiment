function InputState() {
    this.buttonsDown = {};
    this.keysDown = {}
}

InputState.prototype.keyDown = function(keyCode) {
    this.keysDown[keyCode] = true;
}

InputState.prototype.keyUp = function(keyCode) {
    this.keysDown[keyCode] = false;
}

InputState.prototype.buttonDown = function(buttonCode) {
    this.buttonsDown[keyCode] = true;
}

InputState.prototype.buttonUp = function(buttonCode) {
    this.buttonsDown[keyCode] = false;
}

InputState.prototype.isKeyDown = function(keyCode) {
    if (this.keysDown[keyCode]) {
        return true;
    } else {
        return false;
    }
}

InputState.prototype.isButtonDown = function(buttonCode) {
    if (this.buttonsDown[buttonCode]) {
        return true;
    } else {
        return false;
    }
}