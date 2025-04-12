# Speech Recognition Web App

Simple web app where you can talk to then receive immediate text response.

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
    Flask->>User: Show input text

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
OPENAI_API_KEY="<your-openai-api-key>"
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
