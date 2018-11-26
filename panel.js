var backgroundPageConnection = chrome.runtime.connect({
    name: "panel"
});

backgroundPageConnection.postMessage({
    name: 'init',
    tabId: chrome.devtools.inspectedWindow.tabId
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
   
    chrome.devtools.inspectedWindow.eval("__spatialNavigation__.isContainer(document.activeElement);", {useContentScriptContext : true}, function(result) {
        document.getElementById('container').innerText = result;
    });



    chrome.devtools.inspectedWindow.eval("document.activeElement.focusableAreas({'mode': 'visible'}).map(a => a.outerHTML);", {useContentScriptContext : true}, function(result) {
        if (result.length == 0){
            result = "None";
        }
        document.getElementById('visible').innerText = result.replace(/(\r\n\t|\n|\r\t)/gm,"");
    });

    chrome.devtools.inspectedWindow.eval("document.activeElement.focusableAreas({'mode': 'all'}).map(a => a.outerHTML);", {useContentScriptContext : true}, function(result) {
        if (result.length == 0){
            result = "None";
        }
        document.getElementById('all').innerText = result.replace(/(\r\n\t|\n|\r\t)/gm,"");
    });



    chrome.devtools.inspectedWindow.eval("document.activeElement.spatialNavigationSearch('up').outerHTML;", {useContentScriptContext : true}, function(result) {
        document.getElementById('search_up').innerText = result.replace(/(\r\n\t|\n|\r\t)/gm,"");
    });

    chrome.devtools.inspectedWindow.eval("document.activeElement.spatialNavigationSearch('down').outerHTML;", {useContentScriptContext : true}, function(result) {
        document.getElementById('search_down').innerText = result.replace(/(\r\n\t|\n|\r\t)/gm,"");
    });

    chrome.devtools.inspectedWindow.eval("document.activeElement.spatialNavigationSearch('left').outerHTML;", {useContentScriptContext : true}, function(result) {
        document.getElementById('search_left').innerText = result.replace(/(\r\n\t|\n|\r\t)/gm,"");
    });

    chrome.devtools.inspectedWindow.eval("document.activeElement.spatialNavigationSearch('right').outerHTML;", {useContentScriptContext : true}, function(result) {
        document.getElementById('search_right').innerText = result.replace(/(\r\n\t|\n|\r\t)/gm,"");
    });



    chrome.devtools.inspectedWindow.eval("__spatialNavigation__.findNextTarget(document.activeElement, 'up').outerHTML;", {useContentScriptContext : true}, function(result) {
        document.getElementById('up').innerText = result.replace(/(\r\n\t|\n|\r\t)/gm,"");
    });
    
    chrome.devtools.inspectedWindow.eval("__spatialNavigation__.findNextTarget(document.activeElement, 'down').outerHTML;", {useContentScriptContext : true}, function(result) {
        document.getElementById('down').innerText = result.replace(/(\r\n\t|\n|\r\t)/gm,"");
    });

    chrome.devtools.inspectedWindow.eval("__spatialNavigation__.findNextTarget(document.activeElement, 'left').outerHTML;", {useContentScriptContext : true}, function(result) {
        document.getElementById('left').innerText = result.replace(/(\r\n\t|\n|\r\t)/gm,"");
    });
    
    chrome.devtools.inspectedWindow.eval("__spatialNavigation__.findNextTarget(document.activeElement, 'right').outerHTML;", {useContentScriptContext : true}, function(result) {
        document.getElementById('right').innerText = result.replace(/(\r\n\t|\n|\r\t)/gm,"");
    });



    chrome.devtools.inspectedWindow.eval("function candidates_up(){ var temp = __spatialNavigation__.findCandidates(document.activeElement, 'up'); var distance = []; var i; var dis_candidate = []; for(i = 0; i < temp.length; i++){ distance[i] = __spatialNavigation__.getDistanceFromTarget(document.activeElement, temp[i], 'up'); dis_candidate[i] = [temp[i].outerHTML, distance[i]];} return dis_candidate;} candidates_up();", {useContentScriptContext : true}, function(result) {
        var i;
        var temp = "";
        for(i = 0; i < result.length; i++){
            temp += (i + 1) + ": " + result[i][0].replace(/(\r\n\t|\n|\r\t)/gm,"") + "\n" + result[i][1] + "\n";
        }
        document.getElementById('candidates_up').innerText = temp;
    });

    chrome.devtools.inspectedWindow.eval("function candidates_down(){ var temp = __spatialNavigation__.findCandidates(document.activeElement, 'down'); var distance = []; var i; var dis_candidate = []; for(i = 0; i < temp.length; i++){ distance[i] = __spatialNavigation__.getDistanceFromTarget(document.activeElement, temp[i], 'down'); dis_candidate[i] = [temp[i].outerHTML, distance[i]];} return dis_candidate;} candidates_down();", {useContentScriptContext : true}, function(result) {
        var i;
        var temp = "";
        for(i = 0; i < result.length; i++){
            temp += (i + 1) + ": " + result[i][0].replace(/(\r\n\t|\n|\r\t)/gm,"") + "\n" + result[i][1] + "\n";
        }
        document.getElementById('candidates_down').innerText = temp;
    });

    chrome.devtools.inspectedWindow.eval("function candidates_left(){ var temp = __spatialNavigation__.findCandidates(document.activeElement, 'left'); var distance = []; var i; var dis_candidate = []; for(i = 0; i < temp.length; i++){ distance[i] = __spatialNavigation__.getDistanceFromTarget(document.activeElement, temp[i], 'left'); dis_candidate[i] = [temp[i].outerHTML, distance[i]];} return dis_candidate;} candidates_left();", {useContentScriptContext : true}, function(result) {
        var i;
        var temp = "";
        for(i = 0; i < result.length; i++){
            temp += (i + 1) + ": " + result[i][0].replace(/(\r\n\t|\n|\r\t)/gm,"") + "\n" + result[i][1] + "\n";
        }
        document.getElementById('candidates_left').innerText = temp;
    });

    chrome.devtools.inspectedWindow.eval("function candidates_right(){ var temp = __spatialNavigation__.findCandidates(document.activeElement, 'right'); var distance = []; var i; var dis_candidate = []; for(i = 0; i < temp.length; i++){ distance[i] = __spatialNavigation__.getDistanceFromTarget(document.activeElement, temp[i], 'right'); dis_candidate[i] = [temp[i].outerHTML, distance[i]];} return dis_candidate;} candidates_right();", {useContentScriptContext : true}, function(result) {
        var i;
        var temp = "";
        for(i = 0; i < result.length; i++){
            temp += (i + 1) + ": " + result[i][0].replace(/(\r\n\t|\n|\r\t)/gm,"") + "\n" + result[i][1] + "\n";
        }
        document.getElementById('candidates_right').innerText = temp;
    });



    chrome.devtools.inspectedWindow.eval("function container_list(){ var temp = document.activeElement.getSpatialNavigationContainer(); var list = []; var i = 0; while( temp != null){ list[i] = temp; i = i + 1; temp = temp.getSpatialNavigationContainer();} return list.map(a=>a.outerHTML);} container_list();", {useContentScriptContext : true}, function(result) {
        var i;
        var temp = "";
        for(i = 0; i < result.length; i++){
            temp += (i + 1) + ": " + result[i].replace(/(\r\n\t|\n|\r\t)/gm,"") + "\n";
        }
        document.getElementById('container_list').innerText = temp;
    });    
 }); 

 