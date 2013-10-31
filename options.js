// 기본 설정
var defaultSetting = {
  enabled_yn:true, // 일베로/민주화 단축키 활성화
  keybinding_yes:"y", // 일베로 단축키
  keybinding_no:"n", // 민주화 단축키
  enabled_scrap:true, // 스크랩 단축키 활성화 
  keybinding_scrap:"s", // 스크랩 단축키 
  enabled_page:true, // 페이지 이동 단축키 활성화 
  keybinding_prevpage:"[", // 이전 페이지 단축키 
  keybinding_nextpage:"]", // 다음 페이지 단축키 
  enabled_reply:true, // 댓글창 이동 단축키 활성화 
  keybinding_reply:"r", // 댓글창 이동 단축키 
  enabled_noala:true, // 노알라 표시 기능 활성화 
  noala_count:200, // 일베 n개 당 노알라 1개 표시 
  noala_maxcount:10, // 노알라 표시 최대 수(너무 많이 표시되지 않도록) 
  enabled_not:false,
  enabled_not2:false,
  not_freq:60,
  not2_freq:100,
  not_msg:'일베 이용 시간이 [시간]을 경과했습니다. 과도한 일베 이용은 건강에 해로울 수 있습니다.',
  not2_msg:'일베 탐색 횟수가 [횟수]번을 초과하였습니다. 과도한 일베 이용은 건강에 해로울 수 있습니다.'
};

function ghost_yn(isDeactivated) {
  yn.style.color = isDeactivated ? 'graytext' : 'black';
  yn.keybinding_yes.disabled = isDeactivated;
  yn.keybinding_no.disabled = isDeactivated;
}

function ghost_scrap(isDeactivated) {
  scrap.style.color = isDeactivated ? 'graytext' : 'black';
  scrap.keybinding_scrap.disabled = isDeactivated;
}

function ghost_page(isDeactivated) {
  page.style.color = isDeactivated ? 'graytext' : 'black';
  page.keybinding_prevpage.disabled = isDeactivated;
  page.keybinding_nextpage.disabled = isDeactivated;
}

function ghost_reply(isDeactivated) {
  reply.style.color = isDeactivated ? 'graytext' : 'black';
  reply.keybinding_reply.disabled = isDeactivated;
}

function ghost_noala(isDeactivated) {
  noala.style.color = isDeactivated ? 'graytext' : 'black';
  noala.noala_count.disabled = isDeactivated;
  noala.noala_maxcount.disabled = isDeactivated;
}

function ghost_not(isDeactivated) {
  not.style.color = isDeactivated ? 'graytext' : 'black';
  not.not_freq.disabled = isDeactivated;
  not.not_msg.disabled = isDeactivated;
}

function ghost_not2(isDeactivated) {
  not2.style.color = isDeactivated ? 'graytext' : 'black';
  not2.not2_freq.disabled = isDeactivated;
  not2.not2_msg.disabled = isDeactivated;
}

function setDefaultIfNull(key,defaultValue){
  if(localStorage[key]===undefined){
  	localStorage[key]=defaultValue;
  	console.log("default value is assigned. key=" + key + ", value=" + defaultValue);
  }
}

function setDefaultSettingsIfNecessary(){
  for (var keyName in defaultSetting){
    setDefaultIfNull(keyName,defaultSetting[keyName]);
  }
}

window.addEventListener('load', function() {
  setDefaultSettingsIfNecessary(); // localStorage에 아무 내용도 저장되어 있지 않으면 undefined로 리턴되므로 에러 발생.
  yn.enable_yn.checked = JSON.parse(localStorage["enabled_yn"]);
  yn.keybinding_yes.value = localStorage["keybinding_yes"];
  yn.keybinding_no.value = localStorage["keybinding_no"];
  scrap.enable_scrap.checked = JSON.parse(localStorage["enabled_scrap"]);
  scrap.keybinding_scrap.value = localStorage["keybinding_scrap"];
  page.enable_page.checked = JSON.parse(localStorage["enabled_page"]);
  page.keybinding_prevpage.value = localStorage["keybinding_prevpage"];
  page.keybinding_nextpage.value = localStorage["keybinding_nextpage"];
  reply.enable_reply.checked = JSON.parse(localStorage["enabled_reply"]);
  reply.keybinding_reply.value = localStorage["keybinding_reply"];
  noala.enable_noala.checked = JSON.parse(localStorage["enabled_noala"]);
  noala.noala_count.value = localStorage["noala_count"];
  noala.noala_maxcount.value = localStorage["noala_maxcount"];
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
  if (!noala.enable_noala.checked) { ghost_noala(true); }
  if (!not.enable_not.checked) { ghost_not(true); }
  if (!not2.enable_not2.checked) { ghost_not2(true); }

  yn.enable_yn.onchange = function() {
    localStorage["enabled_yn"] = yn.enable_yn.checked;
    ghost_yn(!yn.enable_yn.checked);
  };

  scrap.enable_scrap.onchange = function() {
    localStorage["enabled_scrap"] = scrap.enable_scrap.checked;
    ghost_scrap(!scrap.enable_scrap.checked);
  };

  page.enable_page.onchange = function() {
    localStorage["enabled_page"] = page.enable_page.checked;
    ghost_page(!page.enable_page.checked);
  };

  reply.enable_reply.onchange = function() {
    localStorage["enabled_reply"] = reply.enable_reply.checked;
    ghost_reply(!reply.enable_reply.checked);
  };

  noala.enable_noala.onchange = function() {
    localStorage["enabled_noala"] = noala.enable_noala.checked;
    ghost_noala(!noala.enable_noala.checked);
  };

  noala.noala_count.onchange = function() {
    localStorage["noala_count"] = noala.noala_count.value;
  };

  noala.noala_maxcount.onchange = function() {
    localStorage["noala_maxcount"] = noala.noala_maxcount.value;
  };

  yn.keybinding_yes.onchange = function() {
    localStorage["keybinding_yes"] = yn.keybinding_yes.value;
  };

  yn.keybinding_no.onchange = function() {
    localStorage["keybinding_no"] = yn.keybinding_no.value;
  };

  scrap.keybinding_scrap.onchange = function() {
    localStorage["keybinding_scrap"] = scrap.keybinding_scrap.value;
  };

  reply.keybinding_reply.onchange = function() {
    localStorage["keybinding_reply"] = reply.keybinding_reply.value;
  };

  page.keybinding_prevpage.onchange = function() {
    localStorage["keybinding_prevpage"] = page.keybinding_prevpage.value;
  };

  page.keybinding_nextpage.onchange = function() {
    localStorage["keybinding_nextpage"] = page.keybinding_nextpage.value;
  };

  not.enable_not.onchange = function() {
    localStorage["enabled_not"] = not.enable_not.checked;
    ghost_not(!not.enable_not.checked);
  };

  not.not_freq.onchange = function() {
    localStorage["not_freq"] = not.not_freq.value;
  };

  not.not_msg.onchange = function() {
    localStorage["not_msg"] = not.not_msg.value;
  };

  not2.enable_not2.onchange = function() {
    localStorage["enabled_not2"] = not2.enable_not2.checked;
    ghost_not2(!not2.enable_not2.checked);
  };

  not2.not2_freq.onchange = function() {
    localStorage["not2_freq"] = not2.not2_freq.value;
  };

  not2.not2_msg.onchange = function() {
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
  reply.enable_reply.checked = defaultSetting.enabled_reply;
  reply.keybinding_reply.value = defaultSetting.keybinding_reply;
  noala.enable_noala.checked = defaultSetting.enabled_noala;
  noala.noala_count.value = defaultSetting.noala_count;
  noala.noala_maxcount.value = defaultSetting.noala_maxcount;
  not.enable_not = defaultSetting.enabled_not;
  not.not_freq = defaultSetting.not_freq;
  not.not_msg = defaultSetting.not_msg;
  not2.enable_not2 = defaultSetting.enabled_not2;
  not2.not2_freq = defaultSetting.not2_freq;
  not2.not2_msg = defaultSetting.not2_msg;

  yn.enable_yn.onchange();
  yn.keybinding_yes.onchange();
  yn.keybinding_no.onchange();
  scrap.enable_scrap.onchange();
  scrap.keybinding_scrap.onchange();
  page.enable_page.onchange();
  page.keybinding_prevpage.onchange();
  page.keybinding_nextpage.onchange();
  reply.enable_reply.onchange();
  reply.keybinding_reply.onchange();
  noala.enable_noala.onchange();
  noala.noala_count.onchange();
  noala.noala_maxcount.onchange();
  not.enable_not.onchange();
  not.not_freq.onchange();
  not.not_msg.onchange();
  not2.enable_not2.onchange();
  not2.not2_freq.onchange();
  not2.not2_msg.onchange();
}
