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
		noty( { layout: 'topLeft', type: 'information', text: '가장 최신 글입니다.', timeout:1000 } );
  } 
  else {
    if (relPos != 0) {
      location.href = pageLinks[i].href.replace(/page=\d+/, "page=" + newPage);
    } 
    else {
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
      } 
      else {
        movePage(relPos);
      }
    } 
    else {
      location.href = articles[i + relPos].getElementsByTagName("a")[0].href;
    }
  } 
  else if (!refresh) {
    if (relPos == 1) {
      for (var i = 1; i < articles.length; i++) {
        if (articles[i].className !== "notice") {
          break;
        }
      }
    } 
    else if (relPos == -1) {
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
  var updateNotifyType = 'information';
  var updateMessage = '업데이트 되었습니다.';
  if (myLocalStorage["update_notified"]===undefined){
    // Fresh installation
    updateNotifyType = 'success';
    updateMessage = '설치되었습니다.';
  }
  if (manifest.version !== myLocalStorage["update_notified"]) {
    var n = noty({
      layout: 'topLeft', type: updateNotifyType, text: 'ILBE 휠체어가 ' + updateMessage + ' (v' + manifest.version + ')',
      buttons: [
        {
          text: '플러그인 홈페이지',
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

  if (JSON.parse(myLocalStorage["enabled_ingyeo"])) {
    // 잉여력 표시 기능
    var ingyeoNodes = [];
    var ingyeoReg = new RegExp(/포인트: ([\d,]+) 잉여력 \((\d+)%\)/);
    var ingyeoLevelReg = new RegExp(/레\s+벨: (\d+)\/30/);
    var myInfo = document.evaluate(".//*[@id=\"header\"]/div[2]/div/span[1]/a", document.body, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0);
    if (ingyeoReg.test(myInfo.title)) {
      ingyeoNodes.push(myInfo);
    }
    var divNodes = document.getElementsByTagName("div");
    for (var i=0;i<divNodes.length;i++){
      var targetNode = divNodes[i];
      if (targetNode.className.indexOf("member_")==0){
        if (ingyeoReg.test(targetNode.title)){
          ingyeoNodes.push(targetNode);
        }
      }
    };
    var spanNodes = document.getElementsByTagName("span");
    for (var i=0;i<spanNodes.length;i++){
      var targetNode = spanNodes[i];
      if (targetNode.className.indexOf("member_")==0){
        if (ingyeoReg.test(targetNode.title)){
          ingyeoNodes.push(targetNode);
        }
      }
    };
    for(var i=0;i<ingyeoNodes.length;i++){
      $(ingyeoNodes[i]).hover(
          function(){
            var title = $(this).attr('title');
            $(this).data('tipText', title).removeAttr('title');
            var matchResult = title.match(ingyeoReg);
            var levelMatchResult = title.match(ingyeoLevelReg);
            var point = matchResult[1];
            var percent = matchResult[2];
            var imgTag = "";
            if(ingyeoLevelReg.test(title)){
              var level = levelMatchResult[1];
              imgTag = '<img src="http://www.ilbe.com/modules/point/icons/default_ilbe/' + level + '.gif"/>';
            }
            var tooltip = $('<p class="ilbeshortcut_tooltip"></p>').html('<span style="font-family:Arial;font-size:12px;">'+imgTag + '&nbsp;<span style="font-weight:bold;">'+point+'</span>&nbsp;(' + percent+'%)</span>');
            tooltip.appendTo('body').fadeIn('fast');
          },
          function(){
            $(this).attr('title', $(this).data('tipText'));
            $('.ilbeshortcut_tooltip').remove();
          }
          ).mousemove(
            function(e){
              var mouseX = e.pageX + 10;
              var mouseY = e.pageY + 10;
              $('.ilbeshortcut_tooltip').css({"top":mouseY, "left":mouseX});
            }
            );
    }
  }

  if (JSON.parse(myLocalStorage["enabled_realtime_notify"])) {
    // 알림 포워딩 기능
    var port = chrome.runtime.connect();
    window.addEventListener("message", function(event){
      if (event.source != window) return;
      if (event.data.type) {
        if (event.data.type == "FROM_PAGE_ILBE"){
          if (JSON.parse(myLocalStorage["enabled_realtime_notify_ilbe"])) {
            chrome.runtime.sendMessage({ action: "notify_ilbe", document_title: event.data.document_title, document_srl: event.data.document_srl });
          }
        }
        else if(event.data.type == "FROM_PAGE_REPLY"){
          if (JSON.parse(myLocalStorage["enabled_realtime_notify_reply"])) {
            chrome.runtime.sendMessage({ action: "notify_reply", comment_content: event.data.comment_content, comment_link: event.data.comment_link });
          }
        }
      }
    }, false);

    var actualCode = '(' + function(){
      var ilbePattern = new RegExp(/<script type=\"text\/javascript\"> if\(!jQuery\.deny_notify_ilbe\) notice\(\'<a href=\"\/(\d*)\">(.*)<\/a>\', 3\); <\/script>/);
      var commentPattern = new RegExp(/<script type=\"text\/javascript\"> if\(!jQuery\.deny_notify_comment\) notice\(\'<a href=\"(.*)\">(.*)<\/a>\', 4\); <\/script>/);
      var oldMessageHandler = ws.onmessage;
      var newMessageHandler = function(message){
        var scriptMessage = message.data.substring(2);
        if (ilbePattern.test(scriptMessage)){
          var matched = ilbePattern.exec(scriptMessage);
          var document_srl = matched[1];
          var document_title = jQuery("<div/>").html(matched[2]).text();
          window.postMessage( { type: "FROM_PAGE_ILBE", document_srl: document_srl, document_title: document_title }, "http://www.ilbe.com" );
        }
        else if(commentPattern.test(scriptMessage)){
          var matched = commentPattern.exec(scriptMessage);
          var comment_link = jQuery("<div/>").html(matched[1]).text();
          var comment_content = jQuery("<div/>").html(matched[2]).text();
          window.postMessage( { type: "FROM_PAGE_REPLY", comment_link: comment_link, comment_content: comment_content }, "http://www.ilbe.com" );
        }
        oldMessageHandler(message);
      }
      ws.onmessage = newMessageHandler;
    } + ')();';

    var script = document.createElement("script");
    script.textContent = actualCode;
    (document.head || document.documentElement).appendChild(script);
    script.parentNode.removeChild(script);
  }

  // 단축키 기능
  key(myLocalStorage["keybinding_yes"], function () {
    if (JSON.parse(myLocalStorage["enabled_yn"])) {
      var btnVoted = document.getElementsByClassName("btn_voted");
      btnVoted.item(0).click();
    }
  });
  key(myLocalStorage["keybinding_no"], function () {
    if (JSON.parse(myLocalStorage["enabled_yn"])) {
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
  key(myLocalStorage["keybinding_login"], function(){
    if (JSON.parse(myLocalStorage["enabled_login"])){
      top.location.href = 'http://www.ilbe.com/index.php?mid=ilbe&act=dispMemberLogout';
    }
  });
});
