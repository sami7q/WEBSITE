import { initPageLoader } from "./modules/pageLoader.js";
import { initNavigation } from "./modules/navigation.js";
import { initSearch } from "./modules/search.js";
import { initSubscriptionDetails } from "./modules/subscriptionDetails.js";
import { initAnnouncementTicker } from "./modules/announcementTicker.js";
import { initFlashTimer } from "./modules/flashTimer.js";
import { initCounters } from "./modules/counters.js";
import { initCurrencyWidget } from "./modules/currencyWidget.js";
import { searchCatalog } from "./modules/searchCatalog.js";

const onDomReady = (callback) => {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", callback, { once: true });
    } else {
        callback();
    }
};

initPageLoader();

onDomReady(() => {
    initNavigation();
    initSearch({ catalog: searchCatalog });
    initSubscriptionDetails();
    initAnnouncementTicker();
    initFlashTimer();
    initCounters();
    initCurrencyWidget();
});
