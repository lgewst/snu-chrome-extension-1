var backgroundPageConnection = chrome.runtime.connect({
    name: "panel"
});

backgroundPageConnection.postMessage({
    name: 'init',
    tabId: chrome.devtools.inspectedWindow.tabId
});

var direction = ["up","down","left","right"];

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


    for (var idx = 0 ; idx < direction.length ; idx++){
        (function(){
            var way = direction[idx];
            const pre_0 = '__spatialNavigation__.findNextTarget(document.activeElement, "';
            var cmd_0 = pre_0.concat(way,'").outerHTML;');

            chrome.devtools.inspectedWindow.eval(cmd_0, {useContentScriptContext : true}, function(result) {
                try {throw result}
                catch(res){
                    if (res == null) document.getElementById(way).innerText = null;
                    else document.getElementById(way).innerText = res.replace(/(\r\n\t|\n|\r\t)/gm,"");    
                }
                document.getElementById(way).setAttribute('cmd','next');
            });

            const pre_1 = "document.activeElement.spatialNavigationSearch('";
            var cmd_1 = pre_1.concat(way,"').outerHTML;");

            chrome.devtools.inspectedWindow.eval(cmd_1, {useContentScriptContext : true}, function(result2) {
                var search_id = "search_".concat(way);
                document.getElementById(search_id).setAttribute('cmd','spatnav_search');
                try {throw result2}
                catch(res2){
                    if (res2 == null)
                        document.getElementById(search_id).innerText = null;
                    else
                        document.getElementById(search_id).innerText = res2.replace(/(\r\n\t|\n|\r\t)/gm,"");
                }
            });
        })();       
    }


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

 /**
 * call direction
 * @param {string} way keyMode string
 */

for (var idx = 0 ; idx < direction.length ; idx++){
    // set mouseover & out movement to all arguments exept candidate list
    var tmp = direction[idx];
    try {throw tmp}
    catch (way) {
        document.getElementById(way).onmouseover = function(){mouseOver(way)};
        document.getElementById(way).onmouseout = function(){mouseOut(way)};
        var search = "search_".concat(way);
        try {throw search}
        catch (search_way){
            document.getElementById(search_way).onmouseover = function(){mouseOver(search_way)};
            document.getElementById(search_way).onmouseout = function(){mouseOut(search_way)};
        }
    }
}

function mouseOut(way) {

if (document.getElementById(way) == null) return;

document.getElementById(way).style.color = "black";

if (document.getElementById(way).getAttribute('cmd') == 'next') {
    // type 4 : next target
    const pre_out_next = 'window.__spatialNavigation__.findNextTarget(document.activeElement, "';
    chrome.tabs.executeScript({
        code: pre_out_next.concat(way, '").style.backgroundColor = "transparent"')
    });
    chrome.tabs.executeScript({
        code: pre_out_next.concat(way, '").style.outline = "transparent"')
    });
    
}
else {
    //type 3 : spatnav_search
    var real_way = way.substr(7);
    const pre_out_spat = 'document.activeElement.spatialNavigationSearch("';
    chrome.tabs.executeScript({
        code: pre_out_spat.concat(real_way, '").style.backgroundColor = "transparent"')
    });
    chrome.tabs.executeScript({
        code: pre_out_spat.concat(real_way, '").style.outline = "transparent"')
    });
}
}

function mouseOver(way) {
if (document.getElementById(way) == null) return;

document.getElementById(way).style.color = "red";

if (document.getElementById(way).getAttribute('cmd') == 'next') {
    // type 4 : next target
    const pre_over_next = 'window.__spatialNavigation__.findNextTarget(document.activeElement, "';
    chrome.tabs.executeScript({
        code: pre_over_next.concat(way, '").style.backgroundColor = "#DDA0DD"')
    });
    chrome.tabs.executeScript({
        code: pre_over_next.concat(way, '").style.outline = "thick #BA55D3"')
    });
    
}
else {
    //type 3 : spatnav_search
    var real_way = way.substr(7);
    const pre_over_spat = 'document.activeElement.spatialNavigationSearch("';
    chrome.tabs.executeScript({
        code: pre_over_spat.concat(real_way, '").style.backgroundColor = "#B0C4DE"')
    });
    chrome.tabs.executeScript({
        code: pre_over_spat.concat(real_way, '").style.outline = "thick #6495ED"')
    });
}
}

 