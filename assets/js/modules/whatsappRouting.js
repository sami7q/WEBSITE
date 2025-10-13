const TURKISH_PHONE = "905365015715";
const IRAQI_PHONE = "9647886523889";
const TURKISH_URL = `https://wa.me/${TURKISH_PHONE}`;
const IRAQI_URL = `https://wa.me/${IRAQI_PHONE}`;
const LANGUAGE_STORAGE_KEY = "preferred_language";
const CURRENCY_STORAGE_KEY = "preferred_currency";
const WHATSAPP_LINK_SELECTOR = 'a[href*="wa.me/"]';

const safeGetStorage = (key) => {
    try {
        return window.localStorage.getItem(key);
    } catch (_error) {
        return null;
    }
};

const resolveLanguage = () => {
    const stored = (safeGetStorage(LANGUAGE_STORAGE_KEY) || "").toLowerCase();
    if (stored) {
        return stored;
    }

    const docLang = (document.documentElement.lang || "ar").toLowerCase();
    return docLang.split("-")[0];
};

const resolveCurrency = () => {
    const stored = safeGetStorage(CURRENCY_STORAGE_KEY);
    return (stored || "IQD").toUpperCase();
};

export const getWhatsappUrl = () => {
    const language = resolveLanguage();
    const currency = resolveCurrency();

    if (language.startsWith("tr") || currency === "TL") {
        return TURKISH_URL;
    }

    return IRAQI_URL;
};

const updateWhatsappLinks = () => {
    const targetUrl = getWhatsappUrl();

    document.querySelectorAll(WHATSAPP_LINK_SELECTOR).forEach((anchor) => {
        anchor.setAttribute("href", targetUrl);
        anchor.dataset.whatsappLink = targetUrl;
    });
};

export function initWhatsappRouting() {
    updateWhatsappLinks();

    document.addEventListener("pl:language-change", updateWhatsappLinks);
    document.addEventListener("pl:currency-change", updateWhatsappLinks);

    document.addEventListener(
        "click",
        (event) => {
            const anchor = event.target.closest(WHATSAPP_LINK_SELECTOR);
            if (!anchor) {
                return;
            }

            const targetUrl = getWhatsappUrl();
            if (anchor.getAttribute("href") !== targetUrl) {
                anchor.setAttribute("href", targetUrl);
                anchor.dataset.whatsappLink = targetUrl;
            }
        },
        true
    );
}
