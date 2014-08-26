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

// 이런식의 function은 불가능
function CheckIlbeIsActive() {
  // A chrome window should be focused and a tab should be activated.
  chrome.windows.getAll({ populate: true }, function (windowInfos) {
    for (var windowInfo in windowInfos) {
      if (windowInfo.focused == true) {
        for (var tabInfo in windowInfo.tabs) {
          if (tabInfo.url.indexOf('http://www.ilbe.com') > -1) {
            if (tabInfo.active == true) {
              return true;
            }
          }
        }
      }
    }
  });
  return false;
}

function CheckWhetherIlbeIsActivated(windowInfos) {
  for (var i = 0; i < windowInfos.length; i++) {
    var windowInfo = windowInfos[i];
    console.log('==windowinfo==');
    console.log(windowInfo);
    if (windowInfo.focused == true) {
      for (var j = 0; j < windowInfo.tabs.length; j++) {
        var tabInfo = windowInfo.tabs[j];
        console.log('==tabinfo==');
        console.log(tabInfo);
        if (tabInfo.url.indexOf('http://www.ilbe.com') > -1) {
          if (tabInfo.active == true) {
            return true;
          }
        }
      }
    }
  }
  return false;
}

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

      var is_notify_ilbe = (request.action == "notify_ilbe");
      var is_notify_reply = (request.action == "notify_reply");

      if (is_notify_ilbe || is_notify_reply) {
        chrome.windows.getAll({ populate: true }, function (windowInfos) {
          var toShowNotify = true;
          if (JSON.parse(localStorage["enabled_realtime_notify_when_deactive"])) {
            if (CheckWhetherIlbeIsActivated(windowInfos)) { // 활성화되어 있을 땐 띄우지 않는다.
              toShowNotify = false;
            }
          }
          if (toShowNotify) {
            if (is_notify_ilbe) {
              if (JSON.parse(localStorage["enabled_realtime_notify"]) && JSON.parse(localStorage["enabled_realtime_notify_ilbe"])) {
                ShowChromeNotificationWithLink("일베", request.document_title, "http://www.ilbe.com/" + request.document_srl, "icon-128.png");
              }
            }
            else if (is_notify_reply) {
              if (JSON.parse(localStorage["enabled_realtime_notify"]) && JSON.parse(localStorage["enabled_realtime_notify_reply"])) {
                ShowChromeNotificationWithLink("댓글", request.comment_content, request.comment_link, "icon-128-yellow.png");
              }
            }
          }
        });
      }
    }
    );
