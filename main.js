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

// Modular Database Functions
const ref = window.ref;
const set = window.set;
const onValue = window.onValue;
const update = window.update;
const remove = window.remove;
const get = window.get; 

// DOM Elements (Ye variables abhi declare honge, value DOMContentLoaded mein set hogi)
let authDiv, gameModeSelection, teamBattlePopup, info, grid, teamInput, userInfo,
    loggedInMessageDisplay, showLoginBtn, showRegisterBtn, loginForm, registerForm,
    loginName, loginPass, regName, regEmail, regAvatar, avatarPreview, regPass,
    regConfirmPass, rematchPopup, yourName, opponentName, yourAvatar, opponentAvatar,
    playerVsPlayerSection, gameArea, editProfilePopup, editNameInput, editEmailInput,
    editAvatarInput, editAvatarPreview, winLoseNotification, mainHeader, candyLoader,
    customConfirm, confirmMessage, confirmOk, confirmCancel, gameSettingsPopup,
    soundToggleBtn, musicToggleBtn, forgotPasswordPopup, forgotEmailInput;

// Game Variables
let player = "";
let room = "";
let myTurn = false;
window.playerName = "";
window.playerAvatar = "";
window.playerEmail = "";
let poisoned = {};
let isAIMode = false;
let soundOn = true; // Default sound state
let musicOn = true; // Default music state

// Audio elements for Plan A and Plan D
let buttonClickAudio; 
let backgroundMusicAudio; // Background music ke liye naya variable

// DOMContentLoaded event listener: Yeh code tab chalega jab poora HTML document load ho jayega
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements ko yahan initialize karein, jab DOM ready ho
    authDiv = document.getElementById("auth");
    gameModeSelection = document.getElementById("gameModeSelection");
    teamBattlePopup = document.getElementById("teamBattlePopup");
    info = document.getElementById("info");
    grid = document.getElementById("grid");
    teamInput = document.getElementById("teamCodeInput");
    userInfo = document.getElementById("userInfo");
    loggedInMessageDisplay = document.getElementById("loggedInMessageDisplay");
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
    mainHeader = document.querySelector('.w-full.max-w-3xl.flex.justify-between.items-center.mb-4.px-4');
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
            try {
                const snapshot = await get(ref(db, `users/${user.uid}`)); // Use modular get and ref
                const userData = snapshot.val();
                if (userData) {
                    window.playerName = userData.name || user.displayName || user.email;
                    window.playerAvatar = userData.avatar || user.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                    window.playerEmail = user.email;
                    authDiv.classList.add("hidden");
                    userInfo.classList.remove("hidden");
                    loggedInMessageDisplay.innerHTML = `Logged in as: <span class="text-red-500">${window.playerName}</span>`;
                    gameModeSelection.classList.remove("hidden");
                    // Load user settings (sound/music)
                    loadUserSettings(user.uid);
                } else {
                    // New user or user signed in via Google for the first time
                    window.playerName = user.displayName || user.email;
                    window.playerAvatar = user.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                    window.playerEmail = user.email;
                    authDiv.classList.add("hidden");
                    userInfo.classList.remove("hidden");
                    loggedInMessageDisplay.innerHTML = `Logged in as: <span class="text-red-500">${window.playerName}</span>`;
                    gameModeSelection.classList.remove("hidden");
                    await set(ref(db, `users/${user.uid}`), { // Use modular set and ref
                        name: window.playerName,
                        email: window.playerEmail,
                        avatar: window.playerAvatar,
                        settings: {
                            sound: true,
                            music: true
                        }
                    });
                    loadUserSettings(user.uid); // Load default settings
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
                alert("Failed to load user profile. Please try logging in again.");
                await signOut(auth); // Use modular signOut
            } finally {
                hideCandyLoader();
            }
        } else {
            authDiv.classList.remove("hidden");
            userInfo.classList.add("hidden");
            gameModeSelection.classList.add("hidden");
            loginForm.classList.remove("hidden");
            registerForm.classList.add("hidden");
            showLoginBtn?.classList.add("bg-gray-200", "shadow-md");
            showRegisterBtn?.classList.remove("bg-gray-200", "shadow-md");
            showRegisterBtn?.classList.add("bg-gray-100", "shadow-sm");
            window.playerName = "";
            window.playerAvatar = "";
            window.playerEmail = "";
            gameArea.classList.add("hidden");
            playerVsPlayerSection?.classList?.add("hidden");
            // Ensure header is visible when logged out and showing auth screen
            mainHeader.classList.remove("hidden");
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
        'a[onclick="showForgotPasswordPopup()"], ' + // Forgot password link
        '#teamBattlePopup button, ' + // All buttons inside team battle popup (create, join, close)
        '#editProfilePopup button, ' + // All buttons inside edit profile popup (save, close)
        '#gameArea button, ' + // Exit Game button
        '#winLoseNotification button, ' + // OK button on win/lose notification
        '#rematchPopup button, ' + // Rematch popup buttons (yes, no)
        '#customConfirm button, ' + // Custom confirm dialog buttons (OK, Cancel)
        '#gameSettingsPopup button, ' + // Settings popup buttons (toggles, close)
        '#forgotPasswordPopup button, ' + // Forgot password popup buttons (send, close)
        '.game-mode-card' // All game mode cards
    );

    clickableElements.forEach(element => {
        // Add a click event listener to each selected element
        element.addEventListener('click', playClickSound);
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

        if (avatarFile) {
            // Process and get Base64 Data URL
            finalAvatarDataUrl = await uploadAndResizeAvatar(avatarFile);
        }

        await set(ref(db, `users/${user.uid}`), {
            name: name,
            email: email,
            avatar: finalAvatarDataUrl, // Save the Base64 Data URL
            settings: {
                sound: true,
                music: true
            }
        });
        alert("Registration successful! You are now logged in.");
    } catch (error) {
        console.error("Registration error:", error.message);
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

function login() {
    showCandyLoader();
    const email = loginName.value.trim();
    const pass = loginPass.value.trim();
    if (!email || !pass) {
        hideCandyLoader();
        return alert("Enter email and password");
    }

    signInWithEmailAndPassword(auth, email, pass)
        .then((userCredential) => {
            console.log("Logged in successfully!", userCredential.user.email);
        })
        .catch((error) => {
            console.error("Login error:", error.message);
            let errorMessage = "Login failed. Invalid email or password.";
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                errorMessage = "Invalid email or password.";
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = "Invalid email format.";
            }
            alert(errorMessage);
        })
        .finally(() => {
            hideCandyLoader();
        });
}

// New: Sign in with Google
async function signInWithGoogle() {
    showCandyLoader();
    const provider = new GoogleAuthProvider(); 
    try {
        const result = await signInWithPopup(auth, provider); 
        const user = result.user;
        console.log("Signed in with Google:", user.displayName);

        // Check if user exists in Realtime Database, if not, create their profile
        const userRef = ref(db, `users/${user.uid}`); 
        const snapshot = await get(userRef); 
        if (!snapshot.exists()) {
            // New Google user: set default avatar or use Google's photoURL
            // Google's photoURL is usually already a small, optimized URL, so no need to resize/compress it.
            const avatarUrl = user.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png";
            await set(userRef, {
                name: user.displayName || user.email,
                email: user.email,
                avatar: avatarUrl, 
                settings: {
                    sound: true,
                    music: true
                }
            });
            alert("Welcome! Your account has been created and you are logged in.");
        } else {
            // Existing Google user: update avatar if Google provides a new one and it's different
            const userData = snapshot.val();
            if (user.photoURL && userData.avatar !== user.photoURL) {
                await update(userRef, { avatar: user.photoURL });
            }
            alert("Logged in successfully with Google!");
        }
    } catch (error) {
        console.error("Google Sign-In error:", error.message);
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
        console.error("Forgot password error:", error.message);
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
        console.log("Logged out successfully.");
        // Stop background music when logging out
        pauseBackgroundMusic();
    }).catch((error) => {
        console.error("Logout error:", error.message);
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
            // Process and get Base64 Data URL
            updatedAvatarDataUrl = await uploadAndResizeAvatar(newAvatarFile);
        }

        if (newEmail && newEmail !== user.email) {
            await user.updateEmail(newEmail); 
            console.log("Email updated in Firebase Auth.");
        }

        await update(ref(db, `users/${user.uid}`), {
            name: newName,
            email: newEmail || user.email, 
            avatar: updatedAvatarDataUrl // Save the Base64 Data URL
        });

        window.playerName = newName;
        window.playerEmail = newEmail || user.email;
        window.playerAvatar = updatedAvatarDataUrl;
        loggedInMessageDisplay.innerHTML = `Logged in as: <span class="text-red-500">${window.playerName}</span>`;
        alert("Profile updated successfully!");
        closeEditProfilePopup();
    } catch (error) {
        console.error("Error updating profile:", error);
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

// New: Game Settings Functions
async function loadUserSettings(uid) {
    get(ref(db, `users/${uid}/settings`)) 
        .then(snapshot => {
            const settings = snapshot.val();
            if (settings) {
                soundOn = settings.sound !== undefined ? settings.sound : true;
                musicOn = settings.music !== undefined ? settings.music : true;
            } else {
                // If no settings, set defaults and save
                soundOn = true;
                musicOn = true;
                set(ref(db, `users/${uid}/settings`), { sound: true, music: true }); 
            }
            updateToggleButtonUI(soundToggleBtn, soundOn, 'Sound');
            updateToggleButtonUI(musicToggleBtn, musicOn, 'Music');
            // Play music after settings are loaded and user is authenticated
            playBackgroundMusic();
        })
        .catch(error => {
            console.error("Error loading user settings:", error);
            // Fallback to default if load fails
            soundOn = true;
            musicOn = true;
            updateToggleButtonUI(soundToggleBtn, soundOn, 'Sound');
            updateToggleButtonUI(musicToggleBtn, musicOn, 'Music');
            playBackgroundMusic(); // Try to play music even if settings load failed
        });
}

function updateToggleButtonUI(button, state, label) {
    button.classList.toggle('on', state);
    button.classList.toggle('off', !state);
    button.innerHTML = `<span class="text-xl">${label === 'Sound' ? '🔊' : '🎵'}</span> ${label}: ${state ? 'On' : 'Off'}`;
}

async function saveUserSetting(settingName, value) {
    const user = auth.currentUser;
    if (user) {
        try {
            await set(ref(db, `users/${user.uid}/settings/${settingName}`), value); 
            console.log(`Setting ${settingName} updated to ${value}`);
        } catch (error) {
            console.error(`Error saving ${settingName} setting:`, error);
            alert(`Failed to save ${settingName} setting.`);
        }
    }
}

function toggleSound() {
    soundOn = !soundOn;
    updateToggleButtonUI(soundToggleBtn, soundOn, 'Sound');
    saveUserSetting('sound', soundOn);
    // Here you would integrate actual sound control (e.g., mute/unmute game sounds)
    // For now, it's just a UI toggle and Firebase update.
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
                    console.log(`Room ${room} already exists, generating new code...`);
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
                        teamBattlePopup.classList.add("hidden");
                        info.innerText = `Team created! Share this code: ${room}`;
                        info.classList.remove("hidden"); 
                        // Hide header when starting team battle
                        mainHeader.classList.add("hidden");
                        // Background music will continue playing
                        waitForSecondPlayer();
                    })
                    .catch(error => {
                        console.error("Error setting room data:", error);
                        alert("Failed to create team. Please try again.");
                    })
                    .finally(() => {
                        hideCandyLoader(); 
                    });
                }
            })
            .catch(error => {
                console.error("Error checking room existence:", error);
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
                return alert("Invalid team code");
            }
            get(ref(db, `${room}/players/2`)) 
                .then(snap2 => {
                    if (snap2.exists()) {
                        hideCandyLoader(); 
                        return alert("This team is already full. Please try another code.");
                    }
                    if (snap.val() === window.playerName) {
                        hideCandyLoader(); 
                        return alert("You cannot join your own team as a second player.");
                    }
                    player = "2";
                    set(ref(db, `${room}/players/2`), window.playerName); 
                    set(ref(db, `${room}/avatars/2`), window.playerAvatar); 
                    teamBattlePopup.classList.add("hidden");
                    // Hide header when joining team battle
                    mainHeader.classList.add("hidden");
                    // Background music will continue playing
                    startGame();
                    hideCandyLoader(); 
                });
        }).catch(error => {
            console.error("Error joining team:", error);
            alert("Failed to join team. Please try again.");
            hideCandyLoader(); 
        });
}

function playWithAI() {
  showCandyLoader(); 
  player = "1";
  room = "AI_MODE_" + Math.random().toString(36).substring(2, 7);
  myTurn = true;
  isAIMode = true;
  poisoned = { "1": -1, "2": -1 };

  // Set AI opponent info
  opponentName.textContent = "AI Opponent";
  opponentAvatar.src = "https://cdn-icons-png.flaticon.com/512/4712/4712035.png"; // Distinct AI avatar
  yourName.textContent = window.playerName || "You"; 
  yourAvatar.src = window.playerAvatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"; 

  playerVsPlayerSection?.classList?.remove("hidden"); 
  // Hide header when starting AI game
  mainHeader.classList.add("hidden");
  // Background music will continue playing

  startGame();
  info.innerText = "Your turn! First set your poison candy.";
  info.classList.remove("hidden"); 
  hideCandyLoader(); 
}

function AITurn() {
  // If it's my turn (player's turn) or not in AI mode, AI should not act.
  if (myTurn || !isAIMode) return;
  // No showCandyLoader() here, as per user request. AI thinking message is sufficient.

  const available = [];
  document.querySelectorAll("#grid button:not(:disabled)").forEach(btn => {
    // Only add candies that are not already selected and not AI's own poison
    const idx = parseInt(btn.dataset.index);
    if (!btn.classList.contains("glass-selected") && idx !== poisoned["2"]) {
      available.push(idx);
    }
  });

  if (available.length === 0) {
    set(ref(db, `${room}/turn`), "end"); 
    set(ref(db, `${room}/result`), "No candies left! It's a draw!"); 
    return;
  }

  const aiPlayerId = "2"; // AI is player 2
  const humanPlayerId = "1"; // Human is player 1

  if (poisoned[aiPlayerId] === -1) {
    // AI sets its poison candy
    const candidatesForAIPoison = available.filter(idx => idx !== poisoned[humanPlayerId]);

    let aiPoisonIndex;
    if (candidatesForAIPoison.length > 0) {
        aiPoisonIndex = candidatesForAIPoison[Math.floor(Math.random() * candidatesForAIPoison.length)];
    } else {
        aiPoisonIndex = available[Math.floor(Math.random() * available.length)];
    }

    set(ref(db, `${room}/poison/${aiPlayerId}`), aiPoisonIndex) 
      .then(() => {
        poisoned[aiPlayerId] = aiPoisonIndex; 
        set(ref(db, `${room}/turn`), humanPlayerId); 
      })
      .catch(error => console.error("AI: Error setting poison candy:", error));

  } else {
    // AI picks a candy to eat
    setTimeout(() => {
      let choice = -1;
      // Prioritize picking human player's poison if available and not selected
      if (poisoned[humanPlayerId] !== -1 && available.includes(poisoned[humanPlayerId])) {
        choice = poisoned[humanPlayerId];
      } else {
        // Otherwise, pick a random available candy that is NOT its own poison
        const nonAiPoisonCandies = available.filter(idx => idx !== poisoned[aiPlayerId]);
        if (nonAiPoisonCandies.length > 0) {
          choice = nonAiPoisonCandies[Math.floor(Math.random() * nonAiPoisonCandies.length)];
        } else {
          choice = available[Math.floor(Math.random() * available.length)];
        }
      }

      const btn = document.querySelector(`button[data-index='${choice}']`);
      if (btn) {
        set(ref(db, `${room}/selections/${choice}`), true) 
          .then(() => {
            btn.disabled = true;
            btn.classList.add("glass-selected");

            if (choice === poisoned[humanPlayerId]) {
              declareGameResult(humanPlayerId); 
            } else {
              get(ref(db, `${room}/selections`)).then(selectionsSnap => { 
                const currentSelections = selectionsSnap.val() || {};
                const remainingSelectableCandies = Array.from(document.querySelectorAll(".candy-btn")).filter(candyBtn => {
                    const idx = parseInt(candyBtn.dataset.index);
                    return !currentSelections[idx] && (idx !== poisoned[humanPlayerId]); 
                });
                if (remainingSelectableCandies.length === 0) {
                    set(ref(db, `${room}/turn`), "end"); 
                    set(ref(db, `${room}/result`), "No candies left! It's a draw!"); 
                } else {
                    set(ref(db, `${room}/turn`), humanPlayerId); 
                }
              });
            }
          })
          .catch(error => console.error("AI: Error picking candy:", error));
      }
    }, 1000); // Simulate AI thinking delay
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
                loserName = (loserPlayerId === "1") ? window.playerName : "AI Opponent"; 
                winnerName = (winnerPlayerId === "1") ? window.playerName : "AI Opponent"; 
            } else {
                 loserName = players[loserPlayerId] || `Player ${loserPlayerId}`;
                 winnerName = players[winnerPlayerId] || `Player ${winnerPlayerId}`;
            }
           
            let message = "";
            if (isAIMode) {
                if (loserPlayerId === "1") { 
                    message = `${winnerName} wins! (You picked ${winnerName}'s poison)`;
                } else { 
                    message = `${winnerName} wins! (AI picked its own poison)`;
                }
            } else {
                if (player === loserPlayerId) { 
                    message = `${winnerName} wins! (You picked ${winnerName}'s poison)`;
                } else { 
                    message = `${winnerName} wins! (${loserName} picked your poison)`;
                }
            }
            
            set(ref(db, `${room}/result`), message); 
            set(ref(db, `${room}/turn`), "end"); 

            console.log("🎯 Result Declared:", message);
        });
}


function waitForSecondPlayer() {
    info.classList.remove("hidden");
    info.innerText = `Waiting for Player 2 to join. Code: ${room}`;
    gameModeSelection.classList.add("hidden");
    gameArea.classList.remove("hidden");
    playerVsPlayerSection?.classList?.remove("hidden");

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
                    startGame();
                });
        }
    });
}

function startGame() {
    gameModeSelection.classList.add("hidden");
    gameArea.classList.remove("hidden");
    playerVsPlayerSection?.classList?.remove("hidden");
    info.classList.remove("hidden");
    grid.classList.remove("hidden");
    grid.innerHTML = "";
    winLoseNotification.classList.add("hidden");
    rematchPopup.classList.add("hidden");
    // Hide the main header when game starts
    mainHeader.classList.add("hidden");

    for (let i = 0; i < 20; i++) {
        const btn = document.createElement("button");
        btn.className = "candy-btn";
        btn.innerText = ["🍬", "🍭", "🍫", "🍩", "🍪", "🧁", "🍒", "🍎", "🥝", "🍓"][i % 10];
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
            }
        }).catch(error => console.error("Error checking/initializing AI room:", error));
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
                }
            });
    }

    // Use onValue for real-time listeners
    onValue(ref(db, `${room}/poison`), snap => { 
        poisoned = snap.val() || { "1": -1, "2": -1 };
        document.querySelectorAll(".candy-btn").forEach(btn => {
            const idx = parseInt(btn.dataset.index);
            btn.classList.remove("poison-candy");
            if (poisoned["1"] !== -1 && idx === poisoned["1"]) {
                btn.classList.add("poison-candy");
                if (player === "1") btn.disabled = true;
            }
            if (poisoned["2"] !== -1 && idx === poisoned["2"]) {
                if (!isAIMode) { 
                    btn.classList.add("poison-candy");
                }
                if (player === "2") btn.disabled = true;
            }
        });
    });

    onValue(ref(db, `${room}/turn`), snap => { 
        const t = snap.val();
        if (t === "end") return; 

        // Determine if it's currently MY turn
        myTurn = (isAIMode && t === "1") || (!isAIMode && t === player);

        const opponentPlayer = player === "1" ? "2" : "1";

        if (myTurn) {
            if (poisoned[player] === -1) {
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
        document.querySelectorAll(".candy-btn").forEach(btn => {
            const idx = parseInt(btn.dataset.index); 
            btn.disabled = false; 
            btn.classList.remove("glass-selected"); 

            if (selections[idx]) {
                btn.disabled = true;
                btn.classList.add("glass-selected");
            }
            // Ensure poison candies are disabled for the player who set them
            if (player === "1" && poisoned["1"] !== -1 && idx === poisoned["1"]) {
                btn.classList.add("poison-candy");
                btn.disabled = true;
            } else if (player === "2" && poisoned["2"] !== -1 && idx === poisoned["2"]) {
                btn.classList.add("poison-candy");
                btn.disabled = true;
            }
        });

        // Check for draw condition (no selectable candies left)
        get(ref(db, `${room}/poison`)).then(poisonSnap => { 
            const currentPoisons = poisonSnap.val() || { "1": -1, "2": -1 };
            const remainingSelectableCandies = Array.from(document.querySelectorAll(".candy-btn")).filter(btn => {
                const idx = parseInt(btn.dataset.index);
                return !selections[idx] && (idx !== currentPoisons[player]); 
            });
            if (currentPoisons["1"] !== -1 && currentPoisons["2"] !== -1 && remainingSelectableCandies.length === 0) {
                set(ref(db, `${room}/turn`), "end"); 
                set(ref(db, `${room}/result`), "No candies left! It's a draw!"); 
            }
        });
    });

    onValue(ref(db, `${room}/result`), snap => { 
        const res = snap.val();
        if (res) {
            let title = "";
            let message = res;
            let poisonCandyEmoji = "";
            if (res.includes("wins!")) {
                const winnerMatch = res.match(/^(.*?)\s+wins!/);
                const winnerName = winnerMatch ? winnerMatch[1] : "";

                // Determine if 'this' client is the winner or loser based on winnerName
                if (winnerName === window.playerName || (isAIMode && winnerName.includes("AI") && player === "2")) {
                    title = "You Win!";
                    const opponentPlayerId = player === "1" ? "2" : "1";
                    get(ref(db, `${room}/poison/${opponentPlayerId}`)).then(pSnap => { 
                        const poisonIndex = pSnap.val();
                        if (poisonIndex !== -1 && poisonIndex !== null) {
                            const candyEmoji = ["🍬", "🍭", "🍫", "🍩", "🍪", "🧁", "🍒", "🍎", "🥝", "🍓"][poisonIndex % 10];
                            poisonCandyEmoji = `Opponent's poisonous candy was ${candyEmoji} (candy no. ${poisonIndex + 1}).`;
                        }
                        window.showGameResult(title, message, poisonCandyEmoji);
                    });
                } else {
                    title = "You Lose!";
                    get(ref(db, `${room}/poison/${player}`)).then(pSnap => { 
                        const poisonIndex = pSnap.val();
                        if (poisonIndex !== -1 && poisonIndex !== null) {
                            const candyEmoji = ["🍬", "🍭", "🍫", "🍩", "🍪", "🧁", "🍒", "🍎", "🥝", "🍓"][poisonIndex % 10];
                            poisonCandyEmoji = `Your poisonous candy was ${candyEmoji} (candy no. ${poisonIndex + 1}).`;
                        }
                        window.showGameResult(title, message, poisonCandyEmoji);
                    });
                }
            } else {
                title = "Game Over"; 
                window.showGameResult(title, message, "");
            }
        }
    });

    // Add rematch listener to check both players' requests
    onValue(ref(db, `${room}/rematch`), snap => { 
        const rematchData = snap.val() || {};
        const opponentKey = player === "1" ? "2" : "1";
        if (rematchData[player] && rematchData[opponentKey]) {
            startNewRound();
        }
    });
}

function handleCandyClick(index, btn) {
    if (!myTurn) {
        alert("It's not your turn!");
        return;
    }
    if (btn.classList.contains("glass-selected")) {
        alert("This candy has already been picked!");
        return;
    }

    if (poisoned[player] === -1) {
        // Player is setting their poison candy
        const opponent = player === "1" ? "2" : "1";
        // Prevent setting poison on opponent's already set poison
        if (!isAIMode && poisoned[opponent] === index && poisoned[opponent] !== -1) {
            alert("You cannot set your poison on an opponent's already set poison candy!");
            return;
        }
        set(ref(db, `${room}/poison/${player}`), index) 
            .then(() => {
                poisoned[player] = index; 
                const nextPlayer = player === "1" ? "2" : "1";
                set(ref(db, `${room}/turn`), nextPlayer); 
            })
            .catch(error => {
                console.error("Error setting poison candy:", error);
                alert("Failed to set poison candy. Please try again.");
            });
    } else if (poisoned["1"] !== -1 && poisoned["2"] !== -1) {
        // Both poisons are set, player is picking a candy to eat
        if (poisoned[player] === index) {
            alert("You cannot pick your own poisonous candy!");
            return;
        }
        set(ref(db, `${room}/selections/${index}`), true) 
            .then(() => {
                const opponent = player === "1" ? "2" : "1";
                if (poisoned[opponent] === index) {
                    declareGameResult(player); 
                } else {
                    get(ref(db, `${room}/selections`)).then(selectionsSnap => { 
                        const currentSelections = selectionsSnap.val() || {};
                        const remainingSelectableCandies = Array.from(document.querySelectorAll(".candy-btn")).filter(candyBtn => {
                            const idx = parseInt(candyBtn.dataset.index);
                            return !currentSelections[idx] && (idx !== poisoned[player]); 
                        });
                        if (remainingSelectableCandies.length === 0) {
                            set(ref(db, `${room}/turn`), "end"); 
                            set(ref(db, `${room}/result`), "No candies left! It's a draw!"); 
                        } else {
                            const nextPlayer = player === "1" ? "2" : "1";
                            set(ref(db, `${room}/turn`), nextPlayer); 
                        }
                    });
                }
            })
            .catch(error => {
                console.error("Error picking candy:", error);
                alert("Failed to pick candy. Please try again.");
            });
    } else {
        info.innerText = "Wait for both players to set their poison candies first!";
    }
}

function requestRematch() {
    showCandyLoader(); 
    if (!room) {
        hideCandyLoader(); 
        alert("No active game to rematch.");
        return;
    }

    if (isAIMode) {
        // For AI mode, just reset the room state directly
        set(ref(db, room), { 
            poison: { "1": -1, "2": -1 },
            turn: "1",
            selections: {},
            result: ""
        }).then(() => {
            console.log("AI game state reset for rematch.");
            playWithAI(); 
            rematchPopup.classList.add("hidden");
        }).catch(error => {
            console.error("Error resetting AI game state for rematch:", error);
            alert("Failed to restart AI game. Please try again.");
        }).finally(() => {
            hideCandyLoader(); 
        });
        return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
        hideCandyLoader(); 
        alert("You must be logged in to request a rematch.");
        return;
    }

    set(ref(db, `${room}/rematch/${player}`), true) 
        .then(() => {
            info.innerText = "Rematch requested! Waiting for opponent...";
        })
        .catch(error => {
            console.error("Error requesting rematch:", error);
            alert("Failed to request rematch. Please try again.");
        })
        .finally(() => {
            hideCandyLoader(); 
        });
}

function startNewRound() {
    showCandyLoader(); 
    update(ref(db, room), { 
        poison: { "1": -1, "2": -1 },
        turn: "1",
        selections: {},
        result: "",
        rematch: {} 
    })
    .then(() => {
        console.log("Game state reset for new round.");
        rematchPopup.classList.add("hidden");
        startGame(); 
    })
    .catch(error => {
        console.error("Error resetting game state:", error);
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

    if (!isAIMode && room) {
        // Multiplayer game cleanup
        remove(ref(db, `${room}/players/${player}`)); 
        remove(ref(db, `${room}/avatars/${player}`)); 

        // Check if room becomes empty after player leaves
        get(ref(db, room)) 
            .then(snapshot => {
            const roomData = snapshot.val();
            if (!roomData || (roomData.players && Object.keys(roomData.players).length === 0)) {
                // If no players left, delete the room
                remove(ref(db, room)) 
                    .then(() => console.log("Empty room deleted."))
                    .catch(error => console.error("Error deleting empty room:", error))
                    .finally(() => hideCandyLoader());
            } else if (roomData && roomData.players) {
                // If one player remains, declare the other player winner by forfeit
                const remainingPlayerKey = Object.keys(roomData.players)[0];
                if (remainingPlayerKey) {
                    get(ref(db, `${room}/players/${remainingPlayerKey}`)).then(remainingPlayerSnap => { 
                        const remainingPlayerName = remainingPlayerSnap.val() || `Player ${remainingPlayerKey}`;
                        set(ref(db, `${room}/result`), `${window.playerName} has left the game. ${remainingPlayerName} wins by forfeit!`); 
                        set(ref(db, `${room}/turn`), "end"); 
                    }).catch(error => {
                        console.error("Error fetching remaining player name for forfeit:", error);
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
    } else if (isAIMode && room) {
        // AI mode cleanup
        remove(ref(db, room)) 
            .then(() => console.log("AI game room deleted."))
            .catch(error => console.error("Error deleting AI room:", error))
            .finally(() => hideCandyLoader());
    } else {
        hideCandyLoader(); 
    }

    // Reset local game state
    player = "";
    room = "";
    myTurn = false;
    poisoned = {};
    isAIMode = false;
    // Hide game-related UI and show mode selection
    gameArea.classList.add("hidden");
    playerVsPlayerSection?.classList?.add("hidden");
    winLoseNotification.classList.add("hidden");
    rematchPopup.classList.add("hidden");
    info.classList.add("hidden");
    gameModeSelection.classList.remove("hidden");
    // Show the main header when exiting game
    mainHeader.classList.remove("hidden");
    console.log("Exited game. Returned to mode selection.");
    playBackgroundMusic(); // Play BGM again when returning to main menu
}


// Global function to show game result notification (called from main.js and HTML)
window.showGameResult = function(title, message, poisonCandyDetails) {
    document.getElementById("notificationTitle").innerText = title;
    document.getElementById("notificationMessage").innerText = message;
    document.getElementById("poisonInfo").innerText = poisonCandyDetails;
    winLoseNotification.classList.remove("hidden");
    if (title === "You Win!") {
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
        editAvatarPreview.src = window.playerAvatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png";
        editAvatarPreview.classList.remove("hidden");
    }
}

// New: Functions to open and close game settings popup
function openGameSettingsPopup() {
    if (gameSettingsPopup) {
        gameSettingsPopup.classList.remove('hidden');
    }
}

function closeGameSettingsPopup() {
    if (gameSettingsPopup) {
        gameSettingsPopup.classList.add('hidden');
    }
}

// New: Functions to open and close forgot password popup
function showForgotPasswordPopup() {
    if (forgotPasswordPopup) {
        forgotPasswordPopup.classList.remove('hidden');
        forgotEmailInput.value = ''; // Clear email input
    }
}

function closeForgotPasswordPopup() {
    if (forgotPasswordPopup) {
        forgotPasswordPopup.classList.add('hidden');
    }
}

// Expose functions to the global scope for HTML event handlers
window.register = register;
window.login = login;
window.logout = logout;
window.createTeam = createTeam;
window.joinTeam = joinTeam;
window.playWithAI = playWithAI;
window.requestRematch = requestRematch;
window.updateProfile = updateProfile;
window.closeEditProfilePopup = closeEditProfilePopup;
window.showExitConfirmation = showExitConfirmation;
// New: Expose new functions to global scope
window.openGameSettingsPopup = openGameSettingsPopup;
window.closeGameSettingsPopup = closeGameSettingsPopup;
window.toggleSound = toggleSound;
window.toggleMusic = toggleMusic;
window.signInWithGoogle = signInWithGoogle;
window.sendPasswordResetEmail = sendPasswordResetEmailFn; 
window.closeForgotPasswordPopup = closeForgotPasswordPopup;
