var backgroundPageConnection = chrome.runtime.connect({
    name: "panel"
});

backgroundPageConnection.postMessage({
    name: 'init',
    tabId: chrome.devtools.inspectedWindow.tabId
});

var checked_cnt;
// add basic coloring & decoloring function
function coloring(dir) {
    checked_cnt++;
    const pre_color = 'function find(){ var tmp = __spatialNavigation__.findCandidates(document.activeElement, "';
    chrome.tabs.executeScript({
        code: pre_color.concat(dir, '"); if (tmp == undefined) return; var i; for (i = 0 ; i < tmp.length ; i++){ tmp[i].style.outline = "solid #B0C4DE"; } } find();')
    });
    if (checked_cnt == 4) document.getElementById("Button_all").checked = true;
}

function decoloring(dir){
    checked_cnt--;

    const pre_decolor = 'function find(){ var tmp = __spatialNavigation__.findCandidates(document.activeElement, "';
    chrome.tabs.executeScript({
        code: pre_decolor.concat(dir,'"); if (tmp == undefined) return; var i; for (i = 0 ; i < tmp.length ; i++){ tmp[i].style.outline = "transparent"; } } find();')
    });
    if (checked_cnt<4) document.getElementById("Button_all").checked = false;
}

var direction = ["up","down","left","right"];
    
// set onclick methond on each direction button (show focusable element of 4 direction from active element)
for (var idx = 0 ; idx < direction.length ; idx++){

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

document.getElementById("Button_all").onclick = function(){
    if (this.checked){
        
        for (var idx = 0 ; idx < direction.length ; idx++){
            try {throw direction[idx]}
            catch (way) {
                coloring(way);
                document.getElementById("Button_".concat(way)).checked = true;
        }
                
    }
    checked_cnt = 4;
}
    else {
        for (var idx = 0 ; idx < direction.length ; idx++){
            try {throw direction[idx]}
            catch (way) {
                decoloring(way);
                document.getElementById("Button_".concat(way)).checked = false;
        }
                
    }
    checked_cnt = 0;
    }
}

document.getElementById("Whole_page").onclick = function(){
    if (this.checked){
        document.getElementById("Button_all").checked = true;
        document.getElementById("Button_up").checked = true;
        document.getElementById("Button_down").checked = true;
        document.getElementById("Button_left").checked = true;
        document.getElementById("Button_right").checked = true;
          chrome.tabs.executeScript({
            code : "function paint(){ var tmp = document.body.focusableAreas({'mode': 'all'}); if (tmp == undefined) return; var j; for (j = 0 ; j < tmp.length ; j++){ tmp[j].style.outline = 'solid #B0C4DE'; } } paint();"
        });      
    }
    else {
        chrome.tabs.executeScript({
            code : "function remove(){ var tmp = document.body.focusableAreas({'mode': 'all'}); if (tmp == undefined) return; var j; for (j = 0 ; j < tmp.length ; j++){ tmp[j].style.outline = 'transparent'; } } remove();"
        });      
        document.getElementById("Button_all").checked = false;
        document.getElementById("Button_up").checked = false;
        document.getElementById("Button_down").checked = false;
        document.getElementById("Button_left").checked = false;
        document.getElementById("Button_right").checked = false;
        
    }

}


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    
    checked_cnt = 0;
    // if checked remove all outliner    
   
    
    if (document.getElementById("Whole_page").checked){
        document.getElementById("Whole_page").checked = false;
        document.getElementById("Button_all").checked = false;
        document.getElementById("Button_up").checked = false;
        document.getElementById("Button_down").checked = false;
        document.getElementById("Button_left").checked = false;
        document.getElementById("Button_right").checked = false;
          chrome.tabs.executeScript({
            code : "function remove(){ var tmp = document.body.focusableAreas({'mode': 'all'}); if (tmp == undefined) return; var j; for (j = 0 ; j < tmp.length ; j++){ tmp[j].style.outline = 'transparent'; } } remove();"
        });      
    }
    else if (document.getElementById("Button_all").checked){
        document.getElementById("Button_all").checked = false;
        document.getElementById("Button_up").checked = false;
        document.getElementById("Button_down").checked = false;
        document.getElementById("Button_left").checked = false;
        document.getElementById("Button_right").checked = false;
    } 
    else {if (document.getElementById("Button_up").checked){
        document.getElementById("Button_up").checked = false;
          chrome.tabs.executeScript({
            code : "function remove(){ var tmp = document.body.focusableAreas({'mode': 'all'}); if (tmp == undefined) return; var j; for (j = 0 ; j < tmp.length ; j++){ tmp[j].style.outline = 'transparent'; } } remove();"
        });      
    } 

    if (document.getElementById("Button_down").checked){
        document.getElementById("Button_down").checked = false;
          chrome.tabs.executeScript({
            code : "function remove(){ var tmp = document.body.focusableAreas({'mode': 'all'}); if (tmp == undefined) return; var j; for (j = 0 ; j < tmp.length ; j++){ tmp[j].style.outline = 'transparent'; } } remove();"
        });      
    } 
   
    if (document.getElementById("Button_left").checked){
        document.getElementById("Button_left").checked = false;
          chrome.tabs.executeScript({
            code : "function remove(){ var tmp = document.body.focusableAreas({'mode': 'all'}); if (tmp == undefined) return; var j; for (j = 0 ; j < tmp.length ; j++){ tmp[j].style.outline = 'transparent'; } } remove();"
        });      
    } 

    if (document.getElementById("Button_right").checked){
        document.getElementById("Button_right").checked = false;
          chrome.tabs.executeScript({
            code : "function remove(){ var tmp = document.body.focusableAreas({'mode': 'all'}); if (tmp == undefined) return; var j; for (j = 0 ; j < tmp.length ; j++){ tmp[j].style.outline = 'transparent'; } } remove();"
        });      
    } 
}

    chrome.devtools.inspectedWindow.eval("document.body.focusableAreas({'mode': 'all'}).length;", {useContentScriptContext : true}, function(result) {
        document.getElementById('focus_cnt').innerText = result;
    });

    chrome.devtools.inspectedWindow.eval("__spatialNavigation__.isContainer(document.activeElement);", {useContentScriptContext : true}, function(result) {
        document.getElementById('container').innerText = result;
    });


    // must modify from here

    chrome.devtools.inspectedWindow.eval("document.activeElement.focusableAreas({'mode': 'visible'}).map(a => a.outerHTML);", {useContentScriptContext : true}, function(result) {
        if (result.length == 0){
            var parentDiv = document.getElementById("visible");
            while (parentDiv.firstChild) {
                parentDiv.removeChild(parentDiv.firstChild);
            }
            var content3 = document.createTextNode("None");
            parentDiv.appendChild(content3);
        }
        else{
            var i;
            var temp;
            var parentDiv = document.getElementById("visible");
            while (parentDiv.firstChild) {
                parentDiv.removeChild(parentDiv.firstChild);
            }
    
            for(i = 0; i < result.length; i++){
                var temp_id = "visible_list_" + (i + 1);
                var newDiv = document.createElement("div");
                newDiv.id = temp_id;
                temp = (i+1) + " " + result[i].toString().replace(/(\r\n\t|\n|\r\t)/gm,"");
                var newContent = document.createTextNode(temp);
                newDiv.appendChild(newContent);
                parentDiv.appendChild(newDiv);
            }
        }
    });

    chrome.devtools.inspectedWindow.eval("document.activeElement.focusableAreas({'mode': 'all'}).map(a => a.outerHTML);", {useContentScriptContext : true}, function(result) {
        if (result.length == 0){
            var parentDiv = document.getElementById("all");
            while (parentDiv.firstChild) {
                parentDiv.removeChild(parentDiv.firstChild);
            }
            var content3 = document.createTextNode("None");
            parentDiv.appendChild(content3);
        }
        else{
            var i;
            var temp;
            var parentDiv = document.getElementById("all");
            while (parentDiv.firstChild) {
                parentDiv.removeChild(parentDiv.firstChild);
            }
    
            for(i = 0; i < result.length; i++){
                var temp_id = "all_list_" + (i + 1);
                var newDiv = document.createElement("div");
                newDiv.id = temp_id;
                temp = (i+1) + " " + result[i].toString().replace(/(\r\n\t|\n|\r\t)/gm,"");
                var newContent = document.createTextNode(temp);
                newDiv.appendChild(newContent);
                parentDiv.appendChild(newDiv);
            }
        }
    });

    
    // fill out 4 way result of spatnav search & 4 way candidate
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



    // make html element of 4 way candidate
    // 1 : up
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
    // down
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
    
    // left
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
    // right
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


    // container list
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

 // all mouseover event
 document.body.addEventListener('mouseover', function(event) {
    var id = event.srcElement.id;
    if(id){   
        if (direction.includes(id)) mouseOver(id);
        else if (id.includes("search_")) mouseOver(id);
        else if (id.includes("visible_list")) {
            document.getElementById(id).style.color = "red";
            var index = parseInt(id.substr(13)) -1;
            chrome.tabs.executeScript({
                code : 'var tmp = (document.activeElement.focusableAreas({"mode": "visible"})['.concat(index,']); if (tmp) {tmp.style.backgroundColor = "#FCADAB"; tmp.style.outline = "thick #FFC0CB";}')
            })
        }
        else if (id.includes("all_list")) {
            var index = parseInt(id.substr(9)) -1;
            chrome.tabs.executeScript({
                code : 'function check(){var tmp = (document.activeElement.focusableAreas({"mode": "all"})['.concat(index,']); var tmp_visible = (document.activeElement.focusableAreas({"mode": "visible"})); if (tmp) { if (tmp_visible.includes(tmp)){; tmp.style.backgroundColor = "#FCADAB"; tmp.style.outline = "thick #FFC0CB";return 1;}else {return 3;}}} check();')
            },function(result){
                if (result == 3) document.getElementById(id).style.color = "blue";
                else if (result == 1) document.getElementById(id).style.color = "red";
                
                // else 
            })
        }
        else if(id.includes('candidates_up')) {
            document.getElementById(id).style.color = "red";
            var index = parseInt(id.substr(13)) - 1;
            chrome.tabs.executeScript({
                code : 'var temp= __spatialNavigation__.findCandidates(document.activeElement, "up")['.concat(index,']; if(temp) {temp.style.backgroundColor = "#FCADAB"; temp.style.outline = "thick #FFC0CB";}')
            });
            
        }
        else if(id.includes('candidates_down')) {
            document.getElementById(id).style.color = "red";
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
            document.getElementById(id).style.color = "red";
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
            document.getElementById(id).style.color = "red";
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
            document.getElementById(id).style.color = "red";
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

 // mouse out event of 4 way candidates
 document.body.addEventListener('mouseout', function(event) {
    var id = event.srcElement.id;
    if(id){
        if (direction.includes(id)) mouseOut(id);
        else if (id.includes("search_")) mouseOut(id);
        else if (id.includes("visible_list")) {
            document.getElementById(id).style.color = "black";
            var index = parseInt(id.substr(13)) -1;
            chrome.tabs.executeScript({
                code : 'var tmp = (document.activeElement.focusableAreas({"mode": "visible"})['.concat(index,']); if (tmp) {tmp.style.backgroundColor = "transparent"; tmp.style.outline = "transparent";}')
            })
        }
        else if (id.includes("all_list")) {
            document.getElementById(id).style.color = "black";
            var index = parseInt(id.substr(9)) -1;
            chrome.tabs.executeScript({
                code : 'var tmp = (document.activeElement.focusableAreas({"mode": "all"})['.concat(index,']); if (tmp) {tmp.style.backgroundColor = "transparent"; tmp.style.outline = "transparent";}')
            })
        }
        else if(id.includes('candidates_up')) {
            document.getElementById(id).style.color = "black";
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
            document.getElementById(id).style.color = "black";
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
            document.getElementById(id).style.color = "black";
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
            document.getElementById(id).style.color = "black";
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
            document.getElementById(id).style.color = "black";
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


 // 4 direction next target mouse over / out event (75 line)
 /**
 * call direction
 * @param {string} way keyMode string
 */

function mouseOut(way) {
    if ((document.getElementById(way).innerText == "undefined")|| (document.getElementById(way) == null) ) return;

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
        const pre_over_next = 'var tmp = window.__spatialNavigation__.findNextTarget(document.activeElement, "';
        chrome.tabs.executeScript({
            code: pre_over_next.concat(way, '"); if (tmp) tmp.style.backgroundColor = "#FCADAB"')
        });
        chrome.tabs.executeScript({
            code: pre_over_next.concat(way, '"); if (tmp) tmp.style.outline = "thick #FFC0CB"')
        });
    }
    else if(document.getElementById(way).getAttribute('cmd') == 'spatnav_search') {
        //type 3 : spatnav_search
        var real_way = way.substr(7);
        const pre_over_spat = 'var tmp = document.activeElement.spatialNavigationSearch("';
        chrome.tabs.executeScript({
            code: pre_over_spat.concat(real_way, '"); if (tmp) tmp.style.backgroundColor = "#FCADAB"')
        });
        chrome.tabs.executeScript({
            code: pre_over_spat.concat(real_way, '"); if (tmp) tmp.style.outline = "thick #FFC0CB"')
        });
    }
}

