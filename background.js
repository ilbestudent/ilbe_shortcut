var time = -1;
var count = 0;
var not = 1;
var not2 = 1;

function MinuteToString(minute) {
  var hour = Math.floor(minute / 60);
  var minute = minute - (hour * 60);
  var timestring = "";

  if (minute != 0) {
    if (hour != 0) {
      timestring = hour + "시간 ";
    }
    timestring += minute + "분";
  } else {
    timestring = hour + "시간";
  }
  return timestring;
}

function refreshUsage() {
  chrome.tabs.query({ 'url': 'http://www.ilbe.com/*' }, function (tabs) {
    if (tabs.length > 0) {
      if (time < 0) {
        time = +new Date();
      } else if (JSON.parse(localStorage["enabled_not"]) && (+new Date() - time) > not * localStorage["not_freq"] * 60000) {
        webkitNotifications.createNotification('icon-48.png', '알림', localStorage["not_msg"].replace('[시간]', MinuteToString(not * localStorage["not_freq"]))).show();
        not++;
      }
      if (JSON.parse(localStorage["enabled_not2"]) && count >= not2 * localStorage["not2_freq"]) {
        webkitNotifications.createNotification('icon-48.png', '알림', localStorage["not2_msg"].replace('[횟수]', not2 * localStorage["not2_freq"])).show();
        not2++;
      }
    } else {
      if (time > 0) {
        localStorage["time"] = +new Date() - time + parseInt(localStorage["time"]);
        localStorage["count"] = count + parseInt(localStorage["count"]);
      }
      time = -1;
      count = 0;
      not = 1;
      not2 = 1;
    }
  });
};

function onTabUpdated(tabId, changeInfo, tab) {
  if (tab.url.indexOf('ilbe.com') > -1) {
    chrome.pageAction.show(tabId);
    if (changeInfo.status == 'complete') {
      count++;
    }
  }
  refreshUsage();
};

function onTabRemoved(tabId, removeInfo) {
  refreshUsage();
};

chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
  if (request.method == "getLocalStorage") {
    if (localStorage["enabled_yn"] === undefined) localStorage["enabled_yn"] = true;
    if (localStorage["enabled_scrap"] === undefined) localStorage["enabled_scrap"] = true;
    if (localStorage["enabled_page"] === undefined) localStorage["enabled_page"] = true;
    if (localStorage["enabled_reply"] === undefined) localStorage["enabled_reply"] = true;
    if (localStorage["enabled_newest"] === undefined) localStorage["enabled_newest"] = true;
    if (localStorage["enabled_noala"] === undefined) localStorage["enabled_noala"] = true;
    if (localStorage["enabled_not"] === undefined) localStorage["enabled_not"] = false;
    if (localStorage["enabled_not2"] === undefined) localStorage["enabled_not2"] = false;

    if (localStorage["enabled_zero"] === undefined) localStorage["enabled_zero"] = true;
    if (localStorage["bgcolor_zerolevel"] === undefined) localStorage["bgcolor_zerolevel"] = "FFEEEE";
    if (localStorage["watchlist"] === undefined) localStorage["watchlist"] = '';

    if (localStorage["bgcolor_favorite"] === undefined) localStorage["bgcolor_favorite"] = "CCFFCC";
    if (localStorage["favoritelist"] === undefined) localStorage["favoritelist"] = '';

    if (localStorage["not_freq"] === undefined) localStorage["not_freq"] = '60';
    if (localStorage["not2_freq"] === undefined) localStorage["not2_freq"] = '100';
    if (localStorage["not_msg"] === undefined) localStorage["not_msg"] = '일베 이용 시간이 [시간]을 경과했습니다. 과도한 일베 이용은 건강에 해로울 수 있습니다.';
    if (localStorage["not2_msg"] === undefined) localStorage["not2_msg"] = '일베 탐색 횟수가 [횟수]번을 초과하였습니다. 과도한 일베 이용은 건강에 해로울 수 있습니다.';
    if (localStorage["noala_count"] === undefined) localStorage["noala_count"] = '200';
    if (localStorage["noala_maxcount"] === undefined) localStorage["noala_maxcount"] = '10';
    if (localStorage["keybinding_yes"] === undefined) localStorage["keybinding_yes"] = 'y';
    if (localStorage["keybinding_no"] === undefined) localStorage["keybinding_no"] = 'n';
    if (localStorage["keybinding_scrap"] === undefined) localStorage["keybinding_scrap"] = 's';
    if (localStorage["keybinding_reply"] === undefined) localStorage["keybinding_reply"] = 'r';
    if (localStorage["keybinding_prevpage"] === undefined) localStorage["keybinding_prevpage"] = '[';
    if (localStorage["keybinding_nextpage"] === undefined) localStorage["keybinding_nextpage"] = ']';
    if (localStorage["keybinding_prevarticle"] === undefined) localStorage["keybinding_prevarticle"] = ',';
    if (localStorage["keybinding_nextarticle"] === undefined) localStorage["keybinding_nextarticle"] = '.';
    if (localStorage["keybinding_newest"] === undefined) localStorage["keybinding_newest"] = 'z';
    if (localStorage["time"] === undefined) localStorage["time"] = '0';
    if (localStorage["count"] === undefined) localStorage["count"] = '0';

    // localStorage["update_notified"] = undefined;
    
    sendResponse(localStorage);
  }
  else {
    sendResponse({});
  }
});

chrome.tabs.onUpdated.addListener(onTabUpdated);
chrome.tabs.onRemoved.addListener(onTabRemoved);

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
      if (request.action == "openLink") {
        chrome.tabs.create({ url: request.link });
      }
      else if (request.action == "addWatchlist") {
        if (localStorage["watchlist"] != "") {
          localStorage["watchlist"] += ',';
        }
        localStorage["watchlist"] += request.link;
      }
      else if (request.action == "removeWatchlist") {
        localStorage["watchlist"] = localStorage["watchlist"].replace(',' + request.link, '').replace(request.link, '');
      }
      else if (request.action == "addFavoritelist") {
        if (localStorage["favoritelist"] != "") {
          localStorage["favoritelist"] += ',';
        }
        localStorage["favoritelist"] += request.link;
      }
      else if (request.action == "removeFavoritelist") {
        localStorage["favoritelist"] = localStorage["favoritelist"].replace(',' + request.link, '').replace(request.link, '');
      }
      else if (request.action == "update_notified") {
        // 해당 버전에 대해서 업데이트가 한 번 뜨면 다시 뜨지 않도록 하기 위해
        var manifest = chrome.runtime.getManifest();
        localStorage["update_notified"] = manifest.version;
      }
    }
);
