const formatValue = (value, locale) => {
    try {
        return Number(value).toLocaleString(locale || "en-US");
    } catch (error) {
        return String(Math.trunc(value));
    }
};

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

const animateCounter = (element) => {
    const start = Number(element.dataset.counterStart ?? 0);
    const end = Number(element.dataset.counterEnd ?? start);
    const duration = Number(element.dataset.counterDuration ?? 2400);
    const prefix = element.dataset.counterPrefix ?? "";
    const suffix = element.dataset.counterSuffix ?? "";
    const locale = element.dataset.counterLocale;

    const distance = end - start;
    if (!Number.isFinite(distance) || duration <= 0 || distance === 0) {
        element.textContent = `${prefix}${formatValue(end, locale)}${suffix}`;
        return;
    }

    let startTime;

    const step = (timestamp) => {
        if (!startTime) {
            startTime = timestamp;
        }
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const eased = easeOutCubic(progress);
        const currentValue = start + distance * eased;
        const value = distance > 0 ? Math.floor(currentValue) : Math.ceil(currentValue);
        element.textContent = `${prefix}${formatValue(value, locale)}${suffix}`;

        if (progress < 1) {
            requestAnimationFrame(step);
        }
    };

    element.textContent = `${prefix}${formatValue(start, locale)}${suffix}`;
    requestAnimationFrame(step);
};

export function initCounters() {
    const counters = document.querySelectorAll("[data-counter-end]");
    if (!counters.length) {
        return;
    }

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.4 }
    );

    counters.forEach((counter) => {
        observer.observe(counter);
    });
}
