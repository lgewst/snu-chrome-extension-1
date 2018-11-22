chrome.tabs.onActivated.addListener(function(tabId, changeInfo, tab) {
   
    chrome.devtools.inspectedWindow.eval("__spatialNavigation__.isContainer(document.activeElement);", {useContentScriptContext : true}, function(result) {
        document.getElementById('container').innerHTML = result;
    });
    chrome.devtools.inspectedWindow.eval("__spatialNavigation__.findNextTarget(document.activeElement, 'up').outerHTML;", {useContentScriptContext : true}, function(result) {
        document.getElementById('up').innerHTML = "<xmp>" + result + "</xmp>";
    });
    chrome.devtools.inspectedWindow.eval("__spatialNavigation__.findNextTarget(document.activeElement, 'down').outerHTML;", {useContentScriptContext : true}, function(result) {
        document.getElementById('down').innerHTML = "<xmp>" + result + "</xmp>";
    });
    chrome.devtools.inspectedWindow.eval("__spatialNavigation__.findNextTarget(document.activeElement, 'left').outerHTML;", {useContentScriptContext : true}, function(result) {
        document.getElementById('left').innerHTML = "<xmp>" + result + "</xmp>";
    });
    chrome.devtools.inspectedWindow.eval("__spatialNavigation__.findNextTarget(document.activeElement, 'right').outerHTML;", {useContentScriptContext : true}, function(result) {
        document.getElementById('right').innerHTML = "<xmp>" + result + "</xmp>";
    });
 }); 