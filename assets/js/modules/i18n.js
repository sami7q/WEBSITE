import { DEFAULT_LANGUAGE, LANGUAGE_STORAGE_KEY, TRANSLATIONS } from "./i18n-data.js";

const fallbackTexts = new Map();
const fallbackAttrs = new Map();

const isHtmlElement = (element) => element.dataset.i18nHtml === "true";

const isSupportedLanguage = (lang) => {
    if (!lang) {
        return false;
    }

    return lang === DEFAULT_LANGUAGE || Object.prototype.hasOwnProperty.call(TRANSLATIONS, lang);
};

const safeGetStorageValue = () => {
    try {
        return window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    } catch (_error) {
        return null;
    }
};

const getTranslation = (lang, key, fallbackMap) => {
    if (lang !== DEFAULT_LANGUAGE) {
        const dictionary = TRANSLATIONS[lang];
        if (dictionary && Object.prototype.hasOwnProperty.call(dictionary, key)) {
            return dictionary[key];
        }
    }

    return fallbackMap.get(key);
};

const captureFallbacks = () => {
    const textNodes = document.querySelectorAll("[data-i18n-key]");
    textNodes.forEach((element) => {
        const key = element.dataset.i18nKey;
        if (!key || fallbackTexts.has(key)) {
            return;
        }

        const value = isHtmlElement(element) ? element.innerHTML : element.textContent;
        fallbackTexts.set(key, value ?? "");
    });

    const attrNodes = document.querySelectorAll("[data-i18n-attrs]");
    attrNodes.forEach((element) => {
        const mappings = element.dataset.i18nAttrs?.split(",");
        if (!mappings) {
            return;
        }

        mappings
            .map((segment) => segment.trim())
            .filter(Boolean)
            .forEach((segment) => {
                const [attrNameRaw, keyRaw] = segment.split(":");
                const attrName = attrNameRaw?.trim();
                const key = keyRaw?.trim();

                if (!attrName || !key || fallbackAttrs.has(key)) {
                    return;
                }

                const value = element.getAttribute(attrName);
                fallbackAttrs.set(key, value ?? "");
            });
    });
};

const applyTextTranslations = (lang) => {
    const elements = document.querySelectorAll("[data-i18n-key]");
    elements.forEach((element) => {
        const key = element.dataset.i18nKey;
        if (!key) {
            return;
        }

        const translation = getTranslation(lang, key, fallbackTexts);
        if (translation === undefined) {
            return;
        }

        if (isHtmlElement(element)) {
            element.innerHTML = translation;
        } else {
            element.textContent = translation;
        }
    });
};

const applyAttributeTranslations = (lang) => {
    const elements = document.querySelectorAll("[data-i18n-attrs]");
    elements.forEach((element) => {
        const mappings = element.dataset.i18nAttrs?.split(",");
        if (!mappings) {
            return;
        }

        mappings
            .map((segment) => segment.trim())
            .filter(Boolean)
            .forEach((segment) => {
                const [attrNameRaw, keyRaw] = segment.split(":");
                const attrName = attrNameRaw?.trim();
                const key = keyRaw?.trim();

                if (!attrName || !key) {
                    return;
                }

                const translation = getTranslation(lang, key, fallbackAttrs);
                if (translation === undefined) {
                    return;
                }

                element.setAttribute(attrName, translation);
            });
    });
};

const applyTranslations = (lang) => {
    applyTextTranslations(lang);
    applyAttributeTranslations(lang);
};

const resolveInitialLanguage = () => {
    const stored = safeGetStorageValue();
    if (isSupportedLanguage(stored)) {
        return stored;
    }

    const docLang = (document.documentElement.lang || "").toLowerCase();
    const shortLang = docLang.split("-")[0];
    if (isSupportedLanguage(shortLang)) {
        return shortLang;
    }

    return DEFAULT_LANGUAGE;
};

export const initI18n = () => {
    captureFallbacks();
    const initialLanguage = resolveInitialLanguage();
    applyTranslations(initialLanguage);

    document.addEventListener("pl:language-change", (event) => {
        const lang = event.detail?.language;
        if (!isSupportedLanguage(lang)) {
            applyTranslations(DEFAULT_LANGUAGE);
            return;
        }

        applyTranslations(lang);
    });
};
