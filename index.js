// alert('В консоли указал те пункты, что смог сделать (не все) для удобства проверяющего.');
console.log('Выполнены первые 6 пунктов:\n1. Часы и календарь (+15);\n2. Приветствие (+10);\n3. Смена фонового изображения (+20);\n4. Виджет погоды (+15);\n5. Виджет цитат дня (+10);\n6. Аудиоплеер (+15).\nИтого: 85 баллов из 150.');

/* Приветствие */

const getTimeOfDay = () => {
  let timeOfDay = '';
  const hours = new Date().getHours();
  if (hours >= 0 & hours <= 5) {
    timeOfDay = 'Доброй ночи';
  } else if (hours >= 6 & hours <= 11) {
    timeOfDay = 'Доброе утро';
  } else if (hours >= 12 & hours <= 17) {
    timeOfDay = 'Добрый день';
  } else {
    timeOfDay = 'Добрый вечер';
  }
  return timeOfDay;
};

const showGreeting = () => {
  const greeting = document.querySelector('.greeting');
  greeting.textContent = getTimeOfDay();
};


/* Часы и календарь*/

const showDate = () => {
  const date = document.querySelector('.date');
  const dateOptions = {timeZone: 'UTC', weekday: 'long', month: 'long', day: 'numeric'};
  const currentDate = new Date().toLocaleDateString('ru-RU', dateOptions);
  date.textContent = `${currentDate.charAt(0).toUpperCase()}${currentDate.slice(1)}`;
};

const showTime = () => {
  const time = document.querySelector('.time');
  const currentTime = new Date().toLocaleTimeString();
  time.textContent = currentTime;
  showDate();
  showGreeting();
  setTimeout(showTime, 1000);
};

showTime();



/* Фоновое изображение */

const getEngNameDay = () => {
  let engNameDay = '';
  if (getTimeOfDay() === 'Доброе утро') {
    engNameDay = 'morning';
    return engNameDay;
  } else if (getTimeOfDay() === 'Добрый день') {
    engNameDay = 'afternoon';
    return engNameDay;
  } else if (getTimeOfDay() === 'Добрый вечер') {
    engNameDay = 'evening';
    return engNameDay;
  } else {
    engNameDay = 'night';
    return engNameDay;
  }
};

const getStringNum = (number) => {
  let strNum = '';
  if (number < 10) {
    strNum = number.toString(10).padStart(2, "0"); 
  } else {
    strNum = `${number}`;
  }
  return strNum;
};

const getImgNum = () => {
  const min = Math.ceil(1);
  const max = Math.floor(20);
  const num =  Math.floor(Math.random() * (max - min + 1)) + min;
  return getStringNum(num);
};

const body = document.body;
const imgDay = getEngNameDay();
let imgNum = getImgNum();

const setBg = () => {
  const img = new Image();
  img.src = `https://raw.githubusercontent.com/Dektarion/img/main/image/${imgDay}/${imgNum}.webp`;
  img.onload = () => {
    body.style.backgroundImage = `url('https://raw.githubusercontent.com/Dektarion/img/main/image/${imgDay}/${imgNum}.webp')`;
  };
};

// const setBg = () => {
//   body.style.backgroundImage = `url('https://raw.githubusercontent.com/Dektarion/img/main/image/${imgDay}/${imgNum}.webp')`;
// };

setBg();

let currentImgNum = +imgNum;

const getSlideNext = () => {
  if (currentImgNum < 20) {
    currentImgNum++;
    imgNum = getStringNum(currentImgNum);
    setBg();
  } else if (currentImgNum === 20) {
    currentImgNum = 1;
    imgNum = getStringNum(currentImgNum);
    setBg();
  }
};

const getSlidePrev = () => {
  if (currentImgNum > 1) {
    currentImgNum--;
    imgNum = getStringNum(currentImgNum);
    setBg();
  } else if (currentImgNum === 1) {
    currentImgNum = 20;
    imgNum = getStringNum(currentImgNum);
    setBg();
  }
};

const slideNext = document.querySelector('.slide-next');
const slidePrev = document.querySelector('.slide-prev');

slideNext.addEventListener('click', getSlideNext);
slidePrev.addEventListener('click', getSlidePrev);

/* Погода */

const city = document.querySelector('.city');
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
const weatherError = document.querySelector('.weather-error');

async function getWeather() {  
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=ru&appid=fd6dcf80b1036686cf550f4a2572b025&units=metric`;
  const res = await fetch(url);
  const data = await res.json(); 

  if (data.cod === '404' || data.cod === '400') {
    weatherIcon.className = 'weather-icon owf';
    temperature.textContent = '';
    weatherDescription.textContent = '';
    wind.textContent = '';
    humidity.textContent = '';
    weatherError.textContent = 'Указан некорректный город';
  } else {
  weatherIcon.className = 'weather-icon owf';
  weatherError.textContent = '';
  weatherIcon.classList.add(`owf-${data.weather[0].id}`);
  temperature.textContent = `${Math.round(data.main.temp)}°C`;
  weatherDescription.textContent = data.weather[0].description;
  wind.textContent = `Скорость ветра: ${Math.round(data.wind.speed)} м/с`;
  humidity.textContent = `Влажность: ${data.main.humidity}%`;
  }
}

const setCity = (event) => {
  if (event.code === 'Enter') {
    getWeather();
    city.blur();
  }
};

document.addEventListener('DOMContentLoaded', getWeather);
city.addEventListener('keypress', setCity);

/* Сохранение имени пользователя и города */

const name = document.querySelector('.name');

const setLocalStorage = () => {
  localStorage.setItem('name', name.value);
  localStorage.setItem('city', city.value);
};

window.addEventListener('beforeunload', setLocalStorage);

const getLocalStorage = () => {
  if(localStorage.getItem('name')) {
    name.value = localStorage.getItem('name');
  }
  if (localStorage.getItem('city')) {
    city.value = localStorage.getItem('city');
  }
};

window.addEventListener('load', getLocalStorage);

// localStorage.clear();

/* Цитаты */

const quotes = 'quotes.json';
const quote = document.querySelector('.quote');
const author = document.querySelector('.author');
const quoteRefreshButton = document.querySelector('.change-quote');


const getQuotesNum = () => {
  const min = Math.ceil(0);
  const max = Math.floor(9);
  const num =  Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
};

async function getQuotes() {  
  let randomQuotesNum = getQuotesNum();
  const res = await fetch(quotes);
  const data = await res.json(); 
  quote.textContent = data[randomQuotesNum].text;
  author.textContent = data[randomQuotesNum].author;
}

quoteRefreshButton.addEventListener('click', getQuotes);
window.addEventListener('load', getQuotes);


/* Аудиоплеер */

import playList from './playList.js';
let playNum = 0;

let isPlay = false;
const audioButton = document.querySelector('.play');
const audioPrev = document.querySelector('.play-prev');
const audioNext = document.querySelector('.play-next');
const playListContainer = document.querySelector('.play-list');

playList.forEach(element => {
  const li = document.createElement('li');
  li.classList.add('play-item');
  li.textContent = element.title;
  playListContainer.append(li);
});

const playListName = document.querySelectorAll('.play-item');

const audio = new Audio();
let currentAudioTime = 0;

const playAudio = () => {
  if (!isPlay) {
    audio.src = playList[playNum].src;
    audio.currentTime = currentAudioTime;
    audio.play();
    isPlay = true;
    audioButton.classList.toggle('pause');
    playListName[playNum].classList.add('item-active');
  } else {
    audio.pause();
    currentAudioTime = audio.currentTime;
    isPlay = false;
    audioButton.classList.toggle('pause');
  }
};

audioButton.addEventListener('click', playAudio);

const playNext = () => {
  currentAudioTime = 0;
  isPlay = false;
  audioButton.classList.remove('pause');
  playListName[playNum].classList.remove('item-active');
  if (playNum < 3) {
    playNum++;
    playAudio();
  } else if (playNum === 3) {
    playNum = 0;
    playAudio();
  }
};

const playPrev = () => {
  currentAudioTime = 0;
  isPlay = false;
  audioButton.classList.remove('pause');
  playListName[playNum].classList.remove('item-active');
  if (playNum > 0) {
    playNum--;
    playAudio();
  } else if (playNum === 0) {
    playNum = 3;
    playAudio();
  }
};

audio.addEventListener('ended', playNext);
audioPrev.addEventListener('click', playPrev);
audioNext.addEventListener('click', playNext);
