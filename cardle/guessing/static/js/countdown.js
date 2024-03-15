document.addEventListener("DOMContentLoaded", function () {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 1);
    targetDate.setHours(0, 0, 0, 0);

    const countdownElement = document.getElementById("countdown");
    setInterval(updateCountdown, 1000);

    function updateCountdown() {
        const currentDate = new Date();
        const timeDifference = targetDate - currentDate;

        if (timeDifference > 0) {
            const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

            const formattedHours = hours < 10 ? `0${hours}` : hours;
            const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
            const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
        
            countdownElement.textContent = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
        
        } else {
            countdownElement.textContent = "It's a new day!";
        }
    }

    updateCountdown();
});