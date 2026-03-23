import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    GoogleAuthProvider,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

import {
    getFirestore,
    collection,
    query,
    where,
    limit,
    orderBy,
    onSnapshot,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-storage.js";

let isInitialLoading = true;

const firebaseConfig = {
    apiKey: "AIzaSyBvYHO1sYbPw35VRai37By4sqz0OKnml_0",
    authDomain: "architect-pro-839a5.firebaseapp.com",
    projectId: "architect-pro-839a5",
    storageBucket: "architect-pro-839a5.firebasestorage.app",
    messagingSenderId: "970538126376",
    appId: "1:970538126376:web:1d41594e31f0f9c19c391d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app)

const loginBtn = document.getElementById('btn-login');
if (loginBtn) {
    loginBtn.onclick = async () => {
        const email = document.getElementById('auth-email').value;
        const pass = document.getElementById('auth-password').value;
        if (!email || !pass) return alert("Enter your email and password!");

        try {
            await signInWithEmailAndPassword(auth, email, pass);
            console.log("You have logged in successfully!");
        } catch (err) {
            if (err.code === 'auth/user-not-found') alert("No such user exists.Click Register!");
            else if (err.code === 'auth/wrong-password') alert("Incorrect password!");
            else alert("Błąd: " + err.message);
        }
    };
}

const i18n = {
    pl: {
        "app_title": "Architect Pro | Visual Hierarchy Edition",
        "architect_pro": "Architect Pro",
        "email": "Email",
        "haslo": "Hasło",
        "nowa-kolekcja": "Nowa Kolekcja",
        "no_account": "Nie masz konta? Zarejestruj się",
        "continue_google": "Continue with Google",
        "loading": "Ładowanie...",
        "new_collection": "+ NOWA KOLEKCJA",
        "name_and_enter": "Nazwa i Enter...",
        "all": "Wszystkie",
        "favorites": "Ulubione",
        "db_structure": "Struktura bazy",
        "logout": "Wyloguj",
        "login": "Zaloguj",
        "search_placeholder": "Szukaj zasobów lub tagów...",
        "file": "Plik",
        "add_new": "Dodaj nowy",
        "resource_editor": "Edytor Zasobu",
        "close": "Zamknij",
        "update_changes": "AKTUALIZUJ ZMIANY",
        "delete_permanently": "USUŃ TRWALE",
        "power_add_engine": "Power Add Engine",
        "resource_type": "Typ Zasobu",
        "content_placeholder": "Wpisz treść, notatkę lub wklej link...",
        "tags_placeholder": "Tagi (po przecinku)...",
        "archive_in_db": "Archiwizuj w bazie",
        "system": "System",
        "configuration": "Configuration",
        "main_settings": "Główne",
        "personalization": "Personalizacja",
        "sound": "Dźwięk",
        "performance": "Wydajność",
        "security": "Bezpieczeństwo",
        "developer": "Deweloper",
        "back": "Powrót",
        "save": "Zapisz",
        "manage_profile": "Zarządzaj podstawową tożsamością swojego profilu.",
        "display_name": "Nazwa wyświetlana",
        "your_name": "Twoje imię...",
        "push_notifications": "Powiadomienia push",
        "system_language": "Język Systemowy",
        "appearance": "Wygląd",
        "ui_opacity": "Przezroczystość UI",
        "corner_radius": "Zaokrąglenie rogów",
        "all_filter": "ALL",
        "links_filter": "LINKS",
        "files_filter": "FILES",
        "note_type": "NOTE",
        "code_type": "CODE",
        "system_volume": "Głośność Systemowa",
        "manage_audio": "Zarządzaj audio i efektami dźwiękowymi.",
        "ui_effects": "Efekty interfejsu"
    },
    en: {
        "app_title": "Architect Pro | Visual Hierarchy Edition",
        "architect_pro": "Architect Pro",
        "email": "E-mail",
        "haslo": "Password",
        "no_account": "Don't have an account? Register",
        "continue_google": "Continue with Google",
        "loading": "Loading...",
        "new_collection": "NEW COLLECTION",
        "name_and_enter": "Name and Enter...",
        "all": "All",
        "favorites": "Favorite",
        "db_structure": "Database structure",
        "logout": "Log out",
        "login": "Log in",
        "search_placeholder": "Search for resources or tags...",
        "file": "File",
        "add_new": "Add new",
        "resource_editor": "Resource Editor",
        "close": "Close",
        "update_changes": "UPDATE CHANGES",
        "delete_permanently": "PERMANENTLY DELETE",
        "power_add_engine": "Power Add Engine",
        "resource_type": "Resource Type",
        "content_placeholder": "Enter content, note or paste link...",
        "tags_placeholder": "Tags (comma separated)...",
        "archive_in_db": "Archive in the database",
        "system": "System",
        "configuration": "Configuration",
        "main_settings": "Main",
        "personalization": "Personalization",
        "sound": "Sound",
        "performance": "Efficiency",
        "security": "Security",
        "developer": "Developer",
        "back": "Return",
        "save": "Save",
        "manage_profile": "Manage the primary identity of your profile.",
        "display_name": "Display name",
        "your_name": "Your name...",
        "push_notifications": "Push notifications",
        "system_language": "System Language",
        "appearance": "Appearance",
        "ui_opacity": "UI transparency",
        "corner_radius": "Rounding the corners",
        "all_filter": "ALL",
        "links_filter": "LINKS",
        "files_filter": "FILES",
        "note_type": "NOTE",
        "code_type": "CODE"
    }
};

let currentLang = navigator.language.startsWith('en') ? 'en' : 'pl';

function translatePage() {
    const translations = i18n[currentLang];
    if (!translations) return;

    const allElements = document.querySelectorAll('*');

    allElements.forEach(el => {

        let key = el.getAttribute('data-i18n-key');
        
        if (!key && el.childNodes.length > 0) {
            el.childNodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE && node.textContent.includes("$t(")) {
                    const match = node.textContent.match(/\$t\(['"](.+?)['"]\)/);
                    if (match) {
                        key = match[1];
                        el.setAttribute('data-i18n-key', key);
                    }
                }
            });
        }

        if (key && translations[key]) {
            el.textContent = translations[key];
        }

        if (el.placeholder) {
            if (el.placeholder.includes("$t(")) {
                const match = el.placeholder.match(/\$t\(['"](.+?)['"]\)/);
                if (match) el.setAttribute('data-i18n-placeholder', match[1]);
            }
            const pKey = el.getAttribute('data-i18n-placeholder');
            if (pKey && translations[pKey]) {
                el.placeholder = translations[pKey];
            }
        }
    });
}

const savedLang = localStorage.getItem('userLanguage');
if (savedLang) {
    currentLang = savedLang;
}

document.addEventListener('DOMContentLoaded', translatePage)

function changeLanguage(langCode) {
    currentLang = langCode;
    localStorage.setItem('userLanguage', langCode);

    translatePage();

    console.log("Language changed to: " + langCode);
}

const googleBtn = document.getElementById('google-login-btn');
if (googleBtn) {
    googleBtn.onclick = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (err) {
            if (err.code === 'auth/account-exists-with-different-credential') {
                alert("This email address is already registered with a password. Please log in with your password to link your accounts.");
            } else {
                alert("Login error: " + err.message);
            }
        }
    };
}

const registerBtn = document.getElementById('register-btn');
if (registerBtn) {
    registerBtn.onclick = async () => {
        const email = document.getElementById('auth-email').value;
        const pass = document.getElementById('auth-password').value;
        if (!email || !pass) return alert("Wpisz e-mail i hasło dla nowego konta!");

        try {
            await createUserWithEmailAndPassword(auth, email, pass);
            alert("Account created successfully! You are now logged in.");
        } catch (err) {
            if (err.code === 'auth/email-already-in-use') alert("This email is already taken!");
            else if (err.code === 'auth/weak-password') alert("The password must be at least 6 characters long!");
            else alert("Registration error: " + err.message);
        }
    };
}

const ICONS = {
    folder: `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 width="14" height="14" viewBox="0 0 512 512" xml:space="preserve">
<path fill="#FCD354" opacity="1.000000" stroke="none" 
	d="
M513.000000,137.000000 
	C513.000000,234.354767 513.000000,331.709534 512.718262,429.199219 
	C511.953033,430.124634 511.343018,430.864746 511.005035,431.713196 
	C505.332855,445.952759 490.592010,457.123932 474.983643,457.104980 
	C329.207092,456.927917 183.430237,457.017395 37.653572,456.903931 
	C33.870476,456.901001 29.922153,455.925476 26.336681,454.619141 
	C14.846350,450.432739 7.086315,442.365753 2.872280,430.860077 
	C2.705878,430.405731 1.644419,430.279236 1.000002,430.000000 
	C1.000000,314.978577 1.000000,199.957138 1.283464,84.801025 
	C2.017307,84.207024 2.709845,83.824249 2.882781,83.277214 
	C7.663084,68.156128 24.265808,56.590626 39.923183,56.816433 
	C78.685974,57.375469 117.462250,56.992008 156.233109,57.003391 
	C175.463715,57.009037 189.639542,66.381042 200.968033,81.505188 
	C212.526871,96.272415 224.207001,110.545105 235.354477,125.222351 
	C241.521713,133.342407 249.128204,137.072357 259.255035,137.059753 
	C343.836578,136.954468 428.418335,136.999985 513.000000,137.000000 
z"/>
<path fill="#FFB125" opacity="1.000000" stroke="none" 
	d="
M200.968033,81.505188 
	C202.859665,81.119728 204.852432,81.007698 206.845184,81.007507 
	C296.214691,80.998848 385.584503,81.115433 474.953461,80.892349 
	C490.820618,80.852745 505.321106,92.205849 511.023163,106.271408 
	C511.366577,107.118523 511.955963,107.865936 512.715454,108.329865 
	C513.000000,117.354225 513.000000,126.708458 513.000000,136.531342 
	C428.418335,136.999985 343.836578,136.954468 259.255035,137.059753 
	C249.128204,137.072357 241.521713,133.342407 235.354477,125.222351 
	C224.207001,110.545105 212.526871,96.272415 200.968033,81.505188 
z"/>
</svg>`,
    file: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>`,
    link: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
    delete: `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
 width="14" height="14" viewBox="0 0 20 20" enable-background="new 0 0 512 512" xml:space="preserve">
<path fill="#FFFFFF" opacity="1.000000" stroke="none" 
d="
M211.000000,0.999999 
C241.354233,1.000000 271.708466,1.000000 302.236908,1.325844 
C303.521271,2.208075 304.586334,2.892473 305.748322,3.301596 
C322.534424,9.211809 338.162201,27.718729 337.049286,47.604980 
C336.728027,53.345058 337.000000,59.118336 337.000000,65.000000 
C366.295044,65.000000 394.945038,65.197922 423.589661,64.890999 
C433.411469,64.785759 442.149231,66.831985 449.899261,72.971657 
C458.857300,80.068344 464.712372,89.021118 464.903778,100.591721 
C465.245514,121.247963 465.008362,141.913925 464.995850,162.575821 
C464.990906,170.747589 458.684387,176.979385 450.446442,176.998810 
C447.333252,177.006149 444.220062,177.000000 440.904327,177.000000 
C440.249298,188.879227 439.622772,200.207428 439.000549,211.535873 
C438.332184,223.704681 437.599182,235.870422 437.019165,248.043457 
C436.280640,263.541565 435.716095,279.047882 434.984650,294.546356 
C434.394409,307.052124 433.607422,319.548584 433.017212,332.054352 
C432.285767,347.552826 431.716095,363.058868 430.984650,378.557343 
C430.394440,391.063141 429.600922,403.559326 429.018677,416.065430 
C428.281677,431.896820 427.212158,447.730988 427.108978,463.569305 
C426.962128,486.102692 414.906830,503.217255 394.456940,511.054016 
C393.816742,511.299377 393.478821,512.333557 393.000000,513.000000 
C302.979095,513.000000 212.958206,513.000000 122.763115,512.674011 
C121.785522,511.894623 121.028015,511.312744 120.171898,511.007080 
C106.231804,506.030304 96.222511,497.156464 90.452530,483.177612 
C86.113014,472.664337 87.229340,461.669769 86.149284,450.900452 
C84.851715,437.962433 84.625542,424.914673 84.012810,411.910797 
C83.298248,396.745605 82.706284,381.574646 81.988037,366.409668 
C81.380020,353.572144 80.621727,340.741791 80.013725,327.904266 
C79.295471,312.739288 78.706276,297.568146 77.988029,282.403168 
C77.380020,269.565643 76.624954,256.735138 76.012901,243.897827 
C75.297806,228.899323 74.567833,213.900253 74.043198,198.894470 
C73.792206,191.715729 74.000000,184.520935 74.000000,177.000000 
C69.441124,177.000000 66.305565,177.013229 63.170151,176.997406 
C55.281399,176.957565 49.010880,170.646805 49.004940,162.693497 
C48.990002,142.699173 49.353504,122.696815 48.898865,102.712837 
C48.459385,83.395401 67.289772,64.656258 86.798698,64.907349 
C114.952705,65.269699 143.114838,65.000000 171.273514,65.000000 
C173.059402,65.000000 174.845276,65.000000 177.000000,65.000000 
C177.000000,61.637413 176.987122,58.677708 177.002808,55.718151 
C177.031067,50.391846 176.156250,44.862198 177.280640,39.776062 
C181.259933,21.775997 191.883133,9.197958 209.536987,2.942560 
C210.174103,2.716806 210.518951,1.666190 211.000000,0.999999 
M224.500000,481.000000 
C274.490479,481.000000 324.481171,481.077240 374.471283,480.946289 
C387.139069,480.913116 392.562012,475.629242 393.752991,466.691254 
C395.401489,454.319489 395.354095,441.720001 395.994324,429.216064 
C396.685669,415.714813 397.351318,402.212158 397.993652,388.708466 
C398.683380,374.207153 399.315369,359.703156 400.005127,345.201843 
C400.647400,331.698151 401.351379,318.197388 401.993683,304.693695 
C402.683411,290.192383 403.412018,275.692291 403.975128,261.185852 
C404.431061,249.440262 404.667084,237.686157 404.998962,225.935760 
C405.013092,225.436188 404.988068,224.934814 405.018066,224.436493 
C405.962891,208.743988 406.912292,193.051758 407.872223,177.173401 
C307.218018,177.173401 206.793060,177.173401 106.133156,177.173401 
C106.763092,186.290344 107.505463,195.223358 107.970337,204.170822 
C108.740860,219.001083 109.304222,233.841995 110.008560,248.675858 
C110.633949,261.847076 111.364532,275.013336 111.989914,288.184540 
C112.694244,303.018433 113.304207,317.856781 114.008545,332.690643 
C114.633934,345.861847 115.377365,359.027557 115.986794,372.199463 
C116.703926,387.699310 117.383133,403.201324 117.982864,418.706116 
C118.404999,429.619843 118.612549,440.541809 119.024757,451.456024 
C119.216995,456.546112 119.027611,461.781433 120.209709,466.660522 
C121.101471,470.341370 123.115929,474.719055 126.042740,476.695465 
C129.792679,479.227661 134.945267,480.761383 139.517960,480.820099 
C167.508133,481.179657 195.505219,481.000000 224.500000,481.000000 
M97.576668,97.000000 
C95.743340,97.000015 93.908455,96.950706 92.076965,97.008766 
C84.954559,97.234573 81.144226,101.023819 81.021858,108.191986 
C80.916618,114.356506 81.000000,120.524261 81.000000,126.690582 
C80.999992,132.775558 81.000000,138.860535 81.000000,144.646500 
C198.779663,144.646500 315.847198,144.646500 433.000000,144.646500 
C433.000000,132.964401 432.954529,121.635414 433.013794,110.306961 
C433.065033,100.508636 429.532928,96.975800 419.538849,96.978958 
C312.544769,97.012787 205.550720,97.000000 97.576668,97.000000 
M211.331100,42.138721 
C210.258896,49.616966 209.186707,57.095207 208.090683,64.739655 
C241.275848,64.739655 273.003265,64.739655 304.999573,64.739655 
C304.999573,60.179649 305.395630,55.833366 304.925781,51.582790 
C303.478943,38.493683 298.563568,33.597000 285.677429,33.165844 
C266.542175,32.525597 247.365387,32.772072 228.215271,33.126896 
C221.738052,33.246914 215.183319,34.642906 211.331100,42.138721 
z"/>
<path fill="#FFFFFF" opacity="1.000000" stroke="none" 
d="
M321.000000,336.000000 
C321.000000,298.338440 320.998230,261.176849 321.001190,224.015274 
C321.001984,214.326462 326.902069,208.996765 337.603058,208.999985 
C347.019806,209.002838 352.998932,214.854599 352.999146,224.082825 
C353.000732,294.073242 353.001129,364.063629 352.998657,434.054047 
C352.998322,443.488983 346.890747,449.002472 336.466309,449.000031 
C327.027252,448.997833 321.001923,443.154877 321.001129,433.986511 
C320.998260,401.490997 321.000000,368.995514 321.000000,336.000000 
z"/>
<path fill="#FFFFFF" opacity="1.000000" stroke="none" 
d="
M185.091370,447.418304 
C174.926193,451.138519 165.176987,448.731384 161.872589,439.408997 
C161.347565,437.927765 161.035904,436.284729 161.035004,434.716248 
C160.994583,364.247803 160.996445,293.779358 161.004837,223.310883 
C161.005798,215.168747 167.351929,209.300064 175.657990,208.917511 
C183.390518,208.561340 189.088455,211.097885 192.073135,218.454010 
C192.718246,220.043991 192.962311,221.899612 192.963364,223.633133 
C193.006256,293.934998 192.992477,364.236877 193.013870,434.538757 
C193.015640,440.343262 190.431335,444.459656 185.091370,447.418304 
z"/>
<path fill="#FFFFFF" opacity="1.000000" stroke="none" 
d="
M272.916504,219.765472 
C272.993317,291.650879 272.999573,363.110107 272.996002,434.569366 
C272.995605,442.740509 266.675171,448.706909 258.464325,449.078430 
C250.781952,449.426086 244.997772,447.038635 241.948593,439.670654 
C241.351379,438.227539 241.038818,436.557861 241.037857,434.992401 
C240.994171,364.366028 240.995270,293.739594 241.006851,223.113190 
C241.008102,215.511810 247.393967,209.456924 254.849838,208.901443 
C263.470520,208.259201 269.348053,211.543411 272.916504,219.765472 
z"/>
</svg>`,
    star: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 210.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`
};


let items = [];
let collections = [];
let activeCollection = 'all';
let activeTypeFilter = 'all';
let searchQuery = '';
let expandedCollections = new Set();
let currentEditId = null;
let qaPrio = 'med';
let qaType = 'link';
let tempEditPrio = 'med';
let itemsLimit = 10;

function initAppForUser() {
    const user = auth.currentUser;
    if (!user) return;

    showSkeletonScreens();

    const qColl = query(
        collection(db, 'collections'),
        where("userId", "==", user.uid)
    );

    onSnapshot(qColl, snap => {
        collections = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        renderSidebar();
        renderFeed();
    });

    const qItems = query(
        collection(db, 'raindrop_items'),
        where("userId", "==", user.uid),
        orderBy('createdAt', 'desc'),
        limit(itemsLimit)
    );

    onSnapshot(qItems, snap => {
        if (isInitialLoading) {
            items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            renderFeed();

            setTimeout(() => {
                initMasonry();
            }, 1000);

            isInitialLoading = false;
            return;
        }

        snap.docChanges().forEach((change) => {
            const docData = { id: change.doc.id, ...change.doc.data() };

            if (change.type === "added") {
                items.unshift(docData);
                prependSingleElementToUI(docData);

                const newElement = document.querySelector(`[data-id="${docData.id}"]`);
                if (newElement) {
                    setTimeout(() => resizeGridItem(newElement), 50);
                }
            }
            if (change.type === "modified") {
                const index = items.findIndex(item => item.id === docData.id);
                if (index !== -1) items[index] = docData;
                updateSingleElementInUI(docData);
            }
            if (change.type === "removed") {
                items = items.filter(item => item.id !== docData.id);
                removeElementFromUI(docData.id);
            }
        });

        renderSidebar();
    }, (error) => {
        console.error("Snapshot Error:", error);
    });

    const iconAllContainer = document.getElementById('icon-all');
    if (iconAllContainer) iconAllContainer.innerHTML = ICONS.folder;
}

function showSkeletonScreens() {
    const feedContainer = document.getElementById('feed-container');
    if (!feedContainer) return;

    const skeletonHTML = Array(6).fill(0).map(() => `
        <div class="skeleton-card">
            <div class="skeleton-image"></div>
            <div class="skeleton-text short"></div>
            <div class="skeleton-text long"></div>
        </div>
    `).join('');

    feedContainer.innerHTML = skeletonHTML;
}

onAuthStateChanged(auth, async (user) => {
    const overlay = document.getElementById('auth-overlay');
    const userDisplayName = document.getElementById('user-display-name');
    const userAvatar = document.getElementById('user-avatar');
    const loginTrigger = document.getElementById('btn-login-trigger');
    const logoutBtn = document.getElementById('logout-btn');

    if (user) {
        if (overlay) overlay.style.display = 'none';

        if (logoutBtn) logoutBtn.style.display = '';
        if (loginTrigger) loginTrigger.style.display = 'none';

        if (logoutBtn) {
            logoutBtn.onclick = async () => {
                try {
                    await signOut(auth);

                    localStorage.clear();

                    window.location.reload();

                    console.log("Wylogowano pomyślnie i zresetowano stan.");
                } catch (err) {
                    console.error("Błąd podczas wylogowywania:", err);
                    alert("Wystąpił błąd podczas wylogowywania.");
                }
            };
        }

        userDisplayName.textContent = user.displayName || user.email.split('@')[0];
        if (user.photoURL) {
            userAvatar.innerHTML = `<img src="${user.photoURL}" class="w-full h-full object-cover">`;
        }

        loadUserSettings(user);
        initAppForUser();
    } else {
        if (overlay) overlay.style.display = 'none';

        if (loginTrigger) loginTrigger.style.display = 'block';
        if (logoutBtn) logoutBtn.style.display = 'none';

        if (loginTrigger) {
            loginTrigger.onclick = () => {
                if (overlay) overlay.style.display = 'flex';
            };
        }

        if (userDisplayName) userDisplayName.textContent = "Guest";
        if (userAvatar) userAvatar.innerHTML = "";

        const feedContainer = document.getElementById('feed-container');
        if (feedContainer) {
            feedContainer.innerHTML = '<p class="empty-state">Log in to manage your files.</p>';
        }
    }
    isInitialLoading = false;
});

document.getElementById('btn-login').onclick = async () => {
    const e = document.getElementById('auth-email').value;
    const p = document.getElementById('auth-password').value;
    try { await signInWithEmailAndPassword(auth, e, p); }
    catch (err) { alert("Błąd: " + err.message); }
};

let isLoginMode = true;

document.getElementById('toggle-auth').onclick = () => {
    isLoginMode = !isLoginMode;
    const loginBtn = document.getElementById('btn-login');
    const regBtn = document.getElementById('register-btn');
    const toggleText = document.getElementById('toggle-auth');

    if (isLoginMode) {
        loginBtn.classList.remove('hidden');
        regBtn.classList.add('hidden');
        toggleText.innerText = "Don't have an account? Sign up";
    } else {
        loginBtn.classList.add('hidden');
        regBtn.classList.remove('hidden');
        toggleText.innerText = "Already have an account ? Log in ";
    }
};
document.getElementById('btn-new-coll').onclick = () => {
    document.getElementById('new-proj-box').classList.toggle('hidden');
};

document.getElementById('proj-name-in').onkeydown = async (e) => {
    if (e.key === 'Enter' && e.target.value) {
        const user = auth.currentUser;
        await addDoc(collection(db, 'collections'), {
            name: e.target.value,
            parentId: 'global',
            createdAt: serverTimestamp(),
            userId: user.uid
        });
        e.target.value = '';
        document.getElementById('new-proj-box').classList.add('hidden');
    }
};

function updateSingleElementInUI(data) {
    const element = document.querySelector(`[data-id="${data.id}"]`);
    if (element) {
        element.innerHTML = createCardContentHTML(data);

        const isImage = data.type === 'file' && /\.(jpg|jpeg|png|gif|webp)$/i.test(data.content || '');
        if (isImage) {
            loadImagesInBackground([data]);
        }

        element.style.transition = 'background-color 0.5s';
        element.style.backgroundColor = 'rgba(252, 211, 84, 0.1)';
        setTimeout(() => element.style.backgroundColor = '', 1000);
    }
}

function prependSingleElementToUI(data) {
    const container = document.getElementById('feed-container');
    if (!container) return;

    const isLink = data.type === 'link';
    const isCode = data.type === 'code';
    const isFile = data.type === 'file';
    const isNote = !isLink && !isCode && !isFile;
    const noteClass = isNote ? 'is-note-card' : '';

    const div = document.createElement('div');
    div.setAttribute('data-id', data.id);
    div.className = `item-card p-6 flex flex-col group transition-all ${noteClass}`;
    div.style.borderRadius = "var(--global-radius)";
    div.onclick = () => window.openEditor(data.id);
    div.oncontextmenu = (e) => {
        const container = document.getElementById('feed-container');
        // Sprawdzamy czy kontener istnieje i czy ma klasę view-details
        const isDetailsMode = container && container.classList.contains('view-details');

        if (isDetailsMode && data.type === 'link' && data.linkData?.fullUrl) {
            window.open(data.linkData.fullUrl, '_blank');
            // Jeśli chcesz, aby przy okazji NIE otwierało się menu systemowe, dodaj:
            // e.preventDefault(); 
        }
    };
    div.innerHTML = createCardContentHTML(data);

    container.prepend(div);

    const isImage = data.type === 'file' && /\.(jpg|jpeg|png|gif|webp)$/i.test(data.content || '');
    if (isImage) {
        loadImagesInBackground([data]);
    }
}

function removeElementFromUI(id) {
    const element = document.querySelector(`[data-id="${id}"]`);
    if (element) {
        element.style.transform = 'scale(0.95)';
        element.style.opacity = '0';
        setTimeout(() => element.remove(), 300);
    }
}
document.querySelectorAll('.view-filter').forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll('.view-filter').forEach(b => {
            b.classList.remove('bg-white/10', 'text-white');
            b.classList.add('text-gray-400');
        });

        btn.classList.remove('text-gray-400');
        btn.classList.add('bg-white/10', 'text-white');

        activeTypeFilter = btn.dataset.type;
        renderFeed();
    };
});

function renderSidebar() {
    const container = document.getElementById('project-nav');
    if (!container) return;

    const rootFolders = collections.filter(c => !c.parentId || c.parentId === 'global');

    const countAll = document.getElementById('count-all');
    if (countAll) countAll.innerText = items.length;

    container.innerHTML = rootFolders.map(c => renderFolder(c)).join('');
}

function renderFolder(folder) {
    const isOpen = expandedCollections.has(folder.id);
    const subFolders = collections.filter(f => f.parentId === folder.id);
    const isActive = activeCollection === folder.id;
    const folderItems = items.filter(i => i.collectionId === folder.id);

    const itemsHtml = folderItems.map(item => {
        let iconHtml = ICONS.file;
        if (item.type === 'link') {
            iconHtml = item.linkData?.favicon
                ? `<img src="${item.linkData.favicon}" style="border-radius: var(--global-radius);" class="w-4 h-4">`
                : ICONS.link;
        }

        const isItemActive = currentEditId === item.id;
        const displayTitle = (item.type === 'link' && item.linkData?.title)
            ? item.linkData.title
            : item.content;

        const truncatedTitle = displayTitle.substring(0, 18) + (displayTitle.length > 18 ? '...' : '');

        return `
            <div class="nav-item-entry group/item ${isItemActive ? 'active-item' : ''}" onclick="event.stopPropagation(); window.openEditor('${item.id}')">
                <span class="flex items-center w-4 h-4 justify-center">${iconHtml}</span>
                <span class="truncate">${truncatedTitle}</span>
            </div>
            <div class="item-actions">
                <button class="action-btn btn-fav-quick ${item.isFav ? 'text-amber-500 opacity-100' : ''}" 
                        onclick="event.stopPropagation(); window.toggleFav('${item.id}', ${item.isFav})">
                    ${ICONS.star}
                </button>
                <button class="action-btn btn-delete-quick" 
                        onclick="event.stopPropagation(); window.quickDelete('${item.id}')">
                    ${ICONS.delete}
                </button>
            </div>
    `;
    }).join('');

    const folderIcon = folder.isAutoGenerated ? ICONS.folder : ICONS.folder;

    return `
    <div class="folder-group mb-2">
        <div data-id="${folder.id}" class="collection-item group flex items-center justify-between p-3 text-[14px] font-semibold cursor-pointer transition-all ${isActive ? 'active-folder' : 'text-gray-400 hover:bg-white/5'}" 
             style="border-radius: var(--global-radius);"
             onclick="window.setCollection('${folder.id}')">
            <div class="flex items-center gap-3 truncate">
                <span class="coll-arrow ${isOpen ? 'open' : ''}" onclick="window.toggleExpand(event, '${folder.id}')">▶</span>
                <span class="flex items-center gap-2 truncate">
                    <span class="flex items-center justify-center w-4 h-4">${folderIcon}</span>
                    ${folder.name.toUpperCase()}
                </span>
            </div>
        </div>
        ${isOpen ? `
            <div class="sub-folder ml-4 border-l border-white/5">
                ${subFolders.map(sf => renderFolder(sf)).join('')}
                <div class="folder-items-container mt-2 mb-3">
                    ${itemsHtml}
                </div>
            </div>
        ` : ''}
    </div>`;
}

let renderedCount = 0;
const ITEMS_PER_BATCH = 15;
let allFilteredItems = [];
function renderFeed() {
    const feedContainer = document.getElementById('feed-container');
    if (!feedContainer) return;

    // 1. Resetujemy widok
    feedContainer.innerHTML = '';
    renderedCount = 0; // Ważne dla Twojego systemu batchingu

    let foldersToRender = [];
    let itemsToRender = [];

    // 2. Logika wyboru danych
    if (!activeCollection || activeCollection === 'all') {
        // Widok główny: Foldery "root" + wszystkie pliki
        foldersToRender = collections.filter(f => f.parentId === 'global' || !f.parentId);
        itemsToRender = items;
    } else {
        // Widok kolekcji: Podfoldery + pliki z tej kolekcji
        foldersToRender = collections.filter(f => f.parentId === activeCollection);
        itemsToRender = items.filter(i => i.collectionId === activeCollection);
    }

    // 3. Renderowanie Folderów (jako karty Grid)
    foldersToRender.forEach(folder => {
        const folderCard = document.createElement('div');
        // Używamy Twojej klasy item-card dla identycznego wyglądu
        folderCard.className = 'grid-item item-card animate-slide-up flex flex-col p-6 cursor-pointer';
        folderCard.style.borderRadius = "var(--global-radius)";
        folderCard.style.background = "var(--bg-card)";
        folderCard.style.border = "1px solid rgba(255,255,255,0.05)";

        folderCard.innerHTML = `
            <div class="card-content flex items-center gap-4 py-2">
                <div class="w-12 h-12 bg-amber-500/10 text-amber-500 flex items-center justify-center rounded-xl text-2xl">
                    ${ICONS.folder}
                </div>
                <div class="truncate">
                    <p class="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Kolekcja</p>
                    <p class="text-sm font-semibold truncate text-gray-200">${folder.name.toUpperCase()}</p>
                </div>
            </div>
        `;

        folderCard.onclick = () => window.setCollection(folder.id);
        feedContainer.appendChild(folderCard);

        // Musimy zmierzyć wysokość folderu dla Masonry
        resizeGridItem(folderCard);
    });

    // 4. Renderowanie Plików/Linków
    itemsToRender.forEach(item => {
        const isNote = item.type !== 'link' && item.type !== 'code' && item.type !== 'file';
        const noteClass = isNote ? 'is-note-card' : '';

        const card = document.createElement('div');
        card.setAttribute('data-id', item.id);
        // Dodajemy 'grid-item' - kluczowe dla Twojej funkcji resizeGridItem
        card.className = `grid-item item-card p-6 flex flex-col group transition-all animate-slide-up ${noteClass}`;
        card.style.borderRadius = "var(--global-radius)";
        card.onclick = () => window.openEditor(item.id);

        card.oncontextmenu = (e) => {
            const container = document.getElementById('feed-container');
            const isDetailsMode = container && container.classList.contains('view-details');

            if (isDetailsMode && item.type === 'link' && item.linkData?.fullUrl) {
                window.open(item.linkData.fullUrl, '_blank');
            }
        };

        // Używamy Twojej oryginalnej funkcji treści
        card.innerHTML = createCardContentHTML(item);

        feedContainer.appendChild(card);

        // Obsługa obrazów dla Masonry
        const imgInside = card.querySelector('img');
        if (imgInside) {
            // Jeśli obrazek już jest w cache, resize od razu, jeśli nie - po załadowaniu
            if (imgInside.complete) {
                resizeGridItem(card);
            } else {
                imgInside.onload = () => resizeGridItem(card);
            }
        } else {
            resizeGridItem(card);
        }
    });

    // 5. Finalizacja i ładowanie obrazów w tle
    const imagesToLoad = itemsToRender.filter(i =>
        i.type === 'file' && /\.(jpg|jpeg|png|gif|webp)$/i.test(i.content || '')
    );

    if (imagesToLoad.length > 0) {
        loadImagesInBackground(imagesToLoad);
    }

    // Wymuszamy przeliczenie siatki po krótkiej chwili
    setTimeout(() => {
        if (typeof rebuildMasonry === 'function') rebuildMasonry();
    }, 200);
}

function createCardContentHTML(i) {
    const pClass = i.priority === 'high' ? 'dot-high' : (i.priority === 'low' ? 'dot-low' : 'dot-med');
    const isLink = i.type === 'link';
    const isCode = i.type === 'code';
    const isImage = i.type === 'file' && /\.(jpg|jpeg|png|gif|webp)$/i.test(i.content || '');

    let subTitlte = '';
    if (isLink && i.linkData?.fullUrl) subTitlte = i.linkData.fullUrl;
    else if (i.isFile ** i.fileName) subTittle = i.fileName;
    else if (i.type === 'code') subTittle = 'source_code.js';

    let mainIconHtml = isCode ? '💻' : (i.type === 'file' ? '📄' : '📝');
    if (isLink) {
        mainIconHtml = (i.linkData && i.linkData.favicon)
            ? `<img src="${i.linkData.favicon}" class="w-6 h-6 rounded-sm" loading="lazy">`
            : '🔗';
    }

    let codePreviewHtml = isCode ? `
        <div class="mt-3 p-4 border border-white/10 bg-[#1e1e1e] font-consolas text-[11px] whitespace-pre-wrap overflow-hidden max-h-40" style="border-radius: var(--global-radius);">
            ${i.content}
        </div>` : '';

    let filePreviewHtml = '';
    if (i.type === 'file') {
        if (isImage) {
            filePreviewHtml = `
            <div id="bg-load-${i.id}" class="mt-3 overflow-hidden bg-white/5 border border-white/5 h-auto flex items-center justify-center" style="border-radius: var(--global-radius);">
                <div class="w-4 h-4 border-2 border-white/20 border-t-white/80 rounded-full animate-spin"></div>
            </div>`;
        } else {
            filePreviewHtml = `<div class="mt-3 p-4 bg-white/5 border border-dashed border-white/10 text-xs text-gray-500" style="border-radius: var(--global-radius);">Plik dokumentu</div>`;
        }
    }

    let actionBtnHtml = '';
    const btnText = isLink ? 'Open Website' : 'Open File';
    const btnUrl = isLink ? i.linkData?.fullUrl : i.fileUrl;

    if (btnUrl) {
        actionBtnHtml = `
            <div class="mt-4">
                <a href="${btnUrl}" target="_blank" onclick="event.stopPropagation()" class="action-btn-primary">
                    <button class="btn-container relative flex items-center h-[44px] px-2 pl-7 bg-white text-black rounded-full border border-white/10 transition-all duration-700 expo-out hover:bg-[#f8f8f8] hover:shadow-[0_20px_40px_-10px_rgba(255,255,255,0.1)] active:scale-[0.95] active:shadow-inner overflow-hidden">
                        <span class="relative z-10 text-[14px] font-medium tracking-tight transition-all duration-700 expo-out btn-container-hover:translate-x-2 btn-container-hover:mr-10 mr-8 select-none whitespace-nowrap">${btnText}</span>
                        <div class="relative h-[38px] w-[38px] bg-black text-white rounded-full flex items-center justify-center transition-all duration-700 expo-out btn-container-hover:w-[52px] btn-container-hover:bg-indigo-600 shrink-0 overflow-hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 absolute transition-all duration-700 expo-out btn-container-hover:translate-x-10 btn-container-hover:-translate-y-10 btn-container-hover:opacity-0"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 absolute -translate-x-10 translate-y-10 opacity-0 transition-all duration-700 expo-out btn-container-hover:translate-x-0 btn-container-hover:translate-y-0 btn-container-hover:opacity-100 btn-container-hover:rotate-90"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                        </div>
                    </button>
                </a>
            </div>`;
    }

    return `
        <div class="card-priority-indicator ${pClass}"></div>
        
        <div class="flex justify-between items-start mb-4 details-hide-header">
            <div class="w-10 h-10 bg-white/5 flex items-center justify-center text-lg rounded-lg">${mainIconHtml}</div>
            <button class="favorite-btn text-xl ${i.isFav ? 'text-amber-500' : 'text-gray-600'}" 
                    onclick="event.stopPropagation(); window.toggleFav('${i.id}', ${i.isFav})">
                ${i.isFav ? '⭐' : '☆'}
            </button>
        </div>

        <div class="card-body-wrapper">
            <div class="icon-details-view">${mainIconHtml}</div>
            <div class="card-content-text">
                <p class="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1 type-label">${i.type}</p>
                <p class="text-sm font-semibold truncate mb-1 text-gray-200 main-title">
                    ${isLink && i.linkData?.title ? i.linkData.title : (isCode ? 'Code snippet' : i.content)}
                </p>
                ${subTitlte ? `<p class="item-subtitle text-[11px] text-gray-500 truncate">${subTitlte}</p>` : ''}
            </div>
        </div>

        ${filePreviewHtml}
        ${codePreviewHtml}
        ${actionBtnHtml}
        
        <button class="favorite-btn-details ${i.isFav ? 'text-amber-500' : 'text-gray-600'}" 
                onclick="event.stopPropagation(); window.toggleFav('${i.id}', ${i.isFav})">
            ${i.isFav ? '⭐' : '☆'}
        </button>
    `;
}

function renderBatch() {
    const container = document.getElementById('feed-container');
    if (!container) return;

    const nextBatch = allFilteredItems.slice(renderedCount, renderedCount + ITEMS_PER_BATCH);
    if (nextBatch.length === 0) return;

    const htmlBatch = nextBatch.map(i => {
        const isLink = i.type === 'link';
        const isCode = i.type === 'code';
        const isFile = i.type === 'file';

        const isNote = !isLink && !isCode && !isFile;
        const noteClass = isNote ? 'is-note-card' : '';

        // Przygotowujemy zmienną z URL, żeby kod był czytelniejszy
        const linkUrl = i.linkData?.fullUrl || '';

        return `
    <div data-id="${i.id}" 
         class="item-card p-6 flex flex-col group transition-all ${noteClass}" 
         style="border-radius: var(--global-radius);" 
         onclick="window.openEditor('${i.id}')"
         oncontextmenu="if(document.getElementById('feed-container').classList.contains('view-details') && '${i.type}' === 'link') { event.preventDefault(); window.open('${linkUrl}', '_blank'); }">
        ${createCardContentHTML(i)}
    </div>`;
    }).join('');

    container.insertAdjacentHTML('beforeend', htmlBatch);
    renderedCount += nextBatch.length;

    const imagesInThisBatch = nextBatch.filter(i => i.type === 'file' && /\.(jpg|jpeg|png|gif|webp)$/i.test(i.content || ''));
    if (imagesInThisBatch.length > 0) {
        loadImagesInBackground(imagesInThisBatch);
    }

    if (renderedCount < allFilteredItems.length && typeof createObserver === 'function') {
        createObserver();
    }
}

function loadImagesInBackground(imageItems) {
    let loadedCount = 0;
    const total = imageItems.length;

    imageItems.forEach((item, index) => {

        setTimeout(() => {
            const placeholder = document.getElementById(`bg-load-${item.id}`);
            if (!placeholder) {
                updateProgress();
                return;
            }

            const img = new Image();
            img.src = item.fileUrl;
            img.className = "w-full object-cover opacity-0 transition-opacity duration-500 scale-1/2";

            img.onload = () => {
                placeholder.innerHTML = '';
                placeholder.appendChild(img);
                setTimeout(() => img.style.opacity = "1", 20);
                updateProgress();
            };

            img.onerror = () => {
                placeholder.innerHTML = '<span class="text-[10px] text-red-400">Błąd pliku</span>';
                updateProgress();
            };
        }, index * 50);
    });

    function updateProgress() {
        loadedCount++;
        const percent = Math.round((loadedCount / total) * 100);
        console.log(`%c ⏳ Pobieranie plików: ${percent}% (${loadedCount}/${total})`, "color: #ffaa00;");

        if (loadedCount === total) {

        }
    }
}

function createObserver() {
    const container = document.getElementById('feed-container');
    const items = container.querySelectorAll('.item-card');
    const lastItem = items[items.length - 1];

    if (!lastItem) return;

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            observer.unobserve(lastItem);
            renderBatch();
        }
    }, { threshold: 0.5 });

    observer.observe(lastItem);
}

window.openEditor = (id) => {
    currentEditId = id;
    const item = items.find(i => i.id === id);
    if (!item) return;
    tempEditPrio = item.priority;

    const editorAside = document.getElementById('editor-aside');
    editorAside.classList.remove('translate-x-full');

    document.getElementById('editor-form').innerHTML = `
        <div class="space-y-6">
            <div>
                <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Resource Priority</p>
                <div class="flex gap-4 bg-black/40 p-4 border border-white/5" style="border-radius: var(--global-radius);">
                    <div class="priority-dot dot-low ${tempEditPrio === 'low' ? 'active' : ''}" onclick="window.setEditPrio('low')"></div>
                    <div class="priority-dot dot-med ${tempEditPrio === 'med' ? 'active' : ''}" onclick="window.setEditPrio('med')"></div>
                    <div class="priority-dot dot-high ${tempEditPrio === 'high' ? 'active' : ''}" onclick="window.setEditPrio('high')"></div>
                </div>
            </div>

            <div>
                <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Treść</p>
                <textarea id="edit-content" class="w-full h-64 bg-black/20 border border-white/5 p-4 text-sm font-mono outline-none resize-none" style="border-radius: var(--global-radius);">${item.content}</textarea>
            </div>
        </div>
    `;
    renderSidebar();
};

window.setEditPrio = (p) => {
    tempEditPrio = p;
    document.querySelectorAll('#editor-form .priority-dot').forEach(d => {
        d.classList.toggle('active', d.classList.contains('dot-' + p));
    });
};

document.getElementById('update-item-btn').onclick = async () => {
    if (!currentEditId) return;
    const btn = document.getElementById('update-item-btn');
    const content = document.getElementById('edit-content').value;

    btn.innerText = "SAVING...";
    await updateDoc(doc(db, 'raindrop_items', currentEditId), {
        content: content,
        priority: tempEditPrio
    });
    btn.innerText = "UPDATED!";
    setTimeout(() => {
        btn.innerText = "UPDATE CHANGES"; }, 2000);
};

document.getElementById('delete-item-btn').onclick = async () => {
    if (!currentEditId) return;
    if (confirm("Are you sure you want to delete this resource?")) {
        await deleteDoc(doc(db, 'raindrop_items', currentEditId));
        document.getElementById('editor-aside').classList.add('translate-x-full');
        currentEditId = null;
    }
};

const isUrl = (string) => {
    try { return new URL(string); } catch (_) { return false; }
};

document.getElementById('qa-save').onclick = async () => {
    let content = document.getElementById('qa-content').value;
    const tags = document.getElementById('qa-tags').value.split(',').map(t => t.trim());

    if (qaType === 'code') {
        content = autoTrimCode(content);
    } else {
        content = content.trim();
    }

    if (!content) return;

    const user = auth.currentUser;
    if (!user) return alert("Authorization error - please log in again");

    let finalType = qaType;
    let linkMeta = {};

    const urlData = isUrl(content);

    if (qaType !== 'code' && qaType !== 'file') {
        if (urlData) {
            finalType = 'link';
            const faviconUrl = `https://www.google.com/s2/favicons?sz=64&domain=${urlData.hostname}`;
            linkMeta = {
                title: urlData.hostname.replace('www.', ''),
                favicon: faviconUrl,
                fullUrl: content
            };
        } else if (content.includes('```') || (content.length > 100 && (content.includes('{') || content.includes('function')))) {
            finalType = 'code';
            content = autoTrimCode(content);
        } else {
            finalType = 'text';
        }
    } else if (urlData && qaType === 'link') {
        const faviconUrl = `https://www.google.com/s2/favicons?sz=64&domain=${urlData.hostname}`;
        linkMeta = {
            title: urlData.hostname.replace('www.', ''),
            favicon: faviconUrl,
            fullUrl: content
        };
    }

    try {
        await addDoc(collection(db, 'raindrop_items'), {
            content,
            type: finalType,
            priority: qaPrio,
            tags: tags.filter(t => t !== ""),
            linkData: linkMeta,
            collectionId: activeCollection === 'all' || activeCollection === 'favs' ? 'global' : activeCollection,
            isFav: false,
            createdAt: serverTimestamp(),
            userId: user.uid
        });

        document.getElementById('qa-content').value = '';
        document.getElementById('qa-tags').value = '';

        const quickAddWindow = document.getElementById('quick-add-window');
        quickAddWindow.style.setProperty('display', 'none', 'important');

        console.log("Successfully archived as: " + finalType);
    } catch (error) {
        console.error("Error while saving: ", error);
        alert("Failed to save: " + error.message);
    }
};

function autoTrimCode(text) {
    const lines = text.split('\n');
    const nonEmptyLines = lines.filter(line => line.trim().length > 0);
    if (nonEmptyLines.length === 0) return text.trim();

    const minIndent = nonEmptyLines.reduce((min, line) => {
        const match = line.match(/^(\s*)/);
        const indent = match ? match[1].length : 0;
        return indent < min ? indent : min;
    }, Infinity);

    return lines
        .map(line => line.length >= minIndent ? line.slice(minIndent) : line)
        .join('\n')
        .trim();
}

document.querySelectorAll('#qa-prio-container .priority-dot').forEach(dot => {
    dot.onclick = () => {
        qaPrio = dot.dataset.prio;
        document.querySelectorAll('#qa-prio-container .priority-dot').forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
    };
});

document.getElementById('file-input').onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const user = auth.currentUser;
    if (!user) return alert("You must be logged in to add a file!");

    try {
        console.log("I'm sending the file...");
        const storageRef = ref(storage, `users/${user.uid}/files/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);

        await addDoc(collection(db, 'raindrop_items'), {
            content: file.name,
            fileUrl: url,
            type: 'file',
            priority: 'low',
            tags: ['file'],
            collectionId: activeCollection === 'all' || activeCollection === 'favs' ? 'global' : activeCollection,
            isFav: false,
            createdAt: serverTimestamp(),
            userId: user.uid
        });

        alert("File uploaded successfully!");
        renderFeed();
    } catch (error) {
        console.error("Storage error:", error);
        alert("Upload error: " + error.message);
    }
    e.target.value = '';
};

document.querySelectorAll('#qa-type-container .type-pill').forEach(pill => {
    pill.onclick = () => {
        qaType = pill.dataset.type;
        const textarea = document.getElementById('qa-content');

        document.querySelectorAll('#qa-type-container .type-pill').forEach(p => p.classList.remove('active-pill'));
        pill.classList.add('active-pill');

        if (qaType === 'code') {
            textarea.style.fontFamily = '"Consolas", "Courier New", monospace';
            textarea.style.backgroundColor = 'black';
            textarea.placeholder = "// Wklej tutaj swój kod...";
        } else {
            textarea.style.fontFamily = 'sans-serif';
            textarea.style.backgroundColor = '';
            textarea.placeholder = "Co masz na myśli?";
        }
    };
});

const contextMenu = document.getElementById('context-menu');
const cmOptions = document.getElementById('cm-options');
let lastTargetId = null;

const menuTemplates = {
    collection: [
        { label: 'Zmień nazwę', action: 'rename', icon: '✎' },
        { label: 'Dodaj folder', action: 'add-sub', icon: '📁' },
        { label: 'Usuń kolekcję', action: 'delete-coll', danger: true, icon: '🗑' }
    ],
    sidebar: [
        { label: 'Nowa kolekcja', action: 'new-main', icon: '+' },
        { label: 'Odśwież', action: 'refresh', icon: '↻' }
    ]
};

async function handleContextAction(action, id) {
    contextMenu.classList.add('hidden');
    const docRef = doc(db, 'collections', id);

    if (action === 'delete-coll' && id) {
        if (confirm("Are you sure you want to delete this collection? This operation cannot be undone.")) {
            try {
                await deleteDoc(docRef);
                console.log("Collection deleted from server");
            } catch (error) {
                console.error("Firebase error (deletion):", error);
                alert("You do not have permission or a network error occurred.");
            }
        }
    }
    else if (action === 'rename' && id) {
        const newName = prompt("Enter a new name for this collection:");
        if (newName && newName.trim() !== "") {
            try {
                await updateDoc(docRef, { name: newName.trim() });
                console.log("Name updated on server");
            } catch (error) {
                console.error("Firebase error (rename):", error);
                alert("Error while renaming.");
            }
        }
    }
    else if (action === 'new-main') {
        document.getElementById('new-proj-box').classList.remove('hidden');
    }
    else if (action === 'add-sub' && id) {
        const subName = prompt("Enter subfolder name:");
        if (subName && subName.trim() !== "") {
            try {
                await addDoc(collection(db, 'collections'), {
                    name: subName.trim(),
                    userId: auth.currentUser.uid,
                    parentId: id,
                    createdAt: serverTimestamp(),
                    isOpen: true
                });
                console.log("Subfolder added to:", id);
            } catch (error) {
                console.error("Error while adding subfolder:", error);
            }
        }
    }
}

document.querySelector('aside').addEventListener('contextmenu', (e) => {
    e.preventDefault();
    const collElement = e.target.closest('.collection-item');
    const type = collElement ? 'collection' : 'sidebar';
    lastTargetId = collElement ? collElement.dataset.id : null;

    cmOptions.innerHTML = '';
    const options = menuTemplates[type];

    options.forEach(opt => {
        const div = document.createElement('div');
        div.className = `cm-item ${opt.danger ? 'danger' : ''}`;
        div.innerHTML = `<span>${opt.icon}</span> ${opt.label}`;
        div.onclick = () => handleContextAction(opt.action, lastTargetId);
        cmOptions.appendChild(div);
    });

    contextMenu.style.left = `${e.clientX}px`;
    contextMenu.style.top = `${e.clientY}px`;
    contextMenu.classList.remove('hidden');
});

document.addEventListener('click', (e) => {
    if (!contextMenu.contains(e.target)) {
        contextMenu.classList.add('hidden');
    }
});

window.setCollection = (id) => {
    activeCollection = id;

    window.scrollTo(0, 0);
    renderSidebar();
    renderFeed();
};

window.toggleExpand = (e, id) => { e.stopPropagation(); expandedCollections.has(id) ? expandedCollections.delete(id) : expandedCollections.add(id); renderSidebar(); };
window.toggleFav = async (id, cur) => await updateDoc(doc(db, 'raindrop_items', id), { isFav: !cur });
window.quickDelete = async (id) => {
    if (confirm("Czy na pewno usunąć ten element?")) {
        await deleteDoc(doc(db, 'raindrop_items', id));
        if (currentEditId === id) {
            document.getElementById('editor-aside').classList.add('translate-x-full');
            currentEditId = null;
        }
    }
};

document.getElementById('close-editor').onclick = () => {
    document.getElementById('editor-aside').classList.add('translate-x-full');
    currentEditId = null;
    renderSidebar();
};

document.getElementById('header-add-btn').onclick = () => document.getElementById('quick-add-window').classList.remove('hidden');
document.getElementById('qa-close-x').onclick = () => document.getElementById('quick-add-window').classList.add('hidden');

function makeDraggable(el, handle) {
    let drag = false, ox, oy;
    handle.onmousedown = (e) => {
        drag = true;
        ox = e.clientX - el.offsetLeft;
        oy = e.clientY - el.offsetTop;
        el.style.transition = 'none';
    };
    document.addEventListener('mousemove', (e) => {
        if (drag) {
            el.style.left = (e.clientX - ox) + 'px';
            el.style.top = (e.clientY - oy) + 'px';
            el.style.right = 'auto';
        }
    });
    document.addEventListener('mouseup', () => {
        drag = false;
        el.style.transition = 'opacity 0.3s ease';
    });
}
makeDraggable(document.getElementById('quick-add-window'), document.getElementById('qa-header'));
makeDraggable(document.getElementById('editor-aside'), document.getElementById('editor-header'));

document.getElementById('nav-all').onclick = () => window.setCollection('all');
document.getElementById('nav-favs').onclick = () => window.setCollection('favs');
document.getElementById('global-search').oninput = (e) => { searchQuery = e.target.value; renderFeed(); };

const settingsModal = document.getElementById('settings-modal');
const settingsBtn = document.getElementById('settings-btn');
const closeSettingsBtn = document.getElementById('close-settings-full');
const saveChangesBtn = document.getElementById('save-changes');
const settingsNavItems = document.querySelectorAll('.settings-nav-item');
const settingsSections = document.querySelectorAll('.settings-content');
const customColorPicker = document.getElementById('custom-color-picker');

let selectedAccentColor = "#2563eb";

if (settingsBtn) {
    settingsBtn.onclick = () => {
        settingsModal.classList.remove('hidden');
        settingsModal.classList.add('flex');
        loadUserSettings();
    };
}
const closeModal = () => {
    settingsModal.classList.add('hidden');
    settingsModal.classList.remove('flex');
};
if (closeSettingsBtn) closeSettingsBtn.onclick = closeModal;
settingsModal.onclick = (e) => { if (e.target === settingsModal) closeModal(); };

settingsNavItems.forEach(item => {
    item.onclick = () => {
        const targetSection = item.getAttribute('data-section');
        settingsNavItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        settingsSections.forEach(section => {
            section.classList.toggle('hidden', section.id !== `settings-section-${targetSection}`);
        });
    };
});

function updateAccentUI(color) {
    document.querySelectorAll('.accent-picker').forEach(btn => {
        const isSelected = btn.getAttribute('data-color') === color;
        const icon = btn.querySelector('svg');
        if (isSelected) {
            btn.classList.add('border-white');
            btn.classList.remove('border-transparent');
            if (icon) { icon.classList.remove('opacity-0'); icon.classList.add('opacity-100'); }
        } else {
            btn.classList.remove('border-white');
            btn.classList.add('border-transparent');
            if (icon) { icon.classList.remove('opacity-100'); icon.classList.add('opacity-0'); }
        }
    });
}

document.querySelectorAll('.accent-picker').forEach(button => {
    button.onclick = function () {
        selectedAccentColor = this.getAttribute('data-color');
        updateAccentUI(selectedAccentColor);

        if (customColorPicker) customColorPicker.value = selectedAccentColor;

        applyPrimaryColor(selectedAccentColor);

        window.autoSaveSettings();
    };
});

function updateRadius(value) {
    document.documentElement.style.setProperty('--global-radius', value + 'px');
    autoSaveSettings();
}

function applyPrimaryColor(color) {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', color);
    const textColor = getContrastColor(color);
    root.style.setProperty('--primary-text-color', textColor);

    const hoverColor = `color-mix(in srgb, ${color}, black 15%)`;
    root.style.setProperty('--primary-hover', hoverColor);

    const lightColor = `color-mix(in srgb, ${color}, white 90%)`;
    root.style.setProperty('--primary-light', lightColor);
    root.style.setProperty('--primary-dim', `color-mix(in srgb, ${color}, transparent 80%)`);

    root.style.setProperty('--primary-ring', color + '33');
}

function getContrastColor(hexColor) {
    const hex = hexColor.replace('#', '');

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

    return (yiq >= 128) ? '#000000' : '#ffffff';
}

window.autoSaveSettings = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const selectedLang = document.getElementById('settings-language')?.value || "pl";

    const currentColor = customColorPicker ? customColorPicker.value : selectedAccentColor;

    const settingsData = {
        displayName: document.getElementById('settings-display-name')?.value || "",
        language: selectedLang,
        notifications: document.getElementById('push-notifications')?.checked || false,
        accentColor: currentColor,
        uiOpacity: document.getElementById('ui-opacity')?.value || "90",
        uiRadius: document.getElementById('ui-radius')?.value || "12",
        systemVolume: document.getElementById('system-volume')?.value || "80",
        soundEffects: document.getElementById('sound-effects')?.checked || false,
        animations: document.getElementById('enable-animations')?.checked || false,
        gpuAcceleration: document.getElementById('gpu-acceleration')?.checked || false,
        privateMode: document.getElementById('private-mode')?.checked || false,
        debugMode: document.getElementById('debug-mode')?.checked || false,
        customApiUrl: document.getElementById('api-custom-url')?.value || "",
        updatedAt: serverTimestamp()
    };

    try {
        await setDoc(doc(db, "users", user.uid), { settings: settingsData }, { merge: true });

        if (typeof currentLang !== 'undefined') {
            currentLang = selectedLang;
            translatePage();
        }

        applyInstantChanges(settingsData);
    } catch (err) {
        console.error("Błąd zapisu ustawień:", err);
    }
};

async function loadUserSettings() {
    const user = auth.currentUser;
    if (!user) return;

    try {

        const userDoc = await getDoc(doc(db, "users", user.uid));

        if (userDoc.exists()) {
            const data = userDoc.data();
            const s = data.settings || {};

            requestAnimationFrame(() => {
                if (document.getElementById('settings-display-name')) {
                    document.getElementById('settings-display-name').value = s.displayName || "";
                }
                if (document.getElementById('settings-language')) {
                    document.getElementById('settings-language').value = s.language || "pl";
                }

                const checks = {
                    'push-notifications': s.notifications,
                    'sound-effects': s.soundEffects,
                    'enable-animations': s.animations,
                    'gpu-acceleration': s.gpuAcceleration,
                    'private-mode': s.privateMode,
                    'debug-mode': s.debugMode
                };
                for (const [id, val] of Object.entries(checks)) {
                    const el = document.getElementById(id);
                    if (el) el.checked = val ?? true;
                }

                updateSlider('ui-opacity', 'opacity-val', s.uiOpacity, 90, '%');
                updateSlider('ui-radius', 'radius-val', s.uiRadius, 12, 'px');
                updateSlider('system-volume', 'volume-val', s.systemVolume, 80, '%');

                if (s.accentColor) {
                    selectedAccentColor = s.accentColor;
                    if (customColorPicker) customColorPicker.value = s.accentColor;
                    updateAccentUI(s.accentColor);
                    applyPrimaryColor(s.accentColor);
                }

                applyInstantChanges(s);
            });

            console.log("Ustawienia wczytane i zsynchronizowane z UI");
        }
    } catch (err) {
        console.error("Błąd podczas ładowania ustawień:", err);
    }
}

function updateSlider(inputId, labelId, value, defaultValue, unit) {
    const input = document.getElementById(inputId);
    const label = document.getElementById(labelId);
    const finalVal = value || defaultValue;
    if (input) input.value = finalVal;
    if (label) label.innerText = finalVal + unit;
}

function setVh() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

window.addEventListener('resize', setVh);
setVh();

function applyInstantChanges(s) {
    if (!s || typeof s !== 'object') return;
    const root = document.documentElement;

    requestAnimationFrame(() => {

        if (s.accentColor) {
            applyPrimaryColor(s.accentColor);
        }

        if (s.uiRadius !== undefined) {
            root.style.setProperty('--global-radius', s.uiRadius + 'px');
            const radiusDisplay = document.getElementById('radius-val');
            if (radiusDisplay) radiusDisplay.innerText = s.uiRadius + 'px';
        }

        if (s.uiOpacity !== undefined) {
            const opacityValue = s.uiOpacity / 100;
            const blurValue = opacityValue * 16;

            root.style.setProperty('--ui-opacity', opacityValue);
            root.style.setProperty('--ui-blur', `${blurValue}px`);

            const opacityDisplay = document.getElementById('opacity-val');
            if (opacityDisplay) opacityDisplay.innerText = s.uiOpacity + '%';
        }

        if (s.displayName) {
            const uiName = document.getElementById('user-display-name');
            if (uiName) uiName.textContent = s.displayName;
        }
    });
}

document.getElementById('ui-opacity')?.addEventListener('input', (e) => {
    applyInstantChanges({ uiOpacity: e.target.value });
});

if (saveChangesBtn) {
    saveChangesBtn.onclick = async () => {
        const btn = saveChangesBtn;
        const originalText = btn.innerHTML;
        btn.innerHTML = "sync...";
        await window.autoSaveSettings();
        setTimeout(() => { btn.innerHTML = originalText; }, 1000);
    };
}

if (customColorPicker) {
    customColorPicker.addEventListener('input', (e) => {
        const color = e.target.value;
        applyPrimaryColor(color);
        updateAccentUI(color);
        window.autoSaveSettings();
    });
}
document.getElementById('ui-radius')?.addEventListener('input', (e) => applyInstantChanges({ uiRadius: e.target.value }));
document.getElementById('ui-opacity')?.addEventListener('input', (e) => applyInstantChanges({ uiOpacity: e.target.value }));

function initMobileMenu() {
    const sidebar = document.querySelector('.sidebar-container');
    const toggleBtn = document.getElementById('mobile-menu-toggle');

    if (!sidebar || !toggleBtn) return;

    if (!document.querySelector('.mobile-close-btn')) {
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '✕';
        closeBtn.className = 'mobile-close-btn md:hidden';
        sidebar.prepend(closeBtn);

        closeBtn.onclick = () => {
            sidebar.classList.remove('mobile-open');
        };
    }

    toggleBtn.onclick = (e) => {
        e.preventDefault();
        sidebar.classList.add('mobile-open');
    };

    sidebar.querySelectorAll('button:not(.mobile-close-btn)').forEach(btn => {
        btn.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('mobile-open');
            }
        });
    });
}

function changeViewMode(mode) {
    const container = document.getElementById('feed-container');
    if (!container) return;

    container.classList.remove('view-small', 'view-medium', 'view-large', 'view-details');
    container.classList.add(mode);
    localStorage.setItem('preferredViewMode', mode);

    if (typeof rebuildMasonry === 'function') {
        setTimeout(rebuildMasonry, 50);
    }
}

window.changeViewMode = changeViewMode;

document.addEventListener('DOMContentLoaded', () => {
    const savedMode = localStorage.getItem('preferredViewMode') || 'view-medium';
    const select = document.getElementById('view-mode-select');
    if (select) select.value = savedMode;
    changeViewMode(savedMode);
});

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileMenu);
} else {
    initMobileMenu();
}

document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('userLanguage');
    if (savedLang) {
        currentLang = savedLang;
    }

    translatePage();
});

document.getElementById('open-settings-nav')?.addEventListener('click', () => {
    const aside = document.getElementById('settings-aside');
    if (aside) {
        aside.classList.add('mobile-active');
    } else {
        console.error("Nie znaleziono elementu #settings-aside w HTML!");
    }
});

document.getElementById('close-settings-nav')?.addEventListener('click', () => {
    const aside = document.getElementById('settings-aside');
    if (aside) {
        aside.classList.remove('mobile-active');
    }
});

// Wyjście z całego modala (przycisk strzałki po lewej)
document.getElementById('exit-settings-btn-mobile')?.addEventListener('click', () => {
    document.getElementById('settings-modal').classList.add('hidden');
});

function rebuildMasonry(preferredColumns = null) {
    const container = document.getElementById('feed-container');
    const items = Array.from(document.querySelectorAll('.item-card'));
    if (!container || items.length === 0) return;

    // Pobieramy aktualny tryb
    const isDetails = container.classList.contains('view-details');

    // Resetujemy kontener przed budowaniem
    container.innerHTML = '';

    if (isDetails) {
        // TRYB LISTY: Brak kolumn, elementy prosto do kontenera
        container.style.display = 'flex';
        container.style.flexDirection = 'column';

        items.forEach(item => {
            item.style.width = '100%';
            item.style.gridRowEnd = 'auto'; // Reset dla grid
            container.appendChild(item);
        });
    } else {
        // TRYB MASONRY: Budujemy kolumny
        container.style.display = 'flex';
        container.style.flexDirection = 'row'; // Przywracamy układ poziomy kolumn

        const containerWidth = container.offsetWidth;
        let columnsCount;

        if (preferredColumns) {
            columnsCount = preferredColumns;
        } else {
            // Logika wyboru ilości kolumn na podstawie klasy widoku
            if (window.innerWidth < 768) {
                columnsCount = 1;
            } else if (container.classList.contains('view-small')) {
                columnsCount = Math.max(2, Math.floor(containerWidth / 180));
            } else if (container.classList.contains('view-large')) {
                columnsCount = Math.max(1, Math.floor(containerWidth / 450));
            } else {
                columnsCount = Math.max(1, Math.floor(containerWidth / 300));
            }
        }

        const gap = 20;
        container.style.gap = `${gap}px`;

        const columns = [];
        for (let i = 0; i < columnsCount; i++) {
            const col = document.createElement('div');
            col.className = 'masonry-column';
            col.style.flex = '1';
            col.style.display = 'flex';
            col.style.flexDirection = 'column';
            col.style.gap = `${gap}px`;
            container.appendChild(col);
            columns.push(col);
        }

        items.forEach(item => {
            item.style.width = '100%';
            const shortestColumn = columns.reduce((prev, curr) =>
                (prev.offsetHeight <= curr.offsetHeight) ? prev : curr
            );
            shortestColumn.appendChild(item);
        });
    }
}

function initMasonry() {
    rebuildMasonry();

    const images = document.querySelectorAll('.item-card img');
    images.forEach(img => {
        img.addEventListener('load', rebuildMasonry);
        img.addEventListener('error', rebuildMasonry);
    });

    window.addEventListener('load', rebuildMasonry);

    setTimeout(rebuildMasonry, 500);
    setTimeout(rebuildMasonry, 1000);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMasonry);
} else {
    initMasonry();
}

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(rebuildMasonry, 100);
});

document.addEventListener('DOMContentLoaded', initMasonry);
document.addEventListener('DOMContentLoaded', initMasonry);
window.addEventListener('load', rebuildMasonry);

setTimeout(rebuildMasonry, 300);

function resizeGridItem(item) {
    const grid = document.getElementById('feed-container');
    if (!grid) return;

    const gridStyle = window.getComputedStyle(grid);
    const rowHeight = parseInt(gridStyle.getPropertyValue('grid-auto-rows')) || 1;
    const rowGap = parseInt(gridStyle.getPropertyValue('grid-row-gap')) || 0;

    const content = item.querySelector('.card-content') || item.firstElementChild;
    const contentHeight = content.getBoundingClientRect().height;

    const rowSpan = Math.ceil((contentHeight + rowGap) / (rowHeight + rowGap));

    requestAnimationFrame(() => {
        item.style.gridRowEnd = `span ${rowSpan}`;
    });
}
const resizeObserver = new ResizeObserver(entries => {
    for (let entry of entries) {
        resizeGridItem(entry.target);
    }
});
document.addEventListener('DOMContentLoaded', initMasonry);