/**
 * call setKeyMode
 * @param {string} mode keyMode string
 */

document.body.addEventListener("click", (event) => {
    const id = event.srcElement.id;
    if (id == "ShowCurrElem"){
        if (document.getElementById(id).checked)
        document.getElementById("visNextTarget").checked = false;
    }
    else if (id == "visNextTarget"){
        if (document.getElementById(id).checked){
            document.getElementById("ShowCurrElem").checked = false;
        }
    }
});

function setKeyOption(mode) {
    chrome.tabs.query({}, (tabs) => {
        const setCode = "window.__spatialNavigation__.setKeyMode('";

        for (let i = 0; i < tabs.length; i++) {
            chrome.tabs.executeScript(tabs[i].id, {
                code: setCode.concat(mode, "')")
            }, (err) => {
                const e = chrome.runtime.lastError;
                if (e !== undefined) {
                    console.log(tabs[i].id, err, e);
                }
            });
        }
    });
}

/**
 * save keyMode options.
 */
function saveOptions() {
    const mode = document.getElementById("keyMode").value;
    const isOn = document.getElementById("switch").checked;
    const isVisible = document.getElementById("visNextTarget").checked;
    const CurrentOn = document.getElementById("ShowCurrElem").checked;
    chrome.storage.local.set({
        keyMode: mode,
        isOn,
        isVisible,
        CurrentOn
    }, () => {
        // Update status to let user know options were saved.
        const status = document.getElementById("status");

        if (isOn == false) {
            setKeyOption("NONE");
        } else {
            setKeyOption(keyMode.value);
        }

        status.textContent = "Options saved.";
        setTimeout(() => {
            status.textContent = "";
        }, 750);
    });
}

/**
 * restore keyMode options.
 */
function restoreOptions() {
    // Use default value color = 'ARROW' and isOn = true.
    chrome.storage.local.get({
        keyMode: "ARROW",
        isOn: true,
        isVisible: false,
        CurrentOn: false
    }, (items) => {
        document.getElementById("keyMode").value = items.keyMode;
        document.getElementById("switch").checked = items.isOn;
        document.getElementById("visNextTarget").checked = items.isVisible;
        document.getElementById("ShowCurrElem").checked = items.CurrentOn;

        if (items.isOn == false) {
            setKeyOption("NONE");
        } else {
            setKeyOption(items.keyMode.value);
        }
    });
}


window.onload = restoreOptions;
document.getElementById("save").addEventListener("click", saveOptions);
