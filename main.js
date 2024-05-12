document.addEventListener("DOMContentLoaded", function () {
  const chatIcon = document.getElementById("chat-icon");
  const chatColumn = document.getElementById("chat-column");
  const closeBtn = document.getElementById("close-btn");
  const chatContent = document.querySelector(".chat-content");
  const searchForm = document.getElementById("bot-form");
  const searchInput = searchForm.querySelector('input[name="a"]');
  const voiceBtn = document.getElementById("voice-btn");
  const searchFormInput = searchForm.querySelector("input");


  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if(SpeechRecognition) {
    console.log("Your Browser supports speech Recognition");
    
    const recognition = new SpeechRecognition();
    recognition.continuous = true;

    searchForm.insertAdjacentHTML("beforeend", '<button type="button"><i class="fas fa-microphone"></i></button>');
    searchFormInput.style.paddingRight = "50px";

    const micBtn = searchForm.querySelector("button");
    const micIcon = micBtn.firstElementChild;

    micBtn.addEventListener("click", micBtnClick);
    function micBtnClick() {
      if(micIcon.classList.contains("fa-microphone")) {
        recognition.start(); 
      }
      else {
        recognition.stop();
      }
    }

    recognition.addEventListener("start", startSpeechRecognition); 
    function startSpeechRecognition() {
      micIcon.classList.remove("fa-microphone");
      micIcon.classList.add("fa-microphone-slash");
      searchFormInput.focus();
      console.log("Voice activated, SPEAK");
    }

    recognition.addEventListener("end", endSpeechRecognition); 
    function endSpeechRecognition() {
      micIcon.classList.remove("fa-microphone-slash");
      micIcon.classList.add("fa-microphone");
      searchFormInput.focus();
      console.log("Speech recognition service disconnected");
    }

    recognition.addEventListener("result", resultOfSpeechRecognition); 
    function resultOfSpeechRecognition(event) {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      
      if(transcript.toLowerCase().trim()==="stop recording") {
        recognition.stop();
      }
      else {
        searchFormInput.value = transcript; // Update the value of the input with the transcript
      }
    }
  }
  else {
    console.log("Your Browser does not support speech Recognition");
    info.textContent = "Your Browser does not support Speech Recognition";
  }



  chatIcon.addEventListener("click", function () {
     chatColumn.style.display = "block";
  });

  closeBtn.addEventListener("click", function () {
     chatColumn.style.display = "none";
  });

  const data = {
     intents: [
        {
           tag: "greeting",
           patterns: ["Hi", "Hello", "Hey"],
           responses: [
              "Hello!",
              "Hi there!",
              "Hey! How can I assist you today?",
           ],
        },
        {
           tag: "goodbye",
           patterns: ["Bye", "Goodbye", "See you later"],
           responses: ["Goodbye!", "Take care!", "See you soon!"],
        },
        {
          tag: "web",
          patterns: ["what website is this?", "What was this website created for?", "what year was this website created?", "Who are you?", "what can we do using this website?"],
          responses: ["This is a web search engine using speech recognition", "This website was created because of an AI course project", "since 2024", "I am a chatbot created by group 5", "You can search for something using the mic"],
       },
       {
        tag: "thanks",
        patterns: ["Thank you", "Thanks", "Much appreciated"],
        responses: ["You're welcome!", "Glad I could help!", "Anytime!"],
      }
     ],
  };

  searchForm.addEventListener("submit", function (event) {
     event.preventDefault();
     const message = searchInput.value.trim();
     const response = getResponse(data.intents, message);
     console.log(response);
     displayMessage(response);
     searchInput.value = "";
  });

  searchInput.addEventListener("keypress", function (event) {
     if (event.key === "Enter") {
        event.preventDefault();
        const message = searchInput.value.trim();
        const response = getResponse(data.intents, message);
        displayMessage(response);
        searchInput.value = "";
     }
  });

  // Basic string search algorithm
function searchString(message, patterns) {
  const processedMessage = preprocessMessage(message);
  for (const pattern of patterns) {
      const processedPattern = preprocessMessage(pattern);
      if (processedMessage.includes(processedPattern)) {
          return true;
      }
  }
  return false;
}

// Update the getResponse function to use the searchString algorithm
function getResponse(intents, message) {
  for (const intent of intents) {
      if (searchString(message, intent.patterns)) {
          return intent.responses[
              Math.floor(Math.random() * intent.responses.length)
          ];
      }
  }
  return "Sorry, I didn't understand that.";
}


  // NLP Preprocessing Function
  function preprocessMessage(message) {
     // You can implement more sophisticated NLP preprocessing techniques here
     return message.toLowerCase();
  }

  function displayMessage(message) {
     const chatBubble = document.createElement("div");
     chatBubble.classList.add("chat-bubble");
     chatBubble.textContent = message;
     chatContent.appendChild(chatBubble);
  }
});

// Voice Recognition Part
const searchForm = document.querySelector("#search-form");
const searchFormInput = searchForm.querySelector("input");
const info = document.querySelector(".info");

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if(SpeechRecognition) {
  console.log("Your Browser supports speech Recognition");
  
  const recognition = new SpeechRecognition();
  recognition.continuous = true;

  searchForm.insertAdjacentHTML("beforeend", '<button type="button"><i class="fas fa-microphone"></i></button>');
  searchFormInput.style.paddingRight = "50px";

  const micBtn = searchForm.querySelector("button");
  const micIcon = micBtn.firstElementChild;

  micBtn.addEventListener("click", micBtnClick);
  function micBtnClick() {
    if(micIcon.classList.contains("fa-microphone")) {
      recognition.start(); 
    }
    else {
      recognition.stop();
    }
  }

  recognition.addEventListener("start", startSpeechRecognition); 
  function startSpeechRecognition() {
    micIcon.classList.remove("fa-microphone");
    micIcon.classList.add("fa-microphone-slash");
    searchFormInput.focus();
    console.log("Voice activated, SPEAK");
  }

  recognition.addEventListener("end", endSpeechRecognition); 
  function endSpeechRecognition() {
    micIcon.classList.remove("fa-microphone-slash");
    micIcon.classList.add("fa-microphone");
    searchFormInput.focus();
    console.log("Speech recognition service disconnected");
  }

  recognition.addEventListener("result", resultOfSpeechRecognition); 
  function resultOfSpeechRecognition(event) {
    const current = event.resultIndex;
    const transcript = event.results[current][0].transcript;
    
    if(transcript.toLowerCase().trim()==="stop recording") {
      recognition.stop();
    }
    else if(!searchFormInput.value) {
      searchFormInput.value = transcript;
    }
    else {
      if(transcript.toLowerCase().trim()==="go") {
        searchForm.submit();
      }
      else if(transcript.toLowerCase().trim()==="reset input") {
        searchFormInput.value = "";
      }
      else {
        searchFormInput.value = transcript;
      }
    }
  }
  
  info.textContent = 'Voice Commands: "stop recording", "reset input", "go"';
  
}
else {
  console.log("Your Browser does not support speech Recognition");
  info.textContent = "Your Browser does not support Speech Recognition";
}
