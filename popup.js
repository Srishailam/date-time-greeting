function getGreeting() {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return "Good Morning! ☀️";
  } else if (hour >= 12 && hour < 17) {
    return "Good Afternoon! 🌤️";
  } else if (hour >= 17 && hour < 21) {
    return "Good Evening! 🌅";
  } else {
    return "Good Night! 🌙";
  }
}

function formatTime(date) {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function updateDisplay() {
  const now = new Date();
  
  const greetingEl = document.getElementById('greeting');
  const timeEl = document.getElementById('time');
  const dateEl = document.getElementById('date');
  
  if (greetingEl) greetingEl.textContent = getGreeting();
  if (timeEl) timeEl.textContent = formatTime(now);
  if (dateEl) dateEl.textContent = formatDate(now);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  updateDisplay();
  const intervalId = setInterval(updateDisplay, 1000);
  
  // Clean up interval when popup is closed
  window.addEventListener('beforeunload', function() {
    clearInterval(intervalId);
  });
});
