import { DEFAULT_LANGUAGE, LANGUAGE_STORAGE_KEY, TRANSLATIONS } from "./i18n-data.js";
import { getWhatsappUrl } from "./whatsappRouting.js";

const PAGE_KEY_MAP = {
    "": "index",
    "index.html": "index",
    "subscriptions.html": "subscriptions",
    "accounts.html": "accounts",
    "offers.html": "offers",
    "purchase.html": "purchase"
};

const MOBILE_BREAKPOINT = 960;

const ORDER_KEY = "header.cta.order";
const ORDER_FALLBACK = "اطلب الآن";
const STEPS_KEY = "header.cta.steps";
const STEPS_FALLBACK = "ابدأ الآن";

const safeGetStoredLanguage = () => {
    try {
        return window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    } catch (_error) {
        return null;
    }
};

const resolveLanguage = () => {
    const datasetLang = document.documentElement?.dataset?.locale;
    if (datasetLang) {
        return datasetLang.toLowerCase();
    }

    const stored = safeGetStoredLanguage();
    if (stored) {
        return stored.toLowerCase();
    }

    const docLang = document.documentElement?.lang;
    if (docLang) {
        return docLang.toLowerCase();
    }

    return DEFAULT_LANGUAGE;
};

const translate = (lang, key, fallback) => {
    if (lang !== DEFAULT_LANGUAGE) {
        const dictionary = TRANSLATIONS[lang];
        if (dictionary && Object.prototype.hasOwnProperty.call(dictionary, key)) {
            return dictionary[key];
        }
    }

    return fallback;
};

const resolvePageKey = (pathname) => {
    const file = pathname.split("/").pop() || "index.html";
    return PAGE_KEY_MAP[file] ?? "index";
};

export function initNavigation({
    navSelector = ".site-nav",
    toggleSelector = ".menu-toggle",
    ctaSelector = "[data-cta-primary]"
} = {}) {
    const body = document.body;
    const nav = document.querySelector(navSelector);
    const menuToggle = document.querySelector(toggleSelector);
    const headerCta = document.querySelector(ctaSelector);
    const navLinks = nav ? nav.querySelectorAll("a[data-page]") : [];

    if (!nav) {
        return;
    }

    const currentKey = resolvePageKey(window.location.pathname);

    navLinks.forEach((link) => {
        if (link.dataset.page === currentKey) {
            link.classList.add("is-active");
        }
    });

    if (headerCta) {
        const applyOrderText = (lang) => {
            headerCta.textContent = translate(lang, ORDER_KEY, ORDER_FALLBACK);
            headerCta.dataset.i18nKey = ORDER_KEY;
        };

        const applyStepsText = (lang) => {
            headerCta.textContent = translate(lang, STEPS_KEY, STEPS_FALLBACK);
            headerCta.dataset.i18nKey = STEPS_KEY;
        };

        const setOrderState = () => {
            const lang = resolveLanguage();
            applyOrderText(lang);
            headerCta.href = getWhatsappUrl();
            headerCta.target = "_blank";
            headerCta.rel = "noopener";
            headerCta.dataset.ctaMode = "order";
        };

        const setStepsState = (targetHref) => {
            const lang = resolveLanguage();
            applyStepsText(lang);
            headerCta.href = targetHref;
            headerCta.removeAttribute("target");
            headerCta.removeAttribute("rel");
            headerCta.dataset.ctaMode = "steps";
        };

        const applyInitialState = () => {
            if (currentKey === "purchase") {
                setStepsState("#steps");
            } else {
                setOrderState();
            }
        };

        applyInitialState();

        document.addEventListener("pl:language-change", (event) => {
            const lang = event.detail?.language?.toLowerCase() || resolveLanguage();
            if (headerCta.dataset.ctaMode === "steps") {
                applyStepsText(lang);
            } else {
                applyOrderText(lang);
            }
        });

        document.addEventListener("pl:currency-change", () => {
            if (headerCta.dataset.ctaMode === "order") {
                headerCta.href = getWhatsappUrl();
            }
        });

        navLinks.forEach((link) => {
            link.addEventListener("click", () => {
                if (link.dataset.page === "purchase") {
                    if (currentKey === "purchase") {
                        setStepsState("#steps");
                    } else {
                        setStepsState("purchase.html#steps");
                    }
                } else if (headerCta.dataset.ctaMode !== "order") {
                    setOrderState();
                }
            });
        });
    }

    if (!menuToggle) {
        return;
    }

    const closeMenu = () => {
        menuToggle.setAttribute("aria-expanded", "false");
        nav.dataset.open = "false";
        body.classList.remove("menu-open");
    };

    menuToggle.addEventListener("click", () => {
        const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
        menuToggle.setAttribute("aria-expanded", String(!isOpen));
        nav.dataset.open = String(!isOpen);
        body.classList.toggle("menu-open", !isOpen);
    });

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            if (window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches) {
                closeMenu();
            }
        });
    });

    window.addEventListener("resize", () => {
        if (!window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches) {
            closeMenu();
        }
    });
}
