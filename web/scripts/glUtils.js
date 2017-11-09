var glUtils = (function() {
    function _initWebGL(canvas) {
        return canvas.getContext("webGL") || canvas.getContext("experimental-webgl");
    }

    function _loadShader(gl, text, type) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, text);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }

    function _createShaderProgram(gl, vertexShaderText, fragmentShaderText) {
        var vertexShader = _loadShader(gl, vertexShaderText, gl.VERTEX_SHADER);
        var fragmentShader = _loadShader(gl, fragmentShaderText, gl.FRAGMENT_SHADER);
        var shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("Could not link shaders");
            return null;
        }
        var shaderProgramWrapper = { program: shaderProgram };
        return shaderProgramWrapper;
    }        

    function _createFloatBuffer(gl, data, itemSize, drawType) {
        var floatBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, floatBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), drawType);
        var vertexBufferWrapper = { buffer: floatBuffer };
        vertexBufferWrapper.itemSize = itemSize;
        vertexBufferWrapper.numItems = data.length / itemSize;
        return vertexBufferWrapper;
    }

    function _createU16ElementBuffer(gl, data, drawType) {
        var u16Buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, u16Buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), drawType);
        var u16BufferWrapper = { buffer: u16Buffer };
        u16BufferWrapper.itemSize = 1; // indices are always single elements
        u16BufferWrapper.numItems = data.length;
        return u16BufferWrapper;
    }

    return {
        initWebGL: function(canvas) { return _initWebGL(canvas); },
        createShaderProgram: function(gl, vertexShaderText, fragmentShaderText) {
            return _createShaderProgram(gl, vertexShaderText, fragmentShaderText);
        },
        createFloatBuffer: function(gl, data, itemSize, drawType) { 
            return _createFloatBuffer(gl, data, itemSize, drawType); 
        },
        createU16ElementBuffer: function(gl, data, drawType) {
            return _createU16ElementBuffer(gl, data, drawType);
        }
    }
})();
