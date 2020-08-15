
const video = document.querySelector("video");

function predictionsHandler (predictions) {
    if (predictions.length) {
        console.log(predictions[0].bbox.join("  "));
    }
}


function initializeHandsDetection() {
    
    // init webcam
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => video.srcObject = stream)
            .catch(err => console.error(err));
    }

    // load the model

    const modelParams = {
        flipHorizontal: true,   // flip e.g for video 
        imageScaleFactor: 0.5,  // reduce input image size for gains in speed.
        maxNumBoxes: 2,        // maximum number of boxes to detect
        iouThreshold: 0.5,      // ioU threshold for non-max suppression
        scoreThreshold: 0.80,    // confidence threshold for predictions.
    };

    handTrack.load(modelParams).then(model => {

        setInterval(() => {
            model.detect(video).then(predictionsHandler)
        }, 1000);
    });

    handTrack.startVideo(video);
}

document.addEventListener("DOMContentLoaded", initializeHandsDetection);