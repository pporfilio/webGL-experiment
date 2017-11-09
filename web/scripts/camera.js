function Camera() {
    this.pitch = 0; // radians
    this.yaw = 0; // radians
    this.position = vec3.create();
}

Camera.prototype.addPitch = function(deltaPitch) {
    this.setPitch(this.getPitch() + deltaPitch);
}

Camera.prototype.setPitch = function(newPitch) {
    this.pitch = clamp(newPitch, -Math.PI / 2 + .1, Math.PI / 2 - .1);
}

Camera.prototype.getPitch = function() {
    return this.pitch
}

Camera.prototype.addYaw = function(deltaYaw) {
    this.setYaw(this.getYaw() + deltaYaw);
}

Camera.prototype.setYaw = function(newYaw) {
    this.yaw = newYaw;
}

Camera.prototype.getYaw = function() {
    return this.yaw;
}

Camera.prototype.addPosition = function(deltaPosition) {
    vec3.add(this.position, this.position, deltaPosition);
}

Camera.prototype.setPosition = function(newPosition) {
    this.position = vec3.clone(newPosition);
}

Camera.prototype.getPosition = function() {
    return this.position;
}

Camera.prototype.getCameraRotationMatrix = function() {
    var matrix = mat4.create();
    // This order is important. If you change the pitch first, it moves the Y-Z axes, 
    // so then rotating around camera Y is no longer the same as rotating about world Y.
    // But if you change the yaw first, then you change the camera X-Z axes, but world Y
    // is still orthogonal to them, so changing the pitch works as expected.
    mat4.rotate(matrix, matrix, this.getYaw(), [0, 1, 0]);            
    mat4.rotate(matrix, matrix, this.getPitch(), [1, 0, 0]);
    return matrix;
}

Camera.prototype.getWorldToCameraMatrix = function() {
    var matrix = mat4.create();
    mat4.rotate(matrix, matrix, -this.getPitch(), [1, 0, 0]);
    mat4.rotate(matrix, matrix, -this.getYaw(), [0, 1, 0]);
    mat4.translate(matrix, matrix, vec3.negate(vec3.create(), this.getPosition()));
    return matrix;
}

Camera.prototype.getLookVector = function() {
    var vector = vec3.fromValues(0, 0, -1);
    vec3.transformMat4(vector, vector, this.getCameraRotationMatrix());
    return vector;
}

Camera.prototype.moveAlongLook = function(distance) {
    var lookVector = this.getLookVector();
    console.log("lookVector: " + lookVector);
   var moveVector = vec3.normalize(vec3.create(), lookVector);
   console.log("move vector: " + moveVector);
    var deltaVector = vec3.scale(vec3.create(), moveVector, distance);
    console.log("scaled move vector: " + deltaVector);
    this.addPosition(deltaVector);
}

Camera.prototype.movePerpendicularToLook = function(distance) {
    var orthogonal = vec3.cross(vec3.create(), this.getLookVector(), [0, 1, 0]);
    var moveOrthogonal = vec3.normalize(vec3.create(), orthogonal);
    this.addPosition(vec3.scale(moveOrthogonal, moveOrthogonal, distance));
}
