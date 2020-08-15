
class TextEmitter {
    addTextListener(aListener) {}

    startEmitting() {}

    stopEmitting() {}
}

class InputSourceEmitter extends TextEmitter {

    constructor() {
        super();
        this.isStopped = true;
        this.writtingMachine = document.querySelector("#machine");
        this.listeners = [];
        
        const inputHandler = (event) => {
            if (! this.isStopped && event.key === "Enter") {
                let text = this.writtingMachine.value;
                this.writtingMachine.value = "";
                this.listeners.forEach(listener => listener.notify(text));
            }
        }

        this.writtingMachine.addEventListener("keyup", inputHandler);
    }

    addTextListener(aListener) { this.listeners.push(aListener); }

    startEmitting() { 
        this.isStopped = false; 
        this.writtingMachine.disabled = false;
        this.writtingMachine.focus();
    }

    stopEmitting() { 
        this.isStopped = true; 
        this.writtingMachine.disabled = true;
    }
}

class TextListener {
    notify(aText) {}
}

class FantasyListener extends TextListener {
    constructor(anEmitter) {
        super();
        this.subject = anEmitter;
        this.showingBox = document.querySelector(".text-box");
    }

    notify(aText) {
        this.showingBox.innerHTML = "";
        this.createSpansForText(aText).forEach(span => this.showingBox.appendChild(span));
        this.showingBox.classList.remove("dissapear");
        this.showingBox.style.display = "flex";
        this.subject.stopEmitting();
        
        const hideBox = () => {
            this.showingBox.classList.add("dissapear");
            this.subject.startEmitting();
        };

        const blurText = () => {
            let time = 500, step = 300;
            this.showingBox.childNodes.forEach(span => {
                setTimeout(() => span.classList.add("blurred-text"), time);
                time += step;
            });
            setTimeout(hideBox, time);
        };

        setTimeout(blurText, 1000);
    }

    createSpansForText(aText) {
        let words = aText.split(" ");
        return words.map(word => {
            let node = document.createElement("span");
            node.innerText = word;
            return node;
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    let emitter = new InputSourceEmitter();
    let listener = new FantasyListener(emitter);
    emitter.addTextListener(listener);
    emitter.startEmitting();
});