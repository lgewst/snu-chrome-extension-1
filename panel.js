chrome.tabs.onActivated.addListener(function(tabId, changeInfo, tab) {
   
    chrome.devtools.inspectedWindow.eval("__spatialNavigation__.isContainer(document.activeElement);",{useContentScriptContext : true},function(result) {
        document.getElementById('container').innerHTML = result;
    });
    chrome.devtools.inspectedWindow.eval("__spatialNavigation__.findNextTarget(document.activeElement, 'up');",{useContentScriptContext : true},function(result) {
        document.getElementById('up').innerHTML = result;
    });
    chrome.devtools.inspectedWindow.eval("__spatialNavigation__.findNextTarget(document.activeElement, 'down');",{useContentScriptContext : true},function(result) {
        document.getElementById('down').innerHTML = result;
    });
    chrome.devtools.inspectedWindow.eval("__spatialNavigation__.findNextTarget(document.activeElement, 'left');",{useContentScriptContext : true},function(result) {
        document.getElementById('left').innerHTML = result;
    });
    chrome.devtools.inspectedWindow.eval("__spatialNavigation__.findNextTarget(document.activeElement, 'right');",{useContentScriptContext : true},function(result) {
        document.getElementById('right').innerHTML = result;
    });
 }); 