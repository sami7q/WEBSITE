const PAGE_KEY_MAP = {
    "": "index",
    "index.html": "index",
    "subscriptions.html": "subscriptions",
    "accounts.html": "accounts",
    "offers.html": "offers",
    "purchase.html": "purchase"
};

const MOBILE_BREAKPOINT = 960;

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
        const whatsappUrl = "https://wa.me/9647700000000";

        const setOrderState = () => {
            headerCta.textContent = "اطلب الآن";
            headerCta.href = whatsappUrl;
            headerCta.target = "_blank";
            headerCta.rel = "noopener";
            headerCta.dataset.ctaMode = "order";
        };

        const setStepsState = (targetHref) => {
            headerCta.textContent = "ابدأ الآن";
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
