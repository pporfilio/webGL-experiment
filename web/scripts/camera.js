function Camera() {
    this.pitch = 0; // radians
    this.yaw = 0; // radians
    this.position = [0, 0, 0]
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
    this.position[0] += deltaPosition[0];
    this.position[1] += deltaPosition[1];
    this.position[2] += deltaPosition[2];
}

Camera.prototype.setPosition = function(newPosition) {
    this.position = newPosition;
}

Camera.prototype.getPosition = function() {
    return this.position;
}

Camera.prototype.getCameraRotationMatrix = function() {
    var matrix = mat4.create();
    mat4.rotate(matrix, matrix, this.getPitch(), [1, 0, 0]);
    mat4.rotate(matrix, matrix, this.getYaw(), [0, 1, 0]);            
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
    var moveVector = vec3.fromValues(lookVector[0], 0, lookVector[2]);
    vec3.normalize(moveVector, moveVector);
    this.addPosition([moveVector[0] * distance, 0, moveVector[2] * distance]);
}

Camera.prototype.movePerpendicularToLook = function(distance) {
    var orthogonal = vec3.cross(vec3.create(), this.getLookVector(), [0, 1, 0]);
    var moveOrthogonal = vec3.fromValues(orthogonal[0], 0, orthogonal[2]);
    vec3.normalize(moveOrthogonal, moveOrthogonal);
    this.addPosition([moveOrthogonal[0] * distance, 0, moveOrthogonal[2] * distance])
}