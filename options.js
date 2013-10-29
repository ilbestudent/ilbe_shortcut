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
  enabled_timer:false, // 잉여 시간 표시 기능 
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
  setDefaultIfNull("ingyeo_time",0); // 잉여 시간이 기록되지 않았으면 0으로 초기화
  if(localStorage["ingyeo_time"]=='NaN'){
  	localStorage["ingyeo_time"]=0;
  }
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
  timer.checked = JSON.parse(localStorage["enabled_timer"]);

  if (!yn.enable_yn.checked) { ghost_yn(true); }
  if (!scrap.enable_scrap.checked) { ghost_scrap(true); }
  if (!page.enable_page.checked) { ghost_page(true); }
  if (!reply.enable_reply.checked) { ghost_reply(true); }
  if (!noala.enable_noala.checked) { ghost_noala(true); }

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

  timer.onchange = function() {
    localStorage["enabled_timer"] = timer.checked;
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

  document.querySelector('#reset').addEventListener('click', resetSettings);
  document.querySelector('#reset_timer').addEventListener('click', resetTimer);

  updateTimer();
  setInterval(updateTimer, 5000);
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
  timer.checked = defaultSetting.enabled_timer;

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
  timer.onchange();
}

function resetTimer() {
    localStorage["ingyeo_time"] = 0;
    updateTimer();
}

function updateTimer() {
    if (JSON.parse(localStorage["is_ilbe_active"]) === true) {
        document.querySelector('#ilbe_active').innerText = "(일베 활동 중...)";
    }
    else {
        document.querySelector('#ilbe_active').innerText = "";
    }
    document.querySelector('#timer_value').innerText = secondsToHms(parseInt(localStorage["ingyeo_time"]));
};

function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);
    return ((h > 0 ? h + ":" : "") + (m > 0 ? (h > 0 && m < 10 ? "0" : "") + m + ":" : "0:") + (s < 10 ? "0" : "") + s);
}
