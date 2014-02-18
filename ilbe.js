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
      layout: 'topLeft', type: 'success', text: 'ILBE 휠체어가 업데이트되었습니다. (v' + manifest.version + ')',
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

  // 즐겨찾는 일게이 및
  // 지정 회원 경고 (watchlist)
  var watchlist = myLocalStorage["watchlist"].split(',');
  var favoritelist = myLocalStorage["favoritelist"].split(',');
  if (watchlist.length > 0 || favoritelist.length > 0) {
    var member = document.evaluate(".//div[starts-with(@class, 'member_')]", content, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    for (var i = 0; i < member.snapshotLength; i++) {
      var thisMember = member.snapshotItem(i);
	  
	  var founded = false;
	  var bgcolor = null;
	  if (watchlist.indexOf(thisMember.className.split('_')[1]) > -1) {
        founded = true;
		bgcolor = myLocalStorage["bgcolor_zerolevel"];
      }
	  else if (favoritelist.indexOf(thisMember.className.split('_')[1]) > -1) {
        founded = true;
		bgcolor = myLocalStorage["bgcolor_favorite"];
      }
	  
	  if ( founded && bgcolor !== null ) {
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
      var memberSrl = memberInfoHref.match(/member_srl\=(\d+)/)[1];
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
            chrome.runtime.sendMessage({ action: "removeFavoritelist", link: addfavoritelistLink.className });
          });
          addfavoritelistLink.innerText = "즐겨찾기에서 제거하기";
        } else {
          addfavoritelistLink.addEventListener('click', function () {
            chrome.runtime.sendMessage({ action: "addFavoritelist", link: addfavoritelistLink.className });
          });
        }

		// 와치 리스트 등록된 경우 
        addwatchlistLink.href = "javascript:void(0)";
        addwatchlistLink.setAttribute("class", memberSrl);
        if (watchlist.indexOf(memberSrl) > -1) {
          addwatchlistLink.addEventListener('click', function () {
            chrome.runtime.sendMessage({ action: "removeWatchlist", link: addwatchlistLink.className });
          });
          addwatchlistLink.innerText = "와치리스트에서 제거하기";
        } else {
          addwatchlistLink.addEventListener('click', function () {
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
