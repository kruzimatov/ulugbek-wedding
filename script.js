const intro = document.getElementById("intro");
const invitation = document.getElementById("invitation");
const openInviteBtn = document.getElementById("openInviteBtn");
const letterHero = document.getElementById("letterHero");
const languageSwitcher = document.querySelector(".language-switcher");
const languageButtons = document.querySelectorAll(".language-option");
const musicToggleBtn = document.getElementById("musicToggleBtn");
const backgroundMusic = document.getElementById("backgroundMusic");

const targetWeddingDate = new Date("2026-08-30T16:00:00+05:00").getTime();
const OPENING_DURATION_MS = 1000;
const DEFAULT_LANGUAGE = "uz";
const LANGUAGE_STORAGE_KEY = "weddingInvitationLanguage";
const MUSIC_VOLUME = 0.16;
const ONE_SECOND_MS = 1000;
const ONE_MINUTE_MS = ONE_SECOND_MS * 60;
const ONE_HOUR_MS = ONE_MINUTE_MS * 60;
const ONE_DAY_MS = ONE_HOUR_MS * 24;

const WISHES_STORAGE_KEY = "weddingWishes";
const INITIAL_WISHES = [
    { name: "Bahora Xolmurodova💕", text: "Oishabegim opa baxtli bo'liing, yangi hayotingiz go'zal va shukrli lahzalarga to'la bo'lsin💎✨" },
    { name: "Maftuna", text: "Ma'rufjon aka va Oishabegim sizlarga o'zlarizdek chiroyli baxt tilayman." },
    { name: "Farrux&Diyora", text: "Koop koop baxtlar tilaymiz" },
];

function getStoredWishes() {
    try {
        const raw = localStorage.getItem(WISHES_STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (_) { return []; }
}

function saveWish(wish) {
    const wishes = getStoredWishes();
    wishes.push(wish);
    try { localStorage.setItem(WISHES_STORAGE_KEY, JSON.stringify(wishes)); } catch (_) {}
}

function getAllWishes() {
    return [...INITIAL_WISHES, ...getStoredWishes()];
}

function createWishCard(wish, isNew) {
    const card = document.createElement("div");
    card.className = "wish-card" + (isNew ? " wish-card--new" : "");
    card.innerHTML = '<p class="wish-text"></p><p class="wish-author"></p>';
    card.querySelector(".wish-text").textContent = wish.text;
    card.querySelector(".wish-author").textContent = wish.name;
    return card;
}

function renderWishes() {
    const grid = document.getElementById("wishesGrid");
    if (!grid) return;
    grid.innerHTML = "";
    getAllWishes().forEach(function(w) { grid.appendChild(createWishCard(w, false)); });
}

function setupWishesToggle() {
    const btn = document.getElementById("wishesToggleBtn");
    const grid = document.getElementById("wishesGrid");
    if (!btn || !grid) return;
    let expanded = false;
    btn.addEventListener("click", function() {
        expanded = !expanded;
        grid.classList.toggle("expanded", expanded);
        const locale = getLocale();
        btn.textContent = expanded ? (locale.wishesHideAll || "YOPISH") : (locale.wishesShowAll || "BARCHA TILAKLARNI KO'RISH");
    });
}

function setupWishesForm() {
    const form = document.getElementById("wishesForm");
    if (!form) return;
    form.addEventListener("submit", function(e) {
        e.preventDefault();
        const nameInput = document.getElementById("wishName");
        const msgInput = document.getElementById("wishMessage");
        const name = nameInput.value.trim();
        const text = msgInput.value.trim();
        if (!name) { nameInput.focus(); return; }
        if (!text) { msgInput.focus(); return; }
        const wish = { name: name, text: text };
        saveWish(wish);
        const grid = document.getElementById("wishesGrid");
        if (grid) {
            grid.classList.add("expanded");
            const card = createWishCard(wish, true);
            grid.appendChild(card);
            card.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        const toggleBtn = document.getElementById("wishesToggleBtn");
        if (toggleBtn) {
            const locale = getLocale();
            toggleBtn.textContent = locale.wishesHideAll || "YOPISH";
        }
        form.reset();
    });
}

const LOCALES = {
    ru: {
        pageTitle: "Маъруфжон и Оишабегим | Свадебное приглашение",
        metaDescription: "Свадебное приглашение Маъруфжона и Оишабегим на 30 августа 2026 года.",
        ariaIntro: "Конверт с приглашением",
        ariaEnvelope: "Запечатанный бумажный конверт",
        ariaWeddingDate: "Дата свадьбы",
        ariaCalendar: "Календарь августа 2026 с выделенным 30 августа",
        ariaWeddingDay: "День свадьбы",
        ariaOrnamentHero: "Традиционная страница с именами молодоженов",
        ariaVenueDetails: "Место проведения",
        ariaCountdown: "Обратный отсчет",
        envelopeTopNote: "<span class=\"flap-note-top\">ВЫ</span><span class=\"flap-note-middle\">ПРИГЛАШЕНЫ</span><span class=\"flap-note-script\">на нашу свадьбу</span>",
        withLove: "с любовью,",
        signatureNames: "МАЪРУФЖОН И ОИШАБЕГИМ",
        ornamentNames: "<span class=\"ornament-name-line\">Маъруфжон</span><span class=\"ornament-name-amp\">и</span><span class=\"ornament-name-line\">Оишабегим</span>",
        ornamentMessage: "Спешим сообщить<br />радостную новость:<br />мы женимся!",
        ornamentDay: "30",
        ornamentMonth: "08",
        ornamentYear: "26",
        heroNames: "Дорогие&nbsp;наши<br />родные&nbsp;и&nbsp;<span class=\"no-break\">близкие!</span>",
        openHere: "открыть",
        lead: "В этот прекрасный день мы соединяем наши сердца и начинаем новую историю - историю нашей любви.<br /><br />Будем счастливы разделить радость этого особенного момента вместе с вами.<br /><br /><strong>С любовью приглашаем вас на нашу свадьбу.</strong>",
        scrollHint: "Прокрутите вниз",
        calendarMonth: "Август, 2026",
        weekdayMon: "ПН",
        weekdayTue: "ВТ",
        weekdayWed: "СР",
        weekdayThu: "ЧТ",
        weekdayFri: "ПТ",
        weekdaySat: "СБ",
        weekdaySun: "ВС",
        locationTitle: "Адрес:",
        venueName: "Соку Гулбог МФЙ Биродарлик кўча 33-уй",
        venueTime: "В 16:00",
        venueAddress: "Соку коллеж орқасидаги котежд",
        venueLandmark: "",
        mapLinkYandex: "Яндекс Карты",
        mapLinkGoogle: "Google Maps",
        countdownTitle: "Считаем каждое мгновение",
        unitDays: "Дней",
        unitHours: "Часов",
        unitMinutes: "Минут",
        unitSeconds: "Секунд",
        countdownWaiting: "Мы ждем вас.",
        countdownToday: "Этот день настал. Мы ждем вас.",
        languageSwitcher: "Выбор языка",
        languageRuLabel: "Русский",
        languageUzLabel: "O'zbekcha",
        musicPlayLabel: "Включить музыку",
        musicPauseLabel: "Остановить музыку",
        wishesTitle: "Пожелания",
        wishesSubtitle: "ТЁПЛЫЕ СЛОВА ОТ БЛИЗКИХ",
        wishesShowAll: "ПОКАЗАТЬ ВСЕ ПОЖЕЛАНИЯ",
        wishesHideAll: "СКРЫТЬ",
        wishesFormTitle: "Оставьте пожелание",
        wishesFormDesc: "Ваше пожелание будет опубликовано после проверки.",
        wishesNameLabel: "ВАШЕ ИМЯ",
        wishesNamePlaceholder: "Введите ваше имя",
        wishesMessageLabel: "ПОЖЕЛАНИЕ",
        wishesMessagePlaceholder: "Тёплые слова для молодожёнов...",
        wishesSubmit: "ОТПРАВИТЬ",
    },
    uz: {
        pageTitle: "Ma'rufjon va Oishabegim | To'y taklifnomasi",
        metaDescription: "Ma'rufjon va Oishabegimning 2026-yil 30-avgustdagi to'y taklifnomasi.",
        ariaIntro: "Taklifnoma konverti",
        ariaEnvelope: "Muhrlangan qog'oz konvert",
        ariaWeddingDate: "To'y sanasi",
        ariaCalendar: "2026-yil avgust kalendari, 30-avgust belgilangan",
        ariaWeddingDay: "To'y kuni",
        ariaOrnamentHero: "Yoshlar ismlari tushirilgan an'anaviy sahifa",
        ariaVenueDetails: "Manzil",
        ariaCountdown: "Orqaga sanoq",
        envelopeTopNote: "<span class=\"flap-note-top\">SIZ</span><span class=\"flap-note-middle\">TO'YIMIZGA</span><span class=\"flap-note-script\">taklif etilgansiz</span>",
        withLove: "muhabbat ila,",
        signatureNames: "MA'RUFJON VA OISHABEGIM",
        ornamentNames: "<span class=\"ornament-name-line\">Ma'rufjon</span><span class=\"ornament-name-amp\">va</span><span class=\"ornament-name-line\">Oishabegim</span>",
        ornamentMessage: "Quvonchli yangilik:<br />biz turmush<br />quramiz!",
        ornamentDay: "30",
        ornamentMonth: "08",
        ornamentYear: "26",
        heroNames: "Aziz\u00a0va\u00a0qadrdon<br /><span class=\"no-break\">insonimiz!</span>",
        openHere: "ochish",
        lead: "Hayotimizdagi eng baxtli kunlardan biri - nikoh to'yimizni siz bilan birga nishonlashni niyat qildik.<br /><br />Sizni ushbu kechamizga samimiy taklif etamiz.<br /><br /><strong>Quvonchli kunimizda aziz mehmonimiz bo'lishingizni intiqlik bilan kutamiz.</strong>",
        scrollHint: "Pastga tushuring",
        calendarMonth: "Avgust, 2026",
        weekdayMon: "DU",
        weekdayTue: "SE",
        weekdayWed: "CHOR",
        weekdayThu: "PAY",
        weekdayFri: "JU",
        weekdaySat: "SHA",
        weekdaySun: "YA",
        locationTitle: "Manzil:",
        venueName: "Soku Gulbog' MFY Birodarlik ko'cha 33-uy",
        venueTime: "Soat 16:00 da",
        venueAddress: "Soku kollej orqasidagi kotejd",
        venueLandmark: "",
        mapLinkYandex: "Yandex xaritasi",
        mapLinkGoogle: "Google Maps",
        countdownTitle: "Har lahzani sanayapmiz",
        unitDays: "Kun",
        unitHours: "Soat",
        unitMinutes: "Daqiqa",
        unitSeconds: "Soniya",
        countdownWaiting: "Sizni intiqlik bilan kutamiz.",
        countdownToday: "Bugun aynan o'sha kun. Sizni kutamiz.",
        languageSwitcher: "Til tanlash",
        languageRuLabel: "Ruscha",
        languageUzLabel: "O'zbekcha",
        musicPlayLabel: "Musiqani yoqish",
        musicPauseLabel: "Musiqani to'xtatish",
        wishesTitle: "Tilaklar",
        wishesSubtitle: "YAQINLARIMIZDAN ILIQ SO'ZLAR",
        wishesShowAll: "BARCHA TILAKLARNI KO'RISH",
        wishesHideAll: "YOPISH",
        wishesFormTitle: "Tilak qoldiring",
        wishesFormDesc: "Tilagingiz ko'rib chiqilgandan so'ng sahifada chop etiladi.",
        wishesNameLabel: "ISMINGIZ",
        wishesNamePlaceholder: "Ismingizni kiriting",
        wishesMessageLabel: "TILAGINGIZ",
        wishesMessagePlaceholder: "Kelin-kuyovga iliq so’zlaringiz...",
        wishesSubmit: "YUBORISH",
    },
    en: {
        pageTitle: "Ma'rufjon and Oishabegim | Wedding Invitation",
        metaDescription: "Wedding invitation of Ma'rufjon and Oishabegim, August 30, 2026.",
        ariaIntro: "Invitation envelope",
        ariaEnvelope: "Sealed paper envelope",
        ariaWeddingDate: "Wedding date",
        ariaCalendar: "August 2026 calendar, August 30 highlighted",
        ariaWeddingDay: "Wedding day",
        ariaOrnamentHero: "Traditional page with the names of the couple",
        ariaVenueDetails: "Venue details",
        ariaCountdown: "Countdown",
        envelopeTopNote: "<span class=\"flap-note-top\">YOU ARE</span><span class=\"flap-note-middle\">INVITED</span><span class=\"flap-note-script\">to our wedding</span>",
        withLove: "with love,",
        signatureNames: "MA'RUFJON & OISHABEGIM",
        ornamentNames: "<span class=\"ornament-name-line\">Ma'rufjon</span><span class=\"ornament-name-amp\">&</span><span class=\"ornament-name-line\">Oishabegim</span>",
        heroNames: "Dear\u00a0friends<br /><span class=\"no-break\">and family!</span>",
        openHere: "open",
        lead: "One of the happiest days of our lives — our wedding — and we want to celebrate it with you.<br /><br />We sincerely invite you to join us on this special evening.<br /><br /><strong>We look forward to having you as our cherished guest.</strong>",
        scrollHint: "Scroll down",
        calendarMonth: "August, 2026",
        weekdayMon: "Mo",
        weekdayTue: "Tu",
        weekdayWed: "We",
        weekdayThu: "Th",
        weekdayFri: "Fr",
        weekdaySat: "Sa",
        weekdaySun: "Su",
        locationTitle: "Address:",
        venueName: "Soku Gulbog' MFY Birodarlik street 33",
        venueTime: "At 16:00",
        venueAddress: "Behind Soku college, cottage",
        venueLandmark: "",
        mapLinkYandex: "Yandex Maps",
        mapLinkGoogle: "Google Maps",
        countdownTitle: "Counting every moment",
        unitDays: "Days",
        unitHours: "Hours",
        unitMinutes: "Minutes",
        unitSeconds: "Seconds",
        countdownWaiting: "We look forward to seeing you.",
        countdownToday: "Today is the day. We are waiting for you.",
        languageSwitcher: "Language",
        languageRuLabel: "Russian",
        languageUzLabel: "Uzbek",
        musicPlayLabel: "Play music",
        musicPauseLabel: "Pause music",
        wishesTitle: "Wishes",
        wishesSubtitle: "WARM WORDS FROM LOVED ONES",
        wishesShowAll: "VIEW ALL WISHES",
        wishesHideAll: "HIDE",
        wishesFormTitle: "Leave a wish",
        wishesFormDesc: "Your wish will be published after review.",
        wishesNameLabel: "YOUR NAME",
        wishesNamePlaceholder: "Enter your name",
        wishesMessageLabel: "YOUR WISH",
        wishesMessagePlaceholder: "Warm words for the couple...",
        wishesSubmit: "SUBMIT",
    },

};

let isOpening = false;
let currentLanguage = DEFAULT_LANGUAGE;
let ornamentNameFitFrame = null;

function resetPageScrollToTop() {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
}

function getLocale() {
    return LOCALES[currentLanguage] || LOCALES[DEFAULT_LANGUAGE];
}

function isMusicPlaying() {
    if (!backgroundMusic) return false;
    return !backgroundMusic.paused && !backgroundMusic.ended;
}

function updateMusicToggleState(isPlaying = false) {
    if (!musicToggleBtn) return;
    const locale = getLocale();
    const label = isPlaying ? locale.musicPauseLabel : locale.musicPlayLabel;
    musicToggleBtn.classList.toggle("is-playing", isPlaying);
    musicToggleBtn.setAttribute("aria-pressed", isPlaying ? "true" : "false");
    musicToggleBtn.setAttribute("aria-label", label);
    musicToggleBtn.setAttribute("title", label);
}

function playBackgroundMusic() {
    if (!backgroundMusic) return;
    backgroundMusic.loop = true;
    backgroundMusic.volume = MUSIC_VOLUME;
    const playPromise = backgroundMusic.play();
    if (playPromise && typeof playPromise.then === "function") {
        playPromise.then(() => updateMusicToggleState(true)).catch(() => updateMusicToggleState(false));
        return;
    }
    updateMusicToggleState(isMusicPlaying());
}

function stopBackgroundMusic() {
    if (!backgroundMusic) return;
    backgroundMusic.pause();
    updateMusicToggleState(false);
}

function toggleBackgroundMusic() {
    if (!backgroundMusic) return;
    if (isMusicPlaying()) {
        stopBackgroundMusic();
        return;
    }
    playBackgroundMusic();
}

function setLanguageSwitcherState(lang) {
    languageButtons.forEach((button) => {
        const isActive = button.dataset.language === lang;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
}

function saveLanguagePreference(lang) {
    try {
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch (_) {
    }
}

function getSavedLanguagePreference() {
    try {
        const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
        return LOCALES[saved] ? saved : null;
    } catch (_) {
        return null;
    }
}

function getInitialLanguage() {
    return getSavedLanguagePreference() || DEFAULT_LANGUAGE;
}

function fitOrnamentNames() {
    const namesBlock = document.querySelector(".ornament-names");
    if (!namesBlock) return;
    const nameLines = Array.from(namesBlock.querySelectorAll(".ornament-name-line"));
    if (!nameLines.length) return;
    namesBlock.style.setProperty("--ornament-name-fit-scale", "1");
    nameLines.forEach((line) => line.style.setProperty("--line-fit-scale", "1"));
    const availableWidth = namesBlock.clientWidth;
    if (!availableWidth) return;
    const sideSafePadding = Math.max(8, availableWidth * 0.045);
    const safeWidth = Math.max(0, availableWidth - sideSafePadding * 2);
    if (!safeWidth) return;
    nameLines.forEach((line) => {
        const lineWidth = line.scrollWidth;
        if (!lineWidth) return;
        const fitScale = Math.max(0.68, Math.min(1, (safeWidth / lineWidth) * 0.985));
        line.style.setProperty("--line-fit-scale", fitScale.toFixed(3));
    });
}

function scheduleOrnamentNameFit() {
    if (ornamentNameFitFrame !== null) window.cancelAnimationFrame(ornamentNameFitFrame);
    ornamentNameFitFrame = window.requestAnimationFrame(() => {
        fitOrnamentNames();
        ornamentNameFitFrame = null;
    });
}

function applyTranslations(lang = DEFAULT_LANGUAGE) {
    if (!LOCALES[lang]) return;
    currentLanguage = lang;
    setLanguageSwitcherState(lang);
    const locale = getLocale();
    document.documentElement.lang = lang;
    document.title = locale.pageTitle;
    document.querySelectorAll("[data-i18n]").forEach((node) => {
        const key = node.getAttribute("data-i18n");
        if (key && Object.prototype.hasOwnProperty.call(locale, key)) node.textContent = locale[key];
    });
    document.querySelectorAll("[data-i18n-html]").forEach((node) => {
        const key = node.getAttribute("data-i18n-html");
        if (key && Object.prototype.hasOwnProperty.call(locale, key)) node.innerHTML = locale[key];
    });
    document.querySelectorAll("[data-i18n-attr]").forEach((node) => {
        const rawMapping = node.getAttribute("data-i18n-attr");
        if (!rawMapping) return;
        rawMapping.split(";").forEach((pair) => {
            const [attr, key] = pair.split(":").map((item) => item.trim());
            if (!attr || !key) return;
            if (Object.prototype.hasOwnProperty.call(locale, key)) node.setAttribute(attr, locale[key]);
        });
    });
    const countdownMessage = document.getElementById("countdownMessage");
    if (countdownMessage) countdownMessage.textContent = locale.countdownWaiting;
    scheduleOrnamentNameFit();
    updateMusicToggleState(isMusicPlaying());
}

function openInvitation() {
    if (isOpening) return;
    isOpening = true;
    intro.classList.add("opened");
    openInviteBtn.setAttribute("aria-expanded", "true");
    playBackgroundMusic();
    window.setTimeout(() => {
        openInviteBtn.blur();
        document.body.classList.remove("intro-active");
        resetPageScrollToTop();
        window.requestAnimationFrame(resetPageScrollToTop);
        document.body.classList.add("invitation-visible");
        invitation.setAttribute("aria-hidden", "false");
        intro.classList.add("fade-out");
        revealVisibleSections();
        window.setTimeout(() => {
            intro.hidden = true;
        }, 900);
    }, OPENING_DURATION_MS);
}

function revealVisibleSections() {
    const reveals = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
        reveals.forEach((node) => node.classList.add("visible"));
        return;
    }
    const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("visible");
            currentObserver.unobserve(entry.target);
        });
    }, {threshold: 0.2, rootMargin: "0px 0px -8% 0px"});
    reveals.forEach((node, index) => {
        node.style.transitionDelay = `${Math.min(index * 90, 360)}ms`;
        observer.observe(node);
    });
}

function observeHeroVisibility() {
    if (!letterHero) return;
    if (!("IntersectionObserver" in window)) {
        document.body.classList.add("hero-in-view");
        return;
    }
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            document.body.classList.toggle("hero-in-view", entry.isIntersecting);
        });
    }, {threshold: 0.22});
    heroObserver.observe(letterHero);
}

function setCountdownValues(days, hours, minutes, seconds) {
    document.getElementById("days").textContent = String(days).padStart(2, "0");
    document.getElementById("hours").textContent = String(hours).padStart(2, "0");
    document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
    document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}

function updateCountdown() {
    const now = Date.now();
    const difference = targetWeddingDate - now;
    const countdownMessage = document.getElementById("countdownMessage");
    const locale = getLocale();
    if (difference <= 0) {
        setCountdownValues(0, 0, 0, 0);
        countdownMessage.textContent = locale.countdownToday;
        return false;
    }
    const days = Math.floor(difference / ONE_DAY_MS);
    const hours = Math.floor((difference % ONE_DAY_MS) / ONE_HOUR_MS);
    const minutes = Math.floor((difference % ONE_HOUR_MS) / ONE_MINUTE_MS);
    const seconds = Math.floor((difference % ONE_MINUTE_MS) / ONE_SECOND_MS);
    setCountdownValues(days, hours, minutes, seconds);
    countdownMessage.textContent = locale.countdownWaiting;
    return true;
}

function handleLanguageSwitcherClick(event) {
    const button = event.target.closest(".language-option");
    if (!button) return;
    const selectedLanguage = button.dataset.language;
    if (!selectedLanguage || selectedLanguage === currentLanguage || !LOCALES[selectedLanguage]) return;
    applyTranslations(selectedLanguage);
    updateCountdown();
    saveLanguagePreference(selectedLanguage);
}

openInviteBtn.addEventListener("click", openInvitation);
if (languageSwitcher) languageSwitcher.addEventListener("click", handleLanguageSwitcherClick);
if (musicToggleBtn) musicToggleBtn.addEventListener("click", toggleBackgroundMusic);
if (backgroundMusic) {
    backgroundMusic.loop = true;
    backgroundMusic.volume = MUSIC_VOLUME;
}

document.body.classList.add("intro-active");
resetPageScrollToTop();
observeHeroVisibility();
applyTranslations(getInitialLanguage());
window.addEventListener("resize", scheduleOrnamentNameFit);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => scheduleOrnamentNameFit());
updateCountdown();
const countdownInterval = window.setInterval(() => {
    const hasTimeLeft = updateCountdown();
    if (!hasTimeLeft) window.clearInterval(countdownInterval);
}, 1000);

renderWishes();
setupWishesToggle();
setupWishesForm();
