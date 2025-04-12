const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!SpeechRecognition) {
    alert("このブラウザは音声認識に対応していません");
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
    
    // Flags to control UI state
    let isRecording = false;
    let isProcessing = false; // flag of server process

    // Define mic icon SVG
    const micSvg = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14v7m0 0h3m-3 0H9m3-7a4 4 0 004-4V5a4 4 0 00-8 0v5a4 4 0 004 4z" />`;
    
    // Define play icon SVG
    const playSvg = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3l14 9-14 9V3z" />`;
    
    // Event listner for the start button
    startBtn.addEventListener('click', () => {
        if (!isRecording && !isProcessing) {
            startRecording();
        } else if (isRecording) {
            // Manually stop recording if already recording
            recognition.stop();
        }
    });
    
    // Start recording and updating UI
    function startRecording() {
        isRecording = true;
        recognition.start();
        
        // Update button styles and text
        startBtn.classList.remove('normal-button');
        startBtn.classList.add('recording-button', 'animate-recording');
        buttonText.textContent = "Recording...";
        micIcon.innerHTML = micSvg;
        
        // Start wave animation
        recordingWave1.classList.add('animate-wave');
        recordingWave2.classList.add('animate-wave');
    }
    
    // Stop recording and reset UI
    function stopRecording() {
        isRecording = false;
        
        // Reset button styles and text
        startBtn.classList.remove('recording-button', 'animate-recording');
        startBtn.classList.add('normal-button');
        buttonText.textContent = "Start Recording";
        micIcon.innerHTML = playSvg;
        
        // Stop wave animation
        recordingWave1.classList.remove('animate-wave');
        recordingWave2.classList.remove('animate-wave');
    }
       // Set UI state to processing while waiting for server response
       function setProcessingState(isActive) {
        isProcessing = isActive;
        startBtn.disabled = isActive;
        if (isActive) {
            responseP.innerHTML = '<div class="loading">処理中...</div>';
        }
    } 

    // Handle recognition result
    recognition.onresult = (event) => {
        let resultText = '';
        for (let i = 0; i < event.results.length; i++) {
            resultText += event.results[i][0].transcript;
        }
        resultText = resultText.replace(/ /g, "");
        resultP.textContent = resultText;

        // Reset UI and show processing state
        stopRecording();
        setProcessingState(true);

        // Send recognized text to Flask backend
        fetch('/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({text:resultText})
        })
        .then(response => response.json())
        .then(data => {
            if (data.ai_answer) {
                responseP.innerHTML = marked.parse(data.ai_answer);
            } else {
                responseP.textContent = "バックエンド/Flaskからの応答がありません";
            }
        })
        .catch(error => {
            console.error("Error:", error);
            responseP.textContent = "通信エラーが発生しました";
        })
        .finally(() => {
            setProcessingState(false);
        });
    }
    
    // Reset UI if recognition ends without results
    recognition.onend = () => {
        if (isRecording) {
            stopRecording();
        }
    };
    
    // Handle recognition errors
    recognition.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
        stopRecording();
        resultP.textContent = `認識エラー: ${event.error}`;
    };
}
