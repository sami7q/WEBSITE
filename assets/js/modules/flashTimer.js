const pad = (value) => String(Math.max(0, value)).padStart(2, "0");

const computeTargetDate = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const expiry = new Date(tomorrow);
    expiry.setDate(expiry.getDate() + 7);
    return expiry;
};

const updateDeadlineText = (element, saleEndsAt) => {
    if (!element) {
        return;
    }

    try {
        const formatter = new Intl.DateTimeFormat("ar-IQ", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        });
        element.textContent = formatter.format(saleEndsAt);
    } catch (error) {
        element.textContent = saleEndsAt.toLocaleDateString();
    }
};

export function initFlashTimer() {
    const flashTimer = document.querySelector(".flash-timer");
    if (!flashTimer) {
        return;
    }

    const deadlineElement = document.querySelector("[data-flash-deadline]");
    const unitElements = {
        days: flashTimer.querySelector('[data-unit="days"]'),
        hours: flashTimer.querySelector('[data-unit="hours"]'),
        minutes: flashTimer.querySelector('[data-unit="minutes"]'),
        seconds: flashTimer.querySelector('[data-unit="seconds"]')
    };

    let saleEndsAt = computeTargetDate();
    updateDeadlineText(deadlineElement, saleEndsAt);

    const renderTimer = () => {
        const now = Date.now();
        let diff = saleEndsAt.getTime() - now;

        if (diff <= 0) {
            saleEndsAt = computeTargetDate();
            diff = saleEndsAt.getTime() - now;
            updateDeadlineText(deadlineElement, saleEndsAt);
        }

        const totalSeconds = Math.max(0, Math.floor(diff / 1000));
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (unitElements.days) unitElements.days.textContent = pad(days);
        if (unitElements.hours) unitElements.hours.textContent = pad(hours);
        if (unitElements.minutes) unitElements.minutes.textContent = pad(minutes);
        if (unitElements.seconds) unitElements.seconds.textContent = pad(seconds);
    };

    renderTimer();
    setInterval(renderTimer, 1000);
}
