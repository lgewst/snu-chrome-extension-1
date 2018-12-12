window.addEventListener
    ? window.addEventListener("blur", blurHappened, true)
    : window.attachEvent("onfocusout", blurHappened);

function blurHappened() {
    chrome.runtime.sendMessage({
        request: "reload"
    });
}

const NEXT_TARGET_HIGHLIGHT = "next_target_highlight";
const ACTIVE_ELEMENT_HIGHLIGHT = "active_element_highlight";

let left; let right; let up; let down; let actElement;

/**
 * Event handler for highlight and tooltip.
 */
document.addEventListener("keyup", (e) => {
    const code = e.which || e.keyCode;

    // get keyMode settings.
    chrome.storage.sync.get({
        keyMode: "ARROW",
        isOn: true
    }, (items) => {
        if (document.activeElement != undefined) {
            console.log("after first if");
            // check whether pressed key is arrow key or tab key.
            if (code == "37" || code == "38" || code == "39" || code == "40" || code == "9") {
                if (actElement != null) {
                    actElement.classList.remove(ACTIVE_ELEMENT_HIGHLIGHT);
                }

                if (left != null) {
                    left.classList.remove(NEXT_TARGET_HIGHLIGHT);

                    if (left.getAttribute("tooltip") != null) {
                        left.removeAttribute("tooltip");
                    }
                }
                if (right != null) {
                    right.classList.remove(NEXT_TARGET_HIGHLIGHT);
                    if (right.getAttribute("tooltip") != null) {
                        right.removeAttribute("tooltip");
                    }
                }
                if (up != null) {
                    up.classList.remove(NEXT_TARGET_HIGHLIGHT);
                    if (up.getAttribute("tooltip") != null) {
                        up.removeAttribute("tooltip");
                    }
                }
                if (down != null) {
                    down.classList.remove(NEXT_TARGET_HIGHLIGHT);
                    if (down.getAttribute("tooltip") != null) {
                        down.removeAttribute("tooltip");
                    }
                }

                if (items.isOn == true) {
                    actElement = document.activeElement;
                    console.log("activeElement: ");
                    console.log(actElement);

                    actElement.classList.add(ACTIVE_ELEMENT_HIGHLIGHT);

                    left = window.__spatialNavigation__.findNextTarget(actElement, "left");
                    right = window.__spatialNavigation__.findNextTarget(actElement, "right");
                    up = window.__spatialNavigation__.findNextTarget(actElement, "up");
                    down = window.__spatialNavigation__.findNextTarget(actElement, "down");

                    // Add a visited class name to the element. So we can style it.

                    if (left != undefined) {
                        left.classList.add(NEXT_TARGET_HIGHLIGHT);
                        left.setAttribute("tooltip", "left");
                    }
                    if (right != undefined) {
                        right.classList.add(NEXT_TARGET_HIGHLIGHT);
                        right.setAttribute("tooltip", "right");
                    }
                    if (up != undefined) {
                        up.classList.add(NEXT_TARGET_HIGHLIGHT);
                        up.setAttribute("tooltip", "up");
                    }
                    if (down != undefined) {
                        down.classList.add(NEXT_TARGET_HIGHLIGHT);
                        down.setAttribute("tooltip", "down");
                    }
                    console.log("left:"); console.log(left);
                    console.log("right:"); console.log(right);
                    console.log("up:"); console.log(up);
                    console.log("down:"); console.log(down);
                }
            }
        }
    });
}, false);
