/**
 * call setKeyMode
 * @param {string} mode keyMode string
 */
function setKeyOption(mode) {
    chrome.tabs.query({}, (tabs) => {
        const setCode = "window.__spatialNavigation__.setKeyMode('";

        for (let i = 0; i < tabs.length; i++) {
            chrome.tabs.executeScript(tabs[i].id, {
                code: setCode.concat(mode, "')")
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
    chrome.storage.sync.set({
        keyMode: mode,
        isOn
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
    chrome.storage.sync.get({
        keyMode: "ARROW",
        isOn: true
    }, (items) => {
        document.getElementById("keyMode").value = items.keyMode;
        document.getElementById("switch").checked = items.isOn;

        if (items.isOn == false) {
            setKeyOption("NONE");
        } else {
            setKeyOption(items.keyMode.value);
        }
    });
}


window.onload = restoreOptions;
document.getElementById("save").addEventListener("click", saveOptions);
