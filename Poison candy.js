// Register Service Worker for PWA capabilities
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch(err => {
        console.log('ServiceWorker registration failed: ', err);
      });
  });
}

// Get Firebase instances and functions from the window object (initialized in index.html)
const auth = window.auth;
const db = window.db;
const GoogleAuthProvider = window.GoogleAuthProvider; 

// Modular Auth Functions
const createUserWithEmailAndPassword = window.createUserWithEmailAndPassword;
const signInWithEmailAndPassword = window.signInWithEmailAndPassword;
const signOut = window.signOut;
const signInWithPopup = window.signInWithPopup;
const sendPasswordResetEmail = window.sendPasswordResetEmail;
const onAuthStateChanged = window.onAuthStateChanged;
// NEW: Import setPersistence and persistence types from window
const setPersistence = window.setPersistence;
const browserSessionPersistence = window.browserSessionPersistence;
const browserLocalPersistence = window.browserLocalPersistence;

// Modular Database Functions
const ref = window.ref;
const set = window.set;
const onValue = window.onValue;
const update = window.update;
const remove = window.remove;
const get = window.get; 
const push = window.push; // Add push for unique IDs for friend requests
// New Firebase Realtime Database Query functions
const query = window.query;
const orderByChild = window.orderByChild;
const startAt = window.startAt;
const endAt = window.endAt;


// DOM Elements (Ye variables abhi declare honge, value DOMContentLoaded mein set hogi)
let authDiv, teamBattlePopup, info, grid, teamInput, 
    showLoginBtn, showRegisterBtn, loginForm, registerForm,
    loginName, loginPass, regName, regEmail, regAvatar, avatarPreview, regPass,
    regConfirmPass, rematchPopup, yourName, opponentName, yourAvatar, opponentAvatar,
    playerVsPlayerSection, gameArea, editProfilePopup, editNameInput, editEmailInput,
    editAvatarInput, editAvatarPreview, winLoseNotification, candyLoader,
    customConfirm, confirmMessage, confirmOk, confirmCancel, gameSettingsPopup,
    soundToggleBtn, musicToggleBtn, forgotPasswordPopup, forgotEmailInput,
    friendsPopup, tabMyFriends, tabFriendRequests, tabSearchFriends,
    myFriendsSectionPopup, friendRequestsSectionPopup, searchFriendsSectionPopup, // Friends popup ke andar ke sections
    myFriendsListPopup, receivedRequestsList, sentRequestsList, // Friends popup ke andar ki lists
    searchFriendInput, searchResultsList,
    noFriendsMessagePopup, noReceivedRequestsMessage, noSentRequestsMessage, noSearchResultsMessage,
    aiDifficultyPopup, displaySettingsContent, generalSettingsContent,
    fontSizeSmallBtn, fontSizeMediumBtn, fontSizeLargeBtn,
    candySizeSmallBtn, candySizeMediumBtn, candySizeLargeBtn,
    themeLightBtn, themeDarkBtn, themeCandylandBtn, themeHalloweenBtn,
    buyCurrencyPopup, currencyType,
    navLeaderboard, navAchievements, leaderboardSection, achievementsSection,
    coinsCountEl, gemsCountEl, powerupsInventoryGrid, shieldCountEl, sniperCountEl, timeFreezeCountEl, doubleStrikeCountEl;

// Naye DOM Elements for New Interface
let appContainer, headerBar, userProfileIcon, friendsIcon, settingsIcon,
    mainContentArea, lobbySection, playWithFriendsSection, powerUpsSection,
    navBar, navLobby, navPlayWithFriends, navPowerUps;

// Naye DOM Elements for Main Friends Section
let myFriendsListMainSection, noFriendsMessageMainSection;

// Naye DOM Elements for Game Invite Notification
let gameInviteNotificationPopup, inviteSenderAvatar, inviteSenderName, declineInviteBtn, acceptInviteBtn;
let inviteDeclinedNotificationPopup, declinedSenderAvatar, declinedSenderName;
// NEW: In-Game Powerups Container
let inGamePowerupsContainer, inGameShieldBtn, inGameSniperBtn, inGameTimeFreezeBtn, inGameDoubleStrikeBtn, rememberMeCheckbox;

// Game Variables
let player = "";
let room = "";
let myTurn = false;
window.playerName = "";
window.playerAvatar = "";
window.playerEmail = "";
window.playerUid = ""; // Store current user's UID
let poisoned = {};
let isAIMode = false;
let soundOn = true; // Default sound state
let musicOn = true; // Default music state
let currentFontSize = 'medium'; // Default font size
let currentCandySize = 'medium'; // Default candy size
let currentGameTheme = 'light'; // Default game theme

// NEW: Power-up state variables
let isSniperActive = false;
let isDoubleStrikeActive = false;
let doubleStrikeCount = 0;
let isShieldActive = false;

// NEW: Player's currency and powerups data
window.playerCoins = 0;
window.playerGems = 0;
window.playerPowerups = {};


// Audio elements for Plan A and Plan D
let buttonClickAudio; 
let backgroundMusicAudio; // Background music ke liye naya variable

// Candy Emojis (Original emojis)
const candyEmojis = ["🍬", "🍭", "🍫", "🍩", "🍪", "🧁", "🍒", "🍎", "🥝", "🍓"];

// Global variables to store real-time friend data (Yeh pehle se the, inhein maintain rakhenge)
let currentMyFriends = {};
let currentReceivedRequests = {};
let currentSentRequests = {};


// DOMContentLoaded event listener: Yeh code tab chalega jab poora HTML document load ho jayega
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements ko yahan initialize karein, jab DOM ready ho
    authDiv = document.getElementById("auth");
    teamBattlePopup = document.getElementById("teamBattlePopup"); 
    info = document.getElementById("info");
    grid = document.getElementById("grid");
    teamInput = document.getElementById("teamCodeInput");
    showLoginBtn = document.getElementById("showLoginBtn");
    showRegisterBtn = document.getElementById("showRegisterBtn");
    loginForm = document.getElementById("loginForm");
    registerForm = document.getElementById("registerForm");
    loginName = document.getElementById("loginName");
    loginPass = document.getElementById("loginPass");
    regName = document.getElementById("regName");
    regEmail = document.getElementById("regEmail");
    regAvatar = document.getElementById("regAvatar");
    avatarPreview = document.getElementById("avatarPreview");
    regPass = document.getElementById("regPass");
    regConfirmPass = document.getElementById("regConfirmPass");
    rematchPopup = document.getElementById("rematchPopup");
    yourName = document.getElementById("yourName");
    opponentName = document.getElementById("opponentName");
    yourAvatar = document.getElementById("yourAvatar");
    opponentAvatar = document.getElementById("opponentAvatar");
    playerVsPlayerSection = document.getElementById("playerVsPlayerSection");
    gameArea = document.getElementById("gameArea");
    editProfilePopup = document.getElementById("editProfilePopup");
    editNameInput = document.getElementById("editName");
    editEmailInput = document.getElementById("editEmail");
    editAvatarInput = document.getElementById("editAvatar");
    editAvatarPreview = document.getElementById("editAvatarPreview");
    winLoseNotification = document.getElementById("winLoseNotification");
    candyLoader = document.getElementById('candyLoader');
    customConfirm = document.getElementById('customConfirm');
    confirmMessage = document.getElementById('confirmMessage');
    confirmOk = document.getElementById('confirmOk');
    confirmCancel = document.getElementById('confirmCancel');
    gameSettingsPopup = document.getElementById('gameSettingsPopup');
    soundToggleBtn = document.getElementById('soundToggleBtn');
    musicToggleBtn = document.getElementById('musicToggleBtn');
    forgotPasswordPopup = document.getElementById('forgotPasswordPopup');
    forgotEmailInput = document.getElementById('forgotEmailInput');
    
    // Friends Feature DOM elements (Popups ke andar wale)
    friendsPopup = document.getElementById('friendsPopup');
    tabMyFriends = document.getElementById('tabMyFriends');
    tabFriendRequests = document.getElementById('tabFriendRequests');
    tabSearchFriends = document.getElementById('tabSearchFriends');
    myFriendsSectionPopup = document.getElementById('myFriendsSection'); 
    friendRequestsSectionPopup = document.getElementById('friendRequestsSection'); 
    searchFriendsSectionPopup = document.getElementById('searchFriendsSection'); 
    myFriendsListPopup = document.getElementById('myFriendsListPopup'); 
    receivedRequestsList = document.getElementById('receivedRequestsList');
    sentRequestsList = document.getElementById('sentRequestsList');
    searchFriendInput = document.getElementById('searchFriendInput');
    searchResultsList = document.getElementById('searchResultsList');
    noFriendsMessagePopup = document.getElementById('noFriendsMessagePopup'); 
    noReceivedRequestsMessage = document.getElementById('noReceivedRequestsMessage');
    noSentRequestsMessage = document.getElementById('noSentRequestsMessage');
    noSearchResultsMessage = document.getElementById('noSearchResultsMessage');

    // Naye Interface Elements ko initialize karein
    appContainer = document.querySelector('.app-container');
    headerBar = document.getElementById('headerBar');
    userProfileIcon = document.getElementById('userProfileIcon');
    friendsIcon = document.getElementById('friendsIcon');
    settingsIcon = document.getElementById('settingsIcon');
    mainContentArea = document.getElementById('mainContentArea');
    lobbySection = document.getElementById('lobbySection');
    playWithFriendsSection = document.getElementById('playWithFriendsSection');
    powerUpsSection = document.getElementById('powerUpsSection');
    navBar = document.getElementById('navBar');
    navLobby = document.getElementById('navLobby');
    navPlayWithFriends = document.getElementById('navPlayWithFriends');
    navPowerUps = document.getElementById('navPowerUps');
    navLeaderboard = document.getElementById('navLeaderboard');
    navAchievements = document.getElementById('navAchievements');
    leaderboardSection = document.getElementById('leaderboardSection');
    achievementsSection = document.getElementById('achievementsSection');

    // Naye DOM Elements for Main Friends Section
    myFriendsListMainSection = document.getElementById('myFriendsListMainSection');
    noFriendsMessageMainSection = document.getElementById('noFriendsMessageMainSection');

    // Naye DOM Elements for Game Invite Notification
    gameInviteNotificationPopup = document.getElementById('gameInviteNotificationPopup');
    inviteSenderAvatar = document.getElementById('inviteSenderAvatar');
    inviteSenderName = document.getElementById('inviteSenderName');
    declineInviteBtn = document.getElementById('declineInviteBtn');
    acceptInviteBtn = document.getElementById('acceptInviteBtn');

    // New: Invite Declined Notification DOM elements
    inviteDeclinedNotificationPopup = document.getElementById('inviteDeclinedNotificationPopup');
    declinedSenderAvatar = document.getElementById('declinedSenderAvatar');
    declinedSenderName = document.getElementById('declinedSenderName');
    
    // New: AI Difficulty popup DOM elements
    aiDifficultyPopup = document.getElementById('aiDifficultyPopup');
    
    // New: Buy Currency popup DOM elements
    buyCurrencyPopup = document.getElementById('buyCurrencyPopup');
    currencyType = document.getElementById('currencyType');
    
    // New: Game Settings Display Settings DOM elements
    generalSettingsContent = document.getElementById('generalSettingsContent');
    displaySettingsContent = document.getElementById('displaySettingsContent');
    fontSizeSmallBtn = document.getElementById('fontSizeSmallBtn');
    fontSizeMediumBtn = document.getElementById('fontSizeMediumBtn');
    fontSizeLargeBtn = document.getElementById('fontSizeLargeBtn');
    candySizeSmallBtn = document.getElementById('candySizeSmallBtn');
    candySizeMediumBtn = document.getElementById('candySizeMediumBtn');
    candySizeLargeBtn = document.getElementById('candySizeLargeBtn');
    themeLightBtn = document.getElementById('themeLightBtn');
    themeDarkBtn = document.getElementById('themeDarkBtn');
    themeCandylandBtn = document.getElementById('themeCandylandBtn');
    themeHalloweenBtn = document.getElementById('themeHalloweenBtn');

    // NEW: Currency and Powerups DOM elements
    coinsCountEl = document.getElementById('coinsCount');
    gemsCountEl = document.getElementById('gemsCount');
    powerupsInventoryGrid = document.getElementById('powerupsInventoryGrid');
    shieldCountEl = document.getElementById('shieldCount');
    sniperCountEl = document.getElementById('sniperCount');
    timeFreezeCountEl = document.getElementById('timeFreezeCount');
    doubleStrikeCountEl = document.getElementById('doubleStrikeCount');
    // NEW: In-Game Powerups container ko yahan initialize karein
    inGamePowerupsContainer = document.getElementById('inGamePowerupsContainer');
    inGameShieldBtn = document.querySelector('#inGamePowerupsContainer button[onclick*="shield"]');
    inGameSniperBtn = document.querySelector('#inGamePowerupsContainer button[onclick*="sniper"]');
    inGameTimeFreezeBtn = document.querySelector('#inGamePowerupsContainer button[onclick*="timeFreeze"]');
    inGameDoubleStrikeBtn = document.querySelector('#inGamePowerupsContainer button[onclick*="doubleStrike"]');
    // NEW: Remember Me checkbox
    rememberMeCheckbox = document.getElementById('rememberMe');


    // Audio elements ko initialize karein
    buttonClickAudio = document.getElementById('buttonClickSound');
    backgroundMusicAudio = document.getElementById('backgroundMusic'); // Background music audio element

    // Call loader immediately when the script starts executing for initial page load
    showCandyLoader();

    // Event Listeners for Avatar Previews
    regAvatar?.addEventListener("change", function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                avatarPreview.src = e.target.result;
                avatarPreview.classList.remove("hidden");
            };
            reader.readAsDataURL(file);
        } else {
            avatarPreview.src = "";
            avatarPreview.classList.add("hidden");
        }
    });

    editAvatarInput?.addEventListener("change", function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                editAvatarPreview.src = e.target.result;
                editAvatarPreview.classList.remove("hidden");
            };
            reader.readAsDataURL(file);
        } else {
            editAvatarPreview.src = window.playerAvatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png";
            if (!window.playerAvatar) {
                editAvatarPreview.classList.add("hidden");
            }
        }
    });

    // Tab Switching for Login/Register
    showLoginBtn?.addEventListener("click", () => {
        playClickSound(); // Plan A sound
        loginForm.classList.remove("hidden");
        registerForm.classList.add("hidden");
        showLoginBtn.classList.add("bg-gray-200", "shadow-md");
        showRegisterBtn.classList.remove("bg-gray-200", "shadow-md");
        showRegisterBtn.classList.add("bg-gray-100", "shadow-sm");
        avatarPreview.src = "";
        avatarPreview.classList.add("hidden");
        regAvatar.value = "";
    });

    showRegisterBtn?.addEventListener("click", () => {
        playClickSound(); // Plan A sound
        registerForm.classList.remove("hidden");
        loginForm.classList.add("hidden");
        showRegisterBtn.classList.add("bg-gray-200", "shadow-md");
        showLoginBtn.classList.remove("bg-gray-200", "shadow-md");
        showLoginBtn.classList.add("bg-gray-100", "shadow-sm");
    });

    // Handler for when the user confirms exit
    confirmOk.addEventListener('click', () => {
        playClickSound(); // Plan A sound
        customConfirm.classList.add('hidden'); // Hide the custom dialog
        exitGameConfirmed(); // Call the actual exit game logic
    });

    // Handler for when the user cancels exit
    confirmCancel.addEventListener('click', () => {
        playClickSound(); // Plan A sound
        customConfirm.classList.add('hidden'); // Hide the custom dialog
        hideCandyLoader(); // Ensure loader is hidden if it was shown by showExitConfirmation
    });

    // Firebase Auth State Listener (Yeh listener DOMContentLoaded ke andar hi rehna chahiye)
    onAuthStateChanged(auth, async (user) => { // Use modular onAuthStateChanged
        if (user) {
            console.log("Auth State Changed: User logged in. UID:", user.uid); // DEBUG
            window.playerUid = user.uid; // Set current user's UID globally
            try {
                const snapshot = await get(ref(db, `users/${user.uid}`)); // Use modular get and ref
                const userData = snapshot.val();
                if (userData) {
                    console.log("User data from Firebase:", userData); // DEBUG
                    window.playerName = userData.name || user.displayName || user.email;
                    window.playerAvatar = userData.avatar || user.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                    window.playerEmail = user.email;
                    
                    // Naye UI elements ko show karein
                    authDiv.classList.add("hidden"); // Auth screen hide
                    headerBar.classList.remove("hidden"); // Header bar show
                    mainContentArea.classList.remove("hidden"); // Main content area show
                    navBar.classList.remove("hidden"); // Bottom nav bar show

                    // User profile icon ko update karein
                    userProfileIcon.src = window.playerAvatar;

                    // Load user settings (sound/music, font size, candy size, theme)
                    loadUserSettings(user.uid);
                    // Start listening for friend data
                    listenForFriendsData(user.uid);
                    // Start listening for game invites
                    listenForGameInvites(user.uid);
                    // NEW: Start listening for currency and powerup data
                    listenForPlayerCurrencyAndPowerups(user.uid);
                    
                    // Login ke baad seedha Lobby section par navigate karein
                    navigateToSection('lobby');

                } else {
                    console.log("New user or user data not found in DB. Creating profile."); // DEBUG
                    // New user or user signed in via Google for the first time
                    window.playerName = user.displayName || user.email;
                    window.playerAvatar = user.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                    window.playerEmail = user.email;
                    
                    // Naye UI elements ko show karein
                    authDiv.classList.add("hidden"); // Auth screen hide
                    headerBar.classList.remove("hidden"); // Header bar show
                    mainContentArea.classList.remove("hidden"); // Main content area show
                    navBar.classList.remove("hidden"); // Bottom nav bar hide

                    // User profile icon ko update karein
                    userProfileIcon.src = window.playerAvatar;

                    await set(ref(db, `users/${user.uid}`), { // Use modular set and ref
                        name: window.playerName,
                        email: window.playerEmail,
                        avatar: window.playerAvatar,
                        coins: 100, // NEW: Default starting coins
                        gems: 5,   // NEW: Default starting gems
                        powerups: { // Default powerups with zero count
                            shield: 0,
                            sniper: 0,
                            timeFreeze: 0,
                            doubleStrike: 0
                        },
                        settings: {
                            sound: true,
                            music: true,
                            fontSize: 'medium',
                            candySize: 'medium',
                            theme: 'light'
                        }
                    });
                    loadUserSettings(user.uid); // Load default settings
                    listenForFriendsData(user.uid); // Start listening for friend data
                    listenForGameInvites(user.uid); // Start listening for game invites
                    listenForPlayerCurrencyAndPowerups(user.uid); // NEW: Start listening for currency

                    // Login ke baad seedha Lobby section par navigate karein
                    navigateToSection('lobby');
                }
            } catch (error) {
                console.error("Error fetching user profile during auth state change:", error); // DEBUG
                alert("Failed to load user profile. Please try logging in again.");
                await signOut(auth); // Use modular signOut
            } finally {
                hideCandyLoader();
            }
        } else {
            console.log("Auth State Changed: User logged out."); // DEBUG
            window.playerUid = ""; // Clear UID on logout
            window.playerName = "";
            window.playerAvatar = "";
            window.playerEmail = "";
            window.playerCoins = 0; // NEW: Reset local currency
            window.playerGems = 0;  // NEW: Reset local currency
            window.playerPowerups = {}; // NEW: Reset local powerups
            // NEW: Reset power-up active flags
            isSniperActive = false;
            isDoubleStrikeActive = false;
            doubleStrikeCount = 0;
            isShieldActive = false;


            // Naye UI elements ko hide karein aur auth screen show karein
            authDiv.classList.remove("hidden"); // Auth screen show
            headerBar.classList.add("hidden"); // Header bar hide
            mainContentArea.classList.add("hidden"); // Main content area hide
            navBar.classList.add("hidden"); // Bottom nav bar hide
            gameArea.classList.add("hidden"); // Ensure game area is hidden
            playerVsPlayerSection?.classList?.add("hidden"); // Ensure player vs player is hidden
            hideGameInviteNotification(); // Hide any pending invite notifications
            window.hideInviteDeclinedNotification(); // New: Hide declined invite notification

            loginForm.classList.remove("hidden"); // Default to login form
            registerForm.classList.add("hidden");
            showLoginBtn?.classList.add("bg-gray-200", "shadow-md");
            showRegisterBtn?.classList.remove("bg-gray-200", "shadow-md");
            showRegisterBtn?.classList.add("bg-gray-100", "shadow-sm");
            
            // Stop background music when logging out
            pauseBackgroundMusic();
            hideCandyLoader(); // Hide loader when logged out state is set
        }
    });

    // --- Plan A: Button Click Sound Implementation ---

    // Function to play click sound
    function playClickSound() {
        if (soundOn && buttonClickAudio) {
            buttonClickAudio.currentTime = 0; // Rewind to start for quick successive clicks
            buttonClickAudio.play().catch(e => {
                console.log("Button sound play prevented:", e); // Log if play is prevented (e.g., by browser autoplay policy)
            }); 
        }
    }

    // Select all elements that should have a click sound (Plan A)
    const clickableElements = document.querySelectorAll(
        '#showLoginBtn, #showRegisterBtn, ' + // Auth tabs
        '#loginForm button[type="submit"], #registerForm button[type="submit"], ' + // Login/Register form submit buttons
        '.google-signin-button, ' + // Google Sign-In buttons
        'a[onclick="window.showForgotPasswordPopup()"], ' + // Forgot password link
        '#teamBattlePopup button, ' + // All buttons inside team battle popup (create, join, close)
        '#editProfilePopup button, ' + // All buttons inside edit profile popup (save, close)
        '#gameArea button, ' + // Exit Game button
        '#winLoseNotification button, ' + // OK button on win/lose notification
        '#rematchPopup button, ' + // Rematch popup buttons (yes, no)
        '#customConfirm button, ' + // Custom confirm dialog buttons (OK, Cancel)
        '#gameSettingsPopup button, ' + // Settings popup buttons (toggles, close)
        '#forgotPasswordPopup button, ' + // Forgot password popup buttons (send, close)
        '.game-mode-card, ' + // All game mode cards
        '.tab-button, .list-item-actions button, ' + // Friends feature buttons
        '.profile-icon, .top-icon, .nav-item, ' + // Naye UI elements
        '#declineInviteBtn, #acceptInviteBtn, ' + // New: Game invite notification buttons
        '#inviteDeclinedNotificationPopup .btn-ok, ' + // New: Invite Declined OK button
        // New: Display Settings buttons
        '#fontSizeSmallBtn, #fontSizeMediumBtn, #fontSizeLargeBtn, ' +
        '#candySizeSmallBtn, #candySizeMediumBtn, #candySizeLargeBtn, ' +
        '#themeLightBtn, #themeDarkBtn, #themeCandylandBtn, #themeHalloweenBtn'
    );

    clickableElements.forEach(element => {
        // Add a click event listener to each selected element
        element.addEventListener('click', playClickSound);
    });
    
    // NEW: In-game powerup buttons ke liye event listeners
    const inGamePowerupButtons = document.querySelectorAll('#inGamePowerupsContainer button');
    inGamePowerupButtons.forEach(button => {
        button.addEventListener('click', playClickSound);
    });

    // --- End Plan A Implementation ---

    // --- Plan D: Background Music Implementation ---

    // Function to play background music
    function playBackgroundMusic() {
        if (musicOn && backgroundMusicAudio) {
            backgroundMusicAudio.volume = 0.3; // Adjust volume as needed
            backgroundMusicAudio.play().catch(e => {
                console.log("Background music play prevented:", e);
            });
        }
    }

    // Function to pause background music
    function pauseBackgroundMusic() {
        if (backgroundMusicAudio) {
            backgroundMusicAudio.pause();
        }
    }

    // Expose these functions globally
    window.playBackgroundMusic = playBackgroundMusic;
    window.pauseBackgroundMusic = pauseBackgroundMusic;

    // --- End Plan D Implementation ---

}); // End of DOMContentLoaded

/**
 * Loader ko screen par dikhata hai.
 * Yeh function tab call karein jab koi operation shuru ho.
 */
function showCandyLoader() {
    if (candyLoader) {
        candyLoader.classList.add('show');
        candyLoader.classList.remove('hidden');
    }
}

/**
 * Loader ko screen se chhupata hai.
 * Yeh function tab call karein jab operation complete ho jaye.
 */
function hideCandyLoader() {
    if (candyLoader) {
        candyLoader.classList.remove('show');
        setTimeout(() => {
            candyLoader.classList.add('hidden');
        }, 300);
    }
}

/**
 * Resizes and converts an avatar image to a Base64 Data URL.
 * @param {File} file The image file to process.
 * @returns {Promise<string>} A promise that resolves with the Base64 Data URL of the processed image.
 */
async function uploadAndResizeAvatar(file) { 
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_DIMENSION = 200; // Max width or height for the avatar
                let width = img.width;
                let height = img.height;

                // Calculate new dimensions while maintaining aspect ratio
                if (width > height) {
                    if (width > MAX_DIMENSION) {
                        height *= MAX_DIMENSION / width;
                        width = MAX_DIMENSION;
                    }
                } else {
                    if (height > MAX_DIMENSION) {
                        width *= MAX_DIMENSION / height;
                        height = MAX_DIMENSION;
                    }
                }
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Convert canvas to Base64 Data URL (JPEG for compression)
                // Use image/jpeg for better compression, quality 0.8
                const dataUrl = canvas.toDataURL('image/jpeg', 0.8); 
                
                // Optional: Check data URL size to prevent very large database entries
                // A 200x200 JPEG at 0.8 quality should be well under 1MB, but good to be safe.
                const MAX_DATA_URL_LENGTH = 500 * 1024; // ~500KB limit for safety (DB limit is 1MB per node)
                if (dataUrl.length > MAX_DATA_URL_LENGTH) {
                    console.warn("Resized avatar data URL is still very large. Using default avatar.");
                    resolve("https://cdn-icons-png.flaticon.com/512/149/149071.png"); // Fallback to default
                } else {
                    resolve(dataUrl);
                }
            };
            img.onerror = (error) => reject(new Error("Error loading image for resizing."));
            img.src = event.target.result;
        };
        reader.onerror = (error) => reject(new Error("Error reading file."));
        reader.readAsDataURL(file);
    });
}


// Auth Functions
async function register() {
    showCandyLoader();
    const name = regName.value.trim();
    const email = regEmail.value.trim();
    const pass = regPass.value.trim();
    const confirmPass = regConfirmPass.value.trim();
    const avatarFile = regAvatar.files[0];

    if (!name || !email || !pass || !confirmPass) {
        hideCandyLoader();
        return alert("Please enter username, email, password and confirm password");
    }
    if (pass !== confirmPass) {
        hideCandyLoader();
        return alert("Passwords do not match");
    }

    let finalAvatarDataUrl = "https://cdn-icons-png.flaticon.com/512/149/149071.png"; // Default avatar
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        const user = userCredential.user;
        console.log("Register: User created in Auth:", user.uid); // DEBUG

        if (avatarFile) {
            finalAvatarDataUrl = await uploadAndResizeAvatar(avatarFile);
        }

        await set(ref(db, `users/${user.uid}`), {
            name: name,
            email: email,
            avatar: finalAvatarDataUrl,
            coins: 100, // Default starting coins
            gems: 5,   // Default starting gems
            powerups: { // Default powerups with zero count
                shield: 0,
                sniper: 0,
                timeFreeze: 0,
                doubleStrike: 0
            },
            settings: {
                sound: true,
                music: true,
                fontSize: 'medium',
                candySize: 'medium',
                theme: 'light'
            }
        });
        console.log("Register: User data saved to DB for UID:", user.uid); // DEBUG
        alert("Registration successful! You are now logged in.");
    } catch (error) {
        console.error("Registration error:", error.message, error.code); // DEBUG
        let errorMessage = "Registration failed.";
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = "Email already in use. Please use a different email or login.";
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = "Invalid email address.";
        } else if (error.code === 'auth/weak-password') {
            errorMessage = "Password is too weak (minimum 6 characters).";
        }
        alert(errorMessage);
    } finally {
        hideCandyLoader();
    }
}

async function login() {
    showCandyLoader();
    const email = loginName.value.trim();
    const pass = loginPass.value.trim();
    if (!email || !pass) {
        hideCandyLoader();
        return alert("Enter email and password");
    }
    
    // NEW: Set persistence based on "Remember Me" checkbox
    const persistence = rememberMeCheckbox.checked ? browserLocalPersistence : browserSessionPersistence;
    
    try {
        await setPersistence(auth, persistence);
        const userCredential = await signInWithEmailAndPassword(auth, email, pass);
        console.log("Login: Logged in successfully!", userCredential.user.email);
    } catch (error) {
        console.error("Login error:", error.message, error.code);
        let errorMessage = "Login failed. Invalid email or password.";
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            errorMessage = "Invalid email or password.";
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = "Invalid email format.";
        }
        alert(errorMessage);
    } finally {
        hideCandyLoader();
    }
}

// New: Sign in with Google
async function signInWithGoogle() {
    showCandyLoader();
    const provider = new GoogleAuthProvider();
    
    // NEW: Set persistence for Google Sign-In as well
    const persistence = rememberMeCheckbox.checked ? browserLocalPersistence : browserSessionPersistence;
    await setPersistence(auth, persistence);
    
    try {
        const result = await signInWithPopup(auth, provider); 
        const user = result.user;
        console.log("Google Sign-In: Signed in successfully!", user.uid, user.displayName); // DEBUG

        const userRef = ref(db, `users/${user.uid}`); 
        const snapshot = await get(userRef); 
        if (!snapshot.exists()) {
            console.log("Google Sign-In: New Google user. Creating DB profile."); // DEBUG
            const avatarUrl = user.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png";
            await set(userRef, {
                name: user.displayName || user.email,
                email: user.email,
                avatar: avatarUrl, 
                coins: 100, // Default starting coins
                gems: 5,   // Default starting gems
                powerups: { // Default powerups with zero count
                    shield: 0,
                    sniper: 0,
                    timeFreeze: 0,
                    doubleStrike: 0
                },
                settings: {
                    sound: true,
                    music: true,
                    fontSize: 'medium',
                    candySize: 'medium',
                    theme: 'light'
                }
            });
            alert("Welcome! Your account has been created and you are logged in.");
        } else {
            console.log("Google Sign-In: Existing Google user."); // DEBUG
            const userData = snapshot.val();
            if (user.photoURL && userData.avatar !== user.photoURL) {
                await update(userRef, { avatar: user.photoURL });
                console.log("Google Sign-In: Updated avatar from Google."); // DEBUG
            }
            alert("Logged in successfully with Google!");
        }
    } catch (error) {
        console.error("Google Sign-In error:", error.message, error.code); // DEBUG
        let errorMessage = "Google Sign-In failed.";
        if (error.code === 'auth/popup-closed-by-user') {
            errorMessage = "Sign-in process cancelled by user.";
        } else if (error.code === 'auth/cancelled-popup-request') {
            errorMessage = "Sign-in popup already open or cancelled.";
        } else if (error.code === 'auth/unauthorized-domain') {
            errorMessage = "Google Sign-In is not authorized for this domain. Please check Firebase console settings.";
        }
        alert(errorMessage);
    } finally {
        hideCandyLoader();
    }
}

// New: Forgot Password functionality
async function sendPasswordResetEmailFn() { 
    showCandyLoader();
    const email = forgotEmailInput.value.trim();
    if (!email) {
        hideCandyLoader();
        return alert("Please enter your email address.");
    }

    try {
        await sendPasswordResetEmail(auth, email); 
        alert("Password reset link sent to your email! Please check your inbox (and spam folder).");
        closeForgotPasswordPopup();
    } catch (error) {
        console.error("Forgot password error:", error.message, error.code); // DEBUG
        let errorMessage = "Failed to send password reset email.";
        if (error.code === 'auth/user-not-found') {
            errorMessage = "No user found with this email address.";
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = "Invalid email address format.";
        }
        alert(errorMessage);
    } finally {
        hideCandyLoader();
    }
}

function logout() {
    showCandyLoader(); 
    signOut(auth).then(() => { 
        console.log("Logout: Successfully logged out."); // DEBUG
        // Stop background music when logging out
        pauseBackgroundMusic();
    }).catch((error) => {
        console.error("Logout error:", error.message, error.code); // DEBUG
        alert("Failed to logout. Please try again.");
    }).finally(() => {
        hideCandyLoader(); 
    });
}

async function updateProfile() {
    showCandyLoader(); 
    const user = auth.currentUser;
    if (!user) {
        hideCandyLoader();
        alert("You must be logged in to update your profile.");
        return;
    }

    const newName = editNameInput.value.trim();
    const newEmail = editEmailInput.value.trim();
    const newAvatarFile = editAvatarInput.files[0];

    if (!newName) {
        hideCandyLoader();
        alert("Username cannot be empty.");
        return;
    }

    let updatedAvatarDataUrl = window.playerAvatar; // Start with current avatar
    try {
        if (newAvatarFile) {
            updatedAvatarDataUrl = await uploadAndResizeAvatar(newAvatarFile);
            console.log("Update Profile: New avatar processed."); // DEBUG
        }

        // Only attempt to update email if it's changed and not empty
        if (newEmail && newEmail !== user.email) {
            await user.updateEmail(newEmail); 
            console.log("Update Profile: Email updated in Firebase Auth."); // DEBUG
        }

        // Update user data in Realtime Database
        await update(ref(db, `users/${user.uid}`), {
            name: newName,
            // Use newEmail if provided, otherwise keep the current email from Auth
            email: newEmail || user.email, 
            avatar: updatedAvatarDataUrl
        });
        console.log("Update Profile: User data updated in DB for UID:", user.uid); // DEBUG

        // Update global variables and UI instantly
        window.playerName = newName;
        window.playerEmail = newEmail || user.email;
        window.playerAvatar = updatedAvatarDataUrl;
        
        // Update the profile icon in the header bar
        userProfileIcon.src = window.playerAvatar;

        alert("Profile updated successfully!");
        closeEditProfilePopup();
    } catch (error) {
        console.error("Error updating profile:", error.message, error.code); // DEBUG
        let errorMessage = "Failed to update profile. ";
        if (error.code === 'auth/requires-recent-login') {
            errorMessage += "For security, please re-authenticate to change your email. Log out and log in again.";
        } else if (error.code === 'auth/invalid-email') {
            errorMessage += "Invalid email address format.";
        } else if (error.code === 'auth/email-already-in-use') {
            errorMessage += "This email is already in use by another account.";
        } else {
            errorMessage += error.message; 
        }
        alert(errorMessage);
    } finally {
        hideCandyLoader(); 
    }
}

// New: Game Settings Functions (Updated for Display Settings)
async function loadUserSettings(uid) {
    get(ref(db, `users/${uid}/settings`)) 
        .then(snapshot => {
            const settings = snapshot.val();
            if (settings) {
                soundOn = settings.sound !== undefined ? settings.sound : true;
                musicOn = settings.music !== undefined ? settings.music : true;
                currentFontSize = settings.fontSize || 'medium';
                currentCandySize = settings.candySize || 'medium';
                currentGameTheme = settings.theme || 'light';
                console.log("Settings loaded:", settings); // DEBUG
            } else {
                // Default settings if not found
                soundOn = true;
                musicOn = true;
                currentFontSize = 'medium';
                currentCandySize = 'medium';
                currentGameTheme = 'light';
                set(ref(db, `users/${uid}/settings`), { 
                    sound: true, 
                    music: true,
                    fontSize: 'medium',
                    candySize: 'medium',
                    theme: 'light'
                }); 
                console.log("Default settings set and saved."); // DEBUG
            }
            // Apply loaded settings to UI
            updateToggleButtonUI(soundToggleBtn, soundOn, 'Sound');
            updateToggleButtonUI(musicToggleBtn, musicOn, 'Music');
            setFontSize(currentFontSize); // Apply loaded font size
            setCandySize(currentCandySize); // Apply loaded candy size
            setGameTheme(currentGameTheme); // Apply loaded theme
            playBackgroundMusic();
        })
        .catch(error => {
            console.error("Error loading user settings:", error.message, error.code); // DEBUG
            // Fallback to defaults on error
            soundOn = true;
            musicOn = true;
            currentFontSize = 'medium';
            currentCandySize = 'medium';
            currentGameTheme = 'light';
            updateToggleButtonUI(soundToggleBtn, soundOn, 'Sound');
            updateToggleButtonUI(musicToggleBtn, musicOn, 'Music');
            setFontSize(currentFontSize);
            setCandySize(currentCandySize);
            setGameTheme(currentGameTheme);
            playBackgroundMusic();
        });
}

function updateToggleButtonUI(button, state, label) {
    button.classList.toggle('on', state);
    button.classList.toggle('off', !state);
    button.innerHTML = `<span class="text-xl">${label === 'Sound' ? '🔊' : '🎵'}</span> ${label}: ${state ? 'On' : 'Off'}`;
}

// New: Function to update button group active state
function updateButtonGroupActiveState(buttonIds, activeId) {
    buttonIds.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            if (id === activeId) {
                btn.classList.add("bg-gray-200", "shadow-md");
                btn.classList.remove("bg-gray-100", "shadow-sm");
            } else {
                btn.classList.remove("bg-gray-200", "shadow-md");
                btn.classList.add("bg-gray-100", "shadow-sm");
            }
            // Special handling for dark theme button
            if (id === 'themeDarkBtn') {
                if (id === activeId) {
                    btn.classList.add("bg-gray-800", "text-white");
                } else {
                    btn.classList.remove("bg-gray-800", "text-white");
                    btn.classList.add("bg-gray-100", "text-gray-700");
                }
            }
            // Special handling for Candyland theme button
            if (id === 'themeCandylandBtn') {
                if (id === activeId) {
                    btn.classList.add("bg-pink-300", "text-pink-800"); // Darker pink for active
                    btn.classList.remove("bg-pink-100", "text-pink-700");
                } else {
                    btn.classList.remove("bg-pink-300", "text-pink-800");
                    btn.classList.add("bg-pink-100", "text-pink-700");
                }
            }
             // Special handling for Halloween theme button
            if (id === 'themeHalloweenBtn') {
                if (id === activeId) {
                    btn.classList.add("bg-orange-700", "text-white"); // Darker orange for active
                    btn.classList.remove("bg-orange-900", "text-orange-700");
                } else {
                    btn.classList.remove("bg-orange-700", "text-white");
                    btn.classList.add("bg-orange-900", "text-orange-700");
                }
            }
        }
    });
}


async function saveUserSetting(settingName, value) {
    const user = auth.currentUser;
    if (user) {
        try {
            await set(ref(db, `users/${user.uid}/settings/${settingName}`), value); 
            console.log(`Setting ${settingName} updated to ${value} for UID: ${user.uid}`); // DEBUG
        } catch (error) {
            console.error(`Error saving ${settingName} setting:`, error.message, error.code); // DEBUG
            alert(`Failed to save ${settingName} setting.`);
        }
    }
}

function toggleSound() {
    soundOn = !soundOn;
    updateToggleButtonUI(soundToggleBtn, soundOn, 'Sound');
    saveUserSetting('sound', soundOn);
}

function toggleMusic() {
    musicOn = !musicOn;
    updateToggleButtonUI(musicToggleBtn, musicOn, 'Music');
    saveUserSetting('music', musicOn);
    if (musicOn) {
        playBackgroundMusic();
    } else {
        pauseBackgroundMusic();
    }
}

// New: Font Size Functions
function setFontSize(size) {
    const body = document.body;
    // Remove existing font size classes
    body.classList.remove('font-size-small', 'font-size-medium', 'font-size-large');
    // Add the selected font size class
    body.classList.add(`font-size-${size}`);
    currentFontSize = size; // Update global state
    saveUserSetting('fontSize', size); // Save to Firebase
    // Update button active state
    updateButtonGroupActiveState(
        ['fontSizeSmallBtn', 'fontSizeMediumBtn', 'fontSizeLargeBtn'],
        `fontSize${size.charAt(0).toUpperCase() + size.slice(1)}Btn`
    );
    console.log(`Font size set to: ${size}`);
}

// New: Candy Size Functions
function setCandySize(size) {
    const candyButtons = document.querySelectorAll('#grid button');
    candyButtons.forEach(btn => {
        // Remove existing candy size classes
        btn.classList.remove('candy-size-small', 'candy-size-medium', 'candy-size-large');
        // Add the selected candy size class
        btn.classList.add(`candy-size-${size}`);
    });
    currentCandySize = size; // Update global state
    saveUserSetting('candySize', size); // Save to Firebase
    // Update button active state
    updateButtonGroupActiveState(
        ['candySizeSmallBtn', 'candySizeMediumBtn', 'candySizeLargeBtn'],
        `candySize${size.charAt(0).toUpperCase() + size.slice(1)}Btn`
    );
    console.log(`Candy size set to: ${size}`);
}

// New: Game Theme Functions
function setGameTheme(themeName) {
    const body = document.body;
    // Remove existing theme classes
    body.classList.remove('theme-light', 'theme-dark', 'theme-candyland', 'theme-halloween');
    // Add the selected theme class
    body.classList.add(`theme-${themeName}`);
    currentGameTheme = themeName; // Update global state
    saveUserSetting('theme', themeName); // Save to Firebase
    // Update button active state
    updateButtonGroupActiveState(
        ['themeLightBtn', 'themeDarkBtn', 'themeCandylandBtn', 'themeHalloweenBtn'],
        `theme${themeName.charAt(0).toUpperCase() + themeName.slice(1)}Btn`
    );
    console.log(`Game theme set to: ${themeName}`);
}


function generateRoomCode() {
    return Math.floor(10000 + Math.random() * 90000).toString();
}

function createTeam() {
    showCandyLoader(); 
    if (!window.playerName) {
        hideCandyLoader(); 
        alert("Please log in to create a team.");
        return;
    }
    player = "1";
    isAIMode = false;

    function createRoomWithUniqueCode() {
        room = generateRoomCode();
        get(ref(db, room)) 
            .then(snapshot => {
                if (snapshot.exists()) {
                    console.log(`Room ${room} already exists, generating new code...`); // DEBUG
                    createRoomWithUniqueCode();
                } else {
                    set(ref(db, room), { 
                        poison: { "1": -1, "2": -1 },
                        turn: "1",
                        selections: {},
                        players: { "1": window.playerName },
                        avatars: { "1": window.playerAvatar },
                        result: "",
                        rematch: {}
                    })
                    .then(() => {
                        console.log(`Room ${room} created successfully.`); // DEBUG
                        teamBattlePopup.classList.add("hidden");
                        info.innerText = `Team created! Share this code: ${room}`;
                        info.classList.remove("hidden"); 
                        // Hide main content and nav bar when game starts
                        mainContentArea.classList.add("hidden");
                        navBar.classList.add("hidden");
                        waitForSecondPlayer();
                    })
                    .catch(error => {
                        console.error("Error setting room data:", error.message, error.code); // DEBUG
                        alert("Failed to create team. Please try again.");
                    })
                    .finally(() => {
                        hideCandyLoader(); 
                    });
                }
            })
            .catch(error => {
                console.error("Error checking room existence:", error.message, error.code); // DEBUG
                alert("Failed to create team. Please check your internet connection.");
                hideCandyLoader(); 
            });
    }
    createRoomWithUniqueCode();
}

function joinTeam() {
    showCandyLoader(); 
    if (!window.playerName) {
        hideCandyLoader(); 
        alert("Please log in to join a team.");
        return;
    }
    room = teamInput.value.trim();
    if (!room) {
        hideCandyLoader(); 
        return alert("Enter a team code");
    }
    isAIMode = false;

    get(ref(db, `${room}/players/1`)) 
        .then(snap => {
            if (!snap.exists()) {
                hideCandyLoader(); 
                console.log("Join Team: Invalid team code or player 1 not found."); // DEBUG
                return alert("Invalid team code");
            }
            get(ref(db, `${room}/players/2`)) 
                .then(snap2 => {
                    if (snap2.exists()) {
                        hideCandyLoader(); 
                        console.log("Join Team: Team is already full."); // DEBUG
                        return alert("This team is already full. Please try another code.");
                    }
                    if (snap.val() === window.playerName) {
                        hideCandyLoader(); 
                        console.log("Join Team: Cannot join own team as second player."); // DEBUG
                        return alert("You cannot join your own team as a second player.");
                    }
                    player = "2";
                    set(ref(db, `${room}/players/2`), window.playerName); 
                    set(ref(db, `${room}/avatars/2`), window.playerAvatar); 
                    teamBattlePopup.classList.add("hidden");
                    // Hide main content and nav bar when game starts
                    mainContentArea.classList.add("hidden");
                    navBar.classList.add("hidden");
                    startGame();
                    hideCandyLoader(); 
                    console.log(`Join Team: Successfully joined room ${room} as Player 2.`); // DEBUG
                });
        }).catch(error => {
            console.error("Error joining team:", error.message, error.code); // DEBUG
            alert("Failed to join team. Please try again.");
            hideCandyLoader(); 
        });
}

function openAiDifficultyPopup() {
    if (aiDifficultyPopup) {
        aiDifficultyPopup.classList.remove('hidden');
    }
}

function closeAiDifficultyPopup() {
    if (aiDifficultyPopup) {
        aiDifficultyPopup.classList.add('hidden');
    }
}

function startAIGame(difficulty) {
  showCandyLoader(); 
  closeAiDifficultyPopup(); // Popup close karein jab game start ho

  player = "1";
  room = "AI_MODE_" + Math.random().toString(36).substring(2, 7); // Unique room for AI mode
  myTurn = true;
  isAIMode = true;
  poisoned = { "1": -1, "2": -1 }; // Reset poisoned candies for new game
  
  // Reset power-up states
  isSniperActive = false;
  isDoubleStrikeActive = false;
  doubleStrikeCount = 0;
  isShieldActive = false;
  updatePowerupButtonStates(); // UI buttons ko bhi reset karein

  opponentName.textContent = "AI Opponent";
  opponentAvatar.src = "https://cdn-icons-png.flaticon.com/512/4712/4712035.png"; // Default AI avatar
  yourName.textContent = window.playerName || "You"; 
  yourAvatar.src = window.playerAvatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"; 

  playerVsPlayerSection?.classList?.remove("hidden"); 
  
  // Hide main content and nav bar when game starts
  mainContentArea.classList.add("hidden");
  navBar.classList.add("hidden");

  startGame();
  info.innerText = "Your turn! First set your poison candy.";
  info.classList.remove("hidden"); 
  hideCandyLoader(); 
  console.log("AI Mode: Game started."); // DEBUG
}

function AITurn() {
  if (myTurn || !isAIMode) return; // Only AI's turn in AI mode

  const available = [];
  document.querySelectorAll("#grid button:not(:disabled)").forEach(btn => {
    const idx = parseInt(btn.dataset.index);
    // Ensure AI doesn't pick its own poison candy
    if (!btn.classList.contains("glass-selected") && idx !== poisoned["2"]) { 
      available.push(idx);
    }
  });

  if (available.length === 0) {
    // If no candies left for AI to pick, it's a draw
    set(ref(db, `${room}/turn`), "end"); 
    set(ref(db, `${room}/result`), "No candies left! It's a draw!"); 
    return;
  }

  const aiPlayerId = "2";
  const humanPlayerId = "1";

  if (poisoned[aiPlayerId] === -1) {
    // AI's turn to set poison candy
    // AI should not set its poison on the human player's poison candy
    const candidatesForAIPoison = available.filter(idx => idx !== poisoned[humanPlayerId]);

    let aiPoisonIndex;
    if (candidatesForAIPoison.length > 0) {
        // Pick a random candy from available non-human-poison candies
        aiPoisonIndex = candidatesForAIPoison[Math.floor(Math.random() * candidatesForAIPoison.length)];
    } else {
        // Fallback: if all non-human-poison candies are taken, pick any available
        aiPoisonIndex = available[Math.floor(Math.random() * available.length)]; 
    }

    set(ref(db, `${room}/poison/${aiPlayerId}`), aiPoisonIndex) 
      .then(() => {
        poisoned[aiPlayerId] = aiPoisonIndex; 
        set(ref(db, `${room}/turn`), humanPlayerId); // Pass turn to human player
        console.log("AI Turn: AI set poison to:", aiPoisonIndex); // DEBUG
      })
      .catch(error => console.error("AI: Error setting poison candy:", error.message, error.code)); // DEBUG

  } else {
    // AI's turn to pick a candy
    setTimeout(() => {
      let choice = -1;
      // Strategy 1: If human player's poison candy is available, pick it to win
      if (poisoned[humanPlayerId] !== -1 && available.includes(poisoned[humanPlayerId])) {
        choice = poisoned[humanPlayerId];
      } else {
        // Strategy 2: Pick a random candy that is not AI's own poison
        const nonAiPoisonCandies = available.filter(idx => idx !== poisoned[aiPlayerId]);
        if (nonAiPoisonCandies.length > 0) {
          choice = nonAiPoisonCandies[Math.floor(Math.random() * nonAiPoisonCandies.length)];
        } else {
          // Fallback: if only AI's own poison is left, pick any available (should lead to AI losing)
          choice = available[Math.floor(Math.random() * available.length)];
        }
      }

      const btn = document.querySelector(`button[data-index='${choice}']`);
      if (btn) {
        set(ref(db, `${room}/selections/${choice}`), true) 
          .then(() => {
            // UI update handled by onValue listener for selections
            console.log("AI Turn: AI picked candy:", choice); // DEBUG

            if (choice === poisoned[humanPlayerId]) {
              // AI picked human's poison, human wins
              declareGameResult(humanPlayerId); 
            } else {
              // Check if any candies are left after AI's move
              get(ref(db, `${room}/selections`)).then(selectionsSnap => { 
                const currentSelections = selectionsSnap.val() || {};
                const remainingSelectableCandies = Array.from(document.querySelectorAll(".candy-btn")).filter(candyBtn => {
                    const idx = parseInt(candyBtn.dataset.index);
                    return !currentSelections[idx] && (idx !== poisoned[humanPlayerId]); // Check if not selected and not human's poison
                });
                if (remainingSelectableCandies.length === 0) {
                    // No candies left for human, it's a draw
                    set(ref(db, `${room}/turn`), "end"); 
                    set(ref(db, `${room}/result`), "No candies left! It's a draw!"); 
                } else {
                    set(ref(db, `${room}/turn`), humanPlayerId); // Pass turn back to human player
                }
              });
            }
          })
          .catch(error => console.error("AI: Error picking candy:", error.message, error.code)); // DEBUG
      }
    }, 1500); // AI thinks for 1.5 seconds
  }
}

// New function to declare game results
function declareGameResult(loserPlayerId) {
    get(ref(db, `${room}/players`)) 
        .then(snap => {
            const players = snap.val();
            const winnerPlayerId = (loserPlayerId === "1") ? "2" : "1";

            let loserName;
            let winnerName;

            if (isAIMode) {
                winnerName = (winnerPlayerId === "1") ? window.playerName : "AI Opponent"; 
                loserName = (loserPlayerId === "1") ? window.playerName : "AI Opponent"; 
            } 
            else { 
                 winnerName = players[winnerPlayerId] || `Player ${winnerPlayerId}`;
                 loserName = players[loserPlayerId] || `Player ${loserPlayerId}`;
            }
           
            let message = "";
            if (isAIMode && loserPlayerId === "2") { // AI lost
                message = `${winnerName} wins! (AI picked its own poison)`;
            } 
            else if (isAIMode && loserPlayerId === "1") { // Human lost to AI
                message = `${winnerName} wins! (You picked ${winnerName}'s poison)`;
            } 
            else { // Multiplayer game
                message = `${winnerName} wins! (${loserName} picked ${winnerName}'s poison)`;
            }

            set(ref(db, `${room}/result`), message)
                .then(() => console.log("DECLARE GAME RESULT: Result set successfully in Firebase:", message)) // DEBUG
                .catch(error => console.error("DECLARE GAME RESULT: Error setting result in Firebase:", error.message, error.code)); // DEBUG
            
            set(ref(db, `${room}/turn`), "end")
                .then(() => console.log("DECLARE GAME RESULT: Turn set to 'end' successfully.")) // DEBUG
                .catch(error => console.error("DECLARE GAME RESULT: Error setting turn to 'end':", error.message, error.code)); // DEBUG
        })
        .catch(error => console.error("DECLARE GAME RESULT: Error fetching players data:", error.message, error.code)); // DEBUG
}


function waitForSecondPlayer() {
    info.classList.remove("hidden");
    info.innerText = `Waiting for Player 2 to join. Code: ${room}`;
    // Hide main content and nav bar when game starts
    mainContentArea.classList.add("hidden");
    navBar.classList.add("hidden");
    gameArea.classList.remove("hidden");
    playerVsPlayerSection?.classList?.remove("hidden");
    // Powerups container ko show karein
    inGamePowerupsContainer?.classList?.remove("hidden");
    console.log("Waiting for second player in room:", room); // DEBUG

    // Listen for player 2 joining the room
    onValue(ref(db, `${room}/players/2`), snap => { 
        if (snap.exists()) {
            const opponentDisplayName = snap.val();
            get(ref(db, `${room}/avatars/2`)) 
                .then(avatarSnap => {
                    const opponentAvatarUrl = avatarSnap.val() || "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                    opponentName.textContent = opponentDisplayName;
                    opponentAvatar.src = opponentAvatarUrl;
                    yourName.textContent = window.playerName;
                    yourAvatar.src = window.playerAvatar;
                    startGame(); // Start the game once player 2 joins
                    console.log("Second player joined. Starting game."); // DEBUG
                });
        }
    });

    // New: Listen for invite decline status on the room
    onValue(ref(db, `${room}/result`), async (snapshot) => {
        const resultMessage = snapshot.val();
        if (resultMessage && resultMessage.includes("declined the game invite.")) {
            // Parse decliner's info from the message or fetch if needed
            const declinerNameMatch = resultMessage.match(/^(.*?) declined the game invite\./);
            const declinerName = declinerNameMatch ? declinerNameMatch[1] : "Opponent";
            
            // Fetch decliner's avatar if possible (assuming result message contains UID or we can derive it)
            // For now, we'll use a generic avatar or the one passed if available
            // In declineGameInvite, we'll ensure the result message includes decliner's avatar if possible
            const declinerUid = player === "1" ? "2" : "1"; // Assuming player 1 is inviter, player 2 is invitee
            let declinerAvatarUrl = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
            try {
                const declinerSnapshot = await get(ref(db, `users/${declinerUid}`));
                if (declinerSnapshot.exists()) {
                    declinerAvatarUrl = declinerSnapshot.val().avatar || declinerAvatarUrl;
                }
            } catch (error) {
                console.error("Error fetching decliner avatar:", error);
            }

            window.showInviteDeclinedNotification(declinerName, declinerAvatarUrl);
            // Clean up game state as the invite was declined
            exitGameConfirmed(); // This will reset UI and navigate to lobby
        }
    });
}

function startGame() {
    // Hide main content and nav bar when game starts
    mainContentArea.classList.add("hidden");
    navBar.classList.add("hidden");
    gameArea.classList.remove("hidden");
    playerVsPlayerSection?.classList?.remove("hidden");
    info.classList.remove("hidden");
    grid.classList.remove("hidden");
    // UPDATED: In-Game Powerups container ko show karein
    if (inGamePowerupsContainer) {
        inGamePowerupsContainer.classList.remove('hidden');
    }
    grid.innerHTML = "";
    winLoseNotification.classList.add("hidden");
    rematchPopup.classList.add("hidden");
    hideGameInviteNotification(); // Ensure invite notification is hidden
    window.hideInviteDeclinedNotification(); // New: Hide declined invite notification
    console.log("Game started. Mode:", isAIMode ? "AI" : "Multiplayer", "Room:", room); // DEBUG
    
    // Reset power-up states for the new game
    isSniperActive = false;
    isDoubleStrikeActive = false;
    doubleStrikeCount = 0;
    isShieldActive = false;
    updatePowerupButtonStates(); // UI buttons ko bhi reset karein

    for (let i = 0; i < 20; i++) {
        const btn = document.createElement("button");
        btn.className = `candy-btn candy-size-${currentCandySize}`; // Add current candy size class
        btn.innerText = candyEmojis[i % candyEmojis.length]; // Using emojis
        btn.dataset.index = i;
        btn.onclick = () => handleCandyClick(i, btn);
        grid.appendChild(btn);
    }

    document.querySelectorAll(".candy-btn").forEach(btn => {
        btn.disabled = false;
        btn.classList.remove("glass-selected", "poison-candy");
    });

    if (isAIMode) {
        opponentName.textContent = "AI Opponent";
        opponentAvatar.src = "https://cdn-icons-png.flaticon.com/512/4712/4712035.png";
        yourName.textContent = window.playerName || "You"; 
        yourAvatar.src = window.playerAvatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"; 
        get(ref(db, room)).then(snapshot => { 
            if (!snapshot.exists()) {
                set(ref(db, room), { 
                    poison: { "1": -1, "2": -1 },
                    turn: "1",
                    selections: {},
                    result: ""
                });
                console.log("AI Mode: Initializing new AI room data."); // DEBUG
            }
        }).catch(error => console.error("Error checking/initializing AI room:", error.message, error.code)); // DEBUG
    } else {
        get(ref(db, `${room}/players`)) 
            .then(playersSnap => {
                const playersData = playersSnap.val();
                if (playersData) {
                    yourName.textContent = window.playerName;
                    yourAvatar.src = window.playerAvatar;
                    if (player === "1") {
                        opponentName.textContent = playersData["2"] || "Waiting...";
                        get(ref(db, `${room}/avatars/2`)) 
                            .then(avatarSnap => {
                                opponentAvatar.src = avatarSnap.val() || "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                            });
                    } else {
                        opponentName.textContent = playersData["1"] || "Waiting...";
                        get(ref(db, `${room}/avatars/1`)) 
                            .then(avatarSnap => {
                                opponentAvatar.src = avatarSnap.val() || "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                            });
                    }
                }
            });
        get(ref(db, `${room}/turn`)) 
            .then(snap => {
                if (!snap.exists()) {
                    set(ref(db, `${room}/turn`), "1"); 
                    console.log("Multiplayer: Setting initial turn to Player 1."); // DEBUG
                }
            });
    }

    onValue(ref(db, `${room}/poison`), snap => { 
        poisoned = snap.val() || { "1": -1, "2": -1 };
        console.log("Poison data updated:", poisoned); // DEBUG
        document.querySelectorAll(".candy-btn").forEach(btn => {
            const idx = parseInt(btn.dataset.index);
            btn.classList.remove("poison-candy");
            if (poisoned["1"] !== -1 && idx === poisoned["1"]) {
                btn.classList.add("poison-candy");
                if (player === "1") btn.disabled = true; // Disable for player 1 if it's their poison
            }
            if (poisoned["2"] !== -1 && idx === poisoned["2"]) {
                if (!isAIMode) { 
                    btn.classList.add("poison-candy"); // Only show poison for opponent in multiplayer
                }
                if (player === "2") btn.disabled = true; // Disable for player 2 if it's their poison
            }
        });
    });

    onValue(ref(db, `${room}/turn`), snap => { 
        const t = snap.val();
        console.log("Turn updated:", t); // DEBUG
        if (t === "end") return; // Game has ended, do not update turn info

        myTurn = (isAIMode && t === "1") || (!isAIMode && t === player);

        const opponentPlayer = player === "1" ? "2" : "1";

        if (myTurn) {
            if (isSniperActive) {
                info.innerText = "Sniper active! Select a candy to remove it.";
            }
            else if (doubleStrikeCount > 0) {
                 info.innerText = `Double Strike active! ${doubleStrikeCount} move(s) remaining.`;
            }
            else if (poisoned[player] === -1) {
                info.innerText = "Your turn! First set your poison candy.";
            } else if (poisoned["1"] === -1 || poisoned["2"] === -1) {
                info.innerText = "Waiting for opponent to set their poison...";
            } else {
                info.innerText = "Your turn! Now pick a candy to eat.";
            }
        } else {
            if (isAIMode) {
                if (t === "2") {
                    info.innerText = "AI is thinking...";
                    setTimeout(AITurn, 1500);
                }
            } else {
                if (poisoned[opponentPlayer] === -1) {
                    info.innerText = "Wait for your turn! Opponent is setting their poison.";
                } else {
                    info.innerText = "Wait for your turn!";
                }
            }
        }
    });

    onValue(ref(db, `${room}/selections`), snap => { 
        const selections = snap.val() || {};
        console.log("Selections updated:", selections); // DEBUG
        document.querySelectorAll(".candy-btn").forEach(btn => {
            btn.disabled = false; // Re-enable all first
            btn.classList.remove("glass-selected"); // Remove selected class

            const idx = parseInt(btn.dataset.index); 

            if (selections[idx]) {
                btn.disabled = true; // Disable if already selected
                btn.classList.add("glass-selected"); // Add selected visual
            }
            // Ensure poison candy is always disabled for the player who set it
            if (player === "1" && poisoned["1"] !== -1 && idx === poisoned["1"]) {
                btn.classList.add("poison-candy");
                btn.disabled = true;
            } else if (player === "2" && poisoned["2"] !== -1 && idx === poisoned["2"]) {
                btn.classList.add("poison-candy");
                btn.disabled = true;
            }
            // Ensure opponent's poison candy is not visually marked for the current player in multiplayer
            // This logic was slightly off, ensuring it doesn't add 'poison-candy' for opponent's poison
            if (!isAIMode && player === "1" && poisoned["2"] !== -1 && idx === poisoned["2"]) {
                // Do not add 'poison-candy' class for opponent's poison
            } else if (!isAIMode && player === "2" && poisoned["1"] !== -1 && idx === poisoned["1"]) {
                // Do not add 'poison-candy' class for opponent's poison
            }
        });

        // Check for draw condition after selections are updated
        get(ref(db, `${room}/poison`)).then(poisonSnap => { 
            const currentPoisons = poisonSnap.val() || { "1": -1, "2": -1 };
            const remainingSelectableCandies = Array.from(document.querySelectorAll(".candy-btn")).filter(btn => {
                const idx = parseInt(btn.dataset.index);
                // A candy is selectable if it's not already selected AND it's not the current player's own poison
                return !selections[idx] && (idx !== currentPoisons[player]); 
            });
            // If both players have set poison and no selectable candies are left, it's a draw
            if (currentPoisons["1"] !== -1 && currentPoisons["2"] !== -1 && remainingSelectableCandies.length === 0) {
                set(ref(db, `${room}/turn`), "end"); 
                set(ref(db, `${room}/result`), "No candies left! It's a draw!"); 
                console.log("Draw condition met. Setting result to draw."); // DEBUG
            }
        });
    });

    onValue(ref(db, `${room}/result`), snap => { 
        const res = snap.val();
        if (res) {
            console.log("Game result received:", res); // DEBUG
            let title = "";
            let message = res;
            let poisonInfoText = ""; // Changed to poisonInfoText for clarity

            // Check if the result indicates a game invite decline
            if (res.includes("declined the game invite.")) {
                const declinerNameMatch = res.match(/^(.*?) declined the game invite\./);
                const declinerName = declinerNameMatch ? declinerNameMatch[1] : "Opponent";
                const declinerUidMatch = res.match(/DeclinerUID:(\w+)/); // Extract UID if embedded
                const declinerUid = declinerUidMatch ? declinerUidMatch[1] : null;

                let declinerAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                if (declinerUid) {
                    get(ref(db, `users/${declinerUid}/avatar`)).then(avatarSnap => {
                        declinerAvatar = avatarSnap.val() || declinerAvatar;
                        window.showInviteDeclinedNotification(declinerName, declinerAvatar);
                    }).catch(err => {
                        console.error("Error fetching decliner avatar:", err);
                        window.showInviteDeclinedNotification(declinerName, declinerAvatar); // Show with default if fetch fails
                    });
                } else {
                    window.showInviteDeclinedNotification(declinerName, declinerAvatar);
                }
                // Clean up game state as the invite was declined
                exitGameConfirmed(); // This will reset UI and navigate to lobby
                return; // Stop further processing for game results
            }


            if (res.includes("wins!")) {
                const winnerMatch = res.match(/^(.*?)\s+wins!/);
                const winnerName = winnerMatch ? winnerMatch[1] : "";

                if (winnerName === window.playerName || (isAIMode && winnerName.includes("AI Opponent") && player === "2")) {
                    title = "You Win!";
                    if (poisoned[player] !== -1 && poisoned[player] !== null) {
                        poisonInfoText = `Your poisonous candy was ${candyEmojis[poisoned[player] % candyEmojis.length]} (candy no. ${poisoned[player] + 1}).`;
                    }
                } else {
                    title = "You Lose!";
                    const opponentPlayerId = (player === "1") ? "2" : "1";
                    const actualWinnerPlayerId = (isAIMode && winnerName === "AI Opponent") ? "2" : opponentPlayerId; 
                    
                    if (poisoned[actualWinnerPlayerId] !== -1 && poisoned[actualWinnerPlayerId] !== null) {
                        poisonInfoText = `Opponent's poisonous candy was ${candyEmojis[poisoned[actualWinnerPlayerId] % candyEmojis.length]} (candy no. ${poisoned[actualWinnerPlayerId] + 1}).`;
                    }
                }
            } else {
                title = "Game Over"; 
            }
            window.showGameResult(title, message, poisonInfoText);
        }
    });

    onValue(ref(db, `${room}/rematch`), snap => { 
        const rematchData = snap.val() || {};
        console.log("Rematch data updated:", rematchData); // DEBUG
        const opponentKey = player === "1" ? "2" : "1";
        if (rematchData[player] && rematchData[opponentKey]) {
            startNewRound();
        }
    });
}

async function handleCandyClick(index, btn) {
    console.log(`Candy ${index} clicked. My turn: ${myTurn}, Player: ${player}, Poisoned:`, poisoned);
    if (!myTurn) {
        alert("It's not your turn!");
        return;
    }
    
    // NEW: Handle Sniper power-up
    if (isSniperActive) {
        if (btn.classList.contains("glass-selected")) {
            alert("This candy is already removed!");
            return;
        }
        if (index === poisoned[player]) {
            alert("You cannot remove your own poisonous candy!");
            return;
        }
        
        try {
            await set(ref(db, `${room}/selections/${index}`), true); // Remove the candy
            await update(ref(db, `users/${window.playerUid}/powerups/sniper`), window.playerPowerups.sniper - 1); // Decrement count in database
            isSniperActive = false; // Deactivate sniper
            info.innerText = "Sniper used! It's still your turn to pick a candy.";
            console.log(`Player ${player} used Sniper on candy ${index}.`);
        } catch (error) {
            console.error("Error using Sniper power-up:", error);
            alert("Failed to use power-up. Please try again.");
        }
        return;
    }

    if (btn.classList.contains("glass-selected")) {
        alert("This candy has already been picked!");
        return;
    }

    if (poisoned[player] === -1) { // Current player is setting their poison candy
        const opponent = player === "1" ? "2" : "1";
        if (!isAIMode && poisoned[opponent] === index && poisoned[opponent] !== -1) {
            alert("You cannot set your poison on an opponent's already set poison candy!");
            return;
        }
        try {
            await set(ref(db, `${room}/poison/${player}`), index);
            poisoned[player] = index;
            const nextPlayer = player === "1" ? "2" : "1";
            await set(ref(db, `${room}/turn`), nextPlayer);
            console.log(`Player ${player} set poison to ${index}. Next turn: ${nextPlayer}`);
        } catch (error) {
            console.error("Error setting poison candy:", error.message, error.code);
            alert("Failed to set poison candy. Please try again.");
        }
    } else if (poisoned["1"] !== -1 && poisoned["2"] !== -1) { // Both players have set poison, now picking candies
        if (poisoned[player] === index) {
            alert("You cannot pick your own poisonous candy!");
            return;
        }
        
        const opponent = player === "1" ? "2" : "1";
        if (poisoned[opponent] === index) {
            // NEW: Check for Shield power-up
            if (isShieldActive) {
                try {
                    await update(ref(db, `users/${window.playerUid}/powerups/shield`), window.playerPowerups.shield - 1); // Decrement count in database
                    isShieldActive = false; // Shield is consumed
                    info.innerText = "Your Shield saved you from the poisonous candy! Now it's the opponent's turn.";
                    // Pass turn to next player without the current player losing
                    const nextPlayer = player === "1" ? "2" : "1";
                    await set(ref(db, `${room}/turn`), nextPlayer);
                    console.log(`Player ${player} was saved by Shield from candy ${index}.`);
                    return; // Stop here, no loss declared
                } catch (error) {
                    console.error("Error using Shield power-up:", error);
                    alert("Failed to use power-up. Please try again.");
                    return;
                }
            }
            // No shield, so the player loses
            try {
                await set(ref(db, `${room}/selections/${index}`), true);
                declareGameResult(player); // Current player picked opponent's poison, current player loses
            } catch (error) {
                console.error("Error picking candy:", error.message, error.code);
                alert("Failed to pick candy. Please try again.");
            }
        } else {
            // Normal candy pick
            try {
                await set(ref(db, `${room}/selections/${index}`), true);
                // NEW: Double Strike logic
                if (isDoubleStrikeActive && doubleStrikeCount > 1) {
                    doubleStrikeCount--;
                    info.innerText = `Double Strike active! You have ${doubleStrikeCount} move(s) remaining.`;
                    console.log(`Player ${player} used Double Strike. ${doubleStrikeCount} moves left.`);
                } else {
                    // Regular turn change
                    isDoubleStrikeActive = false;
                    doubleStrikeCount = 0;
                    const nextPlayer = player === "1" ? "2" : "1";
                    await set(ref(db, `${room}/turn`), nextPlayer); // Pass turn to next player
                    console.log(`Player ${player} picked candy ${index}. Next turn: ${nextPlayer}`);
                }
            } catch (error) {
                console.error("Error picking candy:", error.message, error.code);
                alert("Failed to pick candy. Please try again.");
            }
        }
    } else {
        info.innerText = "Wait for both players to set their poison candies first!";
    }
}


// NEW: Use Powerup Function (Updated to decrement count correctly)
async function usePowerup(powerupName) {
    if (!myTurn) {
        alert("You can only use a power-up on your turn!");
        return;
    }
    if (poisoned["1"] === -1 || poisoned["2"] === -1) {
        alert("You can only use power-ups after both players have set their poison candies.");
        return;
    }
    if (window.playerPowerups[powerupName] <= 0) {
        alert(`You don't have any ${powerupName} power-ups left!`);
        return;
    }

    // Check if another powerup is already active
    if (isSniperActive || isDoubleStrikeActive) {
        alert("Another power-up is already active!");
        return;
    }
    
    showCandyLoader();
    try {
        const userPowerupRef = ref(db, `users/${window.playerUid}/powerups/${powerupName}`);

        switch (powerupName) {
            case 'shield':
                // Shield ko use karne par hi count kam hoti hai, is liye yahan sirf local state update hogi.
                // Database update handleCandyClick mein hoga.
                isShieldActive = true;
                info.innerText = "Shield power-up activated! The next poisonous candy you pick will be blocked.";
                // Update UI to show shield is active
                inGameShieldBtn.classList.add('active-shield');
                break;

            case 'sniper':
                // Sniper ka count use karne par hi kam hoga, is liye yahan sirf local state update hogi.
                // Database update handleCandyClick mein hoga.
                isSniperActive = true;
                info.innerText = "Sniper active! Select a candy to remove it from the game.";
                break;
            
            case 'timeFreeze':
                // Decrement powerup count in Firebase
                await update(userPowerupRef, window.playerPowerups.timeFreeze - 1);
                info.innerText = "Time Freeze used! Your opponent's turn is skipped.";
                // Pass turn back to yourself
                const currentPlayer = player;
                await set(ref(db, `${room}/turn`), currentPlayer);
                break;

            case 'doubleStrike':
                // Decrement powerup count in Firebase
                await update(userPowerupRef, window.playerPowerups.doubleStrike - 1);
                isDoubleStrikeActive = true;
                doubleStrikeCount = 2;
                info.innerText = "Double Strike activated! You can now make two moves.";
                break;
        }

        console.log(`Player ${player} used power-up: ${powerupName}`);

    } catch (error) {
        console.error(`Error using power-up ${powerupName}:`, error);
        alert("Failed to use power-up. Please try again.");
    } finally {
        hideCandyLoader();
    }
}

// NEW: Function to update the UI state of in-game powerup buttons
function updatePowerupButtonStates() {
    if (inGameShieldBtn) {
        const count = window.playerPowerups.shield || 0;
        inGameShieldBtn.querySelector('.count').textContent = count;
        inGameShieldBtn.disabled = (count === 0 || isSniperActive || isDoubleStrikeActive);
        inGameShieldBtn.classList.toggle('active-shield', isShieldActive);
    }
    if (inGameSniperBtn) {
        const count = window.playerPowerups.sniper || 0;
        inGameSniperBtn.querySelector('.count').textContent = count;
        inGameSniperBtn.disabled = (count === 0 || isSniperActive || isDoubleStrikeActive);
        // Add a visual indicator for an active sniper, e.g., a glow
        inGameSniperBtn.classList.toggle('active-sniper', isSniperActive);
    }
    if (inGameTimeFreezeBtn) {
        const count = window.playerPowerups.timeFreeze || 0;
        inGameTimeFreezeBtn.querySelector('.count').textContent = count;
        inGameTimeFreezeBtn.disabled = (count === 0 || isSniperActive || isDoubleStrikeActive);
    }
    if (inGameDoubleStrikeBtn) {
        const count = window.playerPowerups.doubleStrike || 0;
        inGameDoubleStrikeBtn.querySelector('.count').textContent = count;
        inGameDoubleStrikeBtn.disabled = (count === 0 || isSniperActive || isDoubleStrikeActive);
        // Add a visual indicator for an active double strike
        inGameDoubleStrikeBtn.classList.toggle('active-double-strike', isDoubleStrikeActive);
    }
}

// NEW: Handlers for powerup buttons in HTML (exposed to window)
window.usePowerup = usePowerup;


// New: Handles what happens after a game ends and 'Continue' is clicked
window.handleGameEndContinue = () => {
    if (isAIMode) {
        // If it was an AI game, show the rematch popup
        rematchPopup.classList.remove('hidden');
    } else {
        // If it was a multiplayer game, go back to lobby and clear state
        closeRematchPopup(); // This function already handles navigation to lobby and state cleanup
    }
};


function requestRematch() {
    showCandyLoader(); 
    if (!room) {
        hideCandyLoader(); 
        alert("No active game to rematch.");
        return;
    }

    if (isAIMode) {
        // For AI mode, simply reset the room state and start a new AI game
        set(ref(db, room), { 
            poison: { "1": -1, "2": -1 },
            turn: "1",
            selections: {},
            result: ""
        }).then(() => {
            console.log("AI game state reset for rematch."); // DEBUG
            startAIGame('easy'); // Start a new AI game
            rematchPopup.classList.add("hidden"); // Hide rematch popup
        }).catch(error => {
            console.error("Error resetting AI game state for rematch:", error.message, error.code); // DEBUG
            alert("Failed to restart AI game. Please try again.");
        }).finally(() => {
            hideCandyLoader(); 
        });
        return;
    }

    // Multiplayer rematch logic
    const currentUser = auth.currentUser;
    if (!currentUser) {
        hideCandyLoader(); 
        alert("You must be logged in to request a rematch.");
        return;
    }

    // Set rematch status for current player in Firebase
    set(ref(db, `${room}/rematch/${player}`), true) 
        .then(() => {
            info.innerText = "Rematch requested! Waiting for opponent...";
            console.log(`Rematch requested by Player ${player}.`); // DEBUG
        })
        .catch(error => {
            console.error("Error requesting rematch:", error.message, error.code); // DEBUG
            alert("Failed to request rematch. Please try again.");
        })
        .finally(() => {
            hideCandyLoader(); 
        });
}

function startNewRound() {
    showCandyLoader(); 
    // Reset the entire room state for a new round
    update(ref(db, room), { 
        poison: { "1": -1, "2": -1 },
        turn: "1",
        selections: {},
        result: "",
        rematch: {} // Clear rematch requests
    })
    .then(() => {
        console.log("Game state reset for new round."); // DEBUG
        rematchPopup.classList.add("hidden"); // Hide rematch popup
        startGame(); // Start a new game with the same players
    })
    .catch(error => {
        console.error("Error resetting game state:", error.message, error.code); // DEBUG
        alert("Failed to start new round. Please try again.");
    })
    .finally(() => {
        hideCandyLoader(); 
    });
}

// Function to show the custom exit confirmation dialog
function showExitConfirmation() {
    customConfirm.classList.remove('hidden');
}

// Actual exit game logic, renamed to avoid conflict with `showExitConfirmation`
function exitGameConfirmed() {
    showCandyLoader(); 

    if (!isAIMode && room) { // If it's a multiplayer game and a room exists
        // Remove current player's data from the room
        remove(ref(db, `${room}/players/${player}`)); 
        remove(ref(db, `${room}/avatars/${player}`)); 
        console.log(`Player ${player} left room ${room}.`); // DEBUG

        // Check if the room is now empty or if there's a remaining player
        get(ref(db, room)) 
            .then(snapshot => {
            const roomData = snapshot.val();
            if (!roomData || (roomData.players && Object.keys(roomData.players).length === 0)) {
                // If no players left, delete the room
                remove(ref(db, room)) 
                    .then(() => console.log("Empty room deleted.")) // DEBUG
                    .catch(error => console.error("Error deleting empty room:", error.message, error.code)) // DEBUG
                    .finally(() => hideCandyLoader());
            } else if (roomData && roomData.players) {
                // If there's a remaining player, declare them the winner by forfeit
                const remainingPlayerKey = Object.keys(roomData.players)[0];
                if (remainingPlayerKey) {
                    get(ref(db, `${room}/players/${remainingPlayerKey}`)).then(remainingPlayerSnap => { 
                        const remainingPlayerName = remainingPlayerSnap.val() || `Player ${remainingPlayerKey}`;
                        set(ref(db, `${room}/result`), `${window.playerName} has left the game. ${remainingPlayerName} wins by forfeit!`); 
                        set(ref(db, `${room}/turn`), "end"); // End the game
                        console.log(`Player ${window.playerName} left. ${remainingPlayerName} wins by forfeit.`); // DEBUG
                    }).catch(error => {
                        console.error("Error fetching remaining player name for forfeit:", error.message, error.code); // DEBUG
                        set(ref(db, `${room}/result`), `${window.playerName} has left the game. The other player wins by forfeit!`); 
                        set(ref(db, `${room}/turn`), "end"); 
                    }).finally(() => hideCandyLoader());
                } else {
                    hideCandyLoader(); 
                }
            } else {
                hideCandyLoader(); 
            }
        });
    } else if (isAIMode && room) { // If it's an AI game and a room exists
        // Delete the AI game room
        remove(ref(db, room)) 
            .then(() => console.log("AI game room deleted.")) // DEBUG
            .catch(error => console.error("Error deleting AI room:", error.message, error.code)) // DEBUG
            .finally(() => hideCandyLoader());
    } else {
        hideCandyLoader(); // No active game or room to clean up
    }

    // Reset local game variables
    player = "";
    room = "";
    myTurn = false;
    poisoned = {};
    isAIMode = false;
    // NEW: Reset power-up active flags
    isSniperActive = false;
    isDoubleStrikeActive = false;
    doubleStrikeCount = 0;
    isShieldActive = false;
    
    // Hide game-related UI elements
    gameArea.classList.add("hidden");
    playerVsPlayerSection?.classList?.add("hidden");
    winLoseNotification.classList.add("hidden");
    rematchPopup.classList.add("hidden");
    info.classList.add("hidden");
    // UPDATED: In-Game Powerups container ko bhi hide karein
    if (inGamePowerupsContainer) {
        inGamePowerupsContainer.classList.add('hidden');
    }
    
    // Show lobby and navigation bar
    mainContentArea.classList.remove("hidden"); // Show main content area
    navBar.classList.remove("hidden"); // Show nav bar
    navigateToSection('lobby'); // Navigate to lobby
    playBackgroundMusic(); // Resume background music
}


// Global function to show game result notification (called from main.js and HTML)
window.showGameResult = function(title, message, poisonCandyDetails) {
    document.getElementById("notificationTitle").innerText = title;
    document.getElementById("notificationMessage").innerText = message;
    document.getElementById("poisonInfo").innerText = poisonCandyDetails;
    winLoseNotification.classList.remove("hidden");
    if (title.includes("Win")) {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
        setTimeout(() => {
            confetti({
                particleCount: 100,
                spread: 70,
            origin: { x: 0.2, y: 0.8 }
            });
        }, 200);
        setTimeout(() => {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { x: 0.8, y: 0.8 }
            });
        }, 400);
    }
    hideCandyLoader(); 
};

function closeEditProfilePopup() {
    if (editProfilePopup) {
        editProfilePopup.classList.add("hidden");
        editNameInput.value = "";
        editEmailInput.value = "";
        editAvatarInput.value = "";
    }
}

function openGameSettingsPopup() {
    if (gameSettingsPopup) {
        gameSettingsPopup.classList.remove('hidden');
        // Update initial state of display settings buttons when opening popup
        updateButtonGroupActiveState(
            ['fontSizeSmallBtn', 'fontSizeMediumBtn', 'fontSizeLargeBtn'],
            `fontSize${currentFontSize.charAt(0).toUpperCase() + currentFontSize.slice(1)}Btn`
        );
        updateButtonGroupActiveState(
            ['candySizeSmallBtn', 'candySizeMediumBtn', 'candySizeLargeBtn'],
            `candySize${currentCandySize.charAt(0).toUpperCase() + currentCandySize.slice(1)}Btn`
        );
        updateButtonGroupActiveState(
            ['themeLightBtn', 'themeDarkBtn', 'themeCandylandBtn', 'themeHalloweenBtn'],
            `theme${currentGameTheme.charAt(0).toUpperCase() + currentGameTheme.slice(1)}Btn`
        );
    }
}

function closeGameSettingsPopup() {
    if (gameSettingsPopup) {
        gameSettingsPopup.classList.add('hidden');
    }
}

function showForgotPasswordPopup() {
    if (forgotPasswordPopup) {
        forgotPasswordPopup.classList.remove('hidden');
        forgotEmailInput.value = '';
    }
}

function closeForgotPasswordPopup() {
    if (forgotPasswordPopup) {
        forgotPasswordPopup.classList.add('hidden');
    }
}

// --- Friends Feature Functions ---

function openFriendsPopup() {
    if (!window.playerUid) {
        alert("You must be logged in to use the Friends feature.");
        return;
    }
    friendsPopup.classList.remove('hidden');
    console.log("DEBUG: Friends popup opened."); // DEBUG

    // Check if there are any received requests and default to that tab
    if (Object.keys(currentReceivedRequests).length > 0) {
        console.log("DEBUG: Pending received requests found. Defaulting to 'Requests' tab."); // DEBUG
        showFriendsTab('friendRequests'); // Show requests tab if there are any
    } else {
        console.log("DEBUG: No pending received requests. Defaulting to 'My Friends' tab."); // DEBUG
        showFriendsTab('myFriends'); // Otherwise, default to my friends
    }
}

function closeFriendsPopup() {
    friendsPopup.classList.add('hidden');
    console.log("DEBUG: Friends popup closed."); // DEBUG
}

// showFriendsTab ab popup ke andar ke tabs ko manage karega
function showFriendsTab(tabName) {
    // Hide all main sections inside the friends popup
    myFriendsSectionPopup.classList.add('hidden');
    friendRequestsSectionPopup.classList.add('hidden');
    searchFriendsSectionPopup.classList.add('hidden');

    // Deactivate all tab buttons
    tabMyFriends.classList.remove('active');
    tabFriendRequests.classList.remove('active');
    tabSearchFriends.classList.remove('active');

    // Show the selected content section and activate its button
    switch (tabName) {
        case 'myFriends':
            myFriendsSectionPopup.classList.remove('hidden');
            tabMyFriends.classList.add('active');
            // Explicitly fetch and display friends when tab is clicked
            get(ref(db, `users/${window.playerUid}/friends`)).then(snapshot => {
                const friendsData = snapshot.val() || {};
                console.log("DEBUG: Fetching friends for My Friends tab on click:", friendsData);
                displayMyFriends(friendsData);
            }).catch(error => {
                console.error("DEBUG: Error fetching friends for My Friends tab:", error);
                displayMyFriends({}); // Show empty if error
            });
            break;
        case 'friendRequests':
            friendRequestsSectionPopup.classList.remove('hidden');
            tabFriendRequests.classList.add('active');
            // Explicitly fetch and display received requests when tab is clicked
            get(ref(db, `users/${window.playerUid}/receivedRequests`)).then(snapshot => {
                const receivedData = snapshot.val() || {};
                console.log("DEBUG: Fetching received requests for Requests tab on click:", receivedData);
                displayFriendRequests(receivedData, 'received');
            }).catch(error => {
                console.error("DEBUG: Error fetching received requests for Requests tab:", error);
                displayFriendRequests({}, 'received'); // Show empty if error
            });
            // Explicitly fetch and display sent requests when tab is clicked
            get(ref(db, `users/${window.playerUid}/sentRequests`)).then(snapshot => {
                const sentData = snapshot.val() || {};
                console.log("DEBUG: Fetching sent requests for Requests tab on click:", sentData);
                displayFriendRequests(sentData, 'sent');
            }).catch(error => {
                console.error("DEBUG: Error fetching sent requests for Requests tab:", error);
                displayFriendRequests({}, 'sent'); // Show empty if error
            });
            break;
        case 'searchFriends':
            searchFriendsSectionPopup.classList.remove('hidden');
            tabSearchFriends.classList.add('active');
            searchResultsList.innerHTML = ''; // Clear previous results
            noSearchResultsMessage.textContent = "Search for players by username or email."; // Reset message
            noSearchResultsMessage.classList.remove('hidden'); // Show initial message
            searchFriendInput.value = ''; // Clear search input
            break;
    }
}

// Listeners for friend data (My Friends, Received Requests, Sent Requests)
function listenForFriendsData(uid) {
    if (!uid) return; // Ensure UID exists
    onValue(ref(db, `users/${uid}/friends`), (snapshot) => {
        currentMyFriends = snapshot.val() || {};
        if (!friendsPopup.classList.contains('hidden') && tabMyFriends.classList.contains('active')) {
            displayMyFriends(currentMyFriends);
        }
        displayMyFriendsMainSection(currentMyFriends);
    });

    onValue(ref(db, `users/${uid}/receivedRequests`), (snapshot) => {
        currentReceivedRequests = snapshot.val() || {};
        if (!friendsPopup.classList.contains('hidden') && tabFriendRequests.classList.contains('active')) {
            displayFriendRequests(currentReceivedRequests, 'received');
        }
    });

    onValue(ref(db, `users/${uid}/sentRequests`), (snapshot) => {
        currentSentRequests = snapshot.val() || {};
        if (!friendsPopup.classList.contains('hidden') && tabFriendRequests.classList.contains('active')) {
            displayFriendRequests(currentSentRequests, 'sent');
        }
    });
}

// NEW: Listener for player's currency and powerups
function listenForPlayerCurrencyAndPowerups(uid) {
    if (!uid) return;
    onValue(ref(db, `users/${uid}`), (snapshot => {
        const userData = snapshot.val() || {};
        window.playerCoins = userData.coins || 0;
        window.playerGems = userData.gems || 0;
        window.playerPowerups = userData.powerups || {
            shield: 0, sniper: 0, timeFreeze: 0, doubleStrike: 0
        };

        updateCurrencyDisplay();
        updatePowerupsDisplay();
        updatePowerupButtonStates();
    }));
}

function updateCurrencyDisplay() {
    if (coinsCountEl) coinsCountEl.textContent = window.playerCoins;
    if (gemsCountEl) gemsCountEl.textContent = window.playerGems;
}

function updatePowerupsDisplay() {
    const powerups = window.playerPowerups || {};

    const powerupElements = {
        shield: { countEl: shieldCountEl, inventoryId: 'shieldCount' },
        sniper: { countEl: sniperCountEl, inventoryId: 'sniperCount' },
        timeFreeze: { countEl: timeFreezeCountEl, inventoryId: 'timeFreezeCount' },
        doubleStrike: { countEl: doubleStrikeCountEl, inventoryId: 'doubleStrikeCount' }
    };

    for (const [key, { countEl, inventoryId }] of Object.entries(powerupElements)) {
        const count = powerups[key] || 0;
        const inventoryEl = document.getElementById(inventoryId);
        
        if (inventoryEl) {
            if (count > 0) {
                inventoryEl.textContent = `x${count}`;
                inventoryEl.classList.remove('hidden');
            } else {
                inventoryEl.classList.add('hidden');
            }
        }
    }
}

async function purchasePowerup(powerupName, cost) {
    if (!window.playerUid) {
        alert("Please log in to purchase power-ups.");
        return;
    }

    if (window.playerCoins < cost) {
        alert("Not enough coins to purchase this power-up!");
        return;
    }

    showCandyLoader();
    try {
        const userRef = ref(db, `users/${window.playerUid}`);
        
        await update(userRef, {
            coins: window.playerCoins - cost,
            [`powerups/${powerupName}`]: (window.playerPowerups[powerupName] || 0) + 1
        });

        alert(`Successfully purchased a ${powerupName} power-up for ${cost} coins!`);

    } catch (error) {
        console.error("Error purchasing powerup:", error.message, error.code);
        alert("Failed to purchase power-up. Please try again.");
    } finally {
        hideCandyLoader();
    }
}

async function displayMyFriends(friendsData = {}) {
    myFriendsListPopup.innerHTML = '';
    const friendUids = Object.keys(friendsData);

    if (friendUids.length === 0) {
        noFriendsMessagePopup.classList.remove('hidden');
        noFriendsMessagePopup.textContent = "No friends yet. Search for new friends!";
        return;
    }
    noFriendsMessagePopup.classList.add('hidden');

    for (const friendUid of friendUids) {
        try {
            const friendSnapshot = await get(ref(db, `users/${friendUid}`));
            const friend = friendSnapshot.val();
            
            if (friend && friend.name && friend.email) {
                const listItem = document.createElement('div');
                listItem.className = 'list-item';
                listItem.innerHTML = `
                    <img src="${friend.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}" alt="${friend.name}" onerror="this.onerror=null; this.src='https://cdn-icons-png.flaticon.com/512/149/149071.png';" />
                    <div class="list-item-info">
                        <span>${friend.name}</span>
                        <small>${friend.email}</small>
                    </div>
                    <div class="list-item-actions">
                        <button onclick="window.removeFriend('${friendUid}')" class="btn-reject btn-remove">Remove</button>
                    </div>
                `;
                myFriendsListPopup.appendChild(listItem);
            }
        } catch (error) {
            console.error(`Error fetching friend details for UID ${friendUid}:`, error.message, error.code, error);
        }
    }
}

async function displayMyFriendsMainSection(friendsData = {}) {
    myFriendsListMainSection.innerHTML = '';
    const friendUids = Object.keys(friendsData);

    if (friendUids.length === 0) {
        noFriendsMessageMainSection.classList.remove('hidden');
        noFriendsMessageMainSection.textContent = "No friends yet. Add friends from the Friends icon in top right!";
        return;
    }
    noFriendsMessageMainSection.classList.add('hidden');

    for (const friendUid of friendUids) {
        try {
            const friendSnapshot = await get(ref(db, `users/${friendUid}`));
            const friend = friendSnapshot.val();
            
            if (friend && friend.name && friend.email) {
                const listItem = document.createElement('div');
                listItem.className = 'list-item';
                listItem.innerHTML = `
                    <img src="${friend.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}" alt="${friend.name}" onerror="this.onerror=null; this.src='https://cdn-icons-png.flaticon.com/512/149/149071.png';" />
                    <div class="list-item-info">
                        <span>${friend.name}</span>
                        <small>${friend.email}</small>
                    </div>
                    <div class="list-item-actions">
                        <button onclick="window.sendGameInvite('${friendUid}', '${friend.name}')" class="btn-blue btn-add">Invite</button>
                    </div>
                `;
                myFriendsListMainSection.appendChild(listItem);
            }
        } catch (error) {
            console.error(`Error fetching friend details for UID ${friendUid}:`, error.message, error.code, error);
        }
    }
}

async function displayFriendRequests(requestsData = {}, type = 'received') {
    const listElement = type === 'received' ? receivedRequestsList : sentRequestsList;
    const noRequestsMessageElement = type === 'received' ? noReceivedRequestsMessage : noSentRequestsMessage;

    listElement.innerHTML = '';
    const requestTargetUids = Object.keys(requestsData);

    if (requestTargetUids.length === 0) {
        noRequestsMessageElement.classList.remove('hidden');
        noRequestsMessageElement.textContent = type === 'received' ? "No new friend requests." : "No sent requests.";
        return;
    }
    noRequestsMessageElement.classList.add('hidden');

    for (const targetUid of requestTargetUids) {
        try {
            const userSnapshot = await get(ref(db, `users/${targetUid}`));
            const user = userSnapshot.val();
            
            if (user && user.name && user.email) {
                const listItem = document.createElement('div');
                listItem.className = 'list-item';
                
                let actionsHtml = '';
                if (type === 'received') {
                    actionsHtml = `
                        <button onclick="window.acceptFriendRequest('${targetUid}', '${user.name}')" class="btn-accept">Accept</button>
                        <button onclick="window.rejectFriendRequest('${targetUid}')" class="btn-reject">Reject</button>
                    `;
                } else {
                    actionsHtml = `<span class="list-item-status">Pending</span>`;
                }

                listItem.innerHTML = `
                    <img src="${user.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}" alt="${user.name}" onerror="this.onerror=null; this.src='https://cdn-icons-png.flaticon.com/512/149/149071.png';" />
                    <div class="list-item-info">
                        <span>${user.name}</span>
                        <small>${user.email}</small>
                    </div>
                    <div class="list-item-actions">
                        ${actionsHtml}
                    </div>
                `;
                listElement.appendChild(listItem);
            }
        } catch (error) {
            console.error(`Error fetching ${type} request user details:`, error.message, error.code, error);
        }
    }
}

async function searchUsers() {
    const searchTerm = searchFriendInput.value.trim();
    searchResultsList.innerHTML = '';
    noSearchResultsMessage.classList.add('hidden');
    showCandyLoader();

    if (!searchTerm) {
        hideCandyLoader();
        noSearchResultsMessage.textContent = "Please enter a username or email to search.";
        noSearchResultsMessage.classList.remove('hidden');
        return;
    }

    try {
        const usersRef = ref(db, 'users');
        let foundUsers = [];

        const nameQuery = query(
            usersRef,
            orderByChild('name'),
            startAt(searchTerm),
            endAt(searchTerm + '\uf8ff')
        );
        const nameSnapshot = await get(nameQuery);
        nameSnapshot.forEach(childSnapshot => {
            const uid = childSnapshot.key;
            const user = childSnapshot.val();
            foundUsers.push({ uid, ...user });
        });

        const emailQuery = query(
            usersRef,
            orderByChild('email'),
            startAt(searchTerm),
            endAt(searchTerm + '\uf8ff')
        );
        const emailSnapshot = await get(emailQuery);
        emailSnapshot.forEach(childSnapshot => {
            const uid = childSnapshot.key;
            const user = childSnapshot.val();
            if (!foundUsers.some(fUser => fUser.uid === uid)) {
                foundUsers.push({ uid, ...user });
            }
        });

        let finalFoundUsers = [];
        for (const user of foundUsers) {
            if (user.uid === window.playerUid) { continue; }
            const isFriend = await get(ref(db, `users/${window.playerUid}/friends/${user.uid}`)).then(s => s.exists());
            if (isFriend) { continue; }
            const isRequestSent = await get(ref(db, `users/${window.playerUid}/sentRequests/${user.uid}`)).then(s => s.exists());
            if (isRequestSent) { continue; }
            const isRequestReceived = await get(ref(db, `users/${window.playerUid}/receivedRequests/${user.uid}`)).then(s => s.exists());
            if (isRequestReceived) { continue; }
            finalFoundUsers.push(user);
        }

        if (finalFoundUsers.length === 0) {
            noSearchResultsMessage.textContent = "No players found matching your search.";
            noSearchResultsMessage.classList.remove('hidden');
        } else {
            finalFoundUsers.forEach(user => {
                const listItem = document.createElement('div');
                listItem.className = 'list-item';
                listItem.innerHTML = `
                    <img src="${user.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}" alt="${user.name}" onerror="this.onerror=null; this.src='https://cdn-icons-png.flaticon.com/512/149/149071.png';" />
                    <div class="list-item-info">
                        <span>${user.name}</span>
                        <small>${user.email}</small>
                    </div>
                    <div class="list-item-actions">
                        <button onclick="window.sendFriendRequest('${user.uid}', '${user.name}')" class="btn-blue btn-add">Add Friend</button>
                    </div>
                `;
                searchResultsList.appendChild(listItem);
            });
        }
    } catch (error) {
        console.error("Error searching users:", error.message, error.code, error);
        noSearchResultsMessage.textContent = `Error searching for players: ${error.message}. Please try again.`;
        noSearchResultsMessage.classList.remove('hidden');
    } finally {
        hideCandyLoader();
    }
}

async function sendFriendRequest(receiverUid, receiverName) {
    showCandyLoader();
    if (!window.playerUid) {
        hideCandyLoader();
        alert("You must be logged in to send friend requests.");
        return;
    }
    if (window.playerUid === receiverUid) {
        hideCandyLoader();
        alert("You cannot send a friend request to yourself.");
        return;
    }
    try {
        const sentSnapshot = await get(ref(db, `users/${window.playerUid}/sentRequests/${receiverUid}`));
        if (sentSnapshot.exists()) {
            hideCandyLoader();
            alert(`Friend request already sent to ${receiverName}.`);
            return;
        }
        const receivedSnapshot = await get(ref(db, `users/${window.playerUid}/receivedRequests/${receiverUid}`));
        if (receivedSnapshot.exists()) {
            hideCandyLoader();
            alert(`${receiverName} has already sent you a friend request. Please check your requests tab.`);
            return;
        }

        const newRequestRef = push(ref(db, 'friendRequests'));
        const requestId = newRequestRef.key;

        const requestData = {
            senderId: window.playerUid,
            receiverId: receiverUid,
            status: 'pending',
            timestamp: Date.now()
        };

        await set(newRequestRef, requestData);
        await set(ref(db, `users/${window.playerUid}/sentRequests/${receiverUid}`), {
            requestId: requestId,
            receiverId: receiverUid,
            timestamp: Date.now()
        });
        await set(ref(db, `users/${receiverUid}/receivedRequests/${window.playerUid}`), {
            requestId: requestId,
            senderId: window.playerUid,
            timestamp: Date.now()
        });

        alert(`Friend request sent to ${receiverName}!`);
        searchUsers();
    } catch (error) {
        console.error("Error sending friend request:", error.message, error.code, error);
        alert("Failed to send friend request. Please try again.");
    } finally {
        hideCandyLoader();
    }
}

async function acceptFriendRequest(senderUid, senderName) {
    showCandyLoader();
    if (!window.playerUid) {
        hideCandyLoader();
        alert("You must be logged in to accept friend requests.");
        return;
    }

    try {
        const requestSnapshot = await get(ref(db, `users/${window.playerUid}/receivedRequests/${senderUid}`));
        const requestData = requestSnapshot.val();
        if (!requestData || !requestData.requestId) {
            hideCandyLoader();
            alert("Request not found or already processed.");
            return;
        }
        const requestId = requestData.requestId;

        await set(ref(db, `users/${window.playerUid}/friends/${senderUid}`), true);
        await set(ref(db, `users/${senderUid}/friends/${window.playerUid}`), true);
        await update(ref(db, `friendRequests/${requestId}`), { status: 'accepted' });
        await remove(ref(db, `users/${window.playerUid}/receivedRequests/${senderUid}`));
        await remove(ref(db, `users/${senderUid}/sentRequests/${window.playerUid}`));

        alert(`You are now friends with ${senderName}!`);
    } catch (error) {
        console.error("Error accepting friend request:", error.message, error.code, error);
        alert("Failed to accept friend request. Please try again.");
    } finally {
        hideCandyLoader();
    }
}

async function rejectFriendRequest(senderUid) {
    showCandyLoader();
    if (!window.playerUid) {
        hideCandyLoader();
        alert("You must be logged in to reject friend requests.");
        return;
    }

    try {
        const requestSnapshot = await get(ref(db, `users/${window.playerUid}/receivedRequests/${senderUid}`));
        const requestData = requestSnapshot.val();
        if (!requestData || !requestData.requestId) {
            hideCandyLoader();
            alert("Request not found or already processed.");
            return;
        }
        const requestId = requestData.requestId;

        await update(ref(db, `friendRequests/${requestId}`), { status: 'rejected' });
        await remove(ref(db, `users/${window.playerUid}/receivedRequests/${senderUid}`));
        await remove(ref(db, `users/${senderUid}/sentRequests/${window.playerUid}`));

        alert("Friend request rejected.");
    } catch (error) {
        console.error("Error rejecting friend request:", error.message, error.code, error);
        alert("Failed to reject friend request. Please try again.");
    } finally {
        hideCandyLoader();
    }
}

async function declineGameInvite(gameRoomId, inviterUid) {
    showCandyLoader();
    if (!window.playerUid) {
        hideCandyLoader();
        alert("You must be logged in to decline game invites.");
        return;
    }

    try {
        await remove(ref(db, `gameInvites/${window.playerUid}/${gameRoomId}`));
        const resultMessage = `${window.playerName} declined the game invite. DeclinerUID:${window.playerUid}`;
        await update(ref(db, gameRoomId), {
            result: resultMessage,
            turn: "end"
        });

        alert("Game invite declined.");
        hideGameInviteNotification();
        exitGameConfirmed();
    } catch (error) {
        console.error("Error declining game invite:", error.message, error.code, error);
        alert("Failed to decline game invite. Please try again.");
    } finally {
        hideCandyLoader();
    }
}

async function removeFriend(friendUid) {
    showCandyLoader();
    if (!window.playerUid) {
        hideCandyLoader();
        alert("You must be logged in to remove friends.");
        return;
    }

    confirmMessage.textContent = "Are you sure you want to remove this friend?";
    customConfirm.classList.remove('hidden');

    confirmOk.onclick = async () => {
        customConfirm.classList.add('hidden');
        try {
            await remove(ref(db, `users/${window.playerUid}/friends/${friendUid}`));
            await remove(ref(db, `users/${friendUid}/friends/${window.playerUid}`));
            alert("Friend removed successfully.");
        } catch (error) {
            console.error("Error removing friend:", error.message, error.code, error);
            alert("Failed to remove friend. Please try again.");
        } finally {
            hideCandyLoader();
        }
    };

    confirmCancel.onclick = () => {
        customConfirm.classList.add('hidden');
        hideCandyLoader();
    };
}

function navigateToSection(sectionId) {
    lobbySection.classList.add('hidden');
    playWithFriendsSection.classList.add('hidden');
    powerUpsSection.classList.add('hidden');
    leaderboardSection.classList.add('hidden');
    achievementsSection.classList.add('hidden');

    navLobby.classList.remove('active');
    navPlayWithFriends.classList.remove('active');
    navPowerUps.classList.remove('active');
    navLeaderboard.classList.remove('active');
    navAchievements.classList.remove('active');

    switch (sectionId) {
        case 'lobby':
            lobbySection.classList.remove('hidden');
            navLobby.classList.add('active');
            break;
        case 'playWithFriends':
            playWithFriendsSection.classList.remove('hidden');
            navPlayWithFriends.classList.add('active');
            get(ref(db, `users/${window.playerUid}/friends`)).then(snapshot => {
                const friendsData = snapshot.val() || {};
                displayMyFriendsMainSection(friendsData);
            }).catch(error => {
                console.error("Error fetching friends for main Play with Friends section:", error);
                displayMyFriendsMainSection({});
            });
            break;
        case 'powerUps':
            powerUpsSection.classList.remove('hidden');
            navPowerUps.classList.add('active');
            break;
        case 'leaderboard':
            leaderboardSection.classList.remove('hidden');
            navLeaderboard.classList.add('active');
            break;
        case 'achievements':
            achievementsSection.classList.remove('hidden');
            navAchievements.classList.add('active');
            break;
        default:
            lobbySection.classList.remove('hidden');
            navLobby.classList.add('active');
    }
}

async function sendGameInvite(receiverUid, receiverName) {
    showCandyLoader();
    if (!window.playerUid) {
        hideCandyLoader();
        alert("You must be logged in to send game invites.");
        return;
    }
    if (window.playerUid === receiverUid) {
        hideCandyLoader();
        alert("You cannot invite yourself to play.");
        return;
    }

    try {
        const newRoomCode = generateRoomCode();
        const roomRef = ref(db, newRoomCode);
        
        const roomSnapshot = await get(roomRef);
        if (roomSnapshot.exists()) {
            hideCandyLoader();
            alert("Failed to create game room. Please try again.");
            sendGameInvite(receiverUid, receiverName);
            return;
        }

        await set(roomRef, {
            poison: { "1": -1, "2": -1 },
            turn: "1",
            selections: {},
            players: { "1": window.playerName },
            avatars: { "1": window.playerAvatar },
            result: "",
            rematch: {},
            status: "waitingForInviteAcceptance"
        });

        const inviteRef = ref(db, `gameInvites/${receiverUid}/${newRoomCode}`);
        await set(inviteRef, {
            senderUid: window.playerUid,
            senderName: window.playerName,
            senderAvatar: window.playerAvatar,
            timestamp: Date.now()
        });

        player = "1";
        room = newRoomCode;
        isAIMode = false;

        opponentName.textContent = receiverName;
        yourName.textContent = window.playerName;
        yourAvatar.src = window.playerAvatar;

        mainContentArea.classList.add("hidden");
        navBar.classList.add("hidden");

        gameArea.classList.remove("hidden");
        playerVsPlayerSection.classList.remove("hidden");
        info.classList.remove("hidden");
        info.innerText = `Invite sent to ${receiverName}! Waiting for them to accept...`;
        
        waitForSecondPlayer();

        alert(`Game invite sent to ${receiverName}!`);
        closeFriendsPopup();
    } catch (error) {
        console.error("Error sending game invite:", error.message, error.code, error);
        alert("Failed to send game invite. Please try again.");
    } finally {
        hideCandyLoader();
    }
}

async function listenForGameInvites(uid) {
    if (!uid) return;
    onValue(ref(db, `gameInvites/${uid}`), async (snapshot) => {
        const invites = snapshot.val();
        if (invites) {
            const inviteKeys = Object.keys(invites);
            if (inviteKeys.length > 0) {
                const latestInviteKey = inviteKeys[inviteKeys.length - 1];
                const inviteData = invites[latestInviteKey];
                
                window.showGameInviteNotification(
                    inviteData.senderName,
                    inviteData.senderAvatar,
                    latestInviteKey,
                    inviteData.senderUid
                );
            } else {
                window.hideGameInviteNotification();
            }
        } else {
            window.hideGameInviteNotification();
        }
    });
}

async function acceptGameInvite(gameRoomId, inviterUid) {
    showCandyLoader();
    if (!window.playerUid) {
        hideCandyLoader();
        alert("You must be logged in to accept game invites.");
        return;
    }

    try {
        player = "2";
        room = gameRoomId;
        isAIMode = false;
        
        isSniperActive = false;
        isDoubleStrikeActive = false;
        doubleStrikeCount = 0;
        isShieldActive = false;

        await set(ref(db, `${room}/players/2`), window.playerName);
        await set(ref(db, `${room}/avatars/2`), window.playerAvatar);
        await update(ref(db, room), { status: "active" });
        await remove(ref(db, `gameInvites/${window.playerUid}/${gameRoomId}`));

        startGame();
        alert("Game invite accepted! Starting game...");
        hideGameInviteNotification();
    } catch (error) {
        console.error("Error accepting game invite:", error.message, error.code, error);
        alert("Failed to accept game invite. Please try again.");
    } finally {
        hideCandyLoader();
    }
}

function openBuyCurrencyPopup(currencyType) {
    const popup = document.getElementById('buyCurrencyPopup');
    document.getElementById('currencyType').textContent = currencyType.charAt(0).toUpperCase() + currencyType.slice(1);
    popup.classList.remove('hidden');
}

function closeBuyCurrencyPopup() {
    document.getElementById('buyCurrencyPopup').classList.add('hidden');
}

function showGeneralSettingsSection() {
    if (generalSettingsContent) {
        generalSettingsContent.classList.remove('hidden');
    }
    if (displaySettingsContent) {
        displaySettingsContent.classList.add('hidden');
    }
}

function showDisplaySettingsSection() {
    if (generalSettingsContent) {
        generalSettingsContent.classList.add('hidden');
    }
    if (displaySettingsContent) {
        displaySettingsContent.classList.remove('hidden');
    }
    updateButtonGroupActiveState(
        ['fontSizeSmallBtn', 'fontSizeMediumBtn', 'fontSizeLargeBtn'],
        `fontSize${currentFontSize.charAt(0).toUpperCase() + currentFontSize.slice(1)}Btn`
    );
    updateButtonGroupActiveState(
        ['candySizeSmallBtn', 'candySizeMediumBtn', 'candySizeLargeBtn'],
        `candySize${currentCandySize.charAt(0).toUpperCase() + currentCandySize.slice(1)}Btn`
    );
    updateButtonGroupActiveState(
        ['themeLightBtn', 'themeDarkBtn', 'themeCandylandBtn', 'themeHalloweenBtn'],
        `theme${currentGameTheme.charAt(0).toUpperCase() + currentGameTheme.slice(1)}Btn`
    );
}

function closeRematchPopup() {
    if (rematchPopup) rematchPopup.classList.add('hidden');
    if (gameArea) gameArea.classList.add('hidden');
    if (playerVsPlayerSection) playerVsPlayerSection.classList.add('hidden');
    if (info) info.classList.add('hidden');
    if (inGamePowerupsContainer) inGamePowerupsContainer.classList.add('hidden');

    if (mainContentArea) mainContentArea.classList.remove('hidden');
    if (navBar) navBar.classList.remove('hidden');
    
    navigateToSection('lobby');
    
    player = "";
    room = "";
    myTurn = false;
    poisoned = {};
    isAIMode = false;
    isSniperActive = false;
    isDoubleStrikeActive = false;
    doubleStrikeCount = 0;
    isShieldActive = false;
    
    playBackgroundMusic();
}

function playClassicMode() {
    alert("Classic Mode selected! (Functionality to be added)");
}

window.register = register;
window.login = login;
window.logout = logout;
window.createTeam = createTeam;
window.joinTeam = joinTeam;
window.requestRematch = requestRematch;
window.updateProfile = updateProfile;
window.closeEditProfilePopup = closeEditProfilePopup;
window.showExitConfirmation = showExitConfirmation;
window.openGameSettingsPopup = openGameSettingsPopup;
window.closeGameSettingsPopup = closeGameSettingsPopup;
window.toggleSound = toggleSound;
window.toggleMusic = toggleMusic;
window.signInWithGoogle = signInWithGoogle;
window.sendPasswordResetEmail = sendPasswordResetEmailFn; 
window.closeForgotPasswordPopup = closeForgotPasswordPopup;
window.openFriendsPopup = openFriendsPopup;
window.closeFriendsPopup = closeFriendsPopup;
window.showFriendsTab = showFriendsTab;
window.searchUsers = searchUsers;
window.sendFriendRequest = sendFriendRequest;
window.acceptFriendRequest = acceptFriendRequest;
window.rejectFriendRequest = rejectFriendRequest;
window.declineGameInvite = declineGameInvite;
window.removeFriend = removeFriend;
window.navigateToSection = navigateToSection;
window.sendGameInvite = sendGameInvite;
window.acceptGameInvite = acceptGameInvite;
window.setFontSize = setFontSize;
window.setCandySize = setCandySize;
window.setGameTheme = setGameTheme;
window.handleGameEndContinue = handleGameEndContinue;
window.openAiDifficultyPopup = openAiDifficultyPopup;
window.closeAiDifficultyPopup = closeAiDifficultyPopup;
window.startAIGame = startAIGame;
window.openBuyCurrencyPopup = openBuyCurrencyPopup;
window.closeBuyCurrencyPopup = closeBuyCurrencyPopup;
window.showGeneralSettingsSection = showGeneralSettingsSection;
window.showDisplaySettingsSection = showDisplaySettingsSection;
window.closeRematchPopup = closeRematchPopup;
window.playClassicMode = playClassicMode;
window.purchasePowerup = purchasePowerup;
window.usePowerup = usePowerup;
window.updatePowerupButtonStates = updatePowerupButtonStates;

