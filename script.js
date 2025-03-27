const knob = document.getElementById('knob');
const valueDisplay = document.getElementById('valueDisplay');
const wrapper = document.querySelector('.knob-wrapper');
const fillLine = document.getElementById('fillLine');


let isDragging = false;
let lastAngle = 0;
let currentRotation = 0;

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
const sensitivity = 1;
const sweepAngle = 150+150; // діапазон обертання
const minAngle = 180+30;

const getAngle = (x, y, cx, cy) =>
  Math.atan2(y - cy, x - cx) * (180 / Math.PI);

wrapper.addEventListener('touchstart', (e) => {
    isDragging = true;
  
    const touch = e.touches[0];
    const rect = knob.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    lastAngle = getAngle(touch.clientX, touch.clientY, cx, cy);
  
    e.preventDefault(); // щоб не скролився екран
  }, { passive: false });
  

document.addEventListener('mouseup', () => {
  isDragging = false;
});

document.addEventListener('touchend', () => {
    isDragging = false;
  });
  

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;

  if (window.getSelection().toString().length > 0) return;

  const rect = knob.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const angle = getAngle(e.clientX, e.clientY, cx, cy);

  let delta = angle - lastAngle;

  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;

  currentRotation += delta * sensitivity;
  currentRotation = clamp(currentRotation, 0, sweepAngle);

  const percentage = Math.round((currentRotation / sweepAngle) * 100);
  const visualRotation = minAngle + currentRotation;

  knob.style.transform = `rotate(${visualRotation}deg)`;
  valueDisplay.textContent = `${percentage}%`;
  fillLine.style.width = `${percentage}%`;
  localStorage.setItem('knobRotation', currentRotation);



  lastAngle = angle;
});

document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
  
    if (window.getSelection().toString().length > 0) return;
  
    const touch = e.touches[0];
    const rect = knob.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
  
    const angle = getAngle(touch.clientX, touch.clientY, cx, cy);
    let delta = angle - lastAngle;
  
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
  
    currentRotation += delta * sensitivity;
    currentRotation = clamp(currentRotation, 0, sweepAngle);
  
    const percentage = Math.round((currentRotation / sweepAngle) * 100);
    const visualRotation = minAngle + currentRotation;
  
    knob.style.transform = `rotate(${visualRotation}deg)`;
    valueDisplay.textContent = `${percentage}%`;
    fillLine.style.width = `${percentage}%`;
    localStorage.setItem('knobRotation', currentRotation);

  
    lastAngle = angle;
  }, { passive: false });  

knob.addEventListener('mousedown', (e) => {
    isDragging = true;
  
    const rect = knob.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    lastAngle = getAngle(e.clientX, e.clientY, centerX, centerY);
  });




// Ініціалізація при завантаженні
window.addEventListener('DOMContentLoaded', () => {
  let savedRotation = parseFloat(localStorage.getItem('knobRotation'));
  if (!isNaN(savedRotation)) {
    currentRotation = clamp(savedRotation, 0, sweepAngle);
  } else {
    currentRotation = 0;
  }

  const percentage = Math.round((currentRotation / sweepAngle) * 100);
  const visualRotation = minAngle + currentRotation;

  knob.style.transition = 'none';
  knob.style.transform = `rotate(${visualRotation}deg)`;
  valueDisplay.textContent = `${percentage}%`;
  fillLine.style.transition = 'none'; // ⛔️ не анімуємо при старті
  void knob.offsetWidth; // Форсує застосування стилів
  fillLine.style.width = `${percentage}%`;

 // ✅ потім вмикаємо плавність для наступних змін
requestAnimationFrame(() => {
  fillLine.style.transition = 'width 0.3s ease';
  knob.style.transition = 'transform 0.25s ease-out';
  document.querySelector('.knob-wrapper').style.opacity = '1';
  document.querySelector('.progress-line').style.opacity = '1';
});
});


  

