var time = -1;
var count = 0;
var not = 1;
var not2 = 1;

var notificationLinkInfo = new Object();

chrome.notifications.onClicked.addListener(function (id) {
  if (id.indexOf("link_") == 0) {
    chrome.tabs.create({ url: id.substring(5) });
  }
});

function ShowChromeNotification(title, message) {
  chrome.notifications.create('', {
    type: "basic",
    title: title,
    message: message,
    iconUrl: "icon-128.png"
  }, function (id) { });
}

function ShowChromeNotificationWithLink(title, message, buttonLink, iconUrl) {
  // Set the ID by using a buttonLink to prevent duplicated notifications
  chrome.notifications.create('link_' + buttonLink, {
    type: "basic",
    title: title,
    message: message,
    iconUrl: iconUrl,
  }, function (id) { });
};

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
  chrome.tabs.query({ url: "http://www.ilbe.com/*" }, function (tabs) {
    if (tabs.length > 0) {
      if (time < 0) {
        time = +new Date();
      }
      else if (JSON.parse(localStorage["enabled_not"]) && (+new Date() - time) > not * localStorage["not_freq"] * 60000) {
        ShowChromeNotification("알림", localStorage["not_msg"].replace('[시간]', MinuteToString(not * localStorage["not_freq"])));
        not++;
      }
      if (JSON.parse(localStorage["enabled_not2"]) && count >= not2 * localStorage["not2_freq"]) {
        ShowChromeNotification("알림", localStorage["not2_msg"].replace('[횟수]', not2 * localStorage["not2_freq"]));
        not2++;
      }
    }
    else {
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
    chrome.pageAction.show(tabId); // To put icons inside the address bar
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
    FixUndefinedSetting();

    // 통계 데이터는 별도로 보관하는 것이 좋을 것 같다.
    if (localStorage["time"] === undefined) localStorage["time"] = '0';
    if (localStorage["count"] === undefined) localStorage["count"] = '0';

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
      else if (request.action == "update_notified") {
        // 해당 버전에 대해서 업데이트가 한 번 뜨면 다시 뜨지 않도록 하기 위해
        var manifest = chrome.runtime.getManifest();
        localStorage["update_notified"] = manifest.version;
      }
      else if (request.action == "notify_reply") {
        if (JSON.parse(localStorage["enabled_realtime_notify"]) && JSON.parse(localStorage["enabled_realtime_notify_reply"])) {
          ShowChromeNotificationWithLink("댓글", request.comment_content, request.comment_link, "icon-128-yellow.png");
        }
      }
      else if (request.action == "notify_ilbe") {
        if (JSON.parse(localStorage["enabled_realtime_notify"]) && JSON.parse(localStorage["enabled_realtime_notify_ilbe"])) {
          ShowChromeNotificationWithLink("일베", request.document_title, "http://www.ilbe.com/" + request.document_srl, "icon-128.png");
        }
      }
    }
    );
