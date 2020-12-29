// variables for HTML elements.
let audioElement = document.getElementById('audio');
let recordButton = document.getElementById('record-button');
let stopButton = document.getElementById('stop-button');
let errorDiv = document.getElementById('error');
stopButton.disabled = true;

// an array to hold all the recordings
let trunks = [];
// a recorder variable 
let recorder = null;

//wait for the user's response before continue with the recording process.
//--> create an async function to use await.
const main = async () => {
    try{
        //returns a media stream
        let stream = await navigator.mediaDevices.getUserMedia({ audio: true }); 
        console.log(stream);
        // Create a mediaRecorder object and assign it to our recorder variable.
        recorder = new MediaRecorder(stream);

        // Add event listerer to record button and stop button
        recordButton.addEventListener("click", startRecording);
        stopButton.addEventListener("click", stopRecording);

        //when data is available --> run saveCurrentRecording
        recorder.ondataavailable = saveCurrentRecording;

        //each time the recorder is stopped, run sendToMediaPlayer function
        recorder.onstop = sendToMediaPlayer;
    }
    catch(error){
        console.log(error);
        if(error.name === 'NotAllowedError'){
            errorDiv.innerHTML = 'Oops, we needed permission';
        }
    }
};

const startRecording = () => {
    recorder.start();
    recordButton.innerHTML = "Recording"
    recordButton.disabled = true;
    stopButton.disabled = false;
}
const stopRecording = () => {
    recorder.stop();
    recordButton.disabled = false;
    recordButton.innerHTML = "Record";
    stopButton.disabled = true;
}

// Whenever data is available, the recording data will be pushed to the chunks array.
const saveCurrentRecording = (event) =>{
    trunks.push(event.data);
    console.log(trunks);
}
//take the recordings and merge them into an audio file for the media player to play.
const sendToMediaPlayer = () => {
	const blob = new Blob(trunks, {
		type: 'audio/mp4; codecs=opus',
	});
	const url = URL.createObjectURL(blob);
	audioElement.setAttribute('src', url);

	//clear the recorded chunks if preferred
	// chunks = [];
};


main();