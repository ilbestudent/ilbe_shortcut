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
function ghost_login(isDeactivated) { ghost(login, [login.keybinding_login], isDeactivated); }
function ghost_noala(isDeactivated) { ghost(noala, [noala.noala_count, noala.noala_maxcount], isDeactivated); }
function ghost_ingyeo(isDeactivated) { ghost(ingyeo, [], isDeactivated); }
function ghost_realtime_notify(isDeactivated) { ghost(realtime_notify, [realtime_notify.enabled_realtime_notify_ilbe, realtime_notify.enabled_realtime_notify_reply], isDeactivated); }
function ghost_not(isDeactivated) { ghost(not, [not.not_freq, not.not_msg], isDeactivated); }
function ghost_not2(isDeactivated) { ghost(not2, [not2.not2_freq, not2.not2_msg], isDeactivated); }

window.addEventListener('load', function () {
  FixUndefinedSetting();

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
  login.enable_login.checked = JSON.parse(localStorage["enabled_login"]);
  login.keybinding_login.value = localStorage["keybinding_login"];
  noala.enable_noala.checked = JSON.parse(localStorage["enabled_noala"]);
  noala.noala_count.value = localStorage["noala_count"];
  noala.noala_maxcount.value = localStorage["noala_maxcount"];
 
  ingyeo.enable_ingyeo.checked = JSON.parse(localStorage["enabled_ingyeo"]);

  realtime_notify.enable_realtime_notify.checked = JSON.parse(localStorage["enabled_realtime_notify"]);
  realtime_notify.enable_realtime_notify_ilbe.checked = JSON.parse(localStorage["enabled_realtime_notify_ilbe"]);
  realtime_notify.enable_realtime_notify_reply.checked = JSON.parse(localStorage["enabled_realtime_notify_reply"]);

  warning.enable_zero.checked = JSON.parse(localStorage["enabled_zero"]);
  warning.bgcolor_zerolevel.value = localStorage["bgcolor_zerolevel"];
  
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
  if (!login.enable_login.checked) { ghost_login(true); }
  if (!noala.enable_noala.checked) { ghost_noala(true); }
  if (!ingyeo.enable_ingyeo.checked) { ghost_ingyeo(true); }
  if (!realtime_notify.enable_realtime_notify.checked) { ghost_realtime_notify(true); }
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

  login.enable_login.onchange = function() {
    localStorage["enabled_login"] = login.enable_login.checked;
    ghost_login(!login.enable_login.checked);
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

  ingyeo.enable_ingyeo.onchange = function() {
    localStorage["enabled_ingyeo"] = ingyeo.enable_ingyeo.checked;
    ghost_ingyeo(!ingyeo.enable_ingyeo.checked);
  };

  // 실시간 알림 전달
  realtime_notify.enable_realtime_notify.onchange = function() {
    localStorage["enabled_realtime_notify"] = realtime_notify.enable_realtime_notify.checked;
    ghost_realtime_notify(!realtime_notify.enable_realtime_notify.checked);
  };

  realtime_notify.enable_realtime_notify_ilbe.onchange = function() {
    localStorage["enabled_realtime_notify_ilbe"] = realtime_notify.enable_realtime_notify_ilbe.checked;
  };
  
  realtime_notify.enable_realtime_notify_reply.onchange = function() {
    localStorage["enabled_realtime_notify_reply"] = realtime_notify.enable_realtime_notify_reply.checked;
  };
  ////////

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

  login.keybinding_login.onchange = function(){
    localStorage["keybinding_login"] = login.keybinding_login.value;
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

  warning.enable_zero.onchange = function () {
    localStorage["enabled_zero"] = warning.enable_zero.checked;
  };

  warning.bgcolor_zerolevel.onchange = function () {
    localStorage["bgcolor_zerolevel"] = warning.bgcolor_zerolevel.value;
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
  login.enable_login.checked = defaultSetting.enabled_login;
  login.keybinding_login.value = defaultSetting.keybinding_login;
  noala.enable_noala.checked = defaultSetting.enabled_noala;
  noala.noala_count.value = defaultSetting.noala_count;
  noala.noala_maxcount.value = defaultSetting.noala_maxcount;
 
  ingyeo.enable_ingyeo.checked = defaultSetting.enabled_ingyeo;

  realtime_notify.enable_realtime_notify.checked = defaultSetting.enabled_realtime_notify;
  realtime_notify.enable_realtime_notify_ilbe.checked = defaultSetting.enabled_realtime_notify_ilbe;
  realtime_notify.enable_realtime_notify_reply.checked = defaultSetting.enabled_realtime_notify_reply;

  warning.enable_zero.checked = defaultSetting.enabled_zero;
  warning.bgcolor_zerolevel.value = defaultSetting.bgcolor_zerolevel;
  
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
  login.enable_login.onchange();
  login.keybinding_login.onchange();
  noala.enable_noala.onchange();
  noala.noala_count.onchange();
  noala.noala_maxcount.onchange();
 
  ingyeo.enable_ingyeo.onchange();
  
  realtime_notify.enable_realtime_notify.onchange();
  realtime_notify.enable_realtime_notify_ilbe.onchange();
  realtime_notify.enable_realtime_notify_reply.onchange();

  warning.enable_zero.onchange();
  warning.bgcolor_zerolevel.onchange();
  
  not.enable_not.onchange();
  not.not_freq.onchange();
  not.not_msg.onchange();
  not2.enable_not2.onchange();
  not2.not2_freq.onchange();
  not2.not2_msg.onchange();
}
