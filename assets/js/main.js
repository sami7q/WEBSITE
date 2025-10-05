(function initializePageLoader() {
    if (!document.body) return;
    const body = document.body;
    const loader = document.createElement("div");
    loader.className = "page-loader";
    loader.setAttribute("aria-hidden", "true");
    loader.innerHTML = `
        <div class="page-loader__inner">
            <div class="page-loader__emblem">
                <span class="page-loader__initials">PS</span>
                <span class="page-loader__orbit"></span>
                <span class="page-loader__orbit page-loader__orbit--delay"></span>
            </div>
            <span class="page-loader__logo">PLUS STORE</span>
            <div class="page-loader__progress" role="presentation">
                <span class="page-loader__bar"></span>
            </div>
            <span class="page-loader__text">جارٍ تجهيز متجرك...</span>
        </div>
    `;

    body.classList.add("is-loading");
    body.appendChild(loader);

    let isHidden = false;
    const hideLoader = () => {
        if (isHidden) return;
        isHidden = true;
        requestAnimationFrame(() => {
            loader.classList.add("is-fading");
            body.classList.remove("is-loading");
            setTimeout(() => loader.remove(), 420);
        });
    };

    const handleDomReady = () => {
        document.removeEventListener("DOMContentLoaded", handleDomReady);
        setTimeout(hideLoader, 160);
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", handleDomReady);
    } else {
        setTimeout(hideLoader, 160);
    }

    window.addEventListener("load", hideLoader, { once: true });

    setTimeout(hideLoader, 2500);
})();

document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".site-nav");
    const navLinks = document.querySelectorAll(".site-nav a[data-page]");
    const headerCta = document.querySelector("[data-cta-primary]");
    const whatsappUrl = "https://wa.me/9647700000000";
    const searchCatalog = [
        {
            name: "ChatGPT-5 Plus (3 أشهر)",
            category: "ذكاء اصطناعي",
            url: "index.html#bestsellers",
            keywords: "chatgpt gpt5 plus ai ذكاء اصطناعي حساب خاص ضمان 90 يوم",
            featured: true
        },
        {
            name: "Coursera Plus (سنة كاملة)",
            category: "تعليم",
            url: "index.html#bestsellers",
            keywords: "coursera plus شهادة جامعات تعلم عن بعد مضمون سنة",
            featured: true
        },
        {
            name: "Capcut Pro (شهرين)",
            category: "تصميم",
            url: "subscriptions.html#catalog",
            keywords: "capcut pro شهرين مونتاج فيديو 22500",
            featured: false
        },
        {
            name: "Netflix (3 أشهر)",
            category: "اشتراكات رقمية",
            url: "subscriptions.html#catalog",
            keywords: "netflix اشتراك 3 اشهر 29985 مسلسلات افلام",
            featured: true
        },
        {
            name: "LinkedIn Premium (3 أشهر)",
            category: "أعمال",
            url: "subscriptions.html#catalog",
            keywords: "linkedin premium 3 اشهر كورسات توظيف 50625",
            featured: false
        },
        {
            name: "Grammarly Premium (3 أشهر)",
            category: "إنتاجية",
            url: "subscriptions.html#catalog",
            keywords: "grammarly premium 3 اشهر كتابة تدقيق لغوي",
            featured: false
        },
        {
            name: "ChatGPT-5 Plus (3 أشهر)",
            category: "ذكاء اصطناعي",
            url: "subscriptions.html#catalog",
            keywords: "chatgpt 5 plus 3 اشهر ذكاء اصطناعي 55000 ضمان 90 يوم",
            featured: true
        },
        {
            name: "MasterClass (6 أشهر)",
            category: "تعليم",
            url: "subscriptions.html#catalog",
            keywords: "masterclass 6 اشهر دورات خبراء 18000",
            featured: false
        },
        {
            name: "Duolingo Plus (6 أشهر)",
            category: "تعليم",
            url: "subscriptions.html#catalog",
            keywords: "duolingo plus 6 اشهر لغات 24300",
            featured: false
        },
        {
            name: "Rosetta Stone (6 أشهر)",
            category: "تعليم",
            url: "subscriptions.html#catalog",
            keywords: "rosetta stone 6 اشهر لغات 22485",
            featured: false
        },
        {
            name: "Coursera Plus (سنة كاملة)",
            category: "تعليم",
            url: "subscriptions.html#catalog",
            keywords: "coursera plus سنة كاملة 125000 شهادات جامعات تعلم بلا حدود",
            featured: true
        },
        {
            name: "Microsoft 365 (سنة)",
            category: "إنتاجية",
            url: "subscriptions.html#catalog",
            keywords: "microsoft 365 سنة اوفيس 40500",
            featured: false
        },
        {
            name: "Windows 11 Pro (سنة)",
            category: "أنظمة",
            url: "subscriptions.html#catalog",
            keywords: "windows 11 pro سنة تفعيل اصلي 40485",
            featured: false
        },
        {
            name: "Adobe Creative Cloud (سنة)",
            category: "تصميم",
            url: "subscriptions.html#catalog",
            keywords: "adobe creative cloud سنة برامج تصميم 374985",
            featured: false
        },
        {
            name: "Canva Pro (سنة)",
            category: "تصميم",
            url: "subscriptions.html#catalog",
            keywords: "canva pro سنة تصميم جرافيك 26305",
            featured: false
        },
        {
            name: "حساب ألعاب حصري (PlayStation 5)",
            category: "الحسابات الجاهزة",
            url: "accounts.html#catalog",
            keywords: "حساب ps5 حصري بلايستيشن",
            featured: false
        },
        {
            name: "حساب Netflix 4K مخصص",
            category: "الحسابات الجاهزة",
            url: "accounts.html#catalog",
            keywords: "حساب netflix 4k مشترك مخصص",
            featured: false
        },
        {
            name: "حساب Xbox Game Pass Ultimate (3 أشهر)",
            category: "الحسابات الجاهزة",
            url: "accounts.html#catalog",
            keywords: "حساب xbox game pass ultimate",
            featured: false
        },
        {
            name: "Smarters IPTV – سنة + 3 أشهر لجهازين",
            category: "الاشتراكات الرياضية",
            url: "offers.html#sports-subscriptions",
            keywords: "smarters iptv جهازين سنة ثلاث شهور 200000 150000 خصم 25",
            featured: true
        },
        {
            name: "Smarters IPTV – سنة + 3 أشهر جهاز واحد",
            category: "الاشتراكات الرياضية",
            url: "offers.html#sports-subscriptions",
            keywords: "smarters iptv جهاز واحد سنة ثلاث شهور 132000 99000 خصم 25",
            featured: true
        },
        {
            name: "Smarters IPTV – باقة 6 أشهر",
            category: "الاشتراكات الرياضية",
            url: "offers.html#sports-subscriptions",
            keywords: "smarters iptv ستة اشهر 87000 65000 خصم ربع",
            featured: false
        },
        {
            name: "Smarters IPTV – باقة 3 أشهر",
            category: "الاشتراكات الرياضية",
            url: "offers.html#sports-subscriptions",
            keywords: "smarters iptv ثلاثة اشهر 53500 40000 خصم 25",
            featured: false
        },
        {
            name: "طريقة الشراء - ثلاث خطوات فقط",
            category: "الدعم والمساعدة",
            url: "purchase.html#steps",
            keywords: "طريقة الشراء خطوات كيف اطلب",
            featured: false
        },
        {
            name: "الأسئلة الشائعة",
            category: "الدعم والمساعدة",
            url: "purchase.html#faq",
            keywords: "الاسئلة الشائعة faq دعم مشاكل",
            featured: false
        },
        {
            name: "طرق الدفع المتاحة",
            category: "الدفع",
            url: "index.html#payment",
            keywords: "طرق الدفع زين كاش qicard تحويل",
            featured: false
        },
        {
            name: "تواصل عبر واتساب",
            category: "الدعم والمساعدة",
            url: "https://wa.me/9647700000000",
            keywords: "تواصل دعم واتساب whatsapp خدمة العملاء",
            featured: false
        }
    ];

    const initSearch = () => {
        const searchContainers = document.querySelectorAll(".search");
        if (!searchContainers.length || !searchCatalog.length) {
            return;
        }

        const normalize = (value) =>
            value
                .toLowerCase()
                .replace(/[\u0610-\u061a\u064b-\u065f]/g, "")
                .replace(/\s+/g, " ")
                .trim();

        const getSearchText = (item) => {
            if (!item.__searchText) {
                item.__searchText = normalize([
                    item.name,
                    item.category,
                    item.keywords || ""
                ].join(" "));
            }
            return item.__searchText;
        };

        const isExternalLink = (url) => /^https?:\/\//i.test(url);

        const navigateTo = (item) => {
            if (!item) return;
            if (isExternalLink(item.url)) {
                window.open(item.url, "_blank", "noopener");
            } else {
                window.location.href = item.url;
            }
        };

        searchContainers.forEach((container) => {
            const input = container.querySelector(".search__input");
            const clearButton = container.querySelector(".search__clear");
            const suggestionList = container.querySelector(".search__suggestions");

            if (!input || !clearButton || !suggestionList) {
                return;
            }

            let currentResults = [];
            let activeIndex = -1;

            const setExpanded = (visible) => {
                input.setAttribute("aria-expanded", visible ? "true" : "false");
            };

            const updateClearVisibility = () => {
                if (input.value.trim()) {
                    clearButton.classList.add("is-visible");
                } else {
                    clearButton.classList.remove("is-visible");
                }
            };

            const closeSuggestions = () => {
                suggestionList.classList.remove("is-visible");
                suggestionList.innerHTML = "";
                setExpanded(false);
                currentResults = [];
                activeIndex = -1;
                input.removeAttribute("aria-activedescendant");
            };

            const updateSuggestions = () => {
                const query = input.value.trim();
                updateClearVisibility();

                if (!query) {
                    closeSuggestions();
                    return;
                }

                const normalizedQuery = normalize(query);
                if (!normalizedQuery) {
                    closeSuggestions();
                    return;
                }

                const results = searchCatalog
                    .filter((item) => getSearchText(item).includes(normalizedQuery))
                    .slice(0, 8);

                if (results.length) {
                    currentResults = results;
                    activeIndex = -1;
                    input.removeAttribute("aria-activedescendant");
                    suggestionList.innerHTML = results
                        .map(
                            (item, index) => `
                                <li class="search__suggestion" role="option" data-index="${index}" data-url="${item.url}">
                                    <span class="search__suggestion-title">${item.name}</span>
                                    <span class="search__suggestion-meta">${item.category}</span>
                                </li>
                            `
                        )
                        .join("");
                    Array.from(suggestionList.querySelectorAll(".search__suggestion")).forEach(
                        (option, optionIndex) => {
                            option.id = `${input.id || "search-input"}-option-${optionIndex}`;
                        }
                    );
                    suggestionList.classList.add("is-visible");
                    setExpanded(true);
                } else {
                    suggestionList.innerHTML = `<li class="search__empty" role="presentation">لم نعثر على نتائج لهذا البحث.</li>`;
                    suggestionList.classList.add("is-visible");
                    setExpanded(true);
                    currentResults = [];
                    activeIndex = -1;
                    input.removeAttribute("aria-activedescendant");
                }
            };

            const activateOption = (index) => {
                const options = suggestionList.querySelectorAll(".search__suggestion");
                if (!options.length) return;

                activeIndex = index;
                options.forEach((option, optionIndex) => {
                    option.classList.toggle("is-active", optionIndex === activeIndex);
                });
                if (activeIndex >= 0 && options[activeIndex]) {
                    const activeOption = options[activeIndex];
                    input.setAttribute("aria-activedescendant", activeOption.id || "");
                    if (typeof activeOption.scrollIntoView === "function") {
                        activeOption.scrollIntoView({ block: "nearest" });
                    }
                } else {
                    input.removeAttribute("aria-activedescendant");
                }
            };

            input.addEventListener("input", () => {
                updateSuggestions();
            });

            input.addEventListener("focus", () => {
                updateSuggestions();
            });

            input.addEventListener("keydown", (event) => {
                if (!suggestionList.classList.contains("is-visible")) {
                    return;
                }

                if (event.key === "ArrowDown") {
                    event.preventDefault();
                    if (!currentResults.length) return;
                    const nextIndex = (activeIndex + 1) % currentResults.length;
                    activateOption(nextIndex);
                } else if (event.key === "ArrowUp") {
                    event.preventDefault();
                    if (!currentResults.length) return;
                    const nextIndex = activeIndex <= 0 ? currentResults.length - 1 : activeIndex - 1;
                    activateOption(nextIndex);
                } else if (event.key === "Enter") {
                    if (!currentResults.length) {
                        return;
                    }
                    event.preventDefault();
                    const selected = currentResults[activeIndex >= 0 ? activeIndex : 0];
                    closeSuggestions();
                    navigateTo(selected);
                } else if (event.key === "Escape") {
                    closeSuggestions();
                }
            });

            input.addEventListener("blur", () => {
                setTimeout(() => {
                    closeSuggestions();
                }, 150);
            });

            clearButton.addEventListener("click", () => {
                input.value = "";
                updateClearVisibility();
                input.focus();
                closeSuggestions();
            });

            suggestionList.addEventListener("mousedown", (event) => {
                const option = event.target.closest(".search__suggestion");
                if (!option) {
                    return;
                }
                event.preventDefault();
                const index = Number(option.dataset.index ?? -1);
                const item = currentResults[index];
                closeSuggestions();
                navigateTo(item);
            });

            document.addEventListener("click", (event) => {
                if (!container.contains(event.target)) {
                    closeSuggestions();
                }
            });

            updateClearVisibility();
        });
    };

    const initSubscriptionDetails = () => {
        const toggles = document.querySelectorAll(".subscription-card__toggle");
        if (!toggles.length) {
            return;
        }

        const closePanel = (button) => {
            const controls = button.getAttribute("aria-controls");
            if (!controls) {
                return;
            }
            const target = document.getElementById(controls);
            if (!target) {
                return;
            }
            button.setAttribute("aria-expanded", "false");
            button.classList.remove("is-active");
            target.setAttribute("hidden", "");
        };

        const openPanel = (button) => {
            const controls = button.getAttribute("aria-controls");
            if (!controls) {
                return;
            }
            const target = document.getElementById(controls);
            if (!target) {
                return;
            }
            button.setAttribute("aria-expanded", "true");
            button.classList.add("is-active");
            target.removeAttribute("hidden");
        };

        toggles.forEach((toggle) => {
            toggle.addEventListener("click", () => {
                const wasExpanded = toggle.getAttribute("aria-expanded") === "true";

                if (wasExpanded) {
                    closePanel(toggle);
                    return;
                }

                toggles.forEach((otherToggle) => {
                    if (otherToggle !== toggle) {
                        closePanel(otherToggle);
                    }
                });

                openPanel(toggle);
            });
        });
    };

    const resolvePageKey = (path) => {
        const file = path.split("/").pop() || "index.html";
        const map = {
            "": "index",
            "index.html": "index",
            "subscriptions.html": "subscriptions",
            "accounts.html": "accounts",
            "offers.html": "offers",
            "purchase.html": "purchase"
        };
        return map[file] ?? "index";
    };

    const currentKey = resolvePageKey(window.location.pathname);
    navLinks.forEach((link) => {
        if (link.dataset.page === currentKey) {
            link.classList.add("is-active");
        }
    });

    initSearch();
    initSubscriptionDetails();

    if (headerCta) {
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

    if (menuToggle && nav) {
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
                if (window.matchMedia("(max-width: 960px)").matches) {
                    closeMenu();
                }
            });
        });

        window.addEventListener("resize", () => {
            if (!window.matchMedia("(max-width: 960px)").matches) {
                closeMenu();
            }
        });
    }

    const ticker = document.querySelector(".announcement__ticker");
    if (ticker) {
        const phrasesAttr = ticker.dataset.phrases || "";
        const phrases = phrasesAttr
            .split(",")
            .map((phrase) => phrase.trim())
            .filter(Boolean);

        if (phrases.length) {
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
                }, 220);
            }, 3400);
        }
    }

    const flashTimer = document.querySelector(".flash-timer");
    if (flashTimer) {
        const deadlineElement = document.querySelector("[data-flash-deadline]");
        const unitElements = {
            days: flashTimer.querySelector('[data-unit="days"]'),
            hours: flashTimer.querySelector('[data-unit="hours"]'),
            minutes: flashTimer.querySelector('[data-unit="minutes"]'),
            seconds: flashTimer.querySelector('[data-unit="seconds"]')
        };

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

        let saleEndsAt = computeTargetDate();

        const updateDeadlineText = () => {
            if (!deadlineElement) return;
            try {
                const formatter = new Intl.DateTimeFormat("ar-IQ", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                });
                deadlineElement.textContent = formatter.format(saleEndsAt);
            } catch (error) {
                deadlineElement.textContent = saleEndsAt.toLocaleDateString();
            }
        };

        const renderTimer = () => {
            const now = Date.now();
            let diff = saleEndsAt.getTime() - now;

            if (diff <= 0) {
                saleEndsAt = computeTargetDate();
                diff = saleEndsAt.getTime() - now;
                updateDeadlineText();
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

        updateDeadlineText();
        renderTimer();
        setInterval(renderTimer, 1000);
    }

    const counters = document.querySelectorAll("[data-counter-end]");
    if (counters.length) {
        const formatValue = (value, locale) => {
            try {
                return Number(value).toLocaleString(locale || "en-US");
            } catch (error) {
                return String(Math.trunc(value));
            }
        };

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

            const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

            const step = (timestamp) => {
                if (!startTime) {
                    startTime = timestamp;
                }
                const progress = Math.min((timestamp - startTime) / duration, 1);
                const eased = easeOutCubic(progress);
                const currentValue = start + distance * eased;
                element.textContent = `${prefix}${formatValue(
                    distance > 0 ? Math.floor(currentValue) : Math.ceil(currentValue),
                    locale
                )}${suffix}`;

                if (progress < 1) {
                    requestAnimationFrame(step);
                }
            };

            element.textContent = `${prefix}${formatValue(start, locale)}${suffix}`;
            requestAnimationFrame(step);
        };

        const observer = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        obs.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.4
            }
        );

        counters.forEach((counter) => {
            observer.observe(counter);
        });
    }
});
