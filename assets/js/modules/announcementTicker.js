const SWITCH_DELAY = 3400;
const FADE_DURATION = 220;

const parsePhrases = (ticker) => {
    const phrasesAttr = ticker.dataset.phrases || "";
    return phrasesAttr
        .split(",")
        .map((phrase) => phrase.trim())
        .filter(Boolean);
};

const cyclePhrases = (ticker, phrases) => {
    if (!phrases.length) {
        return;
    }

    let index = 0;
    ticker.textContent = phrases[index];
    ticker.classList.add("is-visible");
    index = (index + 1) % phrases.length;

    setInterval(() => {
        ticker.classList.remove("is-visible");
        setTimeout(() => {
            ticker.textContent = phrases[index];
            ticker.classList.add("is-visible");
            index = (index + 1) % phrases.length;
        }, FADE_DURATION);
    }, SWITCH_DELAY);
};

export function initAnnouncementTicker() {
    const tickers = document.querySelectorAll(".announcement__ticker");
    if (!tickers.length) {
        return;
    }

    tickers.forEach((ticker) => {
        const phrases = parsePhrases(ticker);
        cyclePhrases(ticker, phrases);
    });
}
