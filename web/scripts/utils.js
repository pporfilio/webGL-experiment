function clamp(number, min, max) {
    return Math.max(min, Math.min(number, max));
}

// Hex must be a 7-character hex code (e.g. #FF00FF) and alpha should be in the range [0, 1]
// Adapted from https://stackoverflow.com/questions/21646738/convert-hex-to-rgba
function hexToRGBA(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(3, 5), 16);
    var b = parseInt(hex.slice(5, 7), 16);
    var a = alpha;

    if (a) {
        a = clamp(a, 0, 1);
    } else {
        a = 0;
    }

    return [r / 255, g / 255, b / 255, a];
}

// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; 
}