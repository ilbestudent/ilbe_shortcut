chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
    if (request.method == "getLocalStorage") {
        if (localStorage["enabled_yn"] === undefined) localStorage["enabled_yn"] = 'true';
        if (localStorage["enabled_scrap"] === undefined) localStorage["enabled_scrap"] = 'true';
        if (localStorage["enabled_page"] === undefined) localStorage["enabled_page"] = 'true';
        if (localStorage["enabled_reply"] === undefined) localStorage["enabled_reply"] = 'true';
        if (localStorage["enabled_noala"] === undefined) localStorage["enabled_noala"] = 'true';
        if (localStorage["enabled_timer"] === undefined) localStorage["enabled_timer"] = 'false';
        if (localStorage["noala_count"] === undefined) localStorage["noala_count"] = '200';
        if (localStorage["noala_maxcount"] === undefined) localStorage["noala_maxcount"] = '10';
        if (localStorage["keybinding_yes"] === undefined) localStorage["keybinding_yes"] = 'y';
        if (localStorage["keybinding_no"] === undefined) localStorage["keybinding_no"] = 'n';
        if (localStorage["keybinding_scrap"] === undefined) localStorage["keybinding_scrap"] = 's';
        if (localStorage["keybinding_reply"] === undefined) localStorage["keybinding_reply"] = 'r';
        if (localStorage["keybinding_prevpage"] === undefined) localStorage["keybinding_prevpage"] = '[';
        if (localStorage["keybinding_nextpage"] === undefined) localStorage["keybinding_nextpage"] = ']';
        if (localStorage["ingyeo_time"] === undefined || localStorage["ingyeo_time"] === "NaN") localStorage["ingyeo_time"] = '0';
        sendResponse(localStorage);
    }
    else {
        sendResponse({});
    }
});

// 일베 잉여 사용시간 계산
setInterval(function () {
    chrome.tabs.getAllInWindow(null, function (tabs) {
        var isOpen = false;
        for (var i = 0; i < tabs.length; i++) {
            if (tabs[i].url.indexOf("ilbe.com") > -1) {
                isOpen = true;
                break;
            }
        }
        localStorage["is_ilbe_active"] = isOpen;
        if (isOpen) {
            localStorage["ingyeo_time"] = parseInt(localStorage["ingyeo_time"]) + 5;
        }
    });
}, 5000);