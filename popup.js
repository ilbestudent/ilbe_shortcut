function SecondToString(second) {
  var hour = Math.floor(second / 3600000);
  var minute = Math.floor((second - (hour * 3600000)) / 60000);
  var second = Math.floor((second - (hour * 3600000) - (minute * 60000)) / 1000);
  var time = "";

  if (hour != 0) {
    time = hour + "시간 ";
  }
  if (minute != 0) {
    time += minute + "분 ";
  }
  if (time == "") {
    time = second + "초 ";
  }
  return time;
}

var background = chrome.extension.getBackgroundPage();

document.getElementById('text').innerHTML = '<b>일베 이용 시간 : </b>' + SecondToString(+new Date() - background.time) + '<br><b>일베 탐색 횟수 : </b>' + background.count + '번<br><b>일베 이용 시간(누적) : </b>' + SecondToString(+new Date() - background.time + parseInt(localStorage["time"])) + '<br><b>일베 탐색 횟수(누적) : </b>' + (background.count + parseInt(localStorage["count"])) + '번';
document.getElementById('reset').addEventListener('click', function () {
  background.time = +new Date();
  background.count = 0;
  background.not = 1;
  background.not2 = 1;
  localStorage["time"] = '0';
  localStorage["count"] = '0';
  document.location.reload(true)
});
