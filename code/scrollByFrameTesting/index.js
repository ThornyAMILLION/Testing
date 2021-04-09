var frameNumber = 0; // start video at frame 0
var playbackConst = 1000; // lower numbers = faster playback
var setHeight = document.getElementById("set-height"); // get page height from video duration   
var vid = document.getElementById('v0'); // select video element
// vid = $('#v0')[0]; // jquery option

// Use requestAnimationFrame for smooth playback
function scrollPlay() {  
    var frameNumber = window.pageYOffset/playbackConst;
    vid.currentTime = frameNumber;
    window.requestAnimationFrame(scrollPlay);
}

$(function () {
    console.log("Jquery working");
    enterView({
        selector: 'section',
        enter: function(el) {
            el.classList.add('entered');
        }
    });

    // dynamically set the page height according to video length
    vid.addEventListener('loadedmetadata', function() {
        setHeight.style.height = Math.floor(vid.duration) * playbackConst + "px";
    });

    window.requestAnimationFrame(scrollPlay);
});