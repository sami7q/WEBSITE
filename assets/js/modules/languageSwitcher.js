const LANGUAGE_STORAGE_KEY = "preferred_language";
const DEFAULT_LANGUAGE = "ar";

const LANGUAGE_CONFIG = {
    ar: { label: "العربية", code: "AR", dir: "rtl" },
    tr: { label: "Türkçe", code: "TR", dir: "ltr" },
    en: { label: "English", code: "EN", dir: "ltr" }
};

const storage = {
    get() {
        try {
            return window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
        } catch (_error) {
            return null;
        }
    },
    set(value) {
        try {
            window.localStorage.setItem(LANGUAGE_STORAGE_KEY, value);
        } catch (_error) {
            /* ignore persistence errors */
        }
    }
};

const applyDocumentLanguage = (lang) => {
    const config = LANGUAGE_CONFIG[lang] ?? LANGUAGE_CONFIG[DEFAULT_LANGUAGE];
    const { dir } = config;
    const root = document.documentElement;
    root.lang = lang;
    root.dir = dir;
    root.dataset.locale = lang;
    if (document.body) {
        document.body.dir = dir;
        document.body.dataset.locale = lang;
    }
};

const dispatchLanguageChange = (lang) => {
    const config = LANGUAGE_CONFIG[lang] ?? LANGUAGE_CONFIG[DEFAULT_LANGUAGE];
    document.dispatchEvent(
        new CustomEvent("pl:language-change", {
            detail: {
                language: lang,
                direction: config.dir,
                label: config.label
            }
        })
    );
};

export const primeDocumentLanguage = () => {
    const stored = storage.get();
    if (stored && LANGUAGE_CONFIG[stored]) {
        applyDocumentLanguage(stored);
    } else {
        applyDocumentLanguage(DEFAULT_LANGUAGE);
    }
};

export function initLanguageSwitcher({ selector = "[data-language-switcher]" } = {}) {
    const switcher = document.querySelector(selector);

    if (!switcher) {
        return;
    }

    const toggle = switcher.querySelector(".language-switcher__toggle");
    const list = switcher.querySelector(".language-switcher__list");
    const labelEl = switcher.querySelector("[data-language-label]");
    const options = Array.from(switcher.querySelectorAll("[data-language-option]"));

    if (!toggle || !list || !labelEl || !options.length) {
        return;
    }

    const resolveInitialLanguage = () => {
        const stored = storage.get();
        if (stored && LANGUAGE_CONFIG[stored]) {
            return stored;
        }

        const docLang = (document.documentElement.lang || "").toLowerCase();
        const short = docLang.split("-")[0];

        if (short && LANGUAGE_CONFIG[short]) {
            return short;
        }

        return DEFAULT_LANGUAGE;
    };

    let currentLanguage = resolveInitialLanguage();

    const syncOptions = (lang) => {
        options.forEach((option) => {
            const isActive = option.dataset.languageOption === lang;
            option.classList.toggle("is-selected", isActive);
            option.setAttribute("aria-selected", String(isActive));
        });
    };

    const updateUi = (lang) => {
        const config = LANGUAGE_CONFIG[lang] ?? LANGUAGE_CONFIG[DEFAULT_LANGUAGE];
        labelEl.textContent = config.label;
        labelEl.lang = lang;
        labelEl.dir = config.dir;
        toggle.setAttribute("data-current-language", lang);
        toggle.lang = lang;
        toggle.dir = config.dir;
        toggle.setAttribute(
            "aria-label",
            `تغيير اللغة (${config.label})`
        );
    };

    const closePanel = () => {
        if (switcher.dataset.open !== "true") {
            return;
        }

        switcher.dataset.open = "false";
        toggle.setAttribute("aria-expanded", "false");
        list.hidden = true;
    };

    const openPanel = () => {
        switcher.dataset.open = "true";
        toggle.setAttribute("aria-expanded", "true");
        list.hidden = false;
    };

    const focusOption = (lang) => {
        const target = options.find((option) => option.dataset.languageOption === lang);
        target?.focus();
    };

    const setLanguage = (lang, { persist = true } = {}) => {
        if (!LANGUAGE_CONFIG[lang]) {
            lang = DEFAULT_LANGUAGE;
        }

        currentLanguage = lang;
        syncOptions(lang);
        updateUi(lang);
        applyDocumentLanguage(lang);

        if (persist) {
            storage.set(lang);
        }

        dispatchLanguageChange(lang);
        closePanel();
        toggle.focus();
    };

    const moveFocus = (direction) => {
        const currentIndex = options.findIndex((option) => option.dataset.languageOption === currentLanguage);
        const nextIndex = (currentIndex + direction + options.length) % options.length;
        options[nextIndex].focus();
    };

    toggle.addEventListener("click", (event) => {
        event.preventDefault();
        const isOpen = switcher.dataset.open === "true";
        if (isOpen) {
            closePanel();
        } else {
            openPanel();
            focusOption(currentLanguage);
        }
    });

    toggle.addEventListener("keydown", (event) => {
        if (["Enter", " ", "Spacebar", "ArrowDown", "ArrowUp"].includes(event.key)) {
            event.preventDefault();
            if (switcher.dataset.open !== "true") {
                openPanel();
            }

            if (event.key === "ArrowUp") {
                moveFocus(-1);
            } else {
                focusOption(currentLanguage);
            }
        } else if (event.key === "Escape") {
            closePanel();
        }
    });

    options.forEach((option) => {
        option.addEventListener("click", () => {
            const lang = option.dataset.languageOption;
            setLanguage(lang);
        });

        option.addEventListener("keydown", (event) => {
            if (event.key === "ArrowDown") {
                event.preventDefault();
                moveFocus(1);
            } else if (event.key === "ArrowUp") {
                event.preventDefault();
                moveFocus(-1);
            } else if (event.key === "Home") {
                event.preventDefault();
                options[0]?.focus();
            } else if (event.key === "End") {
                event.preventDefault();
                options[options.length - 1]?.focus();
            } else if (event.key === "Escape") {
                event.preventDefault();
                closePanel();
                toggle.focus();
            } else if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                const lang = option.dataset.languageOption;
                setLanguage(lang);
            }
        });
    });

    document.addEventListener("click", (event) => {
        if (!switcher.contains(event.target)) {
            closePanel();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closePanel();
        }
    });

    list.hidden = true;
    syncOptions(currentLanguage);
    updateUi(currentLanguage);
    applyDocumentLanguage(currentLanguage);
}
