// A default setting is used in option.html & background
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

  enabled_login: true,          // 로그인/아웃 관련 단축키 활성화
  keybinding_login: "l",        // 로그인(현재는 로그아웃)

  enabled_noala: true, 			    // 노알라 표시 기능 활성화 
  noala_count: 200, 				    // 일베 n개 당 노알라 1개 표시 
  noala_maxcount: 10, 			    // 노알라 표시 최대 수(너무 많이 표시되지 않도록) 

  enabled_ingyeo: true,                // 잉여력 팝업 띄우기
  enabled_realtime_notify: true,       // 실시간 알림 전달 활성화
  enabled_realtime_notify_ilbe: true,  // 실시간 알림(일베 알림)
  enabled_realtime_notify_reply: true, // 실시간 알림(댓글 알림)

  enabled_zero: true,			            // 0렙 강조
  bgcolor_zerolevel: "FFEEEE",			  // 0렙 강조 배경 색상

  enabled_not: false,			      // 일베 중독 방지[시간]
  enabled_not2: false,			    // 일베 중독 방지[횟수]
  not_freq: 60,					        // 사용시간 n분 초과
  not2_freq: 100,				        // 글 n회 열람
  not_msg: '일베 이용 시간이 [시간]을 경과했습니다. 과도한 일베 이용은 건강에 해로울 수 있습니다.',
  not2_msg: '일베 탐색 횟수가 [횟수]번을 초과하였습니다. 과도한 일베 이용은 건강에 해로울 수 있습니다.'
};

function FixUndefinedSetting() {
  for (var settingKey in defaultSetting) {
    if (localStorage[settingKey] === undefined) {
      console.log(settingKey + ' is not defined. Use a default value:' + defaultSetting[settingKey]);
      localStorage[settingKey] = defaultSetting[settingKey];
    }
  }
}