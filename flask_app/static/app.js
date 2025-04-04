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
    const resultP = document.getElementById('result');
    const responseP = document.getElementById('response');

    //start button click event
    startBtn.addEventListener('click', () => {
        recognition.start(); //upon click event, .start() activates the microphone and starts speech recog
    })

    //speech recog results handling
    recognition.onresult = (event) => { //.onresult fires when speech recog successfully detects audio
        let resultText = '';
        for (let i = 0; i < event.results.length; i++) {
            resultText += event.results[i][0].transcript;
        }
        resultText = resultText.replace(/ /g, "");
        resultP.textContent = resultText; // updates the html element to diplay the acquired text

        //send data to flask server
        //fetch() is a javascript func to send data to API or server.
        fetch('/', { //  1st arg of fetch: URL or path you wanna obtain, 2nd: config object
            method: 'POST',
            headers: {'Content-Type': 'application/json'},// in case to send json
            body: JSON.stringify({text:resultText}) //send json data
        })
        .then(response => response.json())  // JSONレスポンスをパース
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
}

