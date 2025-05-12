 
// 정답 단어
let ANSWER;

// 1) 자물쇠 HTML 생성 함수
function createVerticalLockHtml(answer, container) {
    ANSWER = answer;
    let html = `<div class="lock-vertical">`;
    html += `<div class="lock-icon">🔒</div>`;
    // 4글자 슬롯
    for (let i = 0; i < 4; i++) {
        html += `
        <div class="slot" data-index="${i}">
          <button class="btn-prev">◁</button>
          <div class="letter">A</div>
          <button class="btn-next">▷</button>
        </div>`;
    }
    html += `<div class="status"></div>`;
    html += `</div>`;
    // HTML 삽입
    $(container).append(html);
    bindArrowLogic();  // 이벤트 핸들러 연결
}

// 3) 버튼 로직 바인딩
function bindArrowLogic() {
    const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');
    let locked = false;
    const $game = $('#lock-area .lock-vertical').last();

    function updateState() {
        const attempt = $game.find('.letter').toArray()
            .map(el => $(el).text().toLowerCase()).join('');
        if (attempt === ANSWER) {
            locked = true;
            $game.find('.lock-icon').text('🔓');
            $game.find('.status').text('Unlocked!').addClass('text-success');
            $game.find('button').prop('disabled', true);
        }
    }

    // 이전 글자
    $game.on('click', '.btn-prev', function () {
        if (locked) return;
        const $ltr = $(this).siblings('.letter');
        let idx = ALPHABET.indexOf($ltr.text().toLowerCase());
        idx = (idx - 1 + ALPHABET.length) % ALPHABET.length;
        $ltr.text(ALPHABET[idx].toUpperCase());
        updateState();
        playButtonClickSound();
    });

    // 다음 글자
    $game.on('click', '.btn-next', function () {
        if (locked) return;
        const $ltr = $(this).siblings('.letter');
        let idx = ALPHABET.indexOf($ltr.text().toLowerCase());
        idx = (idx + 1) % ALPHABET.length;
        $ltr.text(ALPHABET[idx].toUpperCase());
        updateState();
        playButtonClickSound();
    });
}

// 문서 준비 후 한 번 호출
$(document).ready(function () {
    appendVerticalLock();
});