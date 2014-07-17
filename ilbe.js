// obfuscated script (2014-07-17)
var table = [
    ['06', '20', 'bb', '5b', '49', '29', '82', 'd8', '0b', '32'],
  ['07', '21', 'ba', '5a', '48', '28', '83', 'd9', '0a', '33'],
  ['04', '22', 'b9', '59', '4b', '2b', '80', 'da', '09', '30'],
  ['05', '23', 'b8', '58', '4a', '2a', '81', 'db', '08', '31'],
  ['02', '24', 'bf', '5f', '4d', '2d', '86', 'dc', '0f', '36'],
  ['03', '25', 'be', '5e', '4c', '2c', '87', 'dd', '0e', '37'],
  ['00', '26', 'bd', '5d', '4f', '2f', '84', 'de', '0d', '34'],
  ['01', '27', 'bc', '5c', '4e', '2e', '85', 'df', '0c', '35'],
  ['0e', '28', 'b3', '53', '41', '21', '8a', 'd0', '03', '3a'],
  ['0f', '29', 'b2', '52', '40', '20', '8b', 'd1', '02', '3b']
];

function is_old_member_srl(member_srl) {
  return (member_srl[0] != '0');
}

function to_new_member_srl(old_member_srl) {
  var g = "";
  for (var i = 0; i < old_member_srl.length; i++) {
    var n = old_member_srl.charCodeAt(i) - '0'.charCodeAt(0);
    g = g + table[n][i];
  }
  return g;
}

function extract_real_new_member_srl(new_member_srl) {
  var extracted = "";
  for (var i = 0; i < 10; i++) {
    var c = new_member_srl.substring(i * 2, i * 2 + 2);
    var found = false;
    for (var j = 0; j < 10; j++) {
      if (table[j][i] == c) {
        found = true;
        break;
      }
    }
    if (found == false) {
      break;
    }
    else {
      extracted = extracted + c;
    }
  }

  return extracted;
}

function movePage(relPos) {
  var pageNavigation = document.getElementsByClassName("pagination a1");
  pageNavigation = pageNavigation[pageNavigation.length - 1]; // select the last one
  var currentPage = parseInt(pageNavigation.getElementsByTagName("strong")[0].innerText);
  var pageLinks = pageNavigation.getElementsByTagName("a");
  var newPage = currentPage + relPos;
  for (var i = 0; i < pageLinks.length; ++i) {
    if (pageLinks[i].innerText === '이전') { // 첫 페이지 링크 따라가지 않도록 함
      break;
    }
  }
  if (newPage < 1) {
    alert("가장 최신 글입니다!");
  } else {
    if (relPos != 0) {
      location.href = pageLinks[i].href.replace(/page=\d+/, "page=" + newPage);
    } else {
      location.href = pageLinks[i].href.replace(/page=\d+/, "page=" + 1) + "&pluginAction=3";
    }
  }
}

function moveArticle(relPos, refresh) {
  var boardList = document.getElementsByClassName("boardList")[0];
  var articles = boardList.getElementsByTagName("tr");
  var currentArticle = document.evaluate(".//img[@src='/modules/board/skins/xe_board_hancoma_title/images/common/iconArrowD8.gif']", boardList, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0);
  if (currentArticle !== null) {
    for (var i = 1; i < articles.length; i++) {
      if (articles[i] === currentArticle.parentNode.parentNode) {
        break;
      }
    }
    if ((i == 1 && relPos == -1) || (i == articles.length - 1 && relPos == 1)) {
      if (refresh) {
        location.href = location.href + '?pluginAction=' + (relPos + 2);
      } else {
        movePage(relPos);
      }
    } else {
      location.href = articles[i + relPos].getElementsByTagName("a")[0].href;
    }
  } else if (!refresh) {
    if (relPos == 1) {
      for (var i = 1; i < articles.length; i++) {
        if (articles[i].className !== "notice") {
          break;
        }
      }
    } else if (relPos == -1) {
      var i = articles.length - 1;
    }
    location.href = articles[i].getElementsByTagName("a")[0].href;
  }
}

var pluginAction = location.href.match(/pluginAction\=(\d+)/);
if (pluginAction !== null) {
  moveArticle(parseInt(pluginAction[1]) - 2, false);
}

// 설정 데이터 가져오기
chrome.extension.sendRequest({ method: "getLocalStorage" }, function (myLocalStorage_) {
  myLocalStorage = myLocalStorage_;

  // 업데이트 알림 띄우기
  var manifest = chrome.runtime.getManifest();
  if (manifest.version !== myLocalStorage["update_notified"]) {
    var n = noty({
      layout: 'topLeft', type: 'success', text: 'ILBE 휠체어가 설치되었습니다. (v' + manifest.version + ')',
      buttons: [
        {
          text: '뭐가 바뀌었는지 보기',
          onClick: function ($noty) {
            chrome.runtime.sendMessage({ action: "openLink", link: "https://sites.google.com/site/ilbeshortcut/" });
            chrome.runtime.sendMessage({ action: "update_notified" });
            $noty.close();
          }
        },
        {
          text: '그냥 일베하기',
          onClick: function ($noty) {
            chrome.runtime.sendMessage({ action: "update_notified" });
            $noty.close();
          }
        }
      ]
    });
  }

  var content = document.getElementById("content");

  var link = document.evaluate(".//a[contains(@href, 'todayhumor.co.kr')]", content, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
  for (var i = 0; i < link.snapshotLength; i++) {
    var thisLink = link.snapshotItem(i);
    thisLink.setAttribute("class", thisLink.href);
    thisLink.addEventListener('click', function () {
      chrome.runtime.sendMessage({ action: "openLink", link: thisLink.className });
    });
    thisLink.href = "javascript:void(0)";
  }

  // 0렙 강조
  if (JSON.parse(myLocalStorage["enabled_zero"])) {
    var zero = document.evaluate(".//img[@src='http://www.ilbe.com/modules/point/icons/default_ilbe/0.gif']", content, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    for (var i = 0; i < zero.snapshotLength; i++) {
      var zerorow = zero.snapshotItem(i).parentNode.parentNode.parentNode;
      if (zerorow.className === "replyIndent" || zerorow.className === "userInfo") {
        zerorow = zerorow.parentNode;
      }
      zerorow.setAttribute("style", "background:#" + myLocalStorage["bgcolor_zerolevel"]);
    }
  }

  var converted_count_watchlist = 0;
  var converted_count_favorites = 0;

  var arrayUnique = function (a) {
    return a.reduce(function (p, c) {
      if (p.indexOf(c) < 0) p.push(c);
      return p;
    }, []);
  };

  // WatchList 및 즐겨찾기 리스트 형식 업데이트
  var watchlist = myLocalStorage["watchlist"].split(',');
  var favoritelist = myLocalStorage["favoritelist"].split(',');
  watchlist = watchlist.filter(function (v) { return v !== '' });
  favoritelist = favoritelist.filter(function (v) { return v !== '' });

  for (var i = 0; i < watchlist.length; ++i) {
    if (is_old_member_srl(watchlist[i])) {
      watchlist[i] = to_new_member_srl(watchlist[i]);
      converted_count_watchlist++;
    }
    else {
      var converted = extract_real_new_member_srl(watchlist[i]);
      if (converted != watchlist[i]) {
        watchlist[i] = converted;
      }
    }
  }
  for (var i = 0; i < favoritelist.length; ++i) {
    if (is_old_member_srl(favoritelist[i])) {
      favoritelist[i] = to_new_member_srl(favoritelist[i]);
      converted_count_favorites++;
    }
    else {
      var converted = extract_real_new_member_srl(favoritelist[i]);
      if (converted != favoritelist[i]) {
        favoritelist[i] = converted;
      }
    }
  }

  var needToBeSynced_watchlist = false;
  var needToBeSynced_favoritelist = false;

  var count_watchlist = watchlist.length;
  watchlist = arrayUnique(watchlist);
  if (count_watchlist != watchlist.length) {
    needToBeSynced_watchlist = true;
  }

  var count_favoritelist = favoritelist.length;
  favoritelist = arrayUnique(favoritelist);
  if (count_favoritelist != favoritelist.length) {
    needToBeSynced_favoritelist = true;
  }

  if (converted_count_watchlist > 0) {
    needToBeSynced_watchlist = true;
  }

  if (converted_count_favorites > 0) {
    needToBeSynced_favoritelist = true;
  }
  
  if (needToBeSynced_watchlist) {
    chrome.runtime.sendMessage({ action: "updateWatchlist", link: watchlist.join(',') });
  }

  if (needToBeSynced_favoritelist) {
    chrome.runtime.sendMessage({ action: "updateFavoritelist", link: favoritelist.join(',') });
  }

  // 한 개 이상 업데이트가 일어났다면 메시지를 출력한다.
  if (needToBeSynced_watchlist || needToBeSynced_favoritelist) {
    var displayText = '죄수번호 형식 변환이 완료되었습니다. ' + '<br/><br/>' +
      (needToBeSynced_watchlist ? '와치 리스트:' + converted_count_watchlist + "개<br/>" : '') +
      (needToBeSynced_favoritelist ? '즐겨찾기:' + converted_count_favorites + '개' : '');
    var n = noty({
      layout: 'topLeft', type: 'information', text: displayText,
    });
  }
    
  if (watchlist.length > 0 || favoritelist.length > 0) {
    var member = document.evaluate(".//div[starts-with(@class, 'member_')]", content, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    var real_member_srl = "<undefined>";
    for (var i = 0; i < member.snapshotLength; i++) {
      var thisMember = member.snapshotItem(i);
      if (thisMember.className.indexOf("member_") == 0) {
        var new_member_srl = thisMember.className.replace('member_', '');
        real_member_srl = extract_real_new_member_srl(new_member_srl);
      }

      var founded = false;
      var bgcolor = null;
      if (watchlist.indexOf(real_member_srl) > -1) {
        founded = true;
        bgcolor = myLocalStorage["bgcolor_zerolevel"];
      }
      else if (favoritelist.indexOf(real_member_srl) > -1) {
        founded = true;
        bgcolor = myLocalStorage["bgcolor_favorite"];
      }

      if (founded && bgcolor !== null) {
        thisMember = thisMember.parentNode.parentNode;
        if (thisMember.className === "replyIndent" || thisMember.className === "userInfo") {
          thisMember = thisMember.parentNode;
        }
        thisMember.setAttribute("style", "background:#" + bgcolor);
      }
    }
  }

  // 저격 기능 추가
  var popupMenu = document.getElementById("popup_menu_area");
  popupMenu.addEventListener('DOMSubtreeModified', function () {
    var items = popupMenu.getElementsByTagName("li");
    var memberInfoPos = -1;
    var sniperPos = -1;
    for (var i = 0; i < items.length; ++i) {
      if (items[i].innerText === "회원 정보 보기") {
        memberInfoPos = i;
      }
      else if (items[i].innerText === "조준하기(구글)") {
        sniperPos = i;
      }
    }
    if (sniperPos == -1) {
      var image = chrome.extension.getURL("snipe.gif")
      var image2 = chrome.extension.getURL("add.gif")
      //var sniperNode = document.createElement("li");
      //sniperNode.setAttribute("style", "background-image:url('" + image + "')");
      //var sniperLink = document.createElement("a");
      //sniperLink.innerText = "조준하기(일베레이더)";
      var googlesniperNode = document.createElement("li");
      googlesniperNode.setAttribute("style", "background-image:url('" + image + "')");
      var googlesniperLink = document.createElement("a");
      googlesniperLink.innerText = "조준하기(구글)";

      // 즐겨찾는 일게이
      var addfavoritelistNode = document.createElement("li");
      addfavoritelistNode.setAttribute("style", "background-image:url('" + image2 + "')");
      var addfavoritelistLink = document.createElement("a");
      addfavoritelistLink.innerText = "즐겨찾는 일게이 추가";

      // 워치 리스트
      var addwatchlistNode = document.createElement("li");
      addwatchlistNode.setAttribute("style", "background-image:url('" + image2 + "')");
      var addwatchlistLink = document.createElement("a");
      addwatchlistLink.innerText = "와치리스트에 추가하기";

      // http://www.ilbe.com/index.php?mid=ilbe&act=dispMemberInfo&member_srl=$$$ 
      var memberInfoHref = items[memberInfoPos].getElementsByTagName("a")[0].href; // 멤버 정보 보는 주소
      var memberSrl = memberInfoHref.match(/member_srl\=([a-zA-Z\d]+)/)[1];
      memberSrl = extract_real_new_member_srl(memberSrl);
      if (memberSrl !== undefined) {
        //sniperLink.href = "http://ilberadar.com/search.php?mid=" + memberSrl;
        //sniperLink.target = "_blank";
        googlesniperLink.href = "http://www.google.co.kr/search?q=site%3Ailbe.com+" + memberSrl;
        googlesniperLink.target = "_blank";

        // 즐겨찾기 리스트 등록된 경우 
        addfavoritelistLink.href = "javascript:void(0)";
        addfavoritelistLink.setAttribute("class", memberSrl);
        if (favoritelist.indexOf(memberSrl) > -1) {
          addfavoritelistLink.addEventListener('click', function () {
            noty({
              layout: 'topLeft', type: 'information', text: '즐겨찾기에서 제거되었습니다.',
            });
            chrome.runtime.sendMessage({ action: "removeFavoritelist", link: addfavoritelistLink.className });
          });
          addfavoritelistLink.innerText = "즐겨찾기에서 제거하기";
        } else {
          addfavoritelistLink.addEventListener('click', function () {
            noty({
              layout: 'topLeft', type: 'information', text: '즐겨찾기에 추가되었습니다.',
            });
            chrome.runtime.sendMessage({ action: "addFavoritelist", link: addfavoritelistLink.className });
          });
        }

        // 와치 리스트 등록된 경우 
        addwatchlistLink.href = "javascript:void(0)";
        addwatchlistLink.setAttribute("class", memberSrl);
        if (watchlist.indexOf(memberSrl) > -1) {
          addwatchlistLink.addEventListener('click', function () {
            noty({
              layout: 'topLeft', type: 'information', text: '와치리스트에서 제거되었습니다.',
            });
            chrome.runtime.sendMessage({ action: "removeWatchlist", link: addwatchlistLink.className });
          });
          addwatchlistLink.innerText = "와치리스트에서 제거하기";
        } else {
          addwatchlistLink.addEventListener('click', function () {
            noty({
              layout: 'topLeft', type: 'information', text: '와치리스트에 추가되었습니다.',
            });
            chrome.runtime.sendMessage({ action: "addWatchlist", link: addwatchlistLink.className });
          });
        }
      }
      //sniperNode.appendChild(sniperLink);
      googlesniperNode.appendChild(googlesniperLink);
      addfavoritelistNode.appendChild(addfavoritelistLink);
      addwatchlistNode.appendChild(addwatchlistLink);
      //popupMenu.getElementsByTagName("ul")[0].appendChild(sniperNode);
      popupMenu.getElementsByTagName("ul")[0].appendChild(googlesniperNode);
      popupMenu.getElementsByTagName("ul")[0].appendChild(addfavoritelistNode);
      popupMenu.getElementsByTagName("ul")[0].appendChild(addwatchlistNode);
    }
  });

  if (JSON.parse(myLocalStorage["enabled_noala"])) {
    // 노알라 기능
    table_nodes = document.getElementsByTagName("table");
    for (var i = 0; i < table_nodes.length; ++i) {
      tr_node = table_nodes[i].getElementsByTagName("tr");
      for (var j = 0; j < tr_node.length; ++j) {
        td_node = tr_node[j].getElementsByTagName("td");
        var titleNode = null;
        for (var k = 0; k < td_node.length; ++k) {
          var classValue = td_node[k].getAttribute("class");
          if (classValue == "title") {
            titleNode = td_node[k];
          }
          else if (classValue == "recommend") {
            var count = Number(td_node[k].innerHTML);
            if (count != NaN) {
              var noalaCount = Math.floor(count / parseInt(myLocalStorage["noala_count"]));
              if (noalaCount > parseInt(myLocalStorage["noala_maxcount"]))
                noalaCount = parseInt(myLocalStorage["noala_maxcount"]);
              iconURL = chrome.extension.getURL("noala.png");

              for (var kk = 0; kk < noalaCount; ++kk) {
                var meter = document.createElement('img');
                meter.src = iconURL;
                titleNode.appendChild(meter);
              }
            }
          }
        }
      }
    }
  }

  key(myLocalStorage["keybinding_yes"], function () {
    if (JSON.parse(myLocalStorage["enabled_yn"])) {
      //document.getElementsByTagName("button").item(0).click(); -- 이런 식으로 해선 안된다. 다른 button이 있을 수 있기 때문
      var btnVoted = document.getElementsByClassName("btn_voted");
      btnVoted.item(0).click();
    }
  });
  key(myLocalStorage["keybinding_no"], function () {
    if (JSON.parse(myLocalStorage["enabled_yn"])) {
      //document.getElementsByTagName("button").item(1).click();
      var btnBlamed = document.getElementsByClassName("btn_blamed");
      btnBlamed.item(0).click();
    }
  });
  key(myLocalStorage["keybinding_scrap"], function () {
    if (JSON.parse(myLocalStorage["enabled_scrap"])) {
      document.getElementsByClassName("document_popup_menu").item(0).children.item(0).click();

      var scrap_link_elem = null;

      var repeat = 0;
      var checker_timer_id = setInterval(function () {
        repeat++;
        if (repeat > 10) {
          clearInterval(checker_timer_id);
        }
        else {
          if (scrap_link_elem == null) {
            scrap_link_elem = document.evaluate('//*[@id="popup_menu_area"]/ul/li[4]/a', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (scrap_link_elem != null) {
              if (scrap_link_elem.getAttribute('onclick').indexOf("procMemberScrapDocument") != -1) {
                scrap_link_elem.click();
              }
              else {
                scrap_link_elem = document.evaluate('//*[@id="popup_menu_area"]/ul/li[2]/a', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                if (scrap_link_elem.getAttribute('onclick').indexOf("procMemberScrapDocument") != -1) {
                  scrap_link_elem.click();
                }
              }
            }
          }
        }
      }, 250);
    }
  });
  key(myLocalStorage["keybinding_prevarticle"], function () {
    if (JSON.parse(myLocalStorage["enabled_page"])) {
      moveArticle(-1, true);
    }
  });
  key(myLocalStorage["keybinding_nextarticle"], function () {
    if (JSON.parse(myLocalStorage["enabled_page"])) {
      moveArticle(1, true);
    }
  });
  key(myLocalStorage["keybinding_prevpage"], function () {
    if (JSON.parse(myLocalStorage["enabled_page"])) {
      movePage(-1);
    }
  });
  key(myLocalStorage["keybinding_nextpage"], function () {
    if (JSON.parse(myLocalStorage["enabled_page"])) {
      movePage(1);
    }
  });
  key(myLocalStorage["keybinding_newest"], function () {
    if (JSON.parse(myLocalStorage["enabled_newest"])) {
      movePage(0);
    }
  });
  key(myLocalStorage["keybinding_reply"], function () {
    if (JSON.parse(myLocalStorage["enabled_reply"])) {
      document.getElementById("editor_1").focus(function () {
        document.getElementById("editor_1").select();
      });
      return false;
    }
  });
});
