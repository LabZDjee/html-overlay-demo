/* debug and demo stuff */
/* exported defCb */
function defCb() {
  'use strict';
  const randomVal = Math.random();
  if (randomVal < 0.2) {
    alert("defCb called - will return false");
    return false;
  } else if (randomVal < 0.6) {
    alert("defCb called - will return true");
    return true;
  }
  alert("defCb called - will return no value");
}

function resetShowOverlayParamObject() {
  'use strict';
  const input = document.getElementById("show-overlay-param-object");
  input.value = `{timer: 10000, cross: true, title: "title", message: "message (with details)", button1: {text: "btn1", callback: defCb}, button2: {text: "btn2", callback: defCb}, button3: {text: "btn3", callback: defCb}, button4: {text: "btn4", callback: defCb}}`;
}

function adjustContentsHeight() {
  'use strict';
  const header = document.getElementById("header");
  const contents = document.getElementById("contents");
  const paddingV = parseInt(window.getComputedStyle(contents).getPropertyValue("padding-top")) +
    parseInt(window.getComputedStyle(contents).getPropertyValue("padding-bottom"));

  contents.style.height = `${window.innerHeight - header.clientHeight - paddingV}px`;
}

/* exported onPageLoaded */
function onPageLoaded() {
  'use strict';
  adjustContentsHeight();
  window.addEventListener("resize", adjustContentsHeight);
  resetShowOverlayParamObject();
}

/* exported _showOverlay */
function _showOverlay() {
  'use strict';
  const input = document.getElementById("show-overlay-param-object");
  const value = `(${input.value})`;
  let param = null;
  try {
    /* jshint -W061 */
    param = eval(value);
    /* jshint +W061 */
  } catch (e) {
    alert("syntax error in input parameter to \"showOverlay\"");
    return;
  }
  showOverlay(param);
}

/** The OVERLAY function **
param object:
  cross: true|false (undefined: true)
  title: string
  message: string
  button1 to button4: buttonObject
   with buttonObject:
    text: string
    callback: function, if this function returns false, overlay closing is not called
  timeout: positive integer in ms
  modal: true|false (undefined: true)
*/
function showOverlay(paramObject) {
  "use strict";
  const ovl = document.getElementById("overlay");
  const ovlCross = document.getElementById("overlay-cross");
  const ovlTitle = document.getElementById("overlay-title");
  const ovlMessage = document.getElementById("overlay-message");
  const ovlButton1 = document.getElementById("overlay-button-1");
  const ovlButton2 = document.getElementById("overlay-button-2");
  const ovlButton3 = document.getElementById("overlay-button-3");
  const ovlButton4 = document.getElementById("overlay-button-4");
  const ovlClickCatcher = document.getElementById("overlay-click-catcher");
  let timerId = null;
  let timeOutValue;
  let modal = true;

  function setOverlayTimeout() {
    return setTimeout(() => {
      ovl.style.transform = "rotateX(90deg)";
      ovl.removeEventListener(onMouseMove);
    }, timeOutValue);
  }

  function onMouseMove() {
    if (timerId !== null) {
      clearTimeout(timerId);
      timerId = setOverlayTimeout();
    }
  }

  function closeOverlay() {
    ovl.style.transform = "rotateX(90deg)";
    ovlClickCatcher.style.display = "";
    if (timerId !== null) {
      clearTimeout(timerId);
      ovl.removeEventListener("mousemove", onMouseMove);
    }
  }

  function overlayCrossClicked() {
    closeOverlay();
  }

  function makeClickedButtonCallback(buttonStr) {
    return function () {
      let closeOverlayFlag = true;
      try {
        const returnVal = paramObject[buttonStr].callback();
        if (returnVal === false) {
          closeOverlayFlag = false;
        }
      } catch (e) {}
      if (closeOverlayFlag) {
        closeOverlay();
      }
    };
  }

  if (typeof paramObject.timer !== "undefined" && typeof paramObject.timer === "number" &&
    Number.isInteger(paramObject.timer) && paramObject.timer >= 0) {
    timeOutValue = paramObject.timer;
    timerId = setOverlayTimeout(timeOutValue);
    ovl.addEventListener("mousemove", onMouseMove);
  } else {
    timerId = null;
  }
  if (typeof paramObject.cross === "undefined" || paramObject.cross) {
    ovlCross.style.display = "";
    ovlCross.onclick = overlayCrossClicked;
  } else {
    ovlCross.style.display = "none";
  }
  if (typeof paramObject.title !== "undefined" && typeof paramObject.title === "string" && paramObject.title !== "") {
    ovlTitle.style.display = "";
    ovlTitle.innerHTML = paramObject.title;
  } else {
    ovlTitle.style.display = "none";
  }
  if (typeof paramObject.message !== "undefined" && typeof paramObject.message === "string" && paramObject.message !== "") {
    ovlMessage.style.display = "";
    ovlMessage.innerHTML = paramObject.message;
  } else {
    ovlMessage.style.display = "none";
  }
  if (typeof paramObject.button1 !== "undefined" && typeof paramObject.button1.text !== "undefined" &&
    typeof paramObject.button1.text === "string" && paramObject.button1.text !== "") {
    ovlButton1.style.display = "";
    ovlButton1.innerHTML = paramObject.button1.text;
    ovlButton1.onclick = makeClickedButtonCallback("button1");
  } else {
    ovlButton1.style.display = "none";
  }
  if (typeof paramObject.button2 !== "undefined" && typeof paramObject.button2.text !== "undefined" &&
    typeof paramObject.button2.text === "string" && paramObject.button2.text !== "") {
    ovlButton2.style.display = "";
    ovlButton2.innerHTML = paramObject.button2.text;
    ovlButton2.onclick = makeClickedButtonCallback("button2");
  } else {
    ovlButton2.style.display = "none";
  }
  if (typeof paramObject.button3 !== "undefined" && typeof paramObject.button3.text !== "undefined" &&
    typeof paramObject.button3.text === "string" && paramObject.button3.text !== "") {
    ovlButton3.style.display = "";
    ovlButton3.innerHTML = paramObject.button3.text;
    ovlButton3.onclick = makeClickedButtonCallback("button3");
  } else {
    ovlButton3.style.display = "none";
  }
  if (typeof paramObject.button4 !== "undefined" && typeof paramObject.button4.text !== "undefined" &&
    typeof paramObject.button4.text === "string" && paramObject.button4.text !== "") {
    ovlButton4.style.display = "";
    ovlButton4.innerHTML = paramObject.button4.text;
    ovlButton4.onclick = makeClickedButtonCallback("button4");
  } else {
    ovlButton4.style.display = "none";
  }
  if (typeof paramObject.modal !== "undefined" && paramObject.modal === false) {
    modal = false;
  }
  ovl.style.transform = "rotateX(0deg)"; // display overlay
  if (modal) {
    ovlClickCatcher.style.display = "block";
  }
}