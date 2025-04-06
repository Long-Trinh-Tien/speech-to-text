
export function speechToText(tempResult,finalResult) {
      // Kiểm tra xem trình duyệt có hỗ trợ SpeechRecognition không
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        reject('Trình duyệt của bạn không hỗ trợ nhận dạng giọng nói.');
        return;
      }
      // Tạo đối tượng SpeechRecognition
      const recognition = new SpeechRecognition();
      //recognition.lang = 'vi-VN'; // Đặt ngôn ngữ nhận dạng
      recognition.lang = 'en-US'; // Đặt ngôn ngữ nhận diện thành tiếng Anh Mỹ
      recognition.continuous = false; // Nhận dạng một lần
      recognition.interimResults = true; // Không trả về kết quả tạm thời
  
      let finalTranscript = '';

      // Xử lý khi nhận được kết quả
      recognition.onresult = (event) => {
        let tempTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++)
        {
            const result = event.results[i];
            if(result.isFinal)
            {
                finalTranscript = result[0].transcript;
                finalResult(finalTranscript);
            }
            else{
                tempTranscript = result[0].transcript;
                tempResult(tempTranscript);
            }
        }
       
      };
  
      // Xử lý khi có lỗi
      recognition.onerror = (event) => {
        console.log('Lỗi trong quá trình nhận dạng giọng nói: ' + event.error);
      };
  
      // Bắt đầu nhận dạng
      recognition.start();
    };
  