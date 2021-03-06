function updateCubeColors(env) {
    env.gl.bindBuffer(env.gl.ARRAY_BUFFER, env.cubeColorBufferWrapper.buffer);
    var cubeColors = getCubeColors();
    var data = new Float32Array(cubeColors);
    env.gl.bufferSubData(env.gl.ARRAY_BUFFER, 0, data);
}

function getTriangleVertices() {
    return [
         0.0,  1.0,  0.0,
        -1.0, -1.0,  0.0,
         1.0, -1.0,  0.0
    ];
}

function getTriangleColors() {
    return [
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0
    ];
}

function getSquareVertices() {
    return [
         1.0,  1.0,  0.0,
        -1.0,  1.0,  0.0,
         1.0, -1.0,  0.0,
         1.0, -1.0,  0.0,
        -1.0,  1.0,  0.0,                 
        -1.0, -1.0,  0.0
    ];
}

function getUnitCubeVertices() {
    return [
        -0.5, 0.5, 0.5,
        0.5, 0.5, 0.5,
        0.5, -0.5, 0.5,
        -0.5, -0.5, 0.5,
        -0.5, 0.5, -0.5,
        0.5, 0.5, -0.5,
        0.5, -0.5, -0.5,
        -0.5, -0.5, -0.5
    ]
}

function getCubeIndices() {
    return [
        3, 1, 0, 3, 2, 1, // front
        2, 5, 1, 2, 6, 5, // right
        7, 5, 6, 7, 4, 5, // back
        7, 0, 4, 7, 3, 0, // left
        0, 5, 4, 0, 1, 5, // top
        7, 2, 3, 7, 6, 2  // bottom
    ]
}

function getVertexColorInputs() {
    var result = [];
    for (let i = 0; i < 8; ++i) {
        result.push(document.getElementById("vertex" + i + "color"));
    }
    return result;
}

function getCubeColors() {
    var result = [];
    var colorInputs = getVertexColorInputs();
    for (let i = 0; i < colorInputs.length; ++i) {
        result = result.concat(hexToRGBA(colorInputs[i].value, 1));
    }
    return result;
}

function getSquareColors() {
    var colors = [];
    for (let i = 0; i < 6; ++i) {
        colors = colors.concat([0.5, 0.5, 1.0, 1.0]);
    }
    return colors;
}

function generateCubeLocations(regionSize, regionsPerAxis) {
    var locations = [];
    var halfAxis = Math.trunc(regionsPerAxis / 2);
    for (let x = -halfAxis; x <= halfAxis; ++x) {
        for (let y = -halfAxis; y <= halfAxis; ++y) {
            for (let z = -halfAxis; z <= halfAxis; ++z) {
                let position = [x * regionSize + getRandomIntInclusive(0, regionSize),
                                y * regionSize + getRandomIntInclusive(0, regionSize),
                                z * regionSize + getRandomIntInclusive(0, regionSize)];
                locations.push(position);
            }
        }
    }
    return locations;
}

function drawScene(env) {
    var gl = env.gl;

    gl.viewport(0, 0, env.canvas.width, env.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.GL_DEPTH_BUFFER_BIT);

    var identityMatrix = mat4.identity(mat4.create());
    var projectionMatrix = mat4.create();
    var canvasRatio = env.canvas.width / env.canvas.height;
    mat4.perspective(projectionMatrix, 45, canvasRatio, 0.1, 100.0);

    gl.bindBuffer(gl.ARRAY_BUFFER, env.cubeVertexBufferWrapper.buffer);
    gl.vertexAttribPointer(env.shaderProgramWrapper.aVertexPosition, 
                           env.cubeVertexBufferWrapper.itemSize,
                           gl.FLOAT,
                           false,
                           0,
                           0);
    gl.bindBuffer(gl.ARRAY_BUFFER, env.cubeColorBufferWrapper.buffer);
    gl.vertexAttribPointer(env.shaderProgramWrapper.aVertexColor,
                           env.cubeColorBufferWrapper.itemSize,
                           gl.FLOAT,
                           false,
                           0,
                           0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, env.cubeIndexBufferWrapper.buffer);
    gl.uniformMatrix4fv(env.shaderProgramWrapper.uProjectionMatrix, false, projectionMatrix);
    
    for (let index = 0; index < env.cubeLocations.length; ++index) {
        cubeLocation = vec3.fromValues(env.cubeLocations[index][0],
                                       env.cubeLocations[index][1],
                                       env.cubeLocations[index][2]);
        let scaleInput = document.getElementById("cube-scale");
        let scaleValue = clamp(scaleInput.value, 0.5, 5);

        let cubeTransformMatrix = mat4.identity(mat4.create());
        mat4.translate(cubeTransformMatrix, 
                       cubeTransformMatrix, 
                       cubeLocation);
        mat4.scale(cubeTransformMatrix,
                   cubeTransformMatrix,
                   vec3.fromValues(scaleValue, scaleValue, scaleValue));
        let modelViewMatrix = mat4.multiply(mat4.create(),
                                            env.player.getCamera().getWorldToCameraMatrix(),
                                            cubeTransformMatrix);

        gl.uniformMatrix4fv(env.shaderProgramWrapper.uModelViewMatrix, 
                            false, 
                            modelViewMatrix);
        gl.drawElements(gl.TRIANGLES, env.cubeIndexBufferWrapper.numItems, gl.UNSIGNED_SHORT, 0);
    }
}

function tick(time, env) {
    // TODO better start condition and don't risk overflowing count
    if (env.count == 0) {
        env.startTime = time;
        env.prevTime = time;
        env.currTime = time;
    } else {
        env.prevTime = env.currTime;
        env.currTime = time;                
    }

    // Draw
    env.player.tick(env.prevTime, env.currTime);
    drawScene(env)

    env.count++;

    if (!env.exitAnimation) {
        requestAnimFrame(function (time) { tick(time, env); });
    } else {
        document.exitPointerLock();
    }

}

function handleKeyDown(env, event) {
    env.player.handleKeyDown(event);
    if (event.keyCode == "X".charCodeAt(0)) {
        env.exitAnimation = true;
    }
}

function handleKeyUp(env, event) {
    env.player.handleKeyUp(event);
}

function handleClick(env) {
    if (!env.pointerLocked) {
        console.log("requesting pointer lock");
        env.canvas.requestPointerLock();
    } else {
        console.log("click while locked");
    }
}

function handlePointerLockChange(env) {
    if (document.pointerLockElement === env.canvas) {
        console.log("pointer locked on canvas");
        env.pointerLocked = true;
    } else if (document.pointerLockElement) {
        console.log("pointer locked on unexpected element:");
        console.log(document.pointerLockElement);
        env.pointerLocked = false;
    } else {
        console.log("pointer not locked");
        env.pointerLocked = false;
    }
}

function handlePointerLockError() {
    console.log("pointer lock error");
    alert("Pointer lock failed");
}

function handleMouseMove(env, event) {
    if (env.pointerLocked) {
        env.player.handleMouseMove(event);
    }
}

function handleColorChange(env) {
    updateCubeColors(env);
}



function handleStoreSettings() {
    var storage = window.localStorage;

    var category = document.getElementById("settings-name").value;

    if (!category) {
        return;
    }

    var keys = ["cube-scale", "settings-name"];
    var inputs = [];
    for (let i = 0; i < keys.length; ++i) {
        inputs.push(document.getElementById(keys[i]));
    }
    inputs = inputs.concat(getVertexColorInputs());
    
    for (let i = 0; i < inputs.length; ++i) {
        localSettings.setSettingsItem(category, inputs[i].id, inputs[i].value);
    }
}

function handleLoadSettings(env) {
    var category = document.getElementById("category-select").value;
    var keys = localSettings.getCategoryKeys(category);
    for (let i = 0; i < keys.length; ++i) {
        let control = document.getElementById(keys[i]);
        if (control) {
            control.value = localSettings.getSettingsItem(category, keys[i]);
        }
    }
    // I can't figure out how to make the color changes trigger the `oninput` event
    handleColorChange(env);
}

function populateCategorySelect() {
    var categorySelect = document.getElementById("category-select");
    var categories = localSettings.getSettingsCategories();

    var children = categorySelect.children;
    while (children.length != 0) {
        children[0].remove();
    }

    for (let i = 0; i < categories.length; ++i) {
        let option = document.createElement("option");
        option.text = categories[i];
        categorySelect.appendChild(option);
    }
}

function handleDeleteSettings() {
    var settingsName = document.getElementById("settings-name");
    var category = settingsName.value;
    localSettings.deleteSettingsCategory(category);
    populateCategorySelect();
    settingsName.value = "";
}

function handleSettingsNameChange() {
    var storeSettingsButton = document.getElementById("store-settings");
    var deleteSettingsButton = document.getElementById("delete-settings");
    var settingsNameInput = document.getElementById("settings-name");
    if (settingsNameInput.value) {
        storeSettingsButton.disabled = false;
        deleteSettingsButton.disabled = false;
    } else {
        storeSettingsButton.disabled = true;
        deleteSettingsButton.disabled = true;
    }
}

function main() {
    var canvas = document.getElementById("glCanvas");

    // Initialize OpenGL
    var gl = glUtils.initWebGL(canvas);
    if (!gl) {
        alert("Unable to initialize WebGL. Your browser may not support it.");
        return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.clear(gl.COLOR_BUFFER_BIT || GL_DEPTH_BUFFER_BIT);

    // Initialize Shaders
    var vertexShaderElement = document.getElementById("shader-vs");
    var vertexShaderText = vertexShaderElement.firstChild.textContent;

    var fragmentShaderElement = document.getElementById("shader-fs");
    var fragmentShaderText = fragmentShaderElement.firstChild.textContent;

    var shaderProgramWrapper = glUtils.createShaderProgram(gl, vertexShaderText, fragmentShaderText);
    if (!shaderProgramWrapper) {
        alert("Did not get shaderProgramWrapper");
        return;
    }

    // Set uniform locations on the wrapper
    gl.useProgram(shaderProgramWrapper.program);

    shaderProgramWrapper.aVertexPosition = 
        gl.getAttribLocation(shaderProgramWrapper.program, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgramWrapper.aVertexPosition);

    shaderProgramWrapper.aVertexColor = 
        gl.getAttribLocation(shaderProgramWrapper.program, "aVertexColor");
    gl.enableVertexAttribArray(shaderProgramWrapper.aVertexColor);

    shaderProgramWrapper.uProjectionMatrix = 
        gl.getUniformLocation(shaderProgramWrapper.program, "uProjectionMatrix");
    
    shaderProgramWrapper.uModelViewMatrix = 
        gl.getUniformLocation(shaderProgramWrapper.program, "uModelViewMatrix");

    // Initialize Buffers
    var triangleVertexBufferWrapper = glUtils.createFloatBuffer(gl, 
                                                                getTriangleVertices(),
                                                                3, 
                                                                gl.STATIC_DRAW);
    var squareVertexBufferWrapper = glUtils.createFloatBuffer(gl, 
                                                              getSquareVertices(), 
                                                              3,
                                                              gl.STATIC_DRAW);
    var triangleColorBufferWrapper = glUtils.createFloatBuffer(gl,
                                                               getTriangleColors(),
                                                               4,
                                                               gl.STATIC_DRAW);
    var squareColorBufferWrapper = glUtils.createFloatBuffer(gl,
                                                             getSquareColors(),
                                                             4,
                                                             gl.STATIC_DRAW);
    var cubeVertexBufferWrapper = glUtils.createFloatBuffer(gl,
                                                            getUnitCubeVertices(),
                                                            3,
                                                            gl.STATIC_DRAW);
    var cubeIndexBufferWrapper = glUtils.createU16ElementBuffer(gl,
                                                                getCubeIndices(),
                                                                gl.STATIC_DRAW);
    var cubeColorBufferWrapper = glUtils.createFloatBuffer(gl,
                                                           getCubeColors(),
                                                           4,
                                                           gl.STATIC_DRAW);

    var env = {};
    env.count = 0;
    env.gl = gl;
    env.canvas = canvas;
    env.triangleVertexBufferWrapper = triangleVertexBufferWrapper;
    env.squareVertexBufferWrapper = squareVertexBufferWrapper;
    env.triangleColorBufferWrapper = triangleColorBufferWrapper;
    env.squareColorBufferWrapper = squareColorBufferWrapper;
    env.cubeVertexBufferWrapper = cubeVertexBufferWrapper;
    env.cubeIndexBufferWrapper = cubeIndexBufferWrapper;
    env.cubeColorBufferWrapper = cubeColorBufferWrapper;
    env.shaderProgramWrapper = shaderProgramWrapper;
    env.pointerLocked = false;
    env.cubeLocations = generateCubeLocations(10, 10);
    env.exitAnimation = false;
    env.player = new Player();

    // Generate HTML
    populateCategorySelect();

    // Set up handlers
    document.onkeydown = function(event) { handleKeyDown(env, event); };
    document.onkeyup = function(event) { handleKeyUp(env, event); };
    document.onpointerlockchange = function() { handlePointerLockChange(env); };
    document.onpointerlockerror = function() { handlePointerLockError(); };
    document.onmousemove = function(event) { handleMouseMove(env, event); };

    canvas.onclick = function(event) { handleClick(env); };

    var vertexColorInputs = getVertexColorInputs();
    for (let i = 0; i < vertexColorInputs.length; ++i) {
        vertexColorInputs[i].oninput = function(event) { handleColorChange(env); };
    }

    var storeSettingsButton = document.getElementById("store-settings");
    storeSettingsButton.onclick = function(event) { handleStoreSettings(); }
    storeSettingsButton.disabled = true;
    var loadSettingsButton = document.getElementById("load-settings");
    loadSettingsButton.onclick = function(event) { handleLoadSettings(env); }
    var deleteSettingsButton = document.getElementById("delete-settings");
    deleteSettingsButton.onclick = function(event) { handleDeleteSettings(); }
    deleteSettingsButton.disabled = true;
    var settingsNameInput = document.getElementById("settings-name");
    settingsNameInput.oninput = function(event) { handleSettingsNameChange(); }

    requestAnimFrame(function(time) { tick(time, env); });
}
