function updateToLocalStorage() {
    localStorage["enabled_yn"] = enabled_yn;
    localStorage["enabled_scrap"] = enabled_scrap;
    localStorage["enabled_page"] = enabled_page;
    localStorage["enabled_reply"] = enabled_reply;
    localStorage["enabled_noala"] = enabled_noala;
    localStorage["enabled_timer"] = enabled_timer;
    localStorage["noala_count"] = noala_count;
    localStorage["noala_maxcount"] = noala_maxcount;
    localStorage["keybinding_yes"] = keybinding_yes;
    localStorage["keybinding_no"] = keybinding_no;
    localStorage["keybinding_scrap"] = keybinding_scrap;
    localStorage["keybinding_reply"] = keybinding_reply;
    localStorage["keybinding_prevpage"] = keybinding_prevpage;
    localStorage["keybinding_nextpage"] = keybinding_nextpage;
}
function resetTimer() {
    localStorage["ingyeo_time"] = 0;
    updateTimer();
}
function resetSettings() {
    enabled_yn = 'true';
    enabled_scrap = 'true';
    enabled_page = 'true';
    enabled_reply = 'true';
    enabled_noala = 'true';
    enabled_timer = 'false';
    noala_count = 200;
    noala_maxcount = 10;
    keybinding_yes = "y";
    keybinding_no = "n";
    keybinding_scrap = "s";
    keybinding_reply = "r";
    keybinding_prevpage = "[";
    keybinding_nextpage = "]";
    updateToLocalStorage();
    loadOptions(); // 다시 읽게 해서 UI에 반영을 하자
    alert('초기화했음');
}
function saveOptions() {
    enabled_yn = document.querySelector('#enabled_yn').checked;
    enabled_scrap = document.querySelector('#enabled_scrap').checked;
    enabled_page = document.querySelector('#enabled_page').checked;
    enabled_reply = document.querySelector('#enabled_reply').checked;
    enabled_noala = document.querySelector('#enabled_noala').checked;
    enabled_timer = document.querySelector('#enabled_timer').checked;
    noala_count = document.querySelector('#noala_count').value;
    noala_maxcount = document.querySelector('#noala_maxcount').value;
    keybinding_yes = document.querySelector('#keybinding_yes').value;
    keybinding_no = document.querySelector('#keybinding_no').value;
    keybinding_scrap = document.querySelector('#keybinding_scrap').value;
    keybinding_reply = document.querySelector('#keybinding_reply').value;
    keybinding_prevpage = document.querySelector('#keybinding_prevpage').value;
    keybinding_nextpage = document.querySelector('#keybinding_nextpage').value;
    updateToLocalStorage();
    alert('저장 완료');
}
function updateTimer() {
    if (localStorage["is_ilbe_active"] === 'true') {
        document.querySelector('#ilbe_active').innerText = "(일베 활동 중...)";
    }
    else {
        document.querySelector('#ilbe_active').innerText = "";
    }
    document.querySelector('#timer_value').innerText = secondsToHms(parseInt(localStorage["ingyeo_time"]));
};
function loadOptions() {
    updateTimer();
    setInterval(updateTimer, 5000);

    var enabled_yn = localStorage["enabled_yn"];
    if (enabled_yn === undefined) {
        enabled_yn = 'true';
    }
    var enabled_scrap = localStorage["enabled_scrap"];
    if (enabled_scrap === undefined) {
        enabled_scrap = 'true';
    }
    var enabled_page = localStorage["enabled_page"];
    if (enabled_page === undefined) {
        enabled_page = 'true';
    }
    var enabled_reply = localStorage["enabled_reply"];
    if (enabled_reply === undefined) {
        enabled_reply = 'true';
    }
    var enabled_noala = localStorage["enabled_noala"];
    if (enabled_noala === undefined) {
        enabled_noala = 'true';
    }
    var enabled_timer = localStorage["enabled_timer"];
    if (enabled_timer === undefined) {
        enabled_timer = 'false';
    }
    var noala_count = localStorage["noala_count"];
    if (noala_count === undefined) {
        noala_count = 200;
    }
    var noala_maxcount = localStorage["noala_maxcount"];
    if (noala_maxcount === undefined) {
        noala_maxcount = 10;
    }
    var keybinding_yes = localStorage["keybinding_yes"];
    if (keybinding_yes === undefined) {
        keybinding_yes = "y";
    }
    var keybinding_no = localStorage["keybinding_no"];
    if (keybinding_no === undefined) {
        keybinding_no = "n";
    }
    var keybinding_scrap = localStorage["keybinding_scrap"];
    if (keybinding_scrap === undefined) {
        keybinding_scrap = "s";
    }
    var keybinding_reply = localStorage["keybinding_reply"];
    if (keybinding_reply === undefined) {
        keybinding_reply = "r";
    }
    var keybinding_prevpage = localStorage["keybinding_prevpage"];
    if (keybinding_prevpage === undefined) {
        keybinding_prevpage = "[";
    }
    var keybinding_nextpage = localStorage["keybinding_nextpage"];
    if (keybinding_nextpage === undefined) {
        keybinding_nextpage = "]";
    }


    document.querySelector('#enabled_yn').disabled = false;
    document.querySelector('#enabled_yn').checked = (enabled_yn === 'true');
    document.querySelector('#enabled_scrap').disabled = false;
    document.querySelector('#enabled_scrap').checked = (enabled_scrap === 'true');
    document.querySelector('#enabled_page').disabled = false;
    document.querySelector('#enabled_page').checked = (enabled_page === 'true');
    document.querySelector('#enabled_reply').disabled = false;
    document.querySelector('#enabled_reply').checked = (enabled_reply === 'true');
    document.querySelector('#enabled_noala').disabled = false;
    document.querySelector('#enabled_noala').checked = (enabled_noala === 'true');
    document.querySelector('#enabled_timer').disabled = false;
    document.querySelector('#enabled_timer').checked = (enabled_timer === 'true');
    document.querySelector('#noala_count').disabled = false;
    document.querySelector('#noala_count').value = noala_count;
    document.querySelector('#noala_maxcount').disabled = false;
    document.querySelector('#noala_maxcount').value = noala_maxcount;
    document.querySelector('#keybinding_yes').disabled = false;
    document.querySelector('#keybinding_yes').value = keybinding_yes;
    document.querySelector('#keybinding_no').disabled = false;
    document.querySelector('#keybinding_no').value = keybinding_no;
    document.querySelector('#keybinding_scrap').disabled = false;
    document.querySelector('#keybinding_scrap').value = keybinding_scrap;
    document.querySelector('#keybinding_reply').disabled = false;
    document.querySelector('#keybinding_reply').value = keybinding_reply;
    document.querySelector('#keybinding_prevpage').disabled = false;
    document.querySelector('#keybinding_prevpage').value = keybinding_prevpage;
    document.querySelector('#keybinding_nextpage').disabled = false;
    document.querySelector('#keybinding_nextpage').value = keybinding_nextpage;
}

document.addEventListener('DOMContentLoaded', loadOptions);
document.querySelector('#reset').addEventListener('click', resetSettings);
document.querySelector('#save').addEventListener('click', saveOptions);
document.querySelector('#reset_timer').addEventListener('click', resetTimer);

function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);
    return ((h > 0 ? h + ":" : "") + (m > 0 ? (h > 0 && m < 10 ? "0" : "") + m + ":" : "0:") + (s < 10 ? "0" : "") + s);
}
