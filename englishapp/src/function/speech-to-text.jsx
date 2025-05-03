export function speechToText(tempResult, finalResult, recognition) {
  // Kiểm tra xem trình duyệt có hỗ trợ SpeechRecognition không
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    console.log("Trình duyệt của bạn không hỗ trợ nhận dạng giọng nói.");
    return;
  }
  let finalTranscript = "";

  // Định nghĩa hàm onresult để xử lý khi nhận được kết quả
  recognition.onresult = (event) => {
    let tempTranscript = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      if (result.isFinal) {
        finalTranscript += result[0].transcript;
        finalResult(finalTranscript);
      } else {
        tempTranscript = finalTranscript + result[0].transcript;
        tempResult(tempTranscript);
      }
    }
  };
  recognition.onend = (event) => {
    finalTranscript = "";
  };
  // Xử lý khi có lỗi
  recognition.onerror = (event) => {
    console.log("Lỗi trong quá trình nhận dạng giọng nói: " + event.error);
  };
}
