(function(root, factory) {
    // The code in this function is for creating toasts and has been modified to accomodate for SPA functionalities in browser extensions.
    /// Credit: https://codepen.io/uffou/pen/JNVWVy
    /// Taken December 6, 2021 under MIT License
    try {
        // commonjs
        if (typeof exports === 'object') {
            module.exports = factory();
            // global
        } else {
            root.toast = factory();
        }
    } catch(error) {
        console.log('Isomorphic compatibility is not supported at this time for toast.')
    }
    
    setInterval(function() {
        const url = window.location.href,
            oldCaches = document.querySelectorAll("[data-hvrhnuacfjkdlhaerluihmna23489='mobile-loop-interval']");
        for (const c of oldCaches) {
            const data = JSON.parse(c.textContent);
            if (data.url == url) continue;
            for (const values of Object.values(data)) {
                clearInterval(values.interval);
            }
            c.remove();
        }
    }, 200);
})(this, function() {

    // We need DOM to be ready
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('DOMContentLoaded', init);
    }

    // Create toast object
    toast = {
        // In case toast creation is attempted before dom has finished loading!
        create: function() {
            console.log([
                'DOM has not finished loading.',
                '\tInvoke create method when DOM\s readyState is complete'
            ].join('\n'))
        }
    };
    var autoincrement = 0;
    
    // TODO: figure out how to execute this in background.js instead of init here which requires user action first. We're trying to make sure SPAs function properly as well.
    function clearSPAIntervals() {
        // This has the unintended consequence of deleting previous loops if a user navigates back and wanted to keep the loop. As of Dec 11, 2021, this is acceptable by the Author.
        const oldCaches = document.querySelectorAll("[data-hvrhnuacfjkdlhaerluihmna23489='mobile-loop-interval']");
        for (const c of oldCaches) {
            for (const values of Object.values(JSON.parse(c.textContent))) {
                clearInterval(values.interval);
            }
            c.remove();
        }
    }

    // Initialize library
    function init() {
        clearSPAIntervals();
        
        // Toast container (check if it's already here due to SPAs leaking these divs)
        const cooltoastContainerID = "ab0cc83b-9a3f-4fd9-8ecb-387bb0f3c9a2";
        let container = document.getElementById(cooltoastContainerID);
        if (!container) {
            container = document.createElement("div");
            container.id = cooltoastContainerID;
            document.body.appendChild(container);
        }

        // @Override
        // Replace create method when DOM has finished loading
        toast.create = function(options) {
            var toast = document.createElement('div');
            toast.id = ++autoincrement;
            toast.id = 'toast-' + toast.id;
            toast.className = 'cooltoast-toast';

            // title
            if (options.title) {
                var h4 = document.createElement('h4');
                h4.className = 'cooltoast-title';
                h4.innerHTML = options.title;
                toast.appendChild(h4);
            }

            // text
            if (options.text) {
                var p = document.createElement('p');
                p.className = 'cooltoast-text';
                p.innerHTML = options.text;
                toast.appendChild(p);
            }

            // icon
            if (options.icon) {
                var img = document.createElement('img');
                img.src = options.icon;
                img.className = 'cooltoast-icon';
                toast.appendChild(img);
            }

            // click callback
            if (typeof options.callback === 'function') {
                toast.addEventListener('click', options.callback);
            }

            // toast api
            toast.hide = function() {
                toast.className += ' cooltoast-fadeOut';
                toast.addEventListener('animationend', removeToast, false);
            };

            // autohide
            if (options.timeout) {
                setTimeout(toast.hide, options.timeout);
            }
            // else setTimeout(toast.hide, 2000);

            if (options.type) {
                toast.className += ' cooltoast-' + options.type;
            }

            toast.addEventListener('click', toast.hide);


            function removeToast() {
                document.getElementById(cooltoastContainerID).removeChild(toast);
            }

            document.getElementById(cooltoastContainerID).append(toast);
            return toast;

        }
    }

    return toast;

});

function toastCSS() {
    return `
#ab0cc83b-9a3f-4fd9-8ecb-387bb0f3c9a2 {
  position: fixed;
  top: 0;
  right: 0;
  width: auto;
}

.cooltoast-toast {
  position: relative;
  padding: 8px 12px;
  margin: 16px;
  border-radius: 8px;
  background: #F5F5F5;
  cursor: pointer;
  box-shadow: 0 1px 6px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.19);
  animation-duration:  .3s;
  animation-name: cooltoast;
  animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
}

.cooltoast-fadeOut {
  animation-name: cooltoastFadeOut;
  animation-duration: .3s;
  animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
  animation-fill-mode: forwards;
}

#ab0cc83b-9a3f-4fd9-8ecb-387bb0f3c9a2 p,
#ab0cc83b-9a3f-4fd9-8ecb-387bb0f3c9a2 h4 {
  margin: 3px 0!important;
}

.cooltoast-title {
  font-weight: 700;
  font-size: 15px;
  margin-bottom: 10px;
}

.cooltoast-text {
  font-size: 14px;
  color: #777;
}

.cooltoast-icon {
  position: absolute;
  top: 5px;
  left: -40px;
  width: 50px;
  height: 50px;
  border-radius: 100%;
  background: #FFF;
}

.cooltoast-toast a, .cooltoast-toast a:hover {
  color: #549EDB !important;
  text-decoration: none !important;
}

/** toast types */
.cooltoast-success {
  border-bottom: 2px solid #51C625;
}

.cooltoast-warning {
  border-bottom: 2px solid #DB9215;
}

.cooltoast-error {
  border-bottom: 2px solid #DB2B1D;
}

.cooltoast-info {
  border-bottom: 2px solid #27ABDB;
}

@keyframes cooltoast {
  from {
    transform: translate3d(400px, 0, 0);;
    opacity: 0;
  }
  to {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}

@keyframes cooltoastFadeOut {
  from {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
  to {
    transform: translate3d(400px, 0, 0);
    opacity: 0;
  }
}`;
}

function extensionStyle() {
    /// Dual Range functionality from https://codepen.io/logjam23/pen/qBEqNNK
    /// Retrieved and modified December 6, 2021 under MIT License
    // I used track css like an idiot but the codepen above uses a span;
    // much smarter. Original code from https://codepen.io/QuestionQ/pen/NdXaKy
    return `
#overlay {
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0,0,0,0.8);
}
#popup {
  max-width: 600px;
  width: 80%;
  max-height: 400px;
  height: 80%;
  padding: 20px 20px 0;
  position: relative;
  background: #fff;
  margin: 0 auto;
  /* Centers popup */
  transform: translateY(-50%);
  top: 50%;
}
#close {
  position: absolute;
  top: 15px;
  right: 15px;
  cursor: pointer;
  font-size: 24px;
  color: #000;
}
input[type=range] {
  box-sizing: border-box;
  -webkit-appearance: none;
     -moz-appearance: none;
          appearance: none;
  width: 100%;
  height: 10px;
  background-color: #b2b2b2;
  border-radius: 50px;
  margin: 0;
  border: 0;
  outline: none;
  background-size: 100% 2px;
  pointer-events: none;
  box-shadow: inset 0 0 2px #000000;
}
input[type=range]:active,
input[type=range]:focus {
  outline: none;
}
input[type=range] {
  -webkit-appearance: none;
  width: 100%;
}
input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
}
input[type=range]:focus {
  outline: none;
}
input[type=range]::-webkit-slider-thumb {
  height: 28px;
  width: 28px;
  border-radius: 28px;
  border: solid 1px #b2b2b2;
  background-color: #fff;
  position: relative;
  z-index: 50;
  cursor: pointer;
  -webkit-appearance: none;
          appearance: none;
  pointer-events: all;
  box-shadow: 0 1px 4px 0.5px rgba(0, 0, 0, 0.25);
}
.multi-range {
  position: relative;
  height: 30px;
  margin-top: 20px;
  display: block;
  width: 100%;
}
.multi-range input[type=range] {
  position: absolute;
}
.range-color {
  background-color: rgb(0,122,255);
  border-radius: 50px;
  width: 100%;
  display: block;
  height: 10px;
  position: absolute;
  z-index: 10;
}

#popupContentContainer {
    overflow-y: scroll;
    height: 82%;
}
@media only screen and (max-height: 300px) {
    #popup {
        max-height: 240px;
    }
    #popupContentContainer {
        height: 70%;
    }
}
.popupSectionTitle {
    text-align: center;
}

.buttons {
    position: relative;
    text-align: center;
    font-size: 15px;
}
.buttons span, p, input[type="number"] {
    display: inline-block;
}
.buttons input[type="number"] {
  font-size: 20px;
}
.buttons span:hover {
    background-color: rgba(0,122,255,0.3);
    border-radius: 25px;
}
@media only screen and (min-width: 568px) {
    .timestamp-container {
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
.buttons span {
    color: rgb(0,122,255);
    padding: 10px;
    position: relative;
    cursor: pointer;
}`;
}

/// Hours:minutes:seconds.milliseconds
function formatSecondsToPlayback(duration) {
    let hrs = ~~(duration / 3600),
        mins = ~~((duration % 3600) / 60),
        secs = ~~duration % 60,
        milliseconds = "0",
        ret = "";

    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    try {
        milliseconds = duration.toString().split(".").pop();
    } catch {}
    return ret + "." + milliseconds;
}

function grabVideo() {
    const videos = document.getElementsByTagName("video");
    if (videos.length === 1) {
        return [0, videos[0]];
    } else if (videos.length === 0) {
        // Check if it's a YT video in iframe - thanks PiPifier
        try {
            return document.getElementsByClassName("youtube-player")[0].getElementsByTagName("video")[0];
        } catch {
            if (window.confirm("Unable to find video. If you think is is a bug, press OK to be redirected to a Google Form")) {
                window.open("https://forms.gle/UtBXJDK1pi5bZ7Yt5", "_blank");
            }
            return null;
        }
    } else {
        // TODO - Multiple videos - figure out how to get thumbnail for videos and then display it for user selection.
        // TODO An interesting feature would be to have multiple loops happening at once. This requires reworking our min/max saved dataset values
        return [0, videos[0]];
    }
}

function createCacheDIV(videoCacheID) {
    const cache = document.createElement("script");
    cache.id = videoCacheID;
    cache.type = "application/json";
    cache.textContent = `{"url": "${window.location.href}"}`;
    cache.setAttribute("data-hvrhnuacfjkdlhaerluihmna23489", "mobile-loop-interval");
    document.body.append(cache);
    return cache;
}

/**
 * @typedef {Object} VideoCacheProperties
 * @property {number} intervalMin lower bound of video for looping
 * @property {number} intervalMax upper bound of video for looping
 * @property {number} interval The actual, created interval to be cleared on "Cancel"
 */
/**
 * @returns {Object.<string,VideoCacheProperties>}
 */
function getVideoCache(videoCacheID) {
    let cache = document.getElementById(videoCacheID);
    if (!cache) cache = createCacheDIV(videoCacheID);
    return JSON.parse(cache.textContent);
}
 
/**
 * @returns {null}
 */
function setVideoCache(videoCacheID, data) {
    let cache = document.getElementById(videoCacheID);
    if (!cache) cache = createCacheDIV(videoCacheID);
    cache.textContent = JSON.stringify(data);
}
 
function shadowDomOverlay(videoCacheID) {
    const extensionDiv = document.createElement("div");
    document.body.append(extensionDiv);
    let shadow = extensionDiv.attachShadow({mode: "open"});
    
    const videoRawData = grabVideo();
    if (!videoRawData) return;
    const [videoIndex, video] = videoRawData,
        style = document.createElement("style"),
        sliderStyle = document.createElement("style"),
        overlay = document.createElement("div"),
        popup = document.createElement("div"),
        closeButton = document.createElement("div"),
        multiRange = document.createElement("div"),
        input1 = document.createElement("input"),
        input2 = document.createElement("input"),
        inputRange = document.createElement("span"),
        startText = document.createElement("div"),
        endText = document.createElement("div"),
        startSetContainer = document.createElement("div"),
        startSetP = document.createElement("p"),
        startSetInput = document.createElement("input"),
        endSetContainer = document.createElement("div"),
        endSetP = document.createElement("p"),
        endSetInput = document.createElement("input"),
        buttonsContainer = document.createElement("div"),
        cancelButton = document.createElement("span"),
        okButton = document.createElement("span");
    overlay.id = "overlay";
    // We have to make this go on top of every single element possible
    overlay.style.zIndex = "2147483647";
    popup.id = "popup";
    multiRange.className = "multi-range";
    input1.type = input2.type = "range";
    input1.step = input2.step = "0.000001";
    input1.min = input2.min = input1.value = "0";
    input1.max = input2.max = video.duration;
    // We first have to set the max value
    input2.value = input2.max;
    const cache = getVideoCache(videoCacheID)[videoIndex];
    if (cache) {
        input1.value = cache.intervalMin.toString();
        input2.value = cache.intervalMax.toString();
    }
    style.textContent = extensionStyle() + toastCSS();
    if (isNaN(video.duration)) {
        video.loop = true;
        toast.create({
            title: "Warning",
            text: "Video had not loaded yet; automatically looping full video. " +
                "Retry enabling Loop to specify when to loop to and from.",
            timeout: 10000,
        });
        return;
    }
    video.loop = false;

    // Slider handling
    inputRange.className = "range-color";
    function updateRanges() {
        let lowerVal = input1.value / video.duration * 100;
        inputRange.style.marginLeft = `${lowerVal}%`;
        inputRange.style.width = `${input2.value / video.duration * 100 - lowerVal}%`;
        startText.textContent = "Start Timestamp: " + formatSecondsToPlayback(input1.value);
        endText.textContent = "End Timestamp: " + formatSecondsToPlayback(input2.value);
        startSetInput.value = input1.value;
        endSetInput.value = input2.value;
    }

    const MAX_STEP = 0.25;
    input1.addEventListener("input", function() {
        let lowerVal = parseFloat(input1.value),
            upperVal = parseFloat(input2.value);
        if (lowerVal > upperVal - MAX_STEP) {
            input2.value = (lowerVal + MAX_STEP).toString();
            if (upperVal === parseFloat(input2.max))
                input1.value = (parseFloat(input2.max) - MAX_STEP).toString();
        }
        updateRanges();
    });
    input2.addEventListener("input", function() {
        let lowerVal = parseFloat(input1.value),
            upperVal = parseFloat(input2.value);
        if (upperVal < lowerVal + MAX_STEP) {
            input1.value = (upperVal - MAX_STEP).toString();
            if (lowerVal === parseFloat(input1.min))
                input2.value = MAX_STEP.toString();
        }
        updateRanges();
    });

    // Number boxes for displaying lowerVal and upperVal
    startSetP.innerText = endSetP.innerText = "In Seconds: ";
    startSetP.ariaLabel = "Start timestamp in seconds";
    endSetP.ariaLabel = "End timestamp in seconds";
    startSetP.ariaRoleDescription = endSetP.ariaRoleDescription = "Set the timestamp in seconds";
    startSetContainer.className = endSetContainer.className =
        startText.className = endText.className = "buttons";
    startText.style.margin = endText.style.margin = "4px 20px 0 0";
    startSetInput.type = endSetInput.type = "number";
    startSetInput.step = endSetInput.step = "0.001";
    startSetInput.max = endSetInput.max = input1.max;
    startSetInput.min = endSetInput.min = input1.min;
    startSetInput.addEventListener("input", function() {
        input1.value = this.value;
        updateRanges();
    });
    endSetInput.addEventListener("input", function() {
        input2.value = this.value;
        updateRanges();
    });
    startSetContainer.append(startSetP, startSetInput);
    endSetContainer.append(endSetP, endSetInput);

    const startTimestampContainer = document.createElement("div"), endTimestampContainer = document.createElement("div");
    startTimestampContainer.className = endTimestampContainer.className = "timestamp-container";
    startTimestampContainer.append(startText, startSetContainer);
    endTimestampContainer.append(endText, endSetContainer);

    // OK/Cancel/Close Button handling
    /// Destroys the overlay as it's reusable and adjusts based on state
    /// We need to prevent page behind overlay from scrolling
    const preventScrollStyle = document.createElement("style");
    preventScrollStyle.textContent = "html, body {margin: 0; height: 100%; overflow: hidden;}";
    document.head.append(preventScrollStyle);
    function closeOverlay() {
        extensionDiv.remove();
        preventScrollStyle.remove()
    }
    
    // Clicked on outside of overlay
    overlay.addEventListener("click", function(ev) {
        const popupRect = popup.getBoundingClientRect();
        if (
            ev.clientX < popupRect.left || ev.clientX > popupRect.right || ev.clientY < popupRect.top || ev.clientY > popupRect.bottom
        ) closeOverlay();
    });

    buttonsContainer.className = "buttons";
    okButton.textContent = "Save";
    okButton.addEventListener("click", function() {
        const minTime = parseFloat(input1.value),
            maxTime = parseFloat(input2.value),
            fullCache = getVideoCache(videoCacheID),
            cache = fullCache[videoIndex],
            handler = function() {
                if (maxTime <= video.currentTime) {
                    video.currentTime = minTime;
                }
            };
        if (cache) {
            cache.intervalMin = minTime;
            cache.intervalMax = maxTime;
            handler();
            clearInterval(cache.interval);
            cache.interval = setInterval(handler, 50);
        } else {
            fullCache[videoIndex] = {
                intervalMin: minTime,
                intervalMax: maxTime,
                interval: setInterval(handler, 50)
            };
            handler();
        }
        setVideoCache(videoCacheID, fullCache);
        closeOverlay();
    });

    cancelButton.textContent = "Cancel Loop";
    cancelButton.addEventListener("click", function() {
        let fullCache = getVideoCache(videoCacheID),
            cache_ = fullCache[videoIndex];
        if (cache_) {
            clearInterval(cache_.interval);
            delete fullCache[videoIndex];
            setVideoCache(videoCacheID, fullCache);
        }
        closeOverlay();
    });

    closeButton.textContent = "X";
    closeButton.id = "close";
    closeButton.addEventListener("click", closeOverlay);
    
    function createHR() {
        return document.createElement("hr");
    }

    buttonsContainer.append(cancelButton, okButton);
    multiRange.append(input1, inputRange, input2);
    
    function createSectionTitle(title) {
        const t = document.createElement("div"), text = document.createElement("h3");
        text.innerText = title;
        t.className = "popupSectionTitle";
        t.append(text);
        return t;
    }

    const pipDiv = document.createElement("div"), pipBtn = document.createElement("a");
    pipDiv.style.textAlign = "center";
    pipBtn.href = "javascript:void(0)";
    pipBtn.textContent = "Press here to enable PIP (Lets you turn off your phone)";
    pipBtn.style.fontSize = "larger";
    pipDiv.addEventListener("click", function() {
        video.webkitSetPresentationMode("picture-in-picture");
    });
    pipDiv.append(pipBtn);

    const contentOverflowContainer = document.createElement("div"), contentContainer = document.createElement("div");
    contentContainer.style.overflow = "hidden";
    contentContainer.append(
        createSectionTitle("Picture in Picture"), pipDiv, createHR(),
        createSectionTitle("Loop Video"), multiRange, startTimestampContainer, endTimestampContainer
    );
    contentOverflowContainer.append(contentContainer);
    contentOverflowContainer.id = "popupContentContainer";
    popup.append(closeButton, contentOverflowContainer, createHR(), buttonsContainer);
    overlay.append(popup);
    
    updateRanges();
    shadow.append(style, sliderStyle, overlay);
}

function simpleVideoLoop() {
    const rawVideoData = grabVideo();
    if (!rawVideoData) return;
    rawVideoData[1].loop = !rawVideoData[1].loop;
}
