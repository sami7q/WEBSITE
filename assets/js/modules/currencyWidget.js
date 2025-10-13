// معدلات التحويل بناءً على 1 USD
const RATES = {
    USD: 1,
    TL: 41,
    IQD: 1500
};

const SYMBOLS = {
    USD: '$',
    TL: '₺',
    IQD: 'د.ع'
};

// تنسيق الأرقام بالإنجليزية
const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(Math.round(num));
};

// تحويل السعر
const convertPrice = (iqdPrice, targetCurrency) => {
    const usdPrice = iqdPrice / RATES.IQD;
    return usdPrice * RATES[targetCurrency];
};

// حفظ واستعادة العملة المختارة
const STORAGE_KEY = 'preferred_currency';

const getStoredCurrency = () => {
    return localStorage.getItem(STORAGE_KEY) || 'IQD';
};

const setStoredCurrency = (currency) => {
    localStorage.setItem(STORAGE_KEY, currency);
};

const dispatchCurrencyChange = (currency) => {
    document.dispatchEvent(
        new CustomEvent("pl:currency-change", {
            detail: { currency }
        })
    );
};

export function initCurrencyWidget({
    widgetSelector = '[data-currency-widget]',
    toggleSelector = '.currency-widget__toggle',
    panelSelector = '.currency-widget__panel',
    optionSelector = '.currency-widget__option'
} = {}) {
    const widgets = document.querySelectorAll(widgetSelector);
    
    if (!widgets.length) {
        return;
    }

    // استعادة العملة المحفوظة
    const currentCurrency = getStoredCurrency();

    // تحديث جميع الأسعار
    const updateAllPrices = (currency) => {
        const priceElements = document.querySelectorAll('[data-price-iqd]');
        
        priceElements.forEach(el => {
            const iqdPrice = parseFloat(el.dataset.priceIqd);
            const convertedPrice = convertPrice(iqdPrice, currency);
            
            const amountSpan = el.querySelector('[data-price-amount]');
            const unitSpan = el.querySelector('[data-price-unit]');
            
            if (amountSpan) {
                amountSpan.textContent = formatNumber(convertedPrice);
            }
            
            if (unitSpan) {
                unitSpan.textContent = SYMBOLS[currency];
            }
        });
    };

    // تهيئة كل widget
    widgets.forEach(widget => {
        const toggle = widget.querySelector(toggleSelector);
        const panel = widget.querySelector(panelSelector);
        const options = widget.querySelectorAll(optionSelector);

        if (!toggle || !panel || !options.length) {
            return;
        }

        // تعيين العملة الحالية
        toggle.textContent = currentCurrency;
        
        // تحديد الخيار النشط
        options.forEach(opt => {
            const currency = opt.dataset.currencyOption;
            if (currency === currentCurrency) {
                opt.classList.add('is-selected');
            } else {
                opt.classList.remove('is-selected');
            }
        });

        // فتح/إغلاق القائمة
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = widget.dataset.open === 'true';
            
            // إغلاق جميع القوائم الأخرى
            widgets.forEach(w => {
                if (w !== widget) {
                    w.dataset.open = 'false';
                    w.querySelector(panelSelector)?.setAttribute('hidden', '');
                }
            });
            
            // تبديل الحالة
            widget.dataset.open = String(!isOpen);
            toggle.setAttribute('aria-expanded', String(!isOpen));
            
            if (!isOpen) {
                panel.removeAttribute('hidden');
            } else {
                panel.setAttribute('hidden', '');
            }
        });

        // اختيار العملة
        options.forEach(option => {
            option.addEventListener('click', () => {
                const selectedCurrency = option.dataset.currencyOption;
                
                // تحديث جميع الـ widgets
                widgets.forEach(w => {
                    const wToggle = w.querySelector(toggleSelector);
                    const wOptions = w.querySelectorAll(optionSelector);
                    const wPanel = w.querySelector(panelSelector);
                    
                    if (wToggle) {
                        wToggle.textContent = selectedCurrency;
                        wToggle.setAttribute('aria-expanded', 'false');
                    }
                    
                    wOptions.forEach(opt => {
                        if (opt.dataset.currencyOption === selectedCurrency) {
                            opt.classList.add('is-selected');
                        } else {
                            opt.classList.remove('is-selected');
                        }
                    });
                    
                    // إغلاق القائمة
                    w.dataset.open = 'false';
                    if (wPanel) {
                        wPanel.setAttribute('hidden', '');
                    }
                });
                
                // حفظ الاختيار
                setStoredCurrency(selectedCurrency);
                
                // تحديث الأسعار
                updateAllPrices(selectedCurrency);

                // إعلام باقي الواجهات
                dispatchCurrencyChange(selectedCurrency);
            });
        });
    });

    // إغلاق عند النقر خارج القائمة
    document.addEventListener('click', () => {
        widgets.forEach(widget => {
            widget.dataset.open = 'false';
            const panel = widget.querySelector(panelSelector);
            if (panel) {
                panel.setAttribute('hidden', '');
            }
        });
    });

    // تحديث الأسعار عند التحميل
    updateAllPrices(currentCurrency);
    dispatchCurrencyChange(currentCurrency);
}
