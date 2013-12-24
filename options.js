// 기본 설정
var defaultSetting = {
  enabled_yn: true, 				    // 일베로/민주화 단축키 활성화
  keybinding_yes: "y", 			    // 일베로 단축키
  keybinding_no: "n", 			    // 민주화 단축키
  enabled_scrap: true, 			    // 스크랩 단축키 활성화 
  keybinding_scrap: "s", 		    // 스크랩 단축키 
  enabled_page: true, 			    // 페이지 이동 단축키 활성화 
  keybinding_prevpage: "[", 		// 이전 페이지 단축키 
  keybinding_nextpage: "]", 		// 다음 페이지 단축키 
  keybinding_prevarticle: ",", 	// 이전 글 이동
  keybinding_nextarticle: ".", 	// 다음 글 이동
  enabled_reply: true, 			    // 댓글창 이동 단축키 활성화 
  keybinding_reply: "r", 		    // 댓글창 이동 단축키 
  enabled_newest: true, 			  // 최신글 이동
  keybinding_newest: "z", 		  // 최신글 이동 단축키
  enabled_noala: true, 			    // 노알라 표시 기능 활성화 
  noala_count: 200, 				    // 일베 n개 당 노알라 1개 표시 
  noala_maxcount: 10, 			    // 노알라 표시 최대 수(너무 많이 표시되지 않도록) 
  enabled_zero: true,			          // 0렙 강조
  bgcolor_zerolevel: "FFEEEE",			  // 0렙 강조 배경 색상
  watchlist: "",					      // 워치 리스트(지정 회원 강조, 부정적)
  bgcolor_favorite: "CCFFCC",			  // 즐겨찾는 회원 강조 색상(evergreen)
  favoritelist: "",						  // 즐겨찾는 회원(긍정적)
  enabled_not: false,			      // 일베 중독 방지[시간]
  enabled_not2: false,			    // 일베 중독 방지[횟수]
  not_freq: 60,					        // 사용시간 n분 초과
  not2_freq: 100,				        // 글 n회 열람
  not_msg: '일베 이용 시간이 [시간]을 경과했습니다. 과도한 일베 이용은 건강에 해로울 수 있습니다.',
  not2_msg: '일베 탐색 횟수가 [횟수]번을 초과하였습니다. 과도한 일베 이용은 건강에 해로울 수 있습니다.'
};

function ghost(target, relatedItems, isDeactivated) { // 중복 코드 줄이기 위해서 이걸로 묶어봄
  target.style.color = isDeactivated ? 'graytext' : 'black';
  for (var item in relatedItems) {
    relatedItems[item].disabled = isDeactivated;
  }
}

function ghost_yn(isDeactivated) { ghost(yn, [yn.keybinding_yes, yn.keybinding_no], isDeactivated); }
function ghost_scrap(isDeactivated) { ghost(scrap, [scrap.keybinding_scrap], isDeactivated); }
function ghost_page(isDeactivated) { ghost(page, [page.keybinding_prevpage, page.keybinding_nextpage, page.keybinding_prevarticle, page.keybinding_nextarticle], isDeactivated); }
function ghost_reply(isDeactivated) { ghost(reply, [reply.keybinding_reply], isDeactivated); }
function ghost_newest(isDeactivated) { ghost(newest, [newest.keybinding_newest], isDeactivated); }
function ghost_noala(isDeactivated) { ghost(noala, [noala.noala_count, noala.noala_maxcount], isDeactivated); }
function ghost_not(isDeactivated) { ghost(not, [not.not_freq, not.not_msg], isDeactivated); }
function ghost_not2(isDeactivated) { ghost(not2, [not2.not2_freq, not2.not2_msg], isDeactivated); }

function setDefaultIfNull(key, defaultValue) {
  if (localStorage[key] === undefined) {
    localStorage[key] = defaultValue;
  }
}

function setDefaultSettingsIfNecessary() {
  for (var keyName in defaultSetting) {
    setDefaultIfNull(keyName, defaultSetting[keyName]);
  }
}

window.addEventListener('load', function () {
  setDefaultSettingsIfNecessary(); // localStorage에 아무 내용도 저장되어 있지 않으면 undefined로 리턴되므로 에러 발생.

  yn.enable_yn.checked = JSON.parse(localStorage["enabled_yn"]);
  yn.keybinding_yes.value = localStorage["keybinding_yes"];
  yn.keybinding_no.value = localStorage["keybinding_no"];
  scrap.enable_scrap.checked = JSON.parse(localStorage["enabled_scrap"]);
  scrap.keybinding_scrap.value = localStorage["keybinding_scrap"];
  page.enable_page.checked = JSON.parse(localStorage["enabled_page"]);
  page.keybinding_prevpage.value = localStorage["keybinding_prevpage"];
  page.keybinding_nextpage.value = localStorage["keybinding_nextpage"];
  page.keybinding_prevarticle.value = localStorage["keybinding_prevarticle"];
  page.keybinding_nextarticle.value = localStorage["keybinding_nextarticle"];
  reply.enable_reply.checked = JSON.parse(localStorage["enabled_reply"]);
  reply.keybinding_reply.value = localStorage["keybinding_reply"];
  newest.enable_newest.checked = JSON.parse(localStorage["enabled_newest"]);
  newest.keybinding_newest.value = localStorage["keybinding_newest"];
  noala.enable_noala.checked = JSON.parse(localStorage["enabled_noala"]);
  noala.noala_count.value = localStorage["noala_count"];
  noala.noala_maxcount.value = localStorage["noala_maxcount"];
  
  warning.enable_zero.checked = JSON.parse(localStorage["enabled_zero"]);
  warning.watchlist.value = localStorage["watchlist"];
  warning.bgcolor_zerolevel.value = localStorage["bgcolor_zerolevel"];
  
  favorite.favoritelist.value = localStorage["favoritelist"];
  favorite.bgcolor_favorite.value = localStorage["bgcolor_favorite"];
  
  not.enable_not.checked = JSON.parse(localStorage["enabled_not"]);
  not.not_freq.value = localStorage["not_freq"];
  not.not_msg.value = localStorage["not_msg"];
  not2.enable_not2.checked = JSON.parse(localStorage["enabled_not2"]);
  not2.not2_freq.value = localStorage["not2_freq"];
  not2.not2_msg.value = localStorage["not2_msg"];

  if (!yn.enable_yn.checked) { ghost_yn(true); }
  if (!scrap.enable_scrap.checked) { ghost_scrap(true); }
  if (!page.enable_page.checked) { ghost_page(true); }
  if (!reply.enable_reply.checked) { ghost_reply(true); }
  if (!newest.enable_newest.checked) { ghost_newest(true); }
  if (!noala.enable_noala.checked) { ghost_noala(true); }
  if (!not.enable_not.checked) { ghost_not(true); }
  if (!not2.enable_not2.checked) { ghost_not2(true); }

  yn.enable_yn.onchange = function () {
    localStorage["enabled_yn"] = yn.enable_yn.checked;
    ghost_yn(!yn.enable_yn.checked);
  };

  scrap.enable_scrap.onchange = function () {
    localStorage["enabled_scrap"] = scrap.enable_scrap.checked;
    ghost_scrap(!scrap.enable_scrap.checked);
  };

  page.enable_page.onchange = function () {
    localStorage["enabled_page"] = page.enable_page.checked;
    ghost_page(!page.enable_page.checked);
  };

  reply.enable_reply.onchange = function () {
    localStorage["enabled_reply"] = reply.enable_reply.checked;
    ghost_reply(!reply.enable_reply.checked);
  };

  newest.enable_newest.onchange = function () {
    localStorage["enabled_newest"] = newest.enable_newest.checked;
    ghost_newest(!newest.enable_newest.checked);
  };

  noala.enable_noala.onchange = function () {
    localStorage["enabled_noala"] = noala.enable_noala.checked;
    ghost_noala(!noala.enable_noala.checked);
  };

  noala.noala_count.onchange = function () {
    localStorage["noala_count"] = noala.noala_count.value;
  };

  noala.noala_maxcount.onchange = function () {
    localStorage["noala_maxcount"] = noala.noala_maxcount.value;
  };

  yn.keybinding_yes.onchange = function () {
    localStorage["keybinding_yes"] = yn.keybinding_yes.value;
  };

  yn.keybinding_no.onchange = function () {
    localStorage["keybinding_no"] = yn.keybinding_no.value;
  };

  scrap.keybinding_scrap.onchange = function () {
    localStorage["keybinding_scrap"] = scrap.keybinding_scrap.value;
  };

  reply.keybinding_reply.onchange = function () {
    localStorage["keybinding_reply"] = reply.keybinding_reply.value;
  };

  newest.keybinding_newest.onchange = function () {
    localStorage["keybinding_newest"] = newest.keybinding_newest.value;
  };

  page.keybinding_prevpage.onchange = function () {
    localStorage["keybinding_prevpage"] = page.keybinding_prevpage.value;
  };

  page.keybinding_nextpage.onchange = function () {
    localStorage["keybinding_nextpage"] = page.keybinding_nextpage.value;
  };

  page.keybinding_prevarticle.onchange = function () {
    localStorage["keybinding_prevarticle"] = page.keybinding_prevarticle.value;
  };

  page.keybinding_nextarticle.onchange = function () {
    localStorage["keybinding_nextarticle"] = page.keybinding_nextarticle.value;
  };

  /////////////////////////////
  // 0렙 및 지정 회원 경고 기능
  warning.enable_zero.onchange = function () {
    localStorage["enabled_zero"] = warning.enable_zero.checked;
  };

  warning.watchlist.onchange = function () {
    localStorage["watchlist"] = warning.watchlist.value;
  };

  warning.bgcolor_zerolevel.onchange = function () {
    localStorage["bgcolor_zerolevel"] = warning.bgcolor_zerolevel.value;
  };
  
  /////////////////////////////
  // 즐겨찾는 일게이 
  favorite.favoritelist.onchange = function() {
    localStorage["favoritelist"] = favorite.favoritelist.value;
  };
  
  favorite.bgcolor_favorite.onchange = function() {
    localStorage["bgcolor_favorite"] = favorite.bgcolor_favorite.value;
  };

  not.enable_not.onchange = function () {
    localStorage["enabled_not"] = not.enable_not.checked;
    ghost_not(!not.enable_not.checked);
  };

  not.not_freq.onchange = function () {
    localStorage["not_freq"] = not.not_freq.value;
  };

  not.not_msg.onchange = function () {
    localStorage["not_msg"] = not.not_msg.value;
  };

  not2.enable_not2.onchange = function () {
    localStorage["enabled_not2"] = not2.enable_not2.checked;
    ghost_not2(!not2.enable_not2.checked);
  };

  not2.not2_freq.onchange = function () {
    localStorage["not2_freq"] = not2.not2_freq.value;
  };

  not2.not2_msg.onchange = function () {
    localStorage["not2_msg"] = not2.not2_msg.value;
  };

  document.querySelector('#reset').addEventListener('click', resetSettings);

});

function resetSettings() {
  yn.enable_yn.checked = defaultSetting.enabled_yn;
  yn.keybinding_yes.value = defaultSetting.keybinding_yes;
  yn.keybinding_no.value = defaultSetting.keybinding_no;
  scrap.enable_scrap.checked = defaultSetting.enabled_scrap;
  scrap.keybinding_scrap.value = defaultSetting.keybinding_scrap;
  page.enable_page.checked = defaultSetting.enabled_page;
  page.keybinding_prevpage.value = defaultSetting.keybinding_prevpage;
  page.keybinding_nextpage.value = defaultSetting.keybinding_nextpage;
  page.keybinding_prevarticle.value = defaultSetting.keybinding_prevarticle;
  page.keybinding_nextarticle.value = defaultSetting.keybinding_nextarticle;
  reply.enable_reply.checked = defaultSetting.enabled_reply;
  reply.keybinding_reply.value = defaultSetting.keybinding_reply;
  newest.enable_newest.checked = defaultSetting.enabled_newest;
  newest.keybinding_newest.value = defaultSetting.keybinding_newest;
  noala.enable_noala.checked = defaultSetting.enabled_noala;
  noala.noala_count.value = defaultSetting.noala_count;
  noala.noala_maxcount.value = defaultSetting.noala_maxcount;
  
  warning.enable_zero.checked = defaultSetting.enabled_zero;
  warning.watchlist.value = defaultSetting.watchlist;
  warning.bgcolor_zerolevel.value = defaultSetting.bgcolor_zerolevel;
  
  favorite.favoritelist.value = defaultSetting.favoritelist;
  favorite.bgcolor_favorite.value = defaultSetting.bgcolor_favorite;
  
  not.enable_not.checked = defaultSetting.enabled_not;
  not.not_freq.value = defaultSetting.not_freq;
  not.not_msg.value = defaultSetting.not_msg;
  not2.enable_not2.checked = defaultSetting.enabled_not2;
  not2.not2_freq.value = defaultSetting.not2_freq;
  not2.not2_msg.value = defaultSetting.not2_msg;

  yn.enable_yn.onchange();
  yn.keybinding_yes.onchange();
  yn.keybinding_no.onchange();
  scrap.enable_scrap.onchange();
  scrap.keybinding_scrap.onchange();
  page.enable_page.onchange();
  page.keybinding_prevpage.onchange();
  page.keybinding_nextpage.onchange();
  page.keybinding_prevarticle.onchange();
  page.keybinding_nextarticle.onchange();
  reply.enable_reply.onchange();
  reply.keybinding_reply.onchange();
  newest.enable_newest.onchange();
  newest.keybinding_newest.onchange();
  noala.enable_noala.onchange();
  noala.noala_count.onchange();
  noala.noala_maxcount.onchange();
  
  warning.enable_zero.onchange();
  warning.watchlist.onchange();
  warning.bgcolor_zerolevel.onchange();
  
  favorite.favoritelist.onchange();
  favorite.bgcolor_favorite.onchange();
  
  not.enable_not.onchange();
  not.not_freq.onchange();
  not.not_msg.onchange();
  not2.enable_not2.onchange();
  not2.not2_freq.onchange();
  not2.not2_msg.onchange();
}
