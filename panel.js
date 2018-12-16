const backgroundPageConnection = chrome.runtime.connect({
    name: "panel"
});

backgroundPageConnection.postMessage({
    name: "init",
    tabId: chrome.devtools.inspectedWindow.tabId
});

let checkedCnt;
const direction = ["up", "down", "left", "right"];

/**
 * Make / Remove outline on candidates of specific direction
 * @param {string} dir colored / decolored way
 */
function coloring(dir) {
    checkedCnt++;
    const preColor = "function find(){ var tmp = __spatialNavigation__.findCandidates(document.activeElement, \"";
    chrome.tabs.executeScript({
        code: preColor.concat(dir, "\"); if (tmp == undefined) return; var i; for (i = 0 ; i < tmp.length ; i++){ tmp[i].style.outline = \"solid #B0C4DE\"; } } find();")
    });
    if (checkedCnt == 4) document.getElementById("Button_all").checked = true;
}

function decoloring(dir) {
    checkedCnt--;
    const preDecolor = "function find(){ var tmp = __spatialNavigation__.findCandidates(document.activeElement, \"";
    chrome.tabs.executeScript({
        code: preDecolor.concat(dir, "\"); if (tmp == undefined) return; var i; for (i = 0 ; i < tmp.length ; i++){ tmp[i].style.outline = \"transparent\"; } } find();")
    });
    if (checkedCnt < 4) document.getElementById("Button_all").checked = false;
}

/**
 * Focusable element button onclick event listener
 */
document.body.addEventListener("click", (event) => {
    const id = event.srcElement.id;
    if (id == "Whole_page"){
        if (document.getElementById(id).checked) {
            ChangeCheckAll(true);
            document.getElementById("Button_all").checked = true;
            chrome.tabs.executeScript({
                code: "function paint(){ var tmp = document.body.focusableAreas({'mode': 'all'}); if (tmp == undefined) return; var j; for (j = 0 ; j < tmp.length ; j++){ tmp[j].style.outline = 'solid #B0C4DE'; } } paint();"
            });
        } else {
            ChangeCheckAll(false);
            chrome.tabs.executeScript({
                code: "function remove(){ var tmp = document.body.focusableAreas({'mode': 'all'}); if (tmp == undefined) return; var j; for (j = 0 ; j < tmp.length ; j++){ tmp[j].style.outline = 'transparent'; } } remove();"
            });
            document.getElementById("Button_all").checked = false;
        }
    }
    else if(id == "Button_all"){
        if (document.getElementById(id).checked) ChangeCheckAll(true);
        else ChangeCheckAll(false);
    }
    else {
        var way = id.substr(7);
        if (direction.includes(way)){
        if (document.getElementById(id).checked) coloring(way);
        else decoloring(way);
        }
    }
});

/**
 * Check / UnCheck focusable element button (4way)
 * @param {boolean} bool true = checked, false = unchecked
 */
function ChangeCheckAll(bool){
    for (var idx = 0; idx < direction.length; idx++) {
        try { throw direction[idx]; } catch (way) {
            document.getElementById("Button_".concat(way)).checked = bool;
            if (bool) {
                coloring(way);
                checkedCnt = 4;
            }
            else {
                decoloring(way);
                checkedCnt = 0;
            }
        }
    }
}

/**
 * 
 * Send Message on every focus changing event
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    
    // remove all outliner
    if (checkedCnt != 0) {
        ChangeCheckAll(false);
        document.getElementById("Whole_page").checked = false;
        document.getElementById("Button_all").checked = false;
        chrome.tabs.executeScript({
            code: "function remove(){ var tmp = document.body.focusableAreas({'mode': 'all'}); if (tmp == undefined) return; var j; for (j = 0 ; j < tmp.length ; j++){ tmp[j].style.outline = 'transparent'; } } remove();"
        });
    }
    
    // show information of Spatnav on devtool 
    chrome.devtools.inspectedWindow.eval("document.body.focusableAreas({'mode': 'all'}).length;", { useContentScriptContext: true }, (result) => {
        document.getElementById("focus_cnt").innerText = result;
    });

    chrome.devtools.inspectedWindow.eval("__spatialNavigation__.isContainer(document.activeElement);", { useContentScriptContext: true }, (result) => {
        document.getElementById("container").innerText = result;
        if (result.toString() == "true") {
            document.getElementById("container").style.color = "#0057e7";
        } else {
            document.getElementById("container").style.color = "#d62d20";
        }
    });

    chrome.devtools.inspectedWindow.eval("document.activeElement.focusableAreas({'mode': 'visible'}).map(a => a.outerHTML);", { useContentScriptContext: true }, (result) => {
        if (result.length == 0) {
            var parentDiv = document.getElementById("visible");
            while (parentDiv.firstChild) {
                parentDiv.removeChild(parentDiv.firstChild);
            }
            const content3 = document.createTextNode("None");
            parentDiv.appendChild(content3);
        } else {
            let i;
            let temp;
            var parentDiv = document.getElementById("visible");
            while (parentDiv.firstChild) {
                parentDiv.removeChild(parentDiv.firstChild);
            }

            for (i = 0; i < result.length; i++) {
                const tempId = `visible_list_${i + 1}`;
                const newDiv = document.createElement("div");
                newDiv.id = tempId;
                temp = `[${i + 1}] ${result[i].toString().replace(/(\r\n\t|\n|\r\t)/gm, "")}`;
                const newContent = document.createTextNode(temp);
                newDiv.appendChild(newContent);
                parentDiv.appendChild(newDiv);
            }
        }
    });

    // Make list of focusable areas
    chrome.devtools.inspectedWindow.eval("document.activeElement.focusableAreas({'mode': 'all'}).map(a => a.outerHTML);", { useContentScriptContext: true }, (result) => {
        if (result.length == 0) {
            var parentDiv = document.getElementById("all");
            while (parentDiv.firstChild) {
                parentDiv.removeChild(parentDiv.firstChild);
            }
            const content3 = document.createTextNode("None");
            parentDiv.appendChild(content3);
        } else {
            let i;
            let temp;
            var parentDiv = document.getElementById("all");
            while (parentDiv.firstChild) {
                parentDiv.removeChild(parentDiv.firstChild);
            }

            for (i = 0; i < result.length; i++) {
                const tempId = `all_list_${i + 1}`;
                const newDiv = document.createElement("div");
                newDiv.id = tempId;
                temp = `[${i + 1}] ${result[i].toString().replace(/(\r\n\t|\n|\r\t)/gm, "")}`;
                const newContent = document.createTextNode(temp);
                newDiv.appendChild(newContent);
                parentDiv.appendChild(newDiv);
            }
        }
    });

    for (var idx = 0; idx < direction.length; idx++) {
        (function () {
            const way = direction[idx];
            const cmd0 = "__spatialNavigation__.findNextTarget(document.activeElement, \"".concat(way, "\").outerHTML;");
            chrome.devtools.inspectedWindow.eval(cmd0, { useContentScriptContext: true }, (result) => {
                try { throw result; } catch (res) {
                    if (res === undefined) document.getElementById(way).innerText = "undefined";
                    else document.getElementById(way).innerText = res.toString().replace(/(\r\n\t|\n|\r\t)/gm, "");
                }
                document.getElementById(way).setAttribute("cmd", "next");
            });

            const cmd1 = "document.activeElement.spatialNavigationSearch('".concat(way, "').outerHTML;");

            chrome.devtools.inspectedWindow.eval(cmd1, { useContentScriptContext: true }, (result2) => {
                const search_id = "search_".concat(way);
                document.getElementById(search_id).setAttribute("cmd", "spatnav_search");
                try { throw result2; } catch (res2) {
                    if (res2 === undefined) { document.getElementById(search_id).innerText = "undefined"; } else { document.getElementById(search_id).innerText = res2.toString().replace(/(\r\n\t|\n|\r\t)/gm, ""); }
                }
            });
        }());
    }

    // Make list of 4 way candidate
    // 1 : up
    chrome.devtools.inspectedWindow.eval("function candidates_up(){ var temp = __spatialNavigation__.findCandidates(document.activeElement, 'up'); var distance = []; var i; var dis_candidate = []; for(i = 0; i < temp.length; i++){ distance[i] = __spatialNavigation__.getDistanceFromTarget(document.activeElement, temp[i], 'up'); dis_candidate[i] = [temp[i].outerHTML, distance[i]];} return dis_candidate;} candidates_up();", { useContentScriptContext: true }, (result) => {
        if (result.length == 0) {
            var parentDiv = document.getElementById("candidates1");
            while (parentDiv.firstChild) {
                parentDiv.removeChild(parentDiv.firstChild);
            }
            const content3 = document.createTextNode("None");
            parentDiv.appendChild(content3);
        } else {
            let i;
            let temp;
            var parentDiv = document.getElementById("candidates1");
            while (parentDiv.firstChild) {
                parentDiv.removeChild(parentDiv.firstChild);
            }

            for (i = 0; i < result.length; i++) {
                const tempId = `candidates_up${i + 1}`;
                const newDiv = document.createElement("div");
                newDiv.id = tempId;
                temp = `[${i + 1}] distance : ${parseInt(result[i][1])}, ${result[i][0].replace(/(\r\n\t|\n|\r\t)/gm, "")}`;
                const newContent = document.createTextNode(temp);
                newDiv.appendChild(newContent);
                parentDiv.appendChild(newDiv);
            }
        }
    });
    // 2: down
    chrome.devtools.inspectedWindow.eval("function candidates_down(){ var temp = __spatialNavigation__.findCandidates(document.activeElement, 'down'); var distance = []; var i; var dis_candidate = []; for(i = 0; i < temp.length; i++){ distance[i] = __spatialNavigation__.getDistanceFromTarget(document.activeElement, temp[i], 'down'); dis_candidate[i] = [temp[i].outerHTML, distance[i]];} return dis_candidate;} candidates_down();", { useContentScriptContext: true }, (result) => {
        if (result.length == 0) {
            var parentDiv = document.getElementById("candidates2");
            while (parentDiv.firstChild) {
                parentDiv.removeChild(parentDiv.firstChild);
            }
            const content3 = document.createTextNode("None");
            parentDiv.appendChild(content3);
        } else {
            let i;
            let temp;
            var parentDiv = document.getElementById("candidates2");
            while (parentDiv.firstChild) {
                parentDiv.removeChild(parentDiv.firstChild);
            }

            for (i = 0; i < result.length; i++) {
                const tempId = `candidates_down${i + 1}`;
                const newDiv = document.createElement("div");
                newDiv.setAttribute("id", tempId);
                temp = `[${i + 1}] distance : ${parseInt(result[i][1])}, ${result[i][0].replace(/(\r\n\t|\n|\r\t)/gm, "")}`;
                const newContent = document.createTextNode(temp);
                newDiv.appendChild(newContent);
                const currentDiv = document.getElementById("candidates_down");
                parentDiv.insertBefore(newDiv, currentDiv);
            }
        }
    });

    // 3:left
    chrome.devtools.inspectedWindow.eval("function candidates_left(){ var temp = __spatialNavigation__.findCandidates(document.activeElement, 'left'); var distance = []; var i; var dis_candidate = []; for(i = 0; i < temp.length; i++){ distance[i] = __spatialNavigation__.getDistanceFromTarget(document.activeElement, temp[i], 'left'); dis_candidate[i] = [temp[i].outerHTML, distance[i]];} return dis_candidate;} candidates_left();", { useContentScriptContext: true }, (result) => {
        if (result == undefined) return;
        if (result.length == 0) {
            var parentDiv = document.getElementById("candidates3");
            while (parentDiv.firstChild) {
                parentDiv.removeChild(parentDiv.firstChild);
            }
            const content3 = document.createTextNode("None");
            parentDiv.appendChild(content3);
        } else {
            let i;
            let temp;
            var parentDiv = document.getElementById("candidates3");
            while (parentDiv.firstChild) {
                parentDiv.removeChild(parentDiv.firstChild);
            }

            for (i = 0; i < result.length; i++) {
                const tempId = `candidates_left${i + 1}`;
                const newDiv = document.createElement("div");
                newDiv.setAttribute("id", tempId);
                temp = `[${i + 1}] distance : ${parseInt(result[i][1])}, ${result[i][0].replace(/(\r\n\t|\n|\r\t)/gm, "")}`;
                const newContent = document.createTextNode(temp);
                newDiv.appendChild(newContent);
                const currentDiv = document.getElementById("candidates_left");
                parentDiv.insertBefore(newDiv, currentDiv);
            }
        }
    });
    
    // 4: right
    chrome.devtools.inspectedWindow.eval("function candidates_right(){ var temp = __spatialNavigation__.findCandidates(document.activeElement, 'right'); var distance = []; var i; var dis_candidate = []; for(i = 0; i < temp.length; i++){ distance[i] = __spatialNavigation__.getDistanceFromTarget(document.activeElement, temp[i], 'right'); dis_candidate[i] = [temp[i].outerHTML, distance[i]];} return dis_candidate;} candidates_right();", { useContentScriptContext: true }, (result) => {
        if (result.length == 0) {
            var parentDiv = document.getElementById("candidates4");
            while (parentDiv.firstChild) {
                parentDiv.removeChild(parentDiv.firstChild);
            }
            const content3 = document.createTextNode("None");
            parentDiv.appendChild(content3);
        } else {
            let i;
            let temp;
            var parentDiv = document.getElementById("candidates4");
            while (parentDiv.firstChild) {
                parentDiv.removeChild(parentDiv.firstChild);
            }

            for (i = 0; i < result.length; i++) {
                const tempId = `candidates_right${i + 1}`;
                const newDiv = document.createElement("div");
                newDiv.setAttribute("id", tempId);
                temp = `[${i + 1}] distance : ${parseInt(result[i][1])}, ${result[i][0].replace(/(\r\n\t|\n|\r\t)/gm, "")}`;
                const newContent = document.createTextNode(temp);
                newDiv.appendChild(newContent);
                const currentDiv = document.getElementById("candidates_right");
                parentDiv.insertBefore(newDiv, currentDiv);
            }
        }
    });

    // Make list of container
    chrome.devtools.inspectedWindow.eval("function container_list(){ var temp = document.activeElement.getSpatialNavigationContainer(); var list = []; var i = 0; while( temp != null){ list[i] = temp; i = i + 1; temp = temp.getSpatialNavigationContainer();} return list.map(a=>a.outerHTML);} container_list();", { useContentScriptContext: true }, (result) => {
        if (result === undefined) {
            document.getElementById("container_list").innerText = "undefined";
        } else {
            let i;
            let temp;
            const parentDiv = document.getElementById("containerlist1");
            while (parentDiv.firstChild) {
                parentDiv.removeChild(parentDiv.firstChild);
            }

            for (i = 0; i < result.length; i++) {
                const tempId = `container_list${i + 1}`;
                const newDiv = document.createElement("div");
                newDiv.setAttribute("id", tempId);
                temp = `[${i + 1}] ${result[i].replace(/(\r\n\t|\n|\r\t)/gm, "")}`;
                const newContent = document.createTextNode(temp);
                newDiv.appendChild(newContent);
                const currentDiv = document.getElementById("container_list");
                parentDiv.insertBefore(newDiv, currentDiv);
            }
        }
    });
});

/**
 * Text element mouseover event listener
 */
document.body.addEventListener("mouseover", (event) => {
    const id = event.srcElement.id;
    if (id) {
        if (direction.includes(id)) mouseOver(id);
        else if (id.includes("search_")) mouseOver(id);
        else if (id.includes("visible_list")) {
            document.getElementById(id).style.color = "#d62d20";
            var index = parseInt(id.substr(13)) - 1;
            chrome.tabs.executeScript({
                code: "var tmp = (document.activeElement.focusableAreas({\"mode\": \"visible\"})[".concat(index, "]); if (tmp) {tmp.style.backgroundColor = \"#FCADAB\"; tmp.style.outline = \"thick #FFC0CB\";}")
            });
        } else if (id.includes("all_list")) {
            document.getElementById(id).style.color = "#d62d20";
            var index = parseInt(id.substr(9)) - 1;
            chrome.tabs.executeScript({
                code: "var tmp = (document.activeElement.focusableAreas({\"mode\": \"all\"})[".concat(index, "]); if (tmp) {tmp.style.backgroundColor = \"#FCADAB\"; tmp.style.outline = \"thick #FFC0CB\";}")
            });
        } else if (id.includes("candidates_up")) {
            document.getElementById(id).style.color = "#d62d20";
            var index = parseInt(id.substr(13)) - 1;
            chrome.tabs.executeScript({
                code: `var temp = __spatialNavigation__.findCandidates(document.activeElement,"up"); if (temp){if (temp[${index}]){temp[${index}].style.backgroundColor = "#FCADAB"; temp[${index}].style.outline = "thick #FFC0CB"}}`
            });
        } else if (id.includes("candidates_down")) {
            document.getElementById(id).style.color = "#d62d20";
            var index = parseInt(id.substr(15)) - 1;
            chrome.tabs.executeScript({
                code: `var temp = __spatialNavigation__.findCandidates(document.activeElement,"down"); if (temp){if (temp[${index}]){temp[${index}].style.backgroundColor = "#FCADAB"; temp[${index}].style.outline = "thick #FFC0CB"}}`
            });
        } else if (id.includes("candidates_left")) {
            document.getElementById(id).style.color = "#d62d20";
            var index = parseInt(id.substr(15)) - 1;
            chrome.tabs.executeScript({
                code: `var temp = __spatialNavigation__.findCandidates(document.activeElement,"left"); if (temp){if (temp[${index}]){temp[${index}].style.backgroundColor = "#FCADAB"; temp[${index}].style.outline = "thick #FFC0CB"}}`
            });
        } else if (id.includes("candidates_right")) {
            document.getElementById(id).style.color = "#d62d20";
            var index = parseInt(id.substr(16)) - 1;
            chrome.tabs.executeScript({
                code: `var temp = __spatialNavigation__.findCandidates(document.activeElement,"right"); if (temp){if (temp[${index}]){temp[${index}].style.backgroundColor = "#FCADAB"; temp[${index}].style.outline = "thick #FFC0CB"}}`
            });
        } else if (id.includes("container_list")) {
            document.getElementById(id).style.color = "#d62d20";
            var index = parseInt(id.substr(14)) - 1;
            chrome.tabs.executeScript({
                code: `var temp = document.activeElement.getSpatialNavigationContainer(); for(var i = 0; i < ${index}; i++) { temp = temp.getSpatialNavigationContainer();} temp.style.backgroundColor = "#FCADAB"; temp.style.outline = "thick #FFC0CB";`
            });
        }
    }
});

/**
 * Text element mouseout event listener
 */
document.body.addEventListener("mouseout", (event) => {
    const id = event.srcElement.id;
    if (id) {
        if (direction.includes(id)) mouseOut(id);
        else if (id.includes("search_")) mouseOut(id);
        else if (id.includes("visible_list")) {
            document.getElementById(id).style.color = "rgb(61, 60, 60)";
            var index = parseInt(id.substr(13)) - 1;
            chrome.tabs.executeScript({
                code: "var tmp = (document.activeElement.focusableAreas({\"mode\": \"visible\"})[".concat(index, "]); if (tmp) {tmp.style.backgroundColor = \"transparent\"; tmp.style.outline = \"transparent\";}")
            });
        } else if (id.includes("all_list")) {
            document.getElementById(id).style.color = "rgb(61, 60, 60)";
            var index = parseInt(id.substr(9)) - 1;
            chrome.tabs.executeScript({
                code: "var tmp = (document.activeElement.focusableAreas({\"mode\": \"all\"})[".concat(index, "]); if (tmp) {tmp.style.backgroundColor = \"transparent\"; tmp.style.outline = \"transparent\";}")
            });
        } else if (id.includes("candidates_up")) {
            document.getElementById(id).style.color = "rgb(61, 60, 60)";
            var index = parseInt(id.substr(13) - 1);
            chrome.tabs.executeScript({
                code: `var temp = __spatialNavigation__.findCandidates(document.activeElement,"up"); if (temp){if (temp[${index}]){temp[${index}].style.backgroundColor = "transparent"; temp[${index}].style.outline = "transparent"}}`
            });
        } else if (id.includes("candidates_down")) {
            document.getElementById(id).style.color = "rgb(61, 60, 60)";
            var index = parseInt(id.substr(15)) - 1;
            chrome.tabs.executeScript({
                code: `var temp = __spatialNavigation__.findCandidates(document.activeElement,"down"); if (temp){if (temp[${index}]){temp[${index}].style.backgroundColor = "transparent"; temp[${index}].style.outline = "transparent"}}`
            });
        } else if (id.includes("candidates_left")) {
            document.getElementById(id).style.color = "rgb(61, 60, 60)";
            var index = parseInt(id.substr(15)) - 1;
            chrome.tabs.executeScript({
                code: `var temp = __spatialNavigation__.findCandidates(document.activeElement,"left"); if (temp){if (temp[${index}]){temp[${index}].style.backgroundColor = "transparent"; temp[${index}].style.outline = "transparent"}}`
            });
        } else if (id.includes("candidates_right")) {
            document.getElementById(id).style.color = "rgb(61, 60, 60)";
            var index = parseInt(id.substr(16)) - 1;
            chrome.tabs.executeScript({
                code: `var temp = __spatialNavigation__.findCandidates(document.activeElement,"right"); if (temp){if (temp[${index}]){temp[${index}].style.backgroundColor = "transparent"; temp[${index}].style.outline = "transparent"}}`
            });
        } else if (id.includes("container_list")) {
            document.getElementById(id).style.color = "rgb(61, 60, 60)";
            var index = parseInt(id.substr(14)) - 1;
            chrome.tabs.executeScript({
                code: `var temp = document.activeElement.getSpatialNavigationContainer(); for(var i = 0; i < ${index}; i++) { temp = temp.getSpatialNavigationContainer();} temp.style.backgroundColor = "transparent"; temp.style.outline = "transparent";`
            });
        }
    }
});


/**
 * Mouseover / out event of next element text
 * @param {string} way coloring direction
 */
function mouseOut(way) {
    if ((document.getElementById(way).innerText == "undefined") || (document.getElementById(way) == null)) return;

    document.getElementById(way).style.color = "rgb(61, 60, 60)";

    if (document.getElementById(way).getAttribute("cmd") == "next") {
        chrome.tabs.executeScript({
            code: "var tmp = window.__spatialNavigation__.findNextTarget(document.activeElement, \"".concat(way, "\"); if (tmp) {tmp.style.backgroundColor = \"transparent\"; tmp.style.outline = \"transparent\";}")
        });
    } else if (document.getElementById(way).getAttribute("cmd") == "spatnav_search") {
        const realWay = way.substr(7);
        chrome.tabs.executeScript({
            code: "var tmp = document.activeElement.spatialNavigationSearch(\"".concat(realWay, "\"); if (tmp) {tmp.style.backgroundColor = \"transparent\"; tmp.style.outline = \"transparent\";}")
        });
    }
}

function mouseOver(way) {
    if (document.getElementById(way).innerText == "undefined") return;

    document.getElementById(way).style.color = "#d62d20";

    if (document.getElementById(way).getAttribute("cmd") == "next") {
        chrome.tabs.executeScript({
            code: "var tmp = window.__spatialNavigation__.findNextTarget(document.activeElement, \"".concat(way, "\"); if (tmp) {tmp.style.backgroundColor = \"#FCADAB\"; tmp.style.outline = \"thick #FFC0CB\";}")
        });
    } else if (document.getElementById(way).getAttribute("cmd") == "spatnav_search") {
        const realWay = way.substr(7);
        chrome.tabs.executeScript({
            code: "var tmp = document.activeElement.spatialNavigationSearch(\"".concat(realWay, "\"); if (tmp) {tmp.style.backgroundColor = \"#FCADAB\"; tmp.style.outline = \"thick #FFC0CB\";}")
        });
    }
}
