var backgroundPageConnection = chrome.runtime.connect({
    name: "panel"
});

backgroundPageConnection.postMessage({
    name: 'init',
    tabId: chrome.devtools.inspectedWindow.tabId
});


// add basic coloring & decoloring function
function coloring(dir) {   
    const pre_color = 'function find(){ var tmp = __spatialNavigation__.findCandidates(document.activeElement, "';
    chrome.tabs.executeScript({
        code: pre_color.concat(dir, '"); var i; for (i = 0 ; i < tmp.length ; i++){ tmp[i].style.outline = "solid #B0C4DE"; } } find();')
    });
}

function decoloring(dir){

    const pre_decolor = 'function find(){ var tmp = __spatialNavigation__.findCandidates(document.activeElement, "';
    chrome.tabs.executeScript({
        code: pre_decolor.concat(dir,'"); var i; for (i = 0 ; i < tmp.length ; i++){ tmp[i].style.outline = "transparent"; } } find();')
    });
}

var direction = ["up","down","left","right"];

for (var idx = 0 ; idx < direction.length ; idx++){
    // set onclick methond on each direction button
    try {throw direction[idx]}
    catch (way) {
        document.getElementById("Button_".concat(way)).onclick = function(){
            if (this.checked){
                coloring(way);
            }
            else {
                decoloring(way);
            }
        }
    }
}


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
   
    chrome.devtools.inspectedWindow.eval("__spatialNavigation__.isContainer(document.activeElement);", {useContentScriptContext : true}, function(result) {
        document.getElementById('container').innerText = result;
    });

    chrome.devtools.inspectedWindow.eval("document.activeElement.focusableAreas({'mode': 'visible'}).map(a => a.outerHTML);", {useContentScriptContext : true}, function(result) {
        if (result.length == 0){
            result = "None";
        }
        document.getElementById('visible').innerText = result.toString().replace(/(\r\n\t|\n|\r\t)/gm,"");
    });

    chrome.devtools.inspectedWindow.eval("document.activeElement.focusableAreas({'mode': 'all'}).map(a => a.outerHTML);", {useContentScriptContext : true}, function(result) {
        if (result.length == 0){
            result = "None";
        }
        document.getElementById('all').innerText = result.toString().replace(/(\r\n\t|\n|\r\t)/gm,"");
    });


    for (var idx = 0 ; idx < direction.length ; idx++){
        (function(){
            var way = direction[idx];
            const pre_0 = '__spatialNavigation__.findNextTarget(document.activeElement, "';
            var cmd_0 = pre_0.concat(way,'").outerHTML;');

            chrome.devtools.inspectedWindow.eval(cmd_0, {useContentScriptContext : true}, function(result) {
                try {throw result}
                catch(res){
                    if (res === undefined) document.getElementById(way).innerText = 'undefined';
                    else document.getElementById(way).innerText = res.toString().replace(/(\r\n\t|\n|\r\t)/gm,"");    
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
                    if (res2 === undefined)
                        document.getElementById(search_id).innerText = "undefined";
                    else
                        document.getElementById(search_id).innerText = res2.toString().replace(/(\r\n\t|\n|\r\t)/gm,"");
                }
            });
        })();       
    }


    chrome.devtools.inspectedWindow.eval("function candidates_up(){ var temp = __spatialNavigation__.findCandidates(document.activeElement, 'up'); var distance = []; var i; var dis_candidate = []; for(i = 0; i < temp.length; i++){ distance[i] = __spatialNavigation__.getDistanceFromTarget(document.activeElement, temp[i], 'up'); dis_candidate[i] = [temp[i].outerHTML, distance[i]];} return dis_candidate;} candidates_up();", {useContentScriptContext : true}, function(result) {
        if (result.length == 0){
            var parentDiv = document.getElementById("candidates1");
            while (parentDiv.firstChild) {
                parentDiv.removeChild(parentDiv.firstChild);
            }
            var content3 = document.createTextNode("None");
            parentDiv.appendChild(content3);
        }
        else{
            var i;
            var temp;
            var parentDiv = document.getElementById("candidates1");
            while (parentDiv.firstChild) {
                parentDiv.removeChild(parentDiv.firstChild);
            }
    
            for(i = 0; i < result.length; i++){
                //var temp_id = id + (i + 1);
                var temp_id = "candidates_up" + (i + 1);
                var newDiv = document.createElement("div");
                //newDiv.setAttribute("id", id);
                newDiv.id = temp_id;
                temp = "(" + (i + 1) + ") distance : " + parseInt(result[i][1]) + ", "+ result[i][0].replace(/(\r\n\t|\n|\r\t)/gm,"");
                var newContent = document.createTextNode(temp);
                newDiv.appendChild(newContent);
    
                // add the newly created element and its content into the DOM
                //var currentDiv = document.getElementById("candidates_up");
                parentDiv.appendChild(newDiv);
            }
        }
    });

    chrome.devtools.inspectedWindow.eval("function candidates_down(){ var temp = __spatialNavigation__.findCandidates(document.activeElement, 'down'); var distance = []; var i; var dis_candidate = []; for(i = 0; i < temp.length; i++){ distance[i] = __spatialNavigation__.getDistanceFromTarget(document.activeElement, temp[i], 'down'); dis_candidate[i] = [temp[i].outerHTML, distance[i]];} return dis_candidate;} candidates_down();", {useContentScriptContext : true}, function(result) {
        if (result.length == 0){
            var parentDiv = document.getElementById("candidates2");
            while (parentDiv.firstChild) {
                parentDiv.removeChild(parentDiv.firstChild);
            }
            var content3 = document.createTextNode("None");
            parentDiv.appendChild(content3);
        }
        else{
            var i;
            var temp;
            var parentDiv = document.getElementById("candidates2");
            while (parentDiv.firstChild) {
                parentDiv.removeChild(parentDiv.firstChild);
            }
    
            for(i = 0; i < result.length; i++){    
                var temp_id = "candidates_down" + (i + 1);
                var newDiv = document.createElement("div");
                newDiv.setAttribute("id", temp_id);
                temp = "(" + (i + 1) + ") distance : " + parseInt(result[i][1]) + ", "+ result[i][0].replace(/(\r\n\t|\n|\r\t)/gm,"");
                var newContent = document.createTextNode(temp);
                newDiv.appendChild(newContent);
    
                // add the newly created element and its content into the DOM
                var currentDiv = document.getElementById("candidates_down");
                parentDiv.insertBefore(newDiv, currentDiv);
            }
        }
    });

    chrome.devtools.inspectedWindow.eval("function candidates_left(){ var temp = __spatialNavigation__.findCandidates(document.activeElement, 'left'); var distance = []; var i; var dis_candidate = []; for(i = 0; i < temp.length; i++){ distance[i] = __spatialNavigation__.getDistanceFromTarget(document.activeElement, temp[i], 'left'); dis_candidate[i] = [temp[i].outerHTML, distance[i]];} return dis_candidate;} candidates_left();", {useContentScriptContext : true}, function(result) {
        if (result.length == 0){
            var parentDiv = document.getElementById("candidates3");
            while (parentDiv.firstChild) {
                parentDiv.removeChild(parentDiv.firstChild);
            }
            var content3 = document.createTextNode("None");
            parentDiv.appendChild(content3);
        }
        else{
            var i;
            var temp;
            var parentDiv = document.getElementById("candidates3");
            while (parentDiv.firstChild) {
                parentDiv.removeChild(parentDiv.firstChild);
            }
    
            for(i = 0; i < result.length; i++){
                var temp_id = "candidates_left" + (i + 1);
                var newDiv = document.createElement("div");
                newDiv.setAttribute("id", temp_id);
                temp = "(" + (i + 1) + ") distance : " + parseInt(result[i][1]) + ", "+ result[i][0].replace(/(\r\n\t|\n|\r\t)/gm,"");
                var newContent = document.createTextNode(temp);
                newDiv.appendChild(newContent);
    
                // add the newly created element and its content into the DOM
                var currentDiv = document.getElementById("candidates_left");
                parentDiv.insertBefore(newDiv, currentDiv);
            }
        }
    });

    chrome.devtools.inspectedWindow.eval("function candidates_right(){ var temp = __spatialNavigation__.findCandidates(document.activeElement, 'right'); var distance = []; var i; var dis_candidate = []; for(i = 0; i < temp.length; i++){ distance[i] = __spatialNavigation__.getDistanceFromTarget(document.activeElement, temp[i], 'right'); dis_candidate[i] = [temp[i].outerHTML, distance[i]];} return dis_candidate;} candidates_right();", {useContentScriptContext : true}, function(result) {
        if (result.length == 0){
            var parentDiv = document.getElementById("candidates4");
            while (parentDiv.firstChild) {
                parentDiv.removeChild(parentDiv.firstChild);
            }
            var content3 = document.createTextNode("None");
            parentDiv.appendChild(content3);
        }
        else{
            var i;
            var temp;
            var parentDiv = document.getElementById("candidates4");
            while (parentDiv.firstChild) {
                parentDiv.removeChild(parentDiv.firstChild);
            }
    
            for(i = 0; i < result.length; i++){
                var temp_id = "candidates_right" + (i + 1);
                var newDiv = document.createElement("div");
                newDiv.setAttribute("id", temp_id);
                temp = "(" + (i + 1) + ") distance : " + parseInt(result[i][1]) + ", "+ result[i][0].replace(/(\r\n\t|\n|\r\t)/gm,"");
                var newContent = document.createTextNode(temp);
                newDiv.appendChild(newContent);
    
                // add the newly created element and its content into the DOM
                var currentDiv = document.getElementById("candidates_right");
                parentDiv.insertBefore(newDiv, currentDiv);
            }
        }
    });



    chrome.devtools.inspectedWindow.eval("function container_list(){ var temp = document.activeElement.getSpatialNavigationContainer(); var list = []; var i = 0; while( temp != null){ list[i] = temp; i = i + 1; temp = temp.getSpatialNavigationContainer();} return list.map(a=>a.outerHTML);} container_list();", {useContentScriptContext : true}, function(result) {
        if (result === undefined){
            document.getElementById('container_list').innerText = 'undefined';
        }
        else{
            var i;
            var temp;
            var parentDiv = document.getElementById("containerlist1");
            while (parentDiv.firstChild) {
                parentDiv.removeChild(parentDiv.firstChild);
            }
    
            for(i = 0; i < result.length; i++){
                var temp_id = "container_list" + (i + 1);
                var newDiv = document.createElement("div");
                newDiv.setAttribute("id", temp_id);
                temp = "(" + (i + 1) + ") " + result[i].replace(/(\r\n\t|\n|\r\t)/gm,"");
                var newContent = document.createTextNode(temp);
                newDiv.appendChild(newContent);
    
                // add the newly created element and its content into the DOM
                var currentDiv = document.getElementById("container_list");
                parentDiv.insertBefore(newDiv, currentDiv);
            }
        }
    }); 
 }); 

 document.body.addEventListener('mouseover', function(event) {
    var id = event.srcElement.id;
    if(id){
        document.getElementById(id).style.color = "red";
   
        if(id.includes('candidates_up')) {
            var index = parseInt(id.substr(13)) - 1;
            const pre_out_spat = 'var temp= __spatialNavigation__.findCandidates(document.activeElement, "up")[' + index + ']; if(temp)';
            chrome.tabs.executeScript({
                code: pre_out_spat.concat('{temp.style.backgroundColor = "#FCADAB";}')
            });
            chrome.tabs.executeScript({
                code: pre_out_spat.concat('{temp.style.outline = "thick #FFC0CB";}')
            });
        }
        else if(id.includes('candidates_down')) {
            var index = parseInt(id.substr(15)) - 1;
            const pre_out_spat = 'var temp= __spatialNavigation__.findCandidates(document.activeElement, "down")[' + index + ']; if(temp)';
            chrome.tabs.executeScript({
                code: pre_out_spat.concat('{temp.style.backgroundColor = "#FCADAB";}')
            });
            chrome.tabs.executeScript({
                code: pre_out_spat.concat('{temp.style.outline = "thick #FFC0CB";}')
            });
        }
        else if(id.includes('candidates_left')) {
            var index = parseInt(id.substr(15)) - 1;
            const pre_out_spat = 'var temp= __spatialNavigation__.findCandidates(document.activeElement, "left")[' + index + ']; if(temp)';
            chrome.tabs.executeScript({
                code: pre_out_spat.concat('{temp.style.backgroundColor = "#FCADAB";}')
            });
            chrome.tabs.executeScript({
                code: pre_out_spat.concat('{temp.style.outline = "thick #FFC0CB";}')
            });
        }
        else if(id.includes('candidates_right')) {
            var index = parseInt(id.substr(16)) - 1;
            const pre_out_spat = 'var temp= __spatialNavigation__.findCandidates(document.activeElement, "right")[' + index + ']; if(temp)';
            chrome.tabs.executeScript({
                code: pre_out_spat.concat('{temp.style.backgroundColor = "#FCADAB";}')
            });
            chrome.tabs.executeScript({
                code: pre_out_spat.concat('{temp.style.outline = "thick #FFC0CB";}')
            });
        }
        else if (id.includes('container_list')) {
            var index = parseInt(id.substr(14)) - 1;
            const pre_out_spat = 'var temp = document.activeElement.getSpatialNavigationContainer(); for(var i = 0; i < ' + index + '; i++) { temp.getSpatialNavigationContainer();} temp';
            chrome.tabs.executeScript({
                code: pre_out_spat.concat('.style.backgroundColor = "#FCADAB"')
            });
            chrome.tabs.executeScript({
                code: pre_out_spat.concat('.style.outline = "thick #FFC0CB"')
            });
        }
    }
 });
 document.body.addEventListener('mouseout', function(event) {
    var id = event.srcElement.id;
    if(id){
        document.getElementById(id).style.color = "black";
        if(id.includes('candidates_up')) {
            var index = parseInt(id.substr(13) - 1);
            const pre_out_spat = 'var temp= __spatialNavigation__.findCandidates(document.activeElement, "up")[' + index + ']; if(temp)';
            chrome.tabs.executeScript({
                code: pre_out_spat.concat('{temp.style.backgroundColor = "transparent"}')
            });
            chrome.tabs.executeScript({
                code: pre_out_spat.concat('{temp.style.outline = "transparent"}')
            });
        }
        else if(id.includes('candidates_down')) {
            var index = parseInt(id.substr(15)) - 1;
            const pre_out_spat = 'var temp= __spatialNavigation__.findCandidates(document.activeElement, "down")[' + index + ']; if(temp)';
            chrome.tabs.executeScript({
                code: pre_out_spat.concat('{temp.style.backgroundColor = "transparent"}')
            });
            chrome.tabs.executeScript({
                code: pre_out_spat.concat('{temp.style.outline = "transparent"}')
            });
        }
        else if(id.includes('candidates_left')) {
            var index = parseInt(id.substr(15)) - 1;
            const pre_out_spat = 'var temp= __spatialNavigation__.findCandidates(document.activeElement, "left")[' + index + ']; if(temp)';
            chrome.tabs.executeScript({
                code: pre_out_spat.concat('{temp.style.backgroundColor = "transparent"}')
            });
            chrome.tabs.executeScript({
                code: pre_out_spat.concat('{temp.style.outline = "transparent"}')
            });
        }
        else if(id.includes('candidates_right')) {
            var index = parseInt(id.substr(16)) - 1;
            const pre_out_spat = 'var temp= __spatialNavigation__.findCandidates(document.activeElement, "right")[' + index + ']; if(temp)';
            chrome.tabs.executeScript({
                code: pre_out_spat.concat('{temp.style.backgroundColor = "transparent"}')
            });
            chrome.tabs.executeScript({
                code: pre_out_spat.concat('{temp.style.outline = "transparent"}')
            });
        }
        else if (id.includes('container_list')) {
            var index = parseInt(id.substr(14)) - 1;
            const pre_out_spat = 'var temp = document.activeElement.getSpatialNavigationContainer(); for(var i = 0; i < ' + index + '; i++) { temp.getSpatialNavigationContainer();} temp';
            chrome.tabs.executeScript({
                code: pre_out_spat.concat('.style.backgroundColor = "transparent"')
            });
            chrome.tabs.executeScript({
                code: pre_out_spat.concat('.style.outline = "transparent"')
            });
        }
    }
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
        var candidates = "candidates".concat((idx + 1));
        var candidates_id = "candidates_".concat(way);

        try {throw search}
        catch (search_way){
            document.getElementById(search_way).onmouseover = function(){mouseOver(search_way)};
            document.getElementById(search_way).onmouseout = function(){mouseOut(search_way)};
        }
    }
}


function mouseOut(way) {
    if (document.getElementById(way).innerText == "undefined") return;

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

    else if(document.getElementById(way).getAttribute('cmd') == 'spatnav_search'){
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
    if (document.getElementById(way).innerText == "undefined") return;

    document.getElementById(way).style.color = "red";

    if (document.getElementById(way).getAttribute('cmd') == 'next') {
        // type 4 : next target
        const pre_over_next = 'window.__spatialNavigation__.findNextTarget(document.activeElement, "';
        chrome.tabs.executeScript({
            code: pre_over_next.concat(way, '").style.backgroundColor = "#FCADAB"')
        });
        chrome.tabs.executeScript({
            code: pre_over_next.concat(way, '").style.outline = "thick #FFC0CB"')
        });
    }
    else if(document.getElementById(way).getAttribute('cmd') == 'spatnav_search') {
        //type 3 : spatnav_search
        var real_way = way.substr(7);
        const pre_over_spat = 'document.activeElement.spatialNavigationSearch("';
        chrome.tabs.executeScript({
            code: pre_over_spat.concat(real_way, '").style.backgroundColor = "#FCADAB"')
        });
        chrome.tabs.executeScript({
            code: pre_over_spat.concat(real_way, '").style.outline = "thick #FFC0CB"')
        });
    }
}

