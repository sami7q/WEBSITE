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

export function initSubscriptionDetails() {
    const toggles = document.querySelectorAll(".subscription-card__toggle");
    if (!toggles.length) {
        return;
    }

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
}
