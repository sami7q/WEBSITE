export function initPageLoader() {
    if (typeof document === "undefined") {
        return;
    }

    const body = document.body;
    if (!body || document.querySelector(".page-loader")) {
        return;
    }

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
        if (isHidden) {
            return;
        }
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
}
