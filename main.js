// Firebase Configuration (DO NOT share your actual API key publicly)
const firebaseConfig = {
  apiKey: "AIzaSyDed3PK5mO-Xet6YV-CT9_GoEh3rmBTn08",
  authDomain: "game-ede8f.firebaseapp.com",
  databaseURL: "https://game-ede8f-default-rtdb.firebaseio.com",
  projectId: "game-ede8f",
  storageBucket: "game-ede8f.appspot.com",
  messagingSenderId: "234988659696",
  appId: "1:234988659696:web:5168ce11a1ebc0d44d7335"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();

// DOM Elements
const authDiv = document.getElementById("auth");
const gameModeSelection = document.getElementById("gameModeSelection");
const teamBattlePopup = document.getElementById("teamBattlePopup");
const info = document.getElementById("info");
const grid = document.getElementById("grid");
const teamInput = document.getElementById("teamCodeInput");
const userInfo = document.getElementById("userInfo");
const loggedInMessageDisplay = document.getElementById("loggedInMessageDisplay");
const showLoginBtn = document.getElementById("showLoginBtn");
const showRegisterBtn = document.getElementById("showRegisterBtn");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const loginName = document.getElementById("loginName");
const loginPass = document.getElementById("loginPass");
const regName = document.getElementById("regName");
const regEmail = document.getElementById("regEmail");
const regAvatar = document.getElementById("regAvatar");
const avatarPreview = document.getElementById("avatarPreview");
const regPass = document.getElementById("regPass");
const regConfirmPass = document.getElementById("regConfirmPass");
const rematchPopup = document.getElementById("rematchPopup");
const yourName = document.getElementById("yourName");
const opponentName = document.getElementById("opponentName");
const yourAvatar = document.getElementById("yourAvatar");
const opponentAvatar = document.getElementById("opponentAvatar");
const playerVsPlayerSection = document.getElementById("playerVsPlayerSection");
const gameArea = document.getElementById("gameArea");
const editProfilePopup = document.getElementById("editProfilePopup");
const editNameInput = document.getElementById("editName");
const editEmailInput = document.getElementById("editEmail");
const editAvatarInput = document.getElementById("editAvatar");
const editAvatarPreview = document.getElementById("editAvatarPreview");
const winLoseNotification = document.getElementById("winLoseNotification");
// New: Reference to the main header div
const mainHeader = document.querySelector('.w-full.max-w-3xl.flex.justify-between.items-center.mb-4.px-4');

// Loader DOM element reference
const candyLoader = document.getElementById('candyLoader');

// Custom Confirm Dialogue Elements
const customConfirm = document.getElementById('customConfirm');
const confirmMessage = document.getElementById('confirmMessage');
const confirmOk = document.getElementById('confirmOk');
const confirmCancel = document.getElementById('confirmCancel');


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

// Call loader immediately when the script starts executing for initial page load
showCandyLoader();

// Game Variables
let player = "";
let room = "";
let myTurn = false;
window.playerName = "";
window.playerAvatar = "";
window.playerEmail = "";
let poisoned = {};
let isAIMode = false;

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
    registerForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
    showRegisterBtn.classList.add("bg-gray-200", "shadow-md");
    showLoginBtn.classList.remove("bg-gray-200", "shadow-md");
    showLoginBtn.classList.add("bg-gray-100", "shadow-sm");
});

// Firebase Auth State Listener
auth.onAuthStateChanged(function(user) {
    if (user) {
        db.ref(`users/${user.uid}`).once("value")
            .then(snap => {
                const userData = snap.val();
                if (userData) {
                    window.playerName = userData.name || user.email;
                    window.playerAvatar = userData.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                    window.playerEmail = user.email;
                    authDiv.classList.add("hidden");
                    userInfo.classList.remove("hidden");
                    loggedInMessageDisplay.innerHTML = `Logged in as: <span class="text-red-500">${window.playerName}</span>`;
                    gameModeSelection.classList.remove("hidden");
                } else {
                    window.playerName = user.email;
                    window.playerAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                    window.playerEmail = user.email;
                    authDiv.classList.add("hidden");
                    userInfo.classList.remove("hidden");
                    loggedInMessageDisplay.innerHTML = `Logged in as: <span class="text-red-500">${window.playerName}</span>`;
                    gameModeSelection.classList.remove("hidden");
                    db.ref(`users/${user.uid}`).set({
                        name: user.email,
                        email: user.email,
                        avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    });
                }
            })
            .catch(error => {
                console.error("Error fetching user profile:", error);
                alert("Failed to load user profile. Please try logging in again.");
                auth.signOut();
            })
            .finally(() => { // Hide loader only after user data is processed or error occurs
                hideCandyLoader();
            });
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

// Auth Functions
async function register() {
    // showCandyLoader(); // Global loader handles initial state, keep this only for subsequent actions
    const name = regName.value.trim();
    const email = regEmail.value.trim();
    const pass = regPass.value.trim();
    const confirmPass = regConfirmPass.value.trim();
    const avatarFile = regAvatar.files[0];

    if (!name || !email || !pass || !confirmPass) {
        // hideCandyLoader(); // No need if showCandyLoader is not here
        return alert("Please enter username, email, password and confirm password");
    }
    if (pass !== confirmPass) {
        // hideCandyLoader(); // No need if showCandyLoader is not here
        return alert("Passwords do not match");
    }

    let finalAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    if (avatarFile) {
        try {
            finalAvatar = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.onerror = (e) => reject(e);
                reader.readAsDataURL(avatarFile);
            });
        } catch (error) {
            console.error("Error reading avatar file:", error);
            // hideCandyLoader(); // No need if showCandyLoader is not here
            alert("Could not read avatar file. Please try again.");
            return;
        }
    }

    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, pass);
        const user = userCredential.user;
        await db.ref(`users/${user.uid}`).set({
            name: name,
            email: email,
            avatar: finalAvatar
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
        // hideCandyLoader(); // This hide should be for the specific action, not for initial load.
        // If you want a loader for the *registration process*, re-add showCandyLoader() at the top of this function
        // and hideCandyLoader() here.
    }
}

function login() {
    // showCandyLoader(); // Global loader handles initial state, keep this only for subsequent actions
    const email = loginName.value.trim();
    const pass = loginPass.value.trim();
    if (!email || !pass) {
        // hideCandyLoader(); // No need if showCandyLoader is not here
        return alert("Enter email and password");
    }

    auth.signInWithEmailAndPassword(email, pass)
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
            // hideCandyLoader(); // This hide should be for the specific action, not for initial load.
            // If you want a loader for the *login process*, re-add showCandyLoader() at the top of this function
            // and hideCandyLoader() here.
        });
}

function logout() {
    showCandyLoader(); // This is an action, so loader is appropriate here.
    auth.signOut().then(() => {
        console.log("Logged out successfully.");
    }).catch((error) => {
        console.error("Logout error:", error.message);
        alert("Failed to logout. Please try again.");
    }).finally(() => {
        hideCandyLoader(); // Always hide loader when logout attempt is complete
    });
}

async function updateProfile() {
    showCandyLoader(); // This is an action, so loader is appropriate here.
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

    let updatedAvatar = window.playerAvatar;
    if (newAvatarFile) {
        try {
            updatedAvatar = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.onerror = (e) => reject(e);
                reader.readAsDataURL(newAvatarFile);
            });
        } catch (error) {
            console.error("Error reading new avatar file:", error);
            hideCandyLoader();
            alert("Could not read new avatar file. Please try again.");
            return;
        }
    }

    try {
        if (newEmail && newEmail !== user.email) {
            await user.updateEmail(newEmail);
            console.log("Email updated in Firebase Auth.");
        }

        await db.ref(`users/${user.uid}`).update({
            name: newName,
            email: newEmail || user.email,
            avatar: updatedAvatar
        });

        window.playerName = newName;
        window.playerEmail = newEmail || user.email;
        window.playerAvatar = updatedAvatar;
        loggedInMessageDisplay.innerHTML = `Logged in as: <span class="text-red-500">${window.playerName}</span>`;
        alert("Profile updated successfully!");
        closeEditProfilePopup();
    } catch (error) {
        console.error("Error updating profile:", error);
        let errorMessage = "Failed to update profile. Please try again.";
        if (error.code === 'auth/requires-recent-login') {
            errorMessage = "For security, please re-authenticate to change your email. Log out and log in again.";
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = "Invalid email address format.";
        } else if (error.code === 'auth/email-already-in-use') {
            errorMessage = "This email is already in use by another account.";
        }
        alert(errorMessage);
    } finally {
        hideCandyLoader(); // Always hide loader when profile update attempt is complete
    }
}

function generateRoomCode() {
    return Math.floor(10000 + Math.random() * 90000).toString();
}

function createTeam() {
    showCandyLoader(); // Show loader at the start of team creation
    if (!window.playerName) {
        hideCandyLoader(); // Hide loader if not logged in
        alert("Please log in to create a team.");
        return;
    }
    player = "1";
    isAIMode = false;

    function createRoomWithUniqueCode() {
        room = generateRoomCode();
        db.ref(room).once("value")
            .then(snapshot => {
                if (snapshot.exists()) {
                    console.log(`Room ${room} already exists, generating new code...`);
                    createRoomWithUniqueCode();
                } else {
                    db.ref(room).set({
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
                        info.classList.remove("hidden");
                        info.innerText = `Team created! Share this code: ${room}`;
                        // Hide header when starting team battle
                        mainHeader.classList.add("hidden");
                        waitForSecondPlayer();
                    })
                    .catch(error => {
                        console.error("Error setting room data:", error);
                        alert("Failed to create team. Please try again.");
                    })
                    .finally(() => {
                        hideCandyLoader(); // Hide loader when room creation is complete
                    });
                }
            })
            .catch(error => {
                console.error("Error checking room existence:", error);
                alert("Failed to create team. Please check your internet connection.");
                hideCandyLoader(); // Hide loader on error
            });
    }
    createRoomWithUniqueCode();
}

function joinTeam() {
    showCandyLoader(); // Show loader at the start of joining team
    if (!window.playerName) {
        hideCandyLoader(); // Hide loader if not logged in
        alert("Please log in to join a team.");
        return;
    }
    room = teamInput.value.trim();
    if (!room) {
        hideCandyLoader(); // Hide loader if validation fails
        return alert("Enter a team code");
    }
    isAIMode = false;

    db.ref(`${room}/players/1`).once("value", snap => {
        if (!snap.exists()) {
            hideCandyLoader(); // Hide loader if validation fails
            return alert("Invalid team code");
        }
        db.ref(`${room}/players/2`).once("value", snap2 => {
            if (snap2.exists()) {
                hideCandyLoader(); // Hide loader if validation fails
                return alert("This team is already full. Please try another code.");
            }
            if (snap.val() === window.playerName) {
                hideCandyLoader(); // Hide loader if validation fails
                return alert("You cannot join your own team as a second player.");
            }
            player = "2";
            db.ref(`${room}/players/2`).set(window.playerName);
            db.ref(`${room}/avatars/2`).set(window.playerAvatar);
            teamBattlePopup.classList.add("hidden");
            // Hide header when joining team battle
            mainHeader.classList.add("hidden");
            startGame();
            hideCandyLoader(); // Hide loader when joining team is complete
        });
    }).catch(error => {
        console.error("Error joining team:", error);
        alert("Failed to join team. Please try again.");
        hideCandyLoader(); // Hide loader on error
    });
}

function playWithAI() {
  showCandyLoader(); // Show loader at the start of AI game
  player = "1";
  room = "AI_MODE_" + Math.random().toString(36).substring(2, 7);
  myTurn = true;
  isAIMode = true;
  poisoned = { "1": -1, "2": -1 };

  // Set AI opponent info
  opponentName.textContent = "AI Opponent";
  opponentAvatar.src = "https://cdn-icons-png.flaticon.com/512/4712/4712035.png"; // Example AI avatar
  yourName.textContent = window.playerName || "You"; // Updated to use window.playerName
  yourAvatar.src = window.playerAvatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"; // Updated to use window.playerAvatar and default if empty

  playerVsPlayerSection?.classList?.remove("hidden"); // Use playerVsPlayerSection instead of playerNamesBox
  // Hide header when starting AI game
  mainHeader.classList.add("hidden");

  startGame();
  info.innerText = "Your turn! First set your poison candy.";
  info.classList.remove("hidden"); // Ensure turn info is visible
  hideCandyLoader(); // Hide loader when AI game is started
}

function AITurn() {
  // If it's my turn (player's turn) or not in AI mode, AI should not act.
  if (myTurn || !isAIMode) return;
  showCandyLoader(); // Show loader for AI turn

  const available = [];
  document.querySelectorAll("#grid button:not(:disabled)").forEach(btn => {
    // Only add candies that are not already selected and not AI's own poison
    const idx = parseInt(btn.dataset.index);
    if (!btn.classList.contains("glass-selected") && idx !== poisoned["2"]) {
      available.push(idx);
    }
  });

  if (available.length === 0) {
    db.ref(`${room}/turn`).set("end");
    db.ref(`${room}/result`).set("No candies left! It's a draw!");
    hideCandyLoader(); // Hide loader if draw
    return;
  }

  const aiPlayerId = "2"; // AI is player 2
  const humanPlayerId = "1"; // Human is player 1

  if (poisoned[aiPlayerId] === -1) {
    // AI sets its poison candy
    // Avoid setting poison on human player's poison if already set
    const candidatesForAIPoison = available.filter(idx => idx !== poisoned[humanPlayerId]);

    let aiPoisonIndex;
    if (candidatesForAIPoison.length > 0) {
        aiPoisonIndex = candidatesForAIPoison[Math.floor(Math.random() * candidatesForAIPoison.length)];
    } else {
        // Fallback: if all non-human-poison candies are taken, AI might pick a random one
        aiPoisonIndex = available[Math.floor(Math.random() * available.length)];
    }

    db.ref(`${room}/poison/${aiPlayerId}`).set(aiPoisonIndex)
      .then(() => {
        poisoned[aiPlayerId] = aiPoisonIndex; // Update local state
        db.ref(`${room}/turn`).set(humanPlayerId); // Pass turn to Player 1 (human)
      })
      .catch(error => console.error("AI: Error setting poison candy:", error))
      .finally(() => {
        hideCandyLoader(); // Hide loader after AI sets poison
      });

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
          // If only AI's own poison is left among available, it will pick that
          choice = available[Math.floor(Math.random() * available.length)];
        }
      }

      const btn = document.querySelector(`button[data-index='${choice}']`);
      if (btn) {
        db.ref(`${room}/selections/${choice}`).set(true) // Set to true, not "2"
          .then(() => {
            btn.disabled = true;
            btn.classList.add("glass-selected");

            if (choice === poisoned[humanPlayerId]) {
              // AI picked human's poison, AI (Player 2) wins, Human (Player 1) loses
              declareGameResult(humanPlayerId); // Human (P1) is the loser
            } else if (choice === poisoned[aiPlayerId]) {
              // AI picked its own poison, Human (Player 1) wins, AI (Player 2) loses
              declareGameResult(aiPlayerId); // AI (P2) is the loser
            } else {
              // Check if game ends after AI's move
              db.ref(`${room}/selections`).once('value').then(selectionsSnap => {
                const currentSelections = selectionsSnap.val() || {};
                const remainingSelectableCandies = Array.from(document.querySelectorAll(".candy-btn")).filter(candyBtn => {
                    const idx = parseInt(candyBtn.dataset.index);
                    return !currentSelections[idx] && (idx !== poisoned[humanPlayerId]); // Cannot pick human's own poison
                });
                if (remainingSelectableCandies.length === 0) {
                    db.ref(`${room}/turn`).set("end");
                    db.ref(`${room}/result`).set("No candies left! It's a draw!");
                } else {
                    db.ref(`${room}/turn`).set(humanPlayerId); // Pass turn to Player 1 (human)
                }
              });
            }
          })
          .catch(error => console.error("AI: Error picking candy:", error))
          .finally(() => {
            hideCandyLoader(); // Hide loader after AI picks candy
          });
      } else {
        hideCandyLoader(); // Hide loader if no button is found (shouldn't happen)
      }
    }, 1000); // Simulate AI thinking delay
  }
}

// New function to declare game results
function declareGameResult(loserPlayerId) {
    db.ref(`${room}/players`).once("value", snap => {
        const players = snap.val();
        // loserPlayerId is the ID of the player who picked the poison
        const winnerPlayerId = (loserPlayerId === "1") ? "2" : "1";

        let loserName;
        let winnerName;

        if (isAIMode) {
            loserName = (loserPlayerId === "1") ? window.playerName : "AI Opponent"; // If loser is P1 (user), use their name, else AI
            winnerName = (winnerPlayerId === "1") ? window.playerName : "AI Opponent"; // If winner is P1 (user), use their name, else AI
        } else {
            // For PvP mode, get names from Firebase
             loserName = players[loserPlayerId] || `Player ${loserPlayerId}`;
             winnerName = players[winnerPlayerId] || `Player ${winnerPlayerId}`;
        }
       
        let message = "";
        if (isAIMode) {
            if (loserPlayerId === "1") { // User (Player 1) picked poison, AI (Player 2) wins
                message = `${winnerName} wins! (You picked ${winnerName}'s poison)`;
            } else { // AI (Player 2) picked poison, User (Player 1) wins
                message = `${winnerName} wins! (AI picked its own poison)`;
            }
        } else {
            // For PvP, the 'player' variable in this context refers to the current client's player ID
            // If the current client's player ID is the one that just picked the poison (loserPlayerId)
            if (player === loserPlayerId) { // This client is the loser
                message = `${winnerName} wins! (You picked ${winnerName}'s poison)`;
            } else { // This client is the winner (opponent picked their poison)
                message = `${winnerName} wins! (${loserName} picked your poison)`;
            }
        }
        
        db.ref(`${room}/result`).set(message);
        db.ref(`${room}/turn`).set("end");

        console.log("🎯 Result Declared:", message);
    });
}


function waitForSecondPlayer() {
    info.classList.remove("hidden");
    info.innerText = `Waiting for Player 2 to join. Code: ${room}`;
    gameModeSelection.classList.add("hidden");
    gameArea.classList.remove("hidden");
    playerVsPlayerSection?.classList?.remove("hidden");

    db.ref(`${room}/players/2`).on("value", snap => {
        if (snap.exists()) {
            const opponentDisplayName = snap.val();
            db.ref(`${room}/avatars/2`).once("value", avatarSnap => {
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
        db.ref(room).once("value").then(snapshot => {
            if (!snapshot.exists()) {
                db.ref(room).set({
                    poison: { "1": -1, "2": -1 },
                    turn: "1",
                    selections: {},
                    result: ""
                });
            }
        }).catch(error => console.error("Error checking/initializing AI room:", error));
    } else {
        db.ref(`${room}/players`).once("value", playersSnap => {
            const playersData = playersSnap.val();
            if (playersData) {
                yourName.textContent = window.playerName;
                yourAvatar.src = window.playerAvatar;
                if (player === "1") {
                    opponentName.textContent = playersData["2"] || "Waiting...";
                    db.ref(`${room}/avatars/2`).once("value", avatarSnap => {
                        opponentAvatar.src = avatarSnap.val() || "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                    });
                } else {
                    opponentName.textContent = playersData["1"] || "Waiting...";
                    db.ref(`${room}/avatars/1`).once("value", avatarSnap => {
                        opponentAvatar.src = avatarSnap.val() || "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                    });
                }
            }
        });
        db.ref(`${room}/turn`).once("value", snap => {
            if (!snap.exists()) {
                db.ref(`${room}/turn`).set("1");
            }
        });
    }

    db.ref(`${room}/poison`).off();
    db.ref(`${room}/poison`).on("value", snap => {
        poisoned = snap.val() || { "1": -1, "2": -1 };
        document.querySelectorAll(".candy-btn").forEach(btn => {
            const idx = parseInt(btn.dataset.index);
            btn.classList.remove("poison-candy");
            if (poisoned["1"] !== -1 && idx === poisoned["1"]) {
                btn.classList.add("poison-candy");
                if (player === "1") btn.disabled = true;
            }
            if (poisoned["2"] !== -1 && idx === poisoned["2"]) {
                if (!isAIMode) { // Only show opponent's poison if not AI mode
                    btn.classList.add("poison-candy");
                }
                if (player === "2") btn.disabled = true;
            }
        });
    });

    db.ref(`${room}/turn`).off();
    db.ref(`${room}/turn`).on("value", snap => {
        const t = snap.val();
        if (t === "end") return; // Game has ended, don't update turn info

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

    db.ref(`${room}/selections`).off();
    db.ref(`${room}/selections`).on("value", snap => {
        const selections = snap.val() || {};
        document.querySelectorAll(".candy-btn").forEach(btn => {
            const idx = parseInt(btn.dataset.index); // Define idx here
            btn.disabled = false; // Re-enable all buttons initially
            btn.classList.remove("glass-selected"); // Remove selected style initially

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
        db.ref(`${room}/poison`).once("value").then(poisonSnap => {
            const currentPoisons = poisonSnap.val() || { "1": -1, "2": -1 };
            const remainingSelectableCandies = Array.from(document.querySelectorAll(".candy-btn")).filter(btn => {
                const idx = parseInt(btn.dataset.index);
                // A candy is selectable if it's not already selected AND it's not *this player's* poison.
                return !selections[idx] && (idx !== currentPoisons[player]);
            });
            if (currentPoisons["1"] !== -1 && currentPoisons["2"] !== -1 && remainingSelectableCandies.length === 0) {
                db.ref(`${room}/turn`).set("end");
                db.ref(`${room}/result`).set("No candies left! It's a draw!");
            }
        });
    });

    db.ref(`${room}/result`).off();
    db.ref(`${room}/result`).on("value", snap => {
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
                    db.ref(`${room}/poison/${opponentPlayerId}`).once("value").then(pSnap => {
                        const poisonIndex = pSnap.val();
                        if (poisonIndex !== -1 && poisonIndex !== null) {
                            const candyEmoji = ["🍬", "🍭", "🍫", "🍩", "🍪", "🧁", "🍒", "🍎", "🥝", "🍓"][poisonIndex % 10];
                            poisonCandyEmoji = `Opponent's poisonous candy was ${candyEmoji} (candy no. ${poisonIndex + 1}).`;
                        }
                        window.showGameResult(title, message, poisonCandyEmoji);
                    });
                } else {
                    title = "You Lose!";
                    db.ref(`${room}/poison/${player}`).once("value").then(pSnap => {
                        const poisonIndex = pSnap.val();
                        if (poisonIndex !== -1 && poisonIndex !== null) {
                            const candyEmoji = ["🍬", "🍭", "🍫", "🍩", "🍪", "🧁", "🍒", "🍎", "🥝", "🍓"][poisonIndex % 10];
                            poisonCandyEmoji = `Your poisonous candy was ${candyEmoji} (candy no. ${poisonIndex + 1}).`;
                        }
                        window.showGameResult(title, message, poisonCandyEmoji);
                    });
                }
            } else {
                title = "Game Over"; // For draw conditions
                window.showGameResult(title, message, "");
            }
        }
    });

    // Add rematch listener to check both players' requests
    db.ref(`${room}/rematch`).off();
    db.ref(`${room}/rematch`).on("value", snap => {
        const rematchData = snap.val() || {};
        const opponentKey = player === "1" ? "2" : "1";
        if (rematchData[player] && rematchData[opponentKey]) {
            startNewRound();
        }
    });
}

function handleCandyClick(index, btn) {
    showCandyLoader(); // Show loader on candy click
    if (!myTurn) {
        hideCandyLoader(); // Hide loader if not turn
        alert("It's not your turn!");
        return;
    }
    if (btn.classList.contains("glass-selected")) {
        hideCandyLoader(); // Hide loader if already picked
        alert("This candy has already been picked!");
        return;
    }

    if (poisoned[player] === -1) {
        // Player is setting their poison candy
        const opponent = player === "1" ? "2" : "1";
        // Prevent setting poison on opponent's already set poison
        if (!isAIMode && poisoned[opponent] === index && poisoned[opponent] !== -1) {
            hideCandyLoader(); // Hide loader if invalid poison selection
            alert("You cannot set your poison on an opponent's already set poison candy!");
            return;
        }

        db.ref(`${room}/poison/${player}`).set(index)
            .then(() => {
                poisoned[player] = index; // Update local state
                const nextPlayer = player === "1" ? "2" : "1";
                db.ref(`${room}/turn`).set(nextPlayer);
            })
            .catch(error => {
                console.error("Error setting poison candy:", error);
                alert("Failed to set poison candy. Please try again.");
            })
            .finally(() => {
                hideCandyLoader(); // Hide loader after poison set attempt
            });
    } else if (poisoned["1"] !== -1 && poisoned["2"] !== -1) {
        // Both poisons are set, player is picking a candy to eat
        if (poisoned[player] === index) {
            hideCandyLoader(); // Hide loader if picking own poison
            alert("You cannot pick your own poisonous candy!");
            return;
        }

        db.ref(`${room}/selections/${index}`).set(true)
            .then(() => {
                const opponent = player === "1" ? "2" : "1";
                if (poisoned[opponent] === index) {
                    // Current player picked opponent's poison, so current player is the loser
                    declareGameResult(player); // Call the new function
                } else {
                    // Check if game ends after this move (no more candies to pick)
                    db.ref(`${room}/selections`).once('value').then(selectionsSnap => {
                        const currentSelections = selectionsSnap.val() || {};
                        const remainingSelectableCandies = Array.from(document.querySelectorAll(".candy-btn")).filter(candyBtn => {
                            const idx = parseInt(candyBtn.dataset.index);
                            return !currentSelections[idx] && (idx !== poisoned[player]); // Cannot pick own poison
                        });
                        if (remainingSelectableCandies.length === 0) {
                            db.ref(`${room}/turn`).set("end");
                            db.ref(`${room}/result`).set("No candies left! It's a draw!");
                        } else {
                            const nextPlayer = player === "1" ? "2" : "1";
                            db.ref(`${room}/turn`).set(nextPlayer);
                        }
                    });
                }
            })
            .catch(error => {
                console.error("Error picking candy:", error);
                alert("Failed to pick candy. Please try again.");
            })
            .finally(() => {
                hideCandyLoader(); // Hide loader after candy pick attempt
            });
    } else {
        hideCandyLoader(); // Hide loader if waiting for poison
        info.innerText = "Wait for both players to set their poison candies first!";
    }
}

function requestRematch() {
    showCandyLoader(); // Show loader for rematch request
    if (!room) {
        hideCandyLoader(); // Hide loader if no active game
        alert("No active game to rematch.");
        return;
    }

    if (isAIMode) {
        // For AI mode, just reset the room state directly
        db.ref(room).set({
            poison: { "1": -1, "2": -1 },
            turn: "1",
            selections: {},
            result: ""
        }).then(() => {
            console.log("AI game state reset for rematch.");
            playWithAI(); // Restart AI game
            rematchPopup.classList.add("hidden");
        }).catch(error => {
            console.error("Error resetting AI game state for rematch:", error);
            alert("Failed to restart AI game. Please try again.");
        }).finally(() => {
            hideCandyLoader(); // Hide loader after AI rematch attempt
        });
        return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
        hideCandyLoader(); // Hide loader if not logged in
        alert("You must be logged in to request a rematch.");
        return;
    }

    db.ref(`${room}/rematch/${player}`).set(true)
        .then(() => {
            info.innerText = "Rematch requested! Waiting for opponent...";
            // The rematch listener in startGame will handle starting the new round
        })
        .catch(error => {
            console.error("Error requesting rematch:", error);
            alert("Failed to request rematch. Please try again.");
        })
        .finally(() => {
            hideCandyLoader(); // Hide loader after rematch request attempt
        });
}

function startNewRound() {
    showCandyLoader(); // Show loader for starting new round
    db.ref(room).update({
        poison: { "1": -1, "2": -1 },
        turn: "1",
        selections: {},
        result: "",
        rematch: {} // Clear rematch requests
    })
    .then(() => {
        console.log("Game state reset for new round.");
        rematchPopup.classList.add("hidden");
        startGame(); // Re-initialize game UI and listeners
    })
    .catch(error => {
        console.error("Error resetting game state:", error);
        alert("Failed to start new round. Please try again.");
    })
    .finally(() => {
        hideCandyLoader(); // Hide loader after new round starts
    });
}

// Function to show the custom exit confirmation dialog
function showExitConfirmation() {
    customConfirm.classList.remove('hidden');
    // Set a custom message if needed, or use the default in HTML
    // confirmMessage.innerText = "Are you really sure you want to quit this amazing game?"; 
}

// Handler for when the user confirms exit
confirmOk.addEventListener('click', () => {
    customConfirm.classList.add('hidden'); // Hide the custom dialog
    exitGameConfirmed(); // Call the actual exit game logic
});

// Handler for when the user cancels exit
confirmCancel.addEventListener('click', () => {
    customConfirm.classList.add('hidden'); // Hide the custom dialog
    hideCandyLoader(); // Ensure loader is hidden if it was shown by showExitConfirmation
});


// Actual exit game logic, renamed to avoid conflict with `showExitConfirmation`
function exitGameConfirmed() {
    showCandyLoader(); // Show loader for exiting game

    if (!isAIMode && room) {
        // Multiplayer game cleanup
        db.ref(`${room}/players/${player}`).remove();
        db.ref(`${room}/avatars/${player}`).remove();
        db.ref(room).off(); // Detach all listeners from this room

        // Check if room becomes empty after player leaves
        db.ref(room).once('value', snapshot => {
            const roomData = snapshot.val();
            if (!roomData || (roomData.players && Object.keys(roomData.players).length === 0)) {
                // If no players left, delete the room
                db.ref(room).remove()
                    .then(() => console.log("Empty room deleted."))
                    .catch(error => console.error("Error deleting empty room:", error))
                    .finally(() => hideCandyLoader());
            } else if (roomData && roomData.players) {
                // If one player remains, declare the other player winner by forfeit
                const remainingPlayerKey = Object.keys(roomData.players)[0];
                if (remainingPlayerKey) {
                    db.ref(`${room}/players/${remainingPlayerKey}`).once("value").then(remainingPlayerSnap => {
                        const remainingPlayerName = remainingPlayerSnap.val() || `Player ${remainingPlayerKey}`;
                        db.ref(`${room}/result`).set(`${window.playerName} has left the game. ${remainingPlayerName} wins by forfeit!`);
                        db.ref(`${room}/turn`).set("end");
                    }).catch(error => {
                        console.error("Error fetching remaining player name for forfeit:", error);
                        db.ref(`${room}/result`).set(`${window.playerName} has left the game. The other player wins by forfeit!`);
                        db.ref(`${room}/turn`).set("end");
                    }).finally(() => hideCandyLoader());
                } else {
                    hideCandyLoader(); // If somehow no remaining player, still hide loader
                }
            } else {
                hideCandyLoader(); // If no roomData or players, just hide loader
            }
        });
    } else if (isAIMode && room) {
        // AI mode cleanup
        db.ref(room).off(); // Detach listeners
        db.ref(room).remove() // Delete AI specific room
            .then(() => console.log("AI game room deleted."))
            .catch(error => console.error("Error deleting AI room:", error))
            .finally(() => hideCandyLoader());
    } else {
        hideCandyLoader(); // If no room or not AI mode
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
    hideCandyLoader(); // Hide loader when game result is shown
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
// Changed this to call the function that shows the custom confirmation
window.showExitConfirmation = showExitConfirmation;
// The actual exit logic is now internal to main.js and called by the custom dialog
// window.exitGame = exitGame; // No longer expose this directly for the button