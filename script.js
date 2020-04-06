const pomodoroTimer = document.querySelector('#pomodoro-timer');

const startButton = document.querySelector('#pomodoro-start');
const pauseButton = document.querySelector('#pomodoro-pause');
const stopButton = document.querySelector('#pomodoro-stop');


let isClockRunning = false;
// in seconds = 25 mins
let workSessionDuration = 1500;
let currentTimeLeftInSession = 1500;
// in seconds = 5 mins;
let breakSessionDuration = 300;
let type = 'Work';
let timeSpentInCurrentSession = 0;

// START
startButton.addEventListener('click', () => {
  toggleClock();
})

// PAUSE
pauseButton.addEventListener('click', () => {
  toggleClock();
})

stopButton.addEventListener('click', () => {
  toggleClock(true);
})



const toggleClock = (reset) => {
  if (reset) {
    // STOP THE TIMER
    stopClock();
  } else {
    if (isClockRunning === true) {
      // PAUSE THE TIMER
      isClockRunning = false;
      clearInterval(clockTimer);
    } else {
      // START THE TIMER
      isClockRunning = true;
      clockTimer = setInterval(() => {
        // decrease time left / increase time spent
        currentTimeLeftInSession--;
        // displayCurrentTimeLeftInSession();
        stepDown();
    }, 1000)
    }
  }
}

const displayCurrentTimeLeftInSession = () => {
  const secondsLeft = currentTimeLeftInSession;
  let result = '';
  const seconds = secondsLeft % 60;
  const minutes = parseInt(secondsLeft / 60) % 60;
  let hours = parseInt(secondsLeft / 3600);
  // add leading zeroes if it's less than 10
  function addLeadingZeroes(time) {
    return time < 10 ? `0${time}` : time
  }
  if (hours > 0) result += `${hours}:`
  result += `${addLeadingZeroes(minutes)}:${addLeadingZeroes(seconds)}`
  pomodoroTimer.innerText = result.toString();
}

const stopClock = () => {
  // 1) reset the timer we set
  displaySessionLog(type);
  clearInterval(clockTimer);
  // 2) update our variable to know that the timer is stopped
  isClockRunning = false;
  // reset the time left in the session to its original state
  currentTimeLeftInSession = workSessionDuration;
  // update the timer displayed
  displayCurrentTimeLeftInSession();
  timeSpentInCurrentSession = 0;
  type = type === 'Work' ? 'Break' : 'Work';
}

const stepDown = () => {
  if (currentTimeLeftInSession > 0) {
    // decrease time left / increase time spent
    currentTimeLeftInSession--;
    timeSpentInCurrentSession++;
    } else if (currentTimeLeftInSession === 0) {
      // Timer is over -> if work switch to break, viceversa
      timeSpentInCurrentSession = 0;
      if (type === 'Work') {
        currentTimeLeftInSession = breakSessionDuration;
        displaySessionLog('Work');
        type = 'Break';
      } else {
        currentTimeLeftInSession = workSessionDuration;
        type = 'Work';
        displaySessionLog('Break');
      }
    }
    displayCurrentTimeLeftInSession();
  }

  const displaySessionLog = (type) => {
    const sessionsList = document.querySelector('#pomodoro-sessions');
    // append li to it
    const li = document.createElement('li');
    let sessionLabel = type;
    let elapsedTime = parseInt(timeSpentInCurrentSession / 60)
    elapsedTime = elapsedTime > 0 ? elapsedTime : '< 1';
  
    const text = document.createTextNode(
      `${sessionLabel} : ${elapsedTime} min`
    )
    li.appendChild(text);
  sessionsList.appendChild(li);
}