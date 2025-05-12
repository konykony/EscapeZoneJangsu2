 
// 정답 단어
let ANSWER;

// 자물쇠 게임 생성 함수
 function createArrowLockGame(answer, container) {
    ANSWER = answer;
    const slots = 5;

    // 템플릿 생성
    let html = `<div class="d-flex align-items-center mb-3">
      <span class="back-arrow me-2" id="closeLockBtn">&lt;</span>
      <h3 class="mb-0">자물쇠 풀기</h3>
    </div>
    <div class="divider"></div>
    <div class="lock-container text-center">`;
    html += `<div class="lock-icon">🔒</div>`;
    html += `<div class="d-flex justify-content-center">`;
    
    for (let i = 0; i < slots; i++) {
      html += `
        <div class="slot" data-index="${i}">
          <button class="btn-up">▲</button>
          <div class="letter"></div>
          <button class="btn-down">▼</button>
        </div>`;
    }
    
    html += `</div>`;
    html += `<div class="status text-white"></div>`;
    html += `</div>`;

    // HTML 삽입
    $(container).append(html);
    bindArrowLogic(answer);
    closeLockBtnClick();
  }

  function closeLockBtnClick(){
    $('#closeLockBtn').on('click', function () {
      $("#lockModal").hide();
    });
  }

  // 알파벳 순서 업데이트 함수
  function bindArrowLogic(answer) {
    const $game = $('.lock-container').last();
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

    // 각 자물쇠 자리의 알파벳을 랜덤으로 생성
    function getRandomLetters(exclude) {
      const letters = [];
      while (letters.length < 10) {
        const randomChar = alphabet[Math.floor(Math.random() * alphabet.length)];
        if (!letters.includes(randomChar) && !exclude.includes(randomChar)) {
          letters.push(randomChar);
        }
      }
      return letters;
    }

    // 각 슬롯에 정답을 포함하고, 나머지 알파벳은 랜덤으로 설정
    function setupSlots() {
      const slots = 5;
      const correctLetters = answer.split('');
      const shuffledSlots = [];

      // 정답 글자들을 무작위로 섞음
      while (correctLetters.length) {
        const randomIndex = Math.floor(Math.random() * correctLetters.length);
        shuffledSlots.push(correctLetters.splice(randomIndex, 1)[0]);
      }

      // 나머지 알파벳을 랜덤으로 채우되, 정답 글자들이 포함되도록 설정
      $game.find('.slot').each(function(index) {
        const randomLetters = getRandomLetters([answer[index]]);
        const $letterDiv = $(this).find('.letter');
        
        // 정답 글자를 추가하고 랜덤 알파벳을 배치
        const lettersToDisplay = [answer[index], ...randomLetters];
        $(this).data('letters', lettersToDisplay);

        // 슬롯에 표시
        $letterDiv.text(lettersToDisplay[Math.floor(Math.random() * lettersToDisplay.length)].toUpperCase());
      });
    }

    // 상태 업데이트 함수
    function updateState() {
      const current = $game.find('.letter').toArray()
        .map(el => $(el).text().toLowerCase())
        .join('');
      if (current === answer) {
        $game.find('.lock-icon').text('🔓');
        $game.find('.status').text('풀림!');
        $game.find('button').prop('disabled', true);
        playUnlockSound();
        setSuccess();
      } else {
        $game.find('.status').text('');
      }
    }

    // 각 슬롯에 대해 랜덤한 알파벳 목록 설정
    setupSlots();

    // ▲ 버튼 클릭 이벤트
    $game.on('click', '.btn-up', function() {
      const $slot = $(this).closest('.slot');
      const $letter = $slot.find('.letter');
      const letters = $slot.data('letters');
      let idx = letters.indexOf($letter.text().toLowerCase());
      idx = (idx - 1 + letters.length) % letters.length;
      $letter.text(letters[idx].toUpperCase());
      updateState();
      playButtonClickSound();
    });

    // ▼ 버튼 클릭 이벤트
    $game.on('click', '.btn-down', function() {
      const $slot = $(this).closest('.slot');
      const $letter = $slot.find('.letter');
      const letters = $slot.data('letters');
      let idx = letters.indexOf($letter.text().toLowerCase());
      idx = (idx + 1) % letters.length;
      $letter.text(letters[idx].toUpperCase());
      updateState();
      playButtonClickSound();
    });
  }