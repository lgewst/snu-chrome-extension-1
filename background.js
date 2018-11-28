
/**
 * restore option when page is loaded or refreshed.
 */
function setOption(tabId) {
    chrome.storage.sync.get({
        keyMode: "ARROW",
        isOn: true
    }, (items) => {
        const setCode = "window.__spatialNavigation__.setKeyMode('";
        if (items.isOn == false) {
            chrome.tabs.executeScript(tabId, {
                code: setCode.concat("NONE')")
            }, (_) => {
                const e = chrome.runtime.lastError;
                if (e != undefined) {
                    console.log(tabId, _, e);
                }
            });
        } else {
            chrome.tabs.executeScript(tabId, {
                code: setCode.concat(items.keyMode, "')")
            }, (_) => {
                const e = chrome.runtime.lastError;
                if (e != undefined) {
                    console.log(tabId, _, e);
                }
            });
        }
    });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status == "complete") {
        setOption(tabId);
    }
});
