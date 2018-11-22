chrome.tabs.onActivated.addListener(function(tabId, changeInfo, tab) {
   
    chrome.devtools.inspectedWindow.eval("__spatialNavigation__.isContainer(document.activeElement);", {useContentScriptContext : true}, function(result) {
        document.getElementById('container').innerHTML = result;
    });



    chrome.devtools.inspectedWindow.eval("document.activeElement.focusableAreas({'mode': 'visible'});", {useContentScriptContext : true}, function(result) {
        if (result.length == 0){
            result = "None";
        }
        document.getElementById('visible').innerHTML = "<xmp>" + result + "</xmp>";
    });

    chrome.devtools.inspectedWindow.eval("document.activeElement.focusableAreas({'mode': 'all'});", {useContentScriptContext : true}, function(result) {
        if (result.length == 0){
            result = "None";
        }
        document.getElementById('all').innerHTML = "<xmp>" + result + "</xmp>";
    });



    chrome.devtools.inspectedWindow.eval("document.activeElement.spatialNavigationSearch('up').outerHTML;", {useContentScriptContext : true}, function(result) {
        document.getElementById('search_up').innerHTML = "<xmp>" + result + "</xmp>";
    });

    chrome.devtools.inspectedWindow.eval("document.activeElement.spatialNavigationSearch('down').outerHTML;", {useContentScriptContext : true}, function(result) {
        document.getElementById('search_down').innerHTML = "<xmp>" + result + "</xmp>";
    });

    chrome.devtools.inspectedWindow.eval("document.activeElement.spatialNavigationSearch('left').outerHTML;", {useContentScriptContext : true}, function(result) {
        document.getElementById('search_left').innerHTML = "<xmp>" + result + "</xmp>";
    });

    chrome.devtools.inspectedWindow.eval("document.activeElement.spatialNavigationSearch('right').outerHTML;", {useContentScriptContext : true}, function(result) {
        document.getElementById('search_right').innerHTML = "<xmp>" + result + "</xmp>";
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



    chrome.devtools.inspectedWindow.eval("(__spatialNavigation__.findCandidates(document.activeElement, 'up')).map(a => a.outerHTML);", {useContentScriptContext : true}, function(result) {
        var i;
        var temp = "";
        for(i = 0; i < result.length; i++){
            temp += (i + 1) + ": " + result[i] + "\n";
        }
        document.getElementById('candidates_up').innerHTML = "<xmp>" + temp + "</xmp>";
    });

    chrome.devtools.inspectedWindow.eval("(__spatialNavigation__.findCandidates(document.activeElement, 'down')).map(a => a.outerHTML);", {useContentScriptContext : true}, function(result) {
        var i;
        var temp = "";
        for(i = 0; i < result.length; i++){
            temp += (i + 1) + ": " + result[i] + "\n";
        }
        document.getElementById('candidates_down').innerHTML = "<xmp>" + temp + "</xmp>";
    });

    chrome.devtools.inspectedWindow.eval("(__spatialNavigation__.findCandidates(document.activeElement, 'left')).map(a => a.outerHTML);", {useContentScriptContext : true}, function(result) {
        var i;
        var temp = "";
        for(i = 0; i < result.length; i++){
            temp += (i + 1) + ": " + result[i] + "\n";
        }
        document.getElementById('candidates_left').innerHTML = "<xmp>" + temp + "</xmp>";
    });

    chrome.devtools.inspectedWindow.eval("(__spatialNavigation__.findCandidates(document.activeElement, 'right')).map(a => a.outerHTML);", {useContentScriptContext : true}, function(result) {
        var i;
        var temp = "";
        for(i = 0; i < result.length; i++){
            temp += (i + 1) + ": " + result[i] + "\n";
        }
        document.getElementById('candidates_right').innerHTML = "<xmp>" + temp + "</xmp>";
    });



    
 }); 