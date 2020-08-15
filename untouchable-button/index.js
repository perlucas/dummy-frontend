const DISTANCE = 200;

function setUpButtonBehaviour() {
    let button = document.querySelector("#myButton");
    button.style.position = "absolute";
    button.style.left = addUnit(button.offsetLeft);
    button.style.top = addUnit(button.offsetTop);

    button.addEventListener("mouseenter", () => {
        let possibleMoves = generatePossibleMoves(button);
        let move;
        if (possibleMoves.length === 1) {
            move = possibleMoves[0];
        } else {
            let random = Math.floor(Math.random() * 100);
            let intervalSize = 100/possibleMoves.length;
            for (ii = 0; ii < possibleMoves.length; ii++) {
                if (random >= ii * intervalSize && random < intervalSize + ii * intervalSize) {
                    move = possibleMoves[ii];
                    break;
                }
            }
        }
        moveButton(button, move);
    });
}

function generatePossibleMoves(button) {
    const addDistance = (val) => addUnit(substractUnit(val) + DISTANCE);
    const substractDistance = (val) => addUnit(substractUnit(val) - DISTANCE);

    let movementUp = { 
        left: addUnit(button.style.left),
        top: substractDistance(button.style.top)
    };

    let movementRight = {
        left: addDistance(button.style.left),
        top: addUnit(button.style.top)
    };

    let movementDown = {
        left: addUnit(button.style.left),
        top: addDistance(button.style.top)
    };

    let movementLeft = {
        left: substractDistance(button.style.left),
        top: addUnit(button.style.top)
    };
    return [movementUp, movementRight, movementDown, movementLeft]
        .filter(isValidMovement(button));
}

function substractUnit(value) {
    if (value) {
        return parseFloat(
            value.replace("px", "")
        );
    }
    return 0;
}

function addUnit(value) {
    if (value) {
        let stringValue = value + "";
        if (stringValue.indexOf("px") >= 0) { return stringValue };
        return stringValue + "px";
    }
    return "0px";
}

function isValidMovement(button) {

    return (possibleMovement) => {
        let maxHeight = window.innerHeight;
        let maxWidth = window.innerWidth;
    
        let topValue = substractUnit(possibleMovement.top);
        if (topValue < 0 || topValue >= maxHeight - button.offsetHeight) return false;
    
        let leftValue = substractUnit(possibleMovement.left);
        if (leftValue < 0 || leftValue >= maxWidth - button.offsetWidth) return false;
    
        if (possibleMovement.top === button.style.top && possibleMovement.left === button.style.left) {
            return false;
        }
    
        return true;
    };
}

function moveButton(button, move) {
    button.style.left = move.left;
    button.style.top = move.top;
}

document.addEventListener("DOMContentLoaded", setUpButtonBehaviour);


// Ojo, la caja no parte desde left:0 y top: 0, ojo con esa suposicion!