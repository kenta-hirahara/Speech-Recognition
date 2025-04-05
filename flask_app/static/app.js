const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!SpeechRecognition) {
    alert("this browser cannot recognize audio.");
} else {
    //constructor to initiate speech recognition obj
    const recognition = new SpeechRecognition();
    //config of the obj
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'ja-JP';
    
    //button and display elements
    const startBtn = document.getElementById('start-btn');
    const buttonText = document.getElementById('button-text');
    const micIcon = document.getElementById('mic-icon');
    const resultP = document.getElementById('result');
    const responseP = document.getElementById('response');
    const recordingWave1 = document.getElementById('recording-wave-1');
    const recordingWave2 = document.getElementById('recording-wave-2');
    
    let isRecording = false;
    
    // マイクアイコンSVGを定義
    const micSvg = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14v7m0 0h3m-3 0H9m3-7a4 4 0 004-4V5a4 4 0 00-8 0v5a4 4 0 004 4z" />`;
    
    // 再生アイコンSVGを定義
    const playSvg = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3l14 9-14 9V3z" />`;
    
    //start button click event
    startBtn.addEventListener('click', () => {
        if (!isRecording) {
            startRecording();
        }
    });
    
    function startRecording() {
        isRecording = true;
        recognition.start();
        
        // ボタンのスタイルを変更
        startBtn.classList.remove('normal-button');
        startBtn.classList.add('recording-button', 'animate-recording');
        
        // テキストを更新
        buttonText.textContent = "Recording...";
        
        // アイコンをマイクに変更
        micIcon.innerHTML = micSvg;
        
        // 波紋アニメーションを追加
        recordingWave1.classList.add('animate-wave');
        recordingWave2.classList.add('animate-wave');
    }
    
    function stopRecording() {
        isRecording = false;
        
        // ボタンのスタイルを元に戻す
        startBtn.classList.remove('recording-button', 'animate-recording');
        startBtn.classList.add('normal-button');
        
        // テキストを更新
        buttonText.textContent = "Start Recording";
        
        // アイコンを再生に戻す
        micIcon.innerHTML = playSvg;
        
        // 波紋アニメーションを停止
        recordingWave1.classList.remove('animate-wave');
        recordingWave2.classList.remove('animate-wave');
    }
    
    //speech recog results handling
    recognition.onresult = (event) => {
        let resultText = '';
        for (let i = 0; i < event.results.length; i++) {
            resultText += event.results[i][0].transcript;
        }
        resultText = resultText.replace(/ /g, "");
        resultP.textContent = resultText;
        
        // 録音終了後にボタンのスタイルを戻す
        stopRecording();
        
        // send data to flask server
        fetch('/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({text:resultText})
        })
        .then(response => response.json())
        .then(data => {
            if (data.answer) {
                responseP.innerHTML = marked.parse(data.answer);
            } else {
                responseP.textContent = "Error!!!";
            }
        })
        .catch(error => {
            console.error("Error:", error);
            responseP.textContent = "Error occured";
        });
    }
    
    // 音声認識が終了したときの処理
    recognition.onend = () => {
        // 録音状態が続いている場合のみスタイルを戻す（結果を取得できなかった場合）
        if (isRecording) {
            stopRecording();
        }
    };
    
    // エラー発生時の処理
    recognition.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
        stopRecording();
        resultP.textContent = `認識エラー: ${event.error}`;
    };
}
