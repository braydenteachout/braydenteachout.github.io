// Initialize posts in localStorage if it doesn't exist
if (!localStorage.getItem('posts')) {
    localStorage.setItem('posts', JSON.stringify({
        room1: [],
        room2: [],
        room3: []
    }));
}






// index.js
document.addEventListener('DOMContentLoaded', function () {
    let user = JSON.parse(localStorage.getItem('loggedInUser'));

    // Redirect to login page if not logged in
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    // Check if the user is banned
    if (user.banned) {
        alert("Your account has been banned. Please contact support.");
        localStorage.removeItem('loggedInUser'); // Log the user out
        window.location.href = 'login.html';
        return;
    }

    // Check if the user is timed out
    if (user.timeoutEnd && new Date().getTime() < user.timeoutEnd) {
        let timeoutRemaining = Math.ceil((user.timeoutEnd - new Date().getTime()) / 60000); // Convert to minutes
        alert(`Your account is timed out. Please try again in ${timeoutRemaining} minutes.`);
        localStorage.removeItem('loggedInUser'); // Log the user out
        window.location.href = 'login.html';
        return;
    }

    // Rest of the code...
});

document.addEventListener('DOMContentLoaded', function () {
    let user = JSON.parse(localStorage.getItem('loggedInUser'));
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    let container = document.getElementById('posts-container');
    let loginBtn = document.getElementById('login-btn');
    let signupBtn = document.getElementById('signup-btn');
    let logoutBtn = document.getElementById('logout-btn');
    let profileImg = document.querySelector('.profile-img');
    let deleteAllBtn = document.getElementById('delete-all-btn');
    let adminPanelLink = document.getElementById('admin-panel-link');

    // Display posts in reverse order (newest at the top)
    posts.reverse().forEach(post => {
        let postElement = document.createElement('div');
        postElement.classList.add('post');

        // Add profile image and username
        postElement.innerHTML = `
            <div class="post-header">
                <img src="${localStorage.getItem('profileImage') || 'default-profile.jpg'}" alt="Profile" class="post-profile-img">
                <h3>${post.username}</h3>
            </div>
            <p>${post.content}</p>
        `;
        container.appendChild(postElement);
    });

    // Display login/signup buttons if not logged in, otherwise show logout and profile image
    if (user) {
        loginBtn.style.display = "none";
        signupBtn.style.display = "none";
        logoutBtn.style.display = "block";
        profileImg.style.display = "block"; // Show profile image

        // Show "Delete All Posts" button and "Admin Panel" link only for admins
        if (user.isAdmin) {
            deleteAllBtn.style.display = "block";
            adminPanelLink.style.display = "block";
        } else {
            deleteAllBtn.style.display = "none";
            adminPanelLink.style.display = "none";
        }
    } else {
        loginBtn.style.display = "block";
        signupBtn.style.display = "block";
        logoutBtn.style.display = "none";
        profileImg.style.display = "none"; // Hide profile image
        deleteAllBtn.style.display = "none"; // Hide "Delete All Posts" button
        adminPanelLink.style.display = "none"; // Hide "Admin Panel" link
    }
});

// Logout function
function logout() {
    localStorage.removeItem('loggedInUser');
    alert("Logged out successfully!");
    window.location.href = 'index.html'; // Redirect to the index page
}

// Toggle profile dropdown menu
function toggleDropdown() {
    let menu = document.getElementById('profile-dropdown-menu');
    menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
}

// Function to delete all posts (only for admins)
function deleteAllPosts() {
    // Remove posts from localStorage
    localStorage.removeItem('posts');

    // Clear the posts from the DOM
    let container = document.getElementById('posts-container');
    container.innerHTML = '<h2>Recent Posts</h2>'; // Reset posts container

    alert("All posts have been deleted.");
}

// profile.js
document.addEventListener('DOMContentLoaded', function () {
    let user = JSON.parse(localStorage.getItem('loggedInUser'));

    // If the user is not logged in, redirect to the login page
    if (!user) {
        window.location.href = 'login.html';
    }

    // Display the current profile image from localStorage
    let profileImg = document.getElementById('current-profile-img');
    let savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
        profileImg.src = savedImage;
    }

    // Display user information
    document.getElementById('username-display').textContent = user.username;
    document.getElementById('email-display').textContent = user.email;

    // Display the first letter of the password followed by ####
    let passwordDisplay = user.password.charAt(0) + "####";
    document.getElementById('password-display').textContent = passwordDisplay;

    // Handle the form submission to change the profile image
    document.getElementById('profile-image-form').addEventListener('submit', function(event) {
        event.preventDefault();
        let fileInput = document.getElementById('profile-image');
        let file = fileInput.files[0];
        if (file) {
            let reader = new FileReader();
            reader.onload = function(e) {
                // Save the new image to localStorage
                localStorage.setItem('profileImage', e.target.result);
                // Update the displayed profile image
                profileImg.src = e.target.result;
                alert("Profile image updated successfully!");
            };
            reader.readAsDataURL(file);
        }
    });

    // Handle the form submission to change the password
    document.getElementById('change-password-form').addEventListener('submit', function(event) {
        event.preventDefault();
        let currentPassword = document.getElementById('current-password').value;
        let newPassword = document.getElementById('new-password').value;
        let confirmPassword = document.getElementById('confirm-password').value;

        // Check if the current password matches the stored password
        if (currentPassword !== user.password) {
            alert("Current password is incorrect.");
            return;
        }

        // Check if the new password and confirm password match
        if (newPassword !== confirmPassword) {
            alert("New passwords do not match.");
            return;
        }

        // Update the password in localStorage
        user.password = newPassword;
        localStorage.setItem('loggedInUser', JSON.stringify(user));

        // Update the password in the users array (if applicable)
        let users = JSON.parse(localStorage.getItem('users')) || [];
        let userIndex = users.findIndex(u => u.email === user.email);
        if (userIndex !== -1) {
            users[userIndex].password = newPassword;
            localStorage.setItem('users', JSON.stringify(users));
        }

        // Update the password display
        let passwordDisplay = newPassword.charAt(0) + "####";
        document.getElementById('password-display').textContent = passwordDisplay;

        alert("Password updated successfully!");
    });
});

// createpost.js
document.addEventListener('DOMContentLoaded', function () {
    let user = JSON.parse(localStorage.getItem('loggedInUser'));

    // Redirect to login page if not logged in
    if (!user) {
        alert("You must be logged in to create a post.");
        window.location.href = 'login.html';
        return;
    }

    // Handle form submission
    const form = document.getElementById('post-form');
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        // Get the post content
        const postContent = document.getElementById('post-content').value.trim();

        if (postContent) {
            // Get existing posts from localStorage or initialize as an empty array
            const posts = JSON.parse(localStorage.getItem('posts')) || [];

            // Create a new post object
            const newPost = {
                username: user.username, // Logged-in user's username
                content: postContent,
                timestamp: new Date().toISOString() // Add timestamp for sorting or display
            };

            // Add the new post to the posts array
            posts.push(newPost);

            // Save the updated posts back to localStorage
            localStorage.setItem('posts', JSON.stringify(posts));

            alert("Post created successfully!");
            window.location.href = 'index.html'; // Redirect to the main page
        } else {
            alert("Post content cannot be empty.");
        }
    });
});





document.addEventListener('DOMContentLoaded', function () {
    let user = JSON.parse(localStorage.getItem('loggedInUser'));
    let posts = JSON.parse(localStorage.getItem('posts')) || { room1: [], room2: [], room3: [] }; // Separate posts for each room
    let container = document.getElementById('posts-container');
    let loginBtn = document.getElementById('login-btn');
    let signupBtn = document.getElementById('signup-btn');
    let logoutBtn = document.getElementById('logout-btn');
    let profileImg = document.querySelector('.profile-img');
    let deleteAllBtn = document.getElementById('delete-all-btn');
    let adminPanelLink = document.getElementById('admin-panel-link');
    let chatRoomLinks = document.querySelectorAll('.chat-room-link');

    // Display login/signup buttons if not logged in, otherwise show logout and profile image
    if (user) {
        loginBtn.style.display = "none";
        signupBtn.style.display = "none";
        logoutBtn.style.display = "block";
        profileImg.style.display = "block"; // Show profile image

        // Show "Delete All Posts" button and "Admin Panel" link only for admins
        if (user.isAdmin) {
            deleteAllBtn.style.display = "block";
            adminPanelLink.style.display = "block";
        } else {
            deleteAllBtn.style.display = "none";
            adminPanelLink.style.display = "none";
        }
    } else {
        loginBtn.style.display = "block";
        signupBtn.style.display = "block";
        logoutBtn.style.display = "none";
        profileImg.style.display = "none"; // Hide profile image
        deleteAllBtn.style.display = "none"; // Hide "Delete All Posts" button
        adminPanelLink.style.display = "none"; // Hide "Admin Panel" link
    }

    // Load posts for the default chat room (Room 1)
    loadPosts('room1');

    // Add event listeners to chat room links
    chatRoomLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();

            // Remove the "active" class from all links
            chatRoomLinks.forEach(link => link.classList.remove('active'));

            // Add the "active" class to the clicked link
            this.classList.add('active');

            // Load posts for the selected chat room
            let room = this.getAttribute('data-room');
            loadPosts(`room${room}`);
        });
    });
});

function loadPosts(room) {
    let posts = JSON.parse(localStorage.getItem('posts')) || { room1: [], room2: [], room3: [] };
    let container = document.getElementById('posts-container');

    // Clear the posts container
    container.innerHTML = '<h2>Recent Posts</h2>';

    // Display posts for the selected room
    if (posts[room]) {
        posts[room].reverse().forEach(post => {
            let postElement = document.createElement('div');
            postElement.classList.add('post');

            // Add profile image and username
            postElement.innerHTML = `
                <div class="post-header">
                    <img src="${localStorage.getItem('profileImage') || 'default-profile.jpg'}" alt="Profile" class="post-profile-img">
                    <h3>${post.username}</h3>
                </div>
                <p>${post.content}</p>
            `;
            container.appendChild(postElement);
        });
    } else {
        console.error(`No posts found for room: ${room}`);
    }
}
}

// Logout function
function logout() {
    localStorage.removeItem('loggedInUser');
    alert("Logged out successfully!");
    window.location.href = 'index.html'; // Redirect to the index page
}

// Toggle profile dropdown menu
function toggleDropdown() {
    let menu = document.getElementById('profile-dropdown-menu');
    menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
}

// Function to delete all posts (only for admins)
function deleteAllPosts() {
    let posts = JSON.parse(localStorage.getItem('posts')) || { room1: [], room2: [], room3: [] };
    let activeRoom = document.querySelector('.chat-room-link.active').getAttribute('data-room');

    // Clear posts for the active room
    posts[`room${activeRoom}`] = [];
    localStorage.setItem('posts', JSON.stringify(posts));

    // Reload the posts
    loadPosts(`room${activeRoom}`);
    alert("All posts have been deleted.");
}







document.addEventListener('DOMContentLoaded', function () {
    let user = JSON.parse(localStorage.getItem('loggedInUser'));

    // Redirect to login page if not logged in
    if (!user) {
        alert("You must be logged in to create a post.");
        window.location.href = 'login.html';
        return;
    }

    // Handle form submission
    const form = document.getElementById('post-form');
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        // Get the post content
        const postContent = document.getElementById('post-content').value.trim();

        if (postContent) {
            // Get existing posts from localStorage
            let posts = JSON.parse(localStorage.getItem('posts')) || { room1: [], room2: [], room3: [] };

            // Get the active chat room (default to room1 if not set)
            let activeRoom = localStorage.getItem('activeRoom') || 'room1';

            // Create a new post object
            const newPost = {
                username: user.username, // Logged-in user's username
                content: postContent,
                timestamp: new Date().toISOString() // Add timestamp for sorting or display
            };

            // Add the new post to the active room
            posts[activeRoom].push(newPost);

            // Save the updated posts back to localStorage
            localStorage.setItem('posts', JSON.stringify(posts));

            alert("Post created successfully!");
            window.location.href = 'index.html'; // Redirect to the main page
        } else {
            alert("Post content cannot be empty.");
        }
    });
});

// Add event listeners to chat room links
chatRoomLinks.forEach(link => {
    link.addEventListener('click', function (event) {
        event.preventDefault();

        // Remove the "active" class from all links
        chatRoomLinks.forEach(link => link.classList.remove('active'));

        // Add the "active" class to the clicked link
        this.classList.add('active');

        // Save the selected room to localStorage
        let room = this.getAttribute('data-room');
        localStorage.setItem('activeRoom', `room${room}`);

        // Load posts for the selected chat room
        loadPosts(`room${room}`);
    });
});

// Initialize posts in localStorage if it doesn't exist
if (!localStorage.getItem('posts')) {
    localStorage.setItem('posts', JSON.stringify({
        room1: [],
        room2: [],
        room3: []
    }));
}

// Set default active room if not set
if (!localStorage.getItem('activeRoom')) {
    localStorage.setItem('activeRoom', 'room1');
}

document.addEventListener('DOMContentLoaded', function () {
    let user = JSON.parse(localStorage.getItem('loggedInUser'));
    let posts = JSON.parse(localStorage.getItem('posts')) || { room1: [], room2: [], room3: [] };
    let container = document.getElementById('posts-container');
    let loginBtn = document.getElementById('login-btn');
    let signupBtn = document.getElementById('signup-btn');
    let logoutBtn = document.getElementById('logout-btn');
    let profileImg = document.querySelector('.profile-img');
    let deleteAllBtn = document.getElementById('delete-all-btn');
    let adminPanelLink = document.getElementById('admin-panel-link');
    let chatRoomLinks = document.querySelectorAll('.chat-room-link');

    // Display login/signup buttons if not logged in, otherwise show logout and profile image
    if (user) {
        loginBtn.style.display = "none";
        signupBtn.style.display = "none";
        logoutBtn.style.display = "block";
        profileImg.style.display = "block"; // Show profile image

        // Show "Delete All Posts" button and "Admin Panel" link only for admins
        if (user.isAdmin) {
            deleteAllBtn.style.display = "block";
            adminPanelLink.style.display = "block";
        } else {
            deleteAllBtn.style.display = "none";
            adminPanelLink.style.display = "none";
        }
    } else {
        loginBtn.style.display = "block";
        signupBtn.style.display = "block";
        logoutBtn.style.display = "none";
        profileImg.style.display = "none"; // Hide profile image
        deleteAllBtn.style.display = "none"; // Hide "Delete All Posts" button
        adminPanelLink.style.display = "none"; // Hide "Admin Panel" link
    }

    // Load posts for the active chat room
    let activeRoom = localStorage.getItem('activeRoom') || 'room1';
    loadPosts(activeRoom);

    // Add event listeners to chat room links
    chatRoomLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();

            // Remove the "active" class from all links
            chatRoomLinks.forEach(link => link.classList.remove('active'));

            // Add the "active" class to the clicked link
            this.classList.add('active');

            // Save the selected room to localStorage
            let room = this.getAttribute('data-room');
            localStorage.setItem('activeRoom', `room${room}`);

            // Load posts for the selected chat room
            loadPosts(`room${room}`);
        });
    });
});

function loadPosts(room) {
    let posts = JSON.parse(localStorage.getItem('posts')) || { room1: [], room2: [], room3: [] };
    let container = document.getElementById('posts-container');

    // Clear the posts container
    container.innerHTML = '<h2>Recent Posts</h2>';

    // Display posts for the selected room
    if (posts[room]) {
        posts[room].reverse().forEach(post => {
            let postElement = document.createElement('div');
            postElement.classList.add('post');

            // Add profile image and username
            postElement.innerHTML = `
                <div class="post-header">
                    <img src="${localStorage.getItem('profileImage') || 'default-profile.jpg'}" alt="Profile" class="post-profile-img">
                    <h3>${post.username}</h3>
                </div>
                <p>${post.content}</p>
            `;
            container.appendChild(postElement);
        });
    } else {
        console.error(`No posts found for room: ${room}`);
    }
}

// Logout function
function logout() {
    localStorage.removeItem('loggedInUser');
    alert("Logged out successfully!");
    window.location.href = 'index.html'; // Redirect to the index page
}

// Toggle profile dropdown menu
function toggleDropdown() {
    let menu = document.getElementById('profile-dropdown-menu');
    menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
}

// Function to delete all posts (only for admins)
function deleteAllPosts() {
    let posts = JSON.parse(localStorage.getItem('posts')) || { room1: [], room2: [], room3: [] };
    let activeRoom = localStorage.getItem('activeRoom') || 'room1';

    // Clear posts for the active room
    posts[activeRoom] = [];
    localStorage.setItem('posts', JSON.stringify(posts));

    // Reload the posts
    loadPosts(activeRoom);
    alert("All posts have been deleted.");
}
