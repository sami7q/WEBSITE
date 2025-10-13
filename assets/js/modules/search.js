const ARABIC_DIACRITICS = /[\u0610-\u061a\u064b-\u065f]/g;

const normalize = (value) =>
    value
        .toLowerCase()
        .replace(ARABIC_DIACRITICS, "")
        .replace(/\s+/g, " ")
        .trim();

const isExternalLink = (url) => /^https?:\/\//i.test(url);

const buildSearchText = (item) => {
    if (!item.__searchText) {
        item.__searchText = normalize([
            item.name,
            item.category,
            item.keywords || ""
        ].join(" "));
    }
    return item.__searchText;
};

const navigateTo = (item) => {
    if (!item) {
        return;
    }

    if (isExternalLink(item.url)) {
        window.open(item.url, "_blank", "noopener");
    } else {
        window.location.href = item.url;
    }
};

export function initSearch({ catalog = [] } = {}) {
    if (!catalog.length) {
        return;
    }

    const searchContainers = document.querySelectorAll(".search");
    if (!searchContainers.length) {
        return;
    }

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

        const renderResults = (results) => {
            if (!results.length) {
                suggestionList.innerHTML = "<li class=\"search__empty\" role=\"presentation\">لم نعثر على نتائج لهذا البحث.</li>";
                suggestionList.classList.add("is-visible");
                setExpanded(true);
                currentResults = [];
                activeIndex = -1;
                input.removeAttribute("aria-activedescendant");
                return;
            }

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

            Array.from(suggestionList.querySelectorAll(".search__suggestion")).forEach((option, optionIndex) => {
                option.id = `${input.id || "search-input"}-option-${optionIndex}`;
            });

            suggestionList.classList.add("is-visible");
            setExpanded(true);
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

            const results = catalog
                .filter((item) => buildSearchText(item).includes(normalizedQuery))
                .slice(0, 8);

            renderResults(results);
        };

        const activateOption = (index) => {
            const options = suggestionList.querySelectorAll(".search__suggestion");
            if (!options.length) {
                return;
            }

            activeIndex = index;
            options.forEach((option, optionIndex) => {
                option.classList.toggle("is-active", optionIndex === activeIndex);
            });

            if (activeIndex >= 0 && options[activeIndex]) {
                const activeOption = options[activeIndex];
                input.setAttribute("aria-activedescendant", activeOption.id || "");
                activeOption.scrollIntoView({ block: "nearest" });
            } else {
                input.removeAttribute("aria-activedescendant");
            }
        };

        input.addEventListener("input", updateSuggestions);
        input.addEventListener("focus", updateSuggestions);

        input.addEventListener("keydown", (event) => {
            if (!suggestionList.classList.contains("is-visible")) {
                return;
            }

            if (event.key === "ArrowDown") {
                event.preventDefault();
                if (!currentResults.length) {
                    return;
                }
                const nextIndex = (activeIndex + 1) % currentResults.length;
                activateOption(nextIndex);
            } else if (event.key === "ArrowUp") {
                event.preventDefault();
                if (!currentResults.length) {
                    return;
                }
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
}
