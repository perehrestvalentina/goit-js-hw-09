import { Notify } from 'notiflix/build/notiflix-notify-aio';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
require('flatpickr/dist/themes/material_blue.css');


const refs = {
    input: document.querySelector('#datetime-picker'),
    startBtn: document.querySelector('[data-start]'),
    days: document.querySelector('[data-days]'),
    hours: document.querySelector('[data-hours]'),
    minutes: document.querySelector('[data-minutes]'),
    seconds: document.querySelector('[data-seconds]'),
  };


refs.startBtn.disabled = false;

function convertMs(ms) {
    // Number of milliseconds per unit of time
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
  
    // Remaining days
    const days = Math.floor(ms / day);
    // Remaining hours
    const hours = Math.floor((ms % day) / hour);
    // Remaining minutes
    const minutes = Math.floor(((ms % day) % hour) / minute);
    // Remaining seconds
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);
  
    return { days, hours, minutes, seconds };
  }

function addLeadingZero(value) {
    return String(value).padStart(2, '0');
  }
let selectedDate = null;
const optionsFlatpickr = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  selectedDate: null,
  onClose(selectedDates) {
    selectedDate = selectedDates[0].getTime();
    const deltaDate = selectedDate - Date.now();
    if (deltaDate <= 0) {
      return Notify.failure('Please choose a date in the future! Do not look back..');
    }
  },
};
flatpickr(refs.input, optionsFlatpickr); 
console.log(selectedDate);

refs.startBtn.addEventListener('click', () => {
    refs.startBtn.disabled = true;
    refs.input.disabled = true;
    Notify.info('Відлік почато');
    let intervalId = setInterval(() => {
      const deltaTime = selectedDate - Date.now();
      if (deltaTime <= 500) {
        clearInterval(intervalId);
        return Notify.success('Відлік закінчено');
      }
      const reverseTimer = convertMs(deltaTime);
      refs.days.textContent = addLeadingZero(reverseTimer.days);
      refs.hours.textContent = addLeadingZero(reverseTimer.hours);
      refs.minutes.textContent = addLeadingZero(reverseTimer.minutes);
      refs.seconds.textContent = addLeadingZero(reverseTimer.seconds);
    }, 1000);
  });

   