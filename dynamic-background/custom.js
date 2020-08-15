let currentColor = {
    r: 255,
    g: 0,
    b: 0
};

let targetColor = {};

function defineNewTargetColor() {
    targetColor.r = Math.ceil(Math.random() * 255);
    targetColor.g = Math.ceil(Math.random() * 255);
    targetColor.b = Math.ceil(Math.random() * 255);
}

function updateCurrentColor() {
    for (let type in currentColor) {
        if (currentColor[type] !== targetColor[type]) {
            let factor = currentColor[type] > targetColor[type] ? (-1) : 1;
            currentColor[type] += (factor * 1);
            document.querySelector("body").style.backgroundColor = `rgb(${currentColor.r}, ${currentColor.g}, ${currentColor.b})`;
            return;
        }
    }
    defineNewTargetColor();
}

function startAnimation() {
    defineNewTargetColor();
    setInterval(updateCurrentColor, 50);
}

window.addEventListener("load", function () {
    startAnimation();
});