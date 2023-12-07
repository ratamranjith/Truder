function updateClock(clockId) {
  const now = new Date();
  // Add 5 hours and 30 minutes to the current time
  const offsetTime = new Date(now.getTime() + 5 * 60 * 60 * 1000 + 30 * 60 * 1000);

  const hour = offsetTime.getHours() % 12;
  const minute = offsetTime.getMinutes();
  const second = offsetTime.getSeconds();

  const clock = document.querySelector(`.clock${clockId}`);
  
  if (!clock) {
    console.error(`Clock with ID ${clockId} not found.`);
    return;
  }

  const hourHand = clock.querySelector(`#hour${clockId}`);
  const minuteHand = clock.querySelector(`#minute${clockId}`);
  const secondHand = clock.querySelector(`#second${clockId}`);

  if (!hourHand || !minuteHand || !secondHand) {
    console.error(`Clock hands not found for clock with ID ${clockId}.`);
    return;
  }

  const hourRotation = (hour * 30) + (0.5 * minute); // 30 degrees per hour, 0.5 degrees per minute
  const minuteRotation = (minute * 6) + (0.1 * second); // 6 degrees per minute, 0.1 degrees per second
  const secondRotation = second * 6; // 6 degrees per second

  hourHand.style.transform = `rotate(${hourRotation}deg)`;
  minuteHand.style.transform = `rotate(${minuteRotation}deg)`;
  secondHand.style.transform = `rotate(${secondRotation}deg)`;
}

setInterval(() => {
  updateClock(1); // Update clock 1
  updateClock(2); // Update clock 2
  updateClock(3); // Update clock 3
}, 1000);

// Initial update
updateClock(1);
updateClock(2);
updateClock(3);
