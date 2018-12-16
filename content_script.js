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
    chrome.storage.local.get({
        keyMode: "ARROW",
        isOn: true,
        isVisible: false,
        CurrentOn: false
    }, (items) => {
        if (document.activeElement != undefined) {
            // check whether pressed key is arrow key or tab key.
            if (code == "37" || code == "38" || code == "39" || code == "40" || code == "9") {

                // remove hightlight and tooltip.

                if (actElement != null) {
                    actElement.classList.remove(ACTIVE_ELEMENT_HIGHLIGHT);
                }

                if (left != null) {
                    left.classList.remove(NEXT_TARGET_HIGHLIGHT);

                    if (left.getAttribute("spatNavTooltip") != null) {
                        left.removeAttribute("spatNavTooltip");
                    }
                }
                if (right != null) {
                    right.classList.remove(NEXT_TARGET_HIGHLIGHT);
                    if (right.getAttribute("spatNavTooltip") != null) {
                        right.removeAttribute("spatNavTooltip");
                    }
                }
                if (up != null) {
                    up.classList.remove(NEXT_TARGET_HIGHLIGHT);
                    if (up.getAttribute("spatNavTooltip") != null) {
                        up.removeAttribute("spatNavTooltip");
                    }
                }
                if (down != null) {
                    down.classList.remove(NEXT_TARGET_HIGHLIGHT);
                    if (down.getAttribute("spatNavTooltip") != null) {
                        down.removeAttribute("spatNavTooltip");
                    }
                }

                // add only spatNav and visible option are turned on.
                if (items.isOn == true && items.isVisible == true) {
                    actElement = document.activeElement;

                    actElement.classList.add(ACTIVE_ELEMENT_HIGHLIGHT);

                    left = window.__spatialNavigation__.findNextTarget(actElement, "left");
                    right = window.__spatialNavigation__.findNextTarget(actElement, "right");
                    up = window.__spatialNavigation__.findNextTarget(actElement, "up");
                    down = window.__spatialNavigation__.findNextTarget(actElement, "down");

                    // Add highlight and tooltip

                    if (left != undefined) {
                        left.classList.add(NEXT_TARGET_HIGHLIGHT);
                        left.setAttribute("spatNavTooltip", "left");
                    }
                    if (right != undefined) {
                        right.classList.add(NEXT_TARGET_HIGHLIGHT);
                        right.setAttribute("spatNavTooltip", "right");
                    }
                    if (up != undefined) {
                        up.classList.add(NEXT_TARGET_HIGHLIGHT);
                        up.setAttribute("spatNavTooltip", "up");
                    }
                    if (down != undefined) {
                        down.classList.add(NEXT_TARGET_HIGHLIGHT);
                        down.setAttribute("spatNavTooltip", "down");
                    }
                }
                else if (items.isOn == true && items.CurrentOn == true){
                    actElement = document.activeElement;
                    actElement.classList.add(ACTIVE_ELEMENT_HIGHLIGHT);

                }
            }
        }
    });
}, false);
