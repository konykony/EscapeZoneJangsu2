let startTime = Date.now(); // 페이지 로드 시 시작 시간 기록
$(document).ready(function () {
	if (!checkTestMode()) { // 테스트모드가 아닌 경우
		checkUserPage(); // 현재 페이지 확인
		setPuzzleImg();
		initHeader();
		initFooter();
		// initProgress();
		// setInitHintUsed();
		initHints();
		initExciting();
		initLocker();
		// setJsonDataScript(function(){ // 스크립트가 로드 된 후 실행
		// });
	} else if (isAdmin()) {
		setPuzzleImg();
		initHeader();
		initFooter();
		initHints();
		initExciting();
		initLocker();
		addAdminBtn();
	} else { // 테스트모드 인 경우
		$('#header').hide();
		$('#footer').hide();
		initLocker();
		$("#closeLockBtn").hide();
		$("#lockModal").show();
	}

	$(window).on('beforeunload', function () {
		location.href = "start.html";
	});
});

function isAdmin() {
	const params = new URLSearchParams(window.location.search);
	return params.get('user') === 'admin';
}

//관리자 전용 버튼 추가
function addAdminBtn() {
	if (isAdmin()) {
		// const adminBtn = $('<button>')
		// 	.addClass('btn btn-primary mt-3')
		// 	.text('관리자 페이지')
		// 	.click(function () {
		// 		window.location.href = '../admin/gameTest.html';
		// 	});

		// const wrapperDiv = $('<div>')
		// 	.addClass('text-center')
		// 	.append(adminBtn);

		// $('.puzzle-area').after(wrapperDiv);
		$('#header .progress').hide();
		$('#header .home-btn').click(function () {
			window.location.href = '../admin/gameTest.html';
		});
	}
}

function appendScripts(scriptSrc, callback) {
	var script = document.createElement('script');
	script.src = scriptSrc;
	script.type = 'text/javascript';
	script.async = true;  // 비동기적으로 로드

	// 문서의 <head> 태그에 <script> 태그를 추가
	document.head.appendChild(script);

	// 로드가 완료된 후 실행할 작업
	script.onload = function () {
		console.log(scriptSrc + '가 로드되었습니다!');
		callback();
	};

	// 오류 발생 시 실행할 작업
	script.onerror = function () {
		console.error(scriptSrc + ' 스크립트를 로드하는 중 오류가 발생했습니다.');
	};
}

// jsonData script 추가하기
function setJsonDataScript(callback) {
	// URL 파라미터에서 'script' 값을 읽어옵니다.
	var urlParams = new URLSearchParams(window.location.search);
	var scriptParam = urlParams.get('script');  // 예: ?script=0505

	// 기본적으로 로드할 스크립트 경로 설정
	var scriptPath = '';

	// URL 파라미터 값에 따라 로드할 스크립트를 결정
	if (scriptParam === 'hansel') {
		scriptPath = '../../js/jsonData/hansel.js';
	} else if (scriptParam === '0605') {
		scriptPath = '../../js/jsonData/0605.js';
	} else if (scriptParam === '0705') {
		scriptPath = '../../js/jsonData/0705.js';
	} else {
		scriptPath = '../../js/jsonData/hansel.js';  // 기본 스크립트 경로
	}

	appendScripts(scriptPath, callback);
}

// 정답 입력창에 포커스가 있으면 footer 숨기기
function setInitInput() {
	const $inputElement = $('.answer-input-group input:text, .answer-input-group textarea'); // 텍스트 입력창과 텍스트 영역 모두 선택
	const $footerElement = $('footer'); // 푸터 태그 선택 (ID나 클래스로 특정할 수도 있습니다.)

	// 입력창에 포커스가 들어왔을 때
	$inputElement.on('focus', function () {
		$footerElement.hide(); // 푸터를 숨깁니다.
	});

	// 입력창에서 포커스가 벗어났을 때
	$inputElement.on('blur', function () {
		$footerElement.show(); // 푸터를 다시 표시합니다.
	});
}


// 스테이지 정보 세팅
function setUserStageInfo() {
	const currentStage = getGameStage();
	$('#stageNum').text(currentStage + "번 문제");
}

// // QR코드 숨겨진 장소
// function setHiddenPlace(){
// //	$('#hiddenPlace').text(getHiddenPlace());
// 	const puzzle = getCurrentPuzzleData();
// 	$('#hiddenPlace').text(puzzle.hiddenPlace);
// }

// 관리자 테스트 스테이지
function getAdminTestStage(){
	const filename = window.location.pathname.split('/').pop(); // "game1.html"
	const match = filename.match(/\d+/); // 숫자 추출
	const stageNumber = match ? match[0] : null;
	return stageNumber;
}

// 퍼즐 이미지
function setPuzzleImg() {
	let puzzle;
	if(isAdmin()){
		const currentStage = getAdminTestStage();
		puzzle = getPuzzleData(currentStage);
	}else{
		puzzle = getCurrentPuzzleData();
	}
	if (puzzle.imgUrl != null && puzzle.imgUrl != "" && $("#puzzleImg").length) {
		$("#puzzleImg").attr("src", puzzle.imgUrl);
	} else {
		$("#puzzleImg").hide();
	}
	if (puzzle.content != null && puzzle.content != "") {
		$("#puzzle-text").text(puzzle.content);
	} else {
		$("#puzzle-text").hide();
	}

	if ($("#puzzle-text").length > 0) {
		// 문서 전체 클릭 시
		$(document).on("click", function (e) {
			setPuzzleTextBtn(e);
			setHintBtn(e);
			setLockBtn(e);
			// setPuzzleTextHide(e);
		});
	}
	//	$('#hiddenPlace').text(getHiddenPlace());
}

// function setPuzzleTextHide(e){
// 	if ($(e.target).closest("#footer .puzzle").length === 0) {
// 		$("#puzzle-text").hide(); // div 숨기기
// 	}else if ($(e.target).closest("#footer .locker").length > 0) {
// 		$("#lockModal").show();
// 	}else if ($(e.target).closest("#footer .hints").length > 0) {
// 		$("#hintModal").show();
// 	} else {
// 		if ($("#puzzle-text").is(":visible")) {
// 			$("#puzzle-text").hide();
// 		} else {
// 			$("#puzzle-text").show();
// 		}
// 	}
// }

// 퍼즐 설명
function setPuzzleTextBtn(e){
	if ($(e.target).closest("#footer .puzzle").length === 0) {
		$("#puzzle-text").hide(); // div 숨기기
	} else {
		if ($("#puzzle-text").is(":visible")) {
			$("#puzzle-text").hide();
		} else {
			$("#puzzle-text").show();
		}
	}
}

function setLockBtn(e){
	if ($(e.target).closest("#footer .locker").length > 0) {
		$("#lockModal").show();
	}
}

// 퍼즐 설명
function setHintBtn(e){
	if ($(e.target).closest("#footer .hints").length > 0) {
		$("#hintModal").show();
	}
}

// 시계 화면 업데이트
function updateDisplayTime() {
	const currentTime = Date.now() - startTime;
	$("#display").text(timeToString(currentTime));
}

// 힌트 초기화
function initHints() {
	

	const html = `<div class="d-flex align-items-center mb-3">
      <span class="back-arrow me-2" id="closeHintBtn">&lt;</span>
      <h3 class="mb-0">힌트 조회</h3>
    </div>
    <div class="divider"></div>
    <button class="btn btn-primary hint-button" data-target="#hint1">힌트1 조회</button>
    <div id="hint1" class="hint-content">힌트1 내용</div>

    <button class="btn btn-primary hint-button" data-target="#hint2">힌트2 조회</button>
    <div id="hint2" class="hint-content">힌트2 내용</div>

    <button class="btn btn-primary hint-button" data-target="#hint3">힌트3 조회</button>
    <div id="hint3" class="hint-content">힌트3 내용</div>`;
	$("#hintModal").append(html);

	setHintsEvent();
}

// 힌트 이벤트
function setHintsEvent(){
	$("#closeHintBtn").click(function () {
		$("#hintModal").hide();
		$('#hintModal .hint-content').slideUp(); // 다른 힌트 숨김
	});

	// 힌트 버튼 클릭
	$('#hintModal .hint-button').on('click', function () {
		const target = $(this).data('target');
		$('#hintModal .hint-content').not(target).slideUp(); // 다른 힌트 숨김
		const hintLevel = target.replace('#hint','');
		setHintContent(hintLevel);
		$(target).slideToggle(); // 클릭한 힌트 토글
	});

	setInterval(updateHintBtn, 1 * 1000); // 1초 간격으로 업데이트
}


function updateHintBtn() {
	setHintContent(1);
	setHintContent(2);
	setHintContent(3);
  }


function setHintContent(hintLevel){
	var currentStage = getGameStage();
	
	if(isAdmin()){
		currentStage = getAdminTestStage();
	}
	// 팝업 내용 동적 생성 및 추가
	const contentWrapper = $('<div>').attr('id', 'content-wrapper'); // 추가된 wrapper div

	var minute = parseInt(hintLevel) * (parseInt(hintLevel) + 1) / 2; // 힌트 단계는 1분 뒤, 2단계는 3분뒤, 3단계는 6분 뒤 실행

	const currentTime = new Date(); // 현재 시간
	const timeDifferenceMs = currentTime - getStageStartTime(); // 밀리초 단위 차이
	var content;
	if(((minute * 60 * 1000) - timeDifferenceMs) > 0 && !isAdmin()){
		// $('#hint' + hintLevel).text('아직 ' + hintLevel + '번 힌트를 볼 수 없습니다.');
		$('#hint' + hintLevel).text(`${hintLevel}번 힌트를 보려면 ${convertMsToTime((minute * 60 * 1000) - timeDifferenceMs)} 남았습니다.`);
	}else{
		$('#hint' + hintLevel).text(getValueByIndexAndKey(hintConData, currentStage - 1, 'hint' + hintLevel));
	}
	// $('#hint' + hintLevel).text(content);

	// contentWrapper.append(content); // inputContainer를 contentWrapper에 추가
	// openPopupDynamic("힌트 조회", contentWrapper);
}

// 힌트 보기
function showHint(hintLevel, obj) {
	var currentStage = getGameStage();
	// 팝업 내용 동적 생성 및 추가
	const contentWrapper = $('<div>').attr('id', 'content-wrapper'); // 추가된 wrapper div

	const content = $('<p>' + hintLevel + '단계의 코드번호를 입력하세요</p>');
	const inputContainer = $('<div>').attr('id', 'input-container').attr('class', 'input-group w-100 m-0');
	const nameInput = $('<input>').attr({
		type: 'text',
		id: 'hint-code-input',
		class: 'form-control',
		placeholder: '힌트코드를 입력하세요'
	});

	// 확인 버튼 클릭시
	function executeEvent() {
		const inputHintCode = $('#hint-code-input').val().replace(/-/g, '');
		var currentHintUsed = getHintUsed();
		//		var hintVal = getValueByIndexAndKey(currentHintUsed, currentStage-1, 'code' + hintLevel);
		var hintVal = getValueByIndexAndKey(hintConData, currentStage - 1, 'code' + hintLevel);
		var hintContent = getValueByIndexAndKey(hintConData, currentStage - 1, 'hint' + hintLevel);
		if (inputHintCode == hintVal) {
			//        	initCookieClear(adminPass);
			$('#hintcode-message').text(hintContent);
			$('#popup-title').text(hintLevel + '단계 힌트 조회');
			$('#content-wrapper p').remove();
			$('#input-container').remove();
			setHintUsed(currentHintUsed, currentStage - 1, 'is' + hintLevel, obj);
			//			closePopup();
		} else if (inputHintCode != hintVal) {
			$('#hintcode-message').text('잘못된 힌트코드입니다.');
		} else {
			$('#hintcode-message').text('힌트코드를 입력해주세요.');
		}
	}
	const eventButton = $('<button>').attr('id', 'event-button').attr('class', 'btn btn-primary ms-2').text('확인').click(executeEvent);
	const resultMessage = $('<div id="hintcode-message"></div>');

	inputContainer.append(nameInput, eventButton);
	contentWrapper.append(content, inputContainer, resultMessage); // inputContainer를 contentWrapper에 추가
	openPopupDynamic("힌트코드 입력", contentWrapper);
}

// 열어 본 적 있는 힌트 보기
function showExistHint(hintLevel) {
	var currentStage = getGameStage();
	var currentHintUsed = getHintUsed();
	var hintContent = getValueByIndexAndKey(hintConData, currentStage - 1, 'hint' + hintLevel);
	const content = $('<p>' + hintContent + '</p>');
	const title = hintLevel + '단계 힌트 조회';
	openPopup(title, content);
}

// 
function getCurrentPageNm() {
	const url = window.location.pathname;         // 예: /pages/play/game1.html
	const filename = url.substring(url.lastIndexOf('/') + 1); // game1.html
	return filename;
}

// 현재 페이지와 쿠키속 stage가 일치 하는지 확인
function checkCurrentPage() {
	const filename = getCurrentPageNm();
	var currentStage = getGameStage();

	if (filename.includes("game")) {
		let num = Number(filename.match(/\d+/));
		if (isNaN(num)) {
			return false;
		} else if (num > 0 && num <= 11 && num == currentStage) {
			return true;
		}
	} else if (filename.includes('final') && getEndTimeCookie() == null) {
		return false;
	} else {
		return true;
	}
}

// 현재 페이지 확인
function checkUserPage() {
	if (checkPage8()) {
		return true;
	} else {
		// if(checkTestMode()){
		// 	return true;
		// }else{
		// 	const filename = getCurrentPageNm();
		// 	if (filename.includes("game")) {

		// 	}
		// }
		if (!checkCurrentPage()) { // 쿠키에 저장된 페이지와 다른경우
			goErrorPage();
		}
		if (getEndTimeCookie() != null) { // 게임이 끝난 경우
			location.href = "/pages/play/final.html";
		} else if (isNaN(getStartTime()) || getStartTimeCookie() == null) { // 시작 한 적이 없는 경우(접속 url 잘못 입력)
			goErrorPage();
		}
		var currentStage = getGameStage();
		var currentPuzzle = getPuzzleData(currentStage);
		if (currentPuzzle != null && !isCurrentPage("start.html")) {
			var currentPuzzle = getPuzzleData(currentStage);
			if (currentPuzzle.stage != currentStage) {
				goErrorPage();
			}
		}
	}

}

function checkPage8() {
	const pageName = window.location.pathname.split('/').pop();
	if (pageName == "game8.html") {
		const params = new URLSearchParams(window.location.search);
		const lightValue = params.get('light');

		// // 1~9 사이의 숫자인지 확인
		// if (lightValue && /^[1-9]$/.test(lightValue)) {
		// 	console.log(`유효한 light 값입니다: ${lightValue}`);
		// 	return true;
		// } else {
		// 	console.log('light 파라미터가 없거나 1~9 범위를 벗어났습니다.');
		// }
		try {
			const num = parseInt(params.get('light'));
			if (num >= 1 && num <= 9) {
				isValidLight = true;
				console.log(`✅ 유효한 light 값입니다: ${num}`);
				if (checkCookieExists()) {
					return true;
				}
			} else {
				console.log('❌ light 값이 정수가 아니거나 1~9 범위에 있지 않습니다.');
			}
		} catch (error) {
			console.log('❌ light 파라미터 변환 중 오류가 발생했습니다.', error);
		}
	}
	return false;
}

function playAudio(fileName) {
	var play_audio = new Audio('../../sound/' + fileName); // 재생할 오디오 파일 경로를 지정합니다.

	// 2. 재생 시작
	play_audio.play().then(() => {
		// 재생이 성공적으로 시작되었을 때 실행할 코드 (선택 사항)
		console.log('오디오 재생 시작!');
	}).catch((error) => {
		// 재생이 실패했을 때 실행할 코드 (주로 자동 재생 정책 위반)
		console.error('오디오 재생 실패:', error);
		// 사용자에게 재생 버튼을 표시하거나, 오류 메시지를 보여줄 수 있습니다.
	});
}

// 효과음 시작
var effect_audio = new Audio('../../sound/jump09.mp3'); // 임의로 초기화
function playSoundEffect(fileName) {
	effect_audio = new Audio('../../sound/' + fileName); // 재생할 오디오 파일 경로를 지정합니다.
	effect_audio.currentTime = 0; // 재생 위치를 처음(0초)으로 이동 = 완전 정지
	effect_audio.play().then(() => {
		console.log('오디오 재생 시작!');
	}).catch((error) => {
		console.error('오디오 재생 실패:', error);
	});
}

// 효과음 멈추기기
function stopSoundEffect() {
	effect_audio.pause();        // 재생을 일시정지
	effect_audio.currentTime = 0; // 재생 위치를 처음(0초)으로 이동 = 완전 정지
}

// 자물쇠 버튼 클릭하면 소리 재생
function playButtonClickSound() {
	playSoundEffect('mouse_click.mp3');
}

// 자물쇠 풀리면 소리 재생
function playUnlockSound() {
	playSoundEffect('unlock.mp3');
}

function initExciting() {
	const excitingHtml = `
            <div id="div-exciting">
				<div id="image-container">
					<img id="random-image" src="" alt="랜덤 이미지">
				</div>
			</div>
        `;
	$("#exciting").append(excitingHtml);
	$("#exciting").hide();
}


const imageCount = 11;
var randomIndex = Math.floor(Math.random() * imageCount) + 1;

// 스테이지 끝나고 신나는 이미지 보여주기	
function showExciting() {
	$("#exciting").show();
	$(".container").hide();
	// $("main").hide();
	$("#footer").hide();
	$("#lockModal").hide();
	$("#hintModal").hide();
	$("#hintModal").hide();
	$("#div-exciting").css({
		"display": "flex",
		"justify-content": "center",
		"align-items": "center",
		"min-height": "100vh",
	});
	$("#div-exciting").show();

	showRandomImageAndRedirect();
}

function getRandomImageSource() {
	return "../../img/exciting/play_" + randomIndex + '.gif';
}

function getRandomSoundSource() {
	return "../../sound/sound_" + randomIndex + '.mp3';
}

function setSoundIndex() {
}

function showRandomImageAndRedirect() {
	var randomImageSrc = getRandomImageSource();
	$('#random-image').attr('src', randomImageSrc);
	var randomAudioSrc = getRandomSoundSource();
	// 		$('#exciting-audio source')[0].attr('src', randomAudioSrc);
	//         $('#exciting-audio')[0].play();

	// playSoundEffect(randomAudioSrc);
	var audio = new Audio(randomAudioSrc); // 재생할 오디오 파일 경로를 지정합니다.
	audio.currentTime = 0; // 재생 위치를 처음(0초)으로 이동 = 완전 정지
	// 2. 재생 시작
	audio.play().then(() => {
		// 재생이 성공적으로 시작되었을 때 실행할 코드 (선택 사항)
		console.log('오디오 재생 시작!');
	})
		.catch((error) => {
			// 재생이 실패했을 때 실행할 코드 (주로 자동 재생 정책 위반)
			console.error('오디오 재생 실패:', error);
			// 사용자에게 재생 버튼을 표시하거나, 오류 메시지를 보여줄 수 있습니다.
		});

	setTimeout(function () {
		if(isAdmin()){
			location.href = '../admin/gameTest.html';
		}
		if (!checkTestMode()) { // 테스트 모드가 아닌 경우
			goNextPage();
		}
	}, 2000);
}

// fetch header load된 다음 실행
function initHeader() {
	// const headerHtml = `
	// 	<div class="top-bar">
	//         <div id="userNameLink" class="user-name">사용자 이름</div>
	//     </div>
	// 	<div class="progress mb-3">
	//             <div id="gameProgress" class="progress-bar" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
	//                 0%
	//             </div>
	//         </div>
	//     <div id="stageNum" class="question-info text-start"></div>
	//     <audio id="myAudio" style="display: none;">
	//       <source src="../../sound/unlock.mp3" type="audio/mpeg">
	//     </audio>
	//     <div id="popup-overlay">
	//         <div id="popup-content">
	//             <span id="popup-close-btn" class="close-button">&times;</span>
	//             <h4 id="popup-title"></h4>
	//             <hr/>
	//             <div id="popup-inner-content"></div>
	//         </div>
	//     </div>
	//     `;
	let currentStage = getGameStage();
	if(isAdmin()){
		currentStage = getAdminTestStage();
	}
	// <div>
	// 	<button class="btn btn-outline-primary home-btn">
	// 		<i class="bi bi-house-door"></i>
	// 	</button>
	// 	${currentStage} 단계
	// </div>
	// <div class="progress mb-3">
	// 	<div id="gameProgress" class="progress-bar" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
	//  		0%
	//  	</div>
	//  </div>
	const headerHtml = `
		<div class="header-content" style="width: 100%; text-align: center; position: relative;">
			<button class="btn btn-outline-primary home-btn">
			<i class="bi bi-house-door"></i>
			</button>
			<span>${currentStage} 단계</span>
		</div>

		<!-- 프로그레스 바 -->
		<div class="progress">
			<div id="gameProgress" class="progress-bar" role="progressbar"
				style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
			0%
			</div>
		</div>
      `;

	// #header 요소 안에 동적으로 콘텐츠 삽입
	$("#header").append(headerHtml);
	initHeaderEvents();
}

// header event 실행
function initHeaderEvents() {
	// $('#userNameLink').text(getUserName() + '님');

	// $('#userNameLink').click(function(){ // 이름 버튼 클릭
	// 	location.href = "start.html";
	// });
	$('#header .home-btn').click(function () { // 이름 버튼 클릭
		location.href = "start.html";
	});

	// setUserStageInfo();

	startTime = getStartTime(); // 페이지 로드 시 시작 시간 기록
	// updateDisplayTime(); // 1초 딜레이 없애기
	// setInterval(updateDisplayTime, 1000); // 1초 간격으로 업데이트

	updateProgress(); // 프로그래스바 업데이트
}

// fetch footer load된 다음 실행
function initFooter() {
	// const footerHtml = `
	//         <div class="hint-area">
	//         <div class="hint-control text-left font-weight-bold">
	//             힌트 보기 <i class="bi bi-question-circle"></i>
	//         </div>
	//         <div class="hint-levels">
	//             <button type="button" data-hint-level="1" class="btn btn-outline-secondary btn-sm hint-level-button">1단계</button>
	//             <button type="button" data-hint-level="2" class="btn btn-outline-secondary btn-sm hint-level-button">2단계</button>
	//             <button type="button" data-hint-level="3" class="btn btn-outline-secondary btn-sm hint-level-button">3단계</button>
	//         </div>
	//     </div>
	//     `;
	const footerHtml = `
	<button class="btn btn-outline-primary puzzle">문제</button>
        <button class="btn btn-outline-primary hints">힌트</button>
        <button class="btn btn-outline-primary locker">자물쇠</button>`;

	$("#footer").append(footerHtml);
	initFooterEvents();
}

// footer event 실행
function initFooterEvents() {
	// $('.hint-area .hint-levels .btn').click(function () { // 힌트버튼 클릭
	// 	if ($(this).hasClass('btn-primary')) { // 이미 사용한 버튼은 팝업 안 띄우기
	// 		showExistHint($(this).attr("data-hint-level"));
	// 	} else {
	// 		// showHint($(this).attr("data-hint-level"), $(this));
	// 		showHintNot($(this).attr("data-hint-level"), $(this));
	// 	}
	// });
	$('#popup-close-btn').click(closePopup);

	setStageStartTime();

	if($('#lockModal').length == 0){
		$('#footer .locker').hide();
	}

	// updateHintBtn(); // 힌트 버튼 업데이트
	// setInterval(updateHintBtn, 60*1000); // 1분 간격으로 업데이트
	// setInterval(updateHintBtn, 1 * 1000); // 1초 간격으로 업데이트
	// initPuzzleBtn();
}

function initPuzzleBtn() {
	$('#footer .puzzle').click(function () { // 문제 버튼 클릭
		$("#puzzle-text").show(); // div 보이기기
		$("#puzzle-text").css("display", "");
	});
}

// 밀리초를 분, 초로 변환
function convertMsToTime(ms) {
	const totalSeconds = Math.floor(ms / 1000);
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;

	if (minutes === 0) {
		return `${seconds}초`;
	} else {
		return `${minutes}분 ${String(seconds).padStart(2, '0')}초`;
	}
}

function showHintNot(hintLevel, obj) {

	var currentStage = getGameStage();
	// 팝업 내용 동적 생성 및 추가
	const contentWrapper = $('<div>').attr('id', 'content-wrapper'); // 추가된 wrapper div

	var minute = parseInt(hintLevel) * (parseInt(hintLevel) + 1) / 2; // 힌트 단계는 1분 뒤, 2단계는 3분뒤, 3단계는 6분 뒤 실행

	const currentTime = new Date(); // 현재 시간
	const timeDifferenceMs = currentTime - getStageStartTime(); // 밀리초 단위 차이

	const content = $(`<p>${hintLevel}번 힌트를 보려면 ${convertMsToTime((minute * 60 * 1000) - timeDifferenceMs)} 남았습니다.</p>`);

	contentWrapper.append(content); // inputContainer를 contentWrapper에 추가
	openPopupDynamic("힌트 조회", contentWrapper);
}

// 힌트 버튼 업데이트
// function updateHintBtn() {
	// $('.hint-area .hint-levels .btn').each(function(index, element) {
	// 	var hintLevel = parseInt($(this).attr("data-hint-level"));
	// 	var minute = hintLevel * (hintLevel + 1) / 2; // 힌트 단계는 1분 뒤, 2단계는 3분뒤, 3단계는 6분 뒤 실행

	// 	const currentTime = new Date(); // 현재 시간
	// 	const currentStage = parseInt(getGameStage());
	// 	const timeDifferenceMs = currentTime - getStageStartTime(); // 밀리초 단위 차이

	// 	// 바꾸기기
	// 	if(timeDifferenceMs > (minute*60*1000)){ // 힌트레벨 X 3분
	// 	// if(timeDifferenceMs > (minute*1*1000)){ // 힌트레벨 X 1초
	// 		$(this).removeClass('btn-outline-secondary').addClass('btn-primary');
	// 	}
	// });
// }

function changeLockImg(obj, newBgIndex) {
	const newBg = "../../img/lock/lock_" + newBgIndex + "_off.png";

	const img = new Image();
	img.src = newBg;

	img.onload = function () {
		// 이미지가 완전히 로드된 후에 바꾸기
		obj.css("background-image", `url('${newBg}')`);
	};
}

// 진행상태 초기화
function initProgress() {
	const progressBarHTML = `
		<div class="progress mb-3">
			<div id="gameProgress" class="progress-bar" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
				0%
			</div>
		</div>
        `;

	// header의 맨 하위에 진행 바 삽입
	// $("main").append(progressBarHTML);

	$("#header").after(progressBarHTML);
	// $("div.progress").after(progressBarHTML);
	updateProgress();
}

// 진행상태 업데이트
function updateProgress() {
	const currentStage = getGameStage();
	const totalStages = getPuzzleDataLength();

	if (currentStage <= totalStages) {
		// 현재 단계를 퍼센트로 변환
		const percentage = (currentStage / totalStages) * 100;
		const progressBar = $("#gameProgress");

		// 진행 바의 스타일과 텍스트 업데이트
		progressBar.css("width", percentage + "%");
		progressBar.attr("aria-valuenow", percentage);
		// progressBar.text(Math.round(percentage) + "%");
		progressBar.text(""); // 텍스트를 비워서 숨김

	} else {
		// alert("게임이 완료되었습니다!");
	}
}

function initLocker(){
	if($('#closeLockBtn').length > 0){
		$('#closeLockBtn').on('click', function () {
            $("#lockModal").hide();
        });
	}
}