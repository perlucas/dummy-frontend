
class TextEmitter {
    addTextListener(aListener) {}

    startEmitting() {}

    stopEmitting() {}
}

class FakeEmitter extends TextEmitter {
    constructor() {
        super();
        this.listeners = [];
        this.activated = false;

        const emitText = () => {
            if (this.activated) {
                let text = "A Random text";
                this.listeners.forEach(listener => listener.notify(text));
            }
        };

        setInterval(emitText, 1000);
    }

    addTextListener(aListener) { this.listeners.push(aListener); }

    startEmitting() { this.activated = true; }

    stopEmitting() { this.activated = false; }
}

class VoiceSourceEmitter extends TextEmitter {
    constructor() {
        super();
        this.active = false;
        this.listeners = [];
        this.queuedTexts = [];
        this.recognition = null;
        this.initializeVoiceRecognition();
        const emitText = () => {
            if (this.active && this.queuedTexts.length > 0) {
                let textToEmit = this.queuedTexts.shift();
                this.listeners.forEach(listener => listener.notify(textToEmit));
            }
        };
        setInterval(emitText, 200);
    }

    initializeVoiceRecognition() {
        try {
             let SpeechRecognition = (
                window.SpeechRecognition || 
                window.webkitSpeechRecognition || 
                window.mozSpeechRecognition || 
                window.msSpeechRecognition
            );
            
            this.recognition = new SpeechRecognition();
            this.recognition.lang = "es";
            
            // [
            //     'onaudiostart',
            //     'onaudioend',
            //     'onend',
            //     'onerror',
            //     'onnomatch',
            //     'onresult',
            //     'onsoundstart',
            //     'onsoundend',
            //     'onspeechend',
            //     'onstart'
            //    ].forEach((function(eventName) {
            //        this.recognition[eventName] = function(e) {
            //            console.log(eventName, e);
            //        };
                   
            //    }).bind(this));

            // this.recognition.addEventListener("result", (event) => console.log(event));

            this.recognition.onresult = (event) => {
                console.log(event);
                let currentIndex = event.resultIndex;
                let transcript = event.results[currentIndex][0].transcript;
                this.queuedTexts.push(transcript);
            };

            this.recognition.onend = () => this.recognition.start();

            this.recognition.start();
        }
        catch(e) {
            alert("Your browser doesn't support voice recognition!");
            throw e;
        }
    }

    addTextListener(aListener) { this.listeners.push(aListener); }

    startEmitting() { this.active = true; }

    stopEmitting() { this.active = false; }
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
    let emitter = new VoiceSourceEmitter();
    let listener = new FantasyListener(emitter);
    emitter.addTextListener(listener);
    emitter.startEmitting();
});