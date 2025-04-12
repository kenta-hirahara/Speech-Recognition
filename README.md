# Voice Assistant Web Application 
This app combines local voice processing with cloud-based language model capabilities, creating a seamless voice-to-text-to-response system.

## Architecture overview
1. Local Flask Application
 - Captures user voice input through the browser including chrome, safari and opera
 - Leverages WebSpeechAPI for real-time speech-to-text conversion
 - Sends text to Colab server to undergo LLM inferences
 - Renders final response back to the user

2. Colab Server with FastAPI
 - Exposed to the internet via Ngrok tunneling
 - Receives text input from the local Flask application
 - Processes the input through a large language model (LLM)
 - Returns the response to the local application

## Data Flow
```mermaid
sequenceDiagram
    actor User
    participant Flask as Flask App
    participant WebSpeech as WebSpeech API
    participant Ngrok as Ngrok
    participant FastAPI as FastAPI on Colab
    participant LLM as LLM

    Note over User,WebSpeech: Speech Input Phase
    User->>Flask: Speak into the microphone
    Flask->>WebSpeech: Send speech recognition request
    WebSpeech-->>Flask: Return transcribed text
    Flask->>Flask: Display input text in HTML
    Flask-->>User: Show input text

    Note over Flask,LLM: Backend Processing Phase
    Flask->>Ngrok: POST request with text data
    Ngrok->>FastAPI: Forward request
    FastAPI->>LLM: Send input text
    LLM-->>FastAPI: Generate response text

    Note over Ngrok,User: Response Display Phase
    FastAPI-->>Ngrok: Return JSON response (response text)
    Ngrok-->>Flask: Forward response
    Flask->>Flask: Display response in HTML
    Flask-->>User: Show final response
```

# How to use it

1. After cloning, add the following line to the existing `.env` file.

```
LLM_URL="<ngrok_url_ask_Kenta>"
```

2. Build docker image by running the following command:

```
docker compose build
```

3. Boot the container by doing:

```
docker compose up
```

4. Go to http://localhost:5000.
