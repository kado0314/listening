// --- 定数とDOM要素の取得 ---
const targetSentenceElement = document.getElementById('targetSentence');
const playButton = document.getElementById('playButton');
const recordButton = document.getElementById('recordButton');
const recognitionResultElement = document.getElementById('recognitionResult');
const scoreResultElement = document.getElementById('scoreResult');

const TARGET_SENTENCE = targetSentenceElement.textContent.trim();
const TARGET_WORDS = normalizeText(TARGET_SENTENCE).split(' ');

// --- ユーティリティ関数（正規化）---
// テキストから句読点を削除し、小文字に統一する
function normalizeText(text) {
    return text.toLowerCase().replace(/[.,!?;:]/g, '').trim();
}

// --- 1. 英文再生 (TTS: Text-to-Speech) ---
playButton.addEventListener('click', () => {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(TARGET_SENTENCE);
        utterance.lang = 'en-US'; // 英語に設定
        window.speechSynthesis.speak(utterance);
    } else {
        alert('お使いのブラウザは音声合成に対応していません。');
    }
});

// --- 2. 復唱の録音と認識 (STT: Speech-to-Text) ---
recordButton.addEventListener('click', () => {
    // WebKit Speech Recognition APIの準備 (Chromeなど)
    if (!('webkitSpeechRecognition' in window)) {
        alert('お使いのブラウザは音声認識に対応していません。Google Chromeなどをご利用ください。');
        return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'en-US'; // 英語認識に設定
    recognition.interimResults = false; // 最終結果のみを取得
    recognition.continuous = false; 

    // 録音中であることをユーザーに知らせる
    recordButton.textContent = '🔴 録音中...（話してください）';
    recordButton.disabled = true;

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        recognitionResultElement.textContent = transcript;
        
        // スコア計算
        const score = calculateScore(transcript);
        scoreResultElement.textContent = `${score}%`;
        
        // 完了
        recordButton.textContent = '🎙️ 録音開始';
        recordButton.disabled = false;
    };

    recognition.onerror = (event) => {
        recognitionResultElement.textContent = `認識エラー: ${event.error}`;
        scoreResultElement.textContent = '0%';
        recordButton.textContent = '🎙️ 録音開始';
        recordButton.disabled = false;
    };

    recognition.start();
});


// --- 3. スコア化ロジック（単語の一致度） ---
function calculateScore(recognizedText) {
    if (!recognizedText) return 0;

    const recognizedWords = normalizeText(recognizedText).split(' ');
    
    let matchedCount = 0;
    const maxWords = Math.max(TARGET_WORDS.length, recognizedWords.length);

    // 単語を順番に比較して一致数をカウントする
    for (let i = 0; i < TARGET_WORDS.length; i++) {
        // recognizedWordsにその単語が存在するかチェック（順番は問わない簡易チェック）
        // 厳密には、順番も含めた比較（レーベンシュタイン距離）が望ましいですが、ここでは簡易な方法で
        if (i < recognizedWords.length && TARGET_WORDS[i] === recognizedWords[i]) {
             matchedCount++;
        }
    }
    
    // スコア計算: (一致した単語数 / 正解英文の単語数) * 100
    // 認識されたテキストが短すぎたり長すぎたりする場合を考慮し、TARGET_WORDSの長さを基準にします
    const score = (matchedCount / TARGET_WORDS.length) * 100;

    // 小数点以下を切り捨ててパーセンテージとして返す
    return Math.floor(score);
}
