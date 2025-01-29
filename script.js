
    // index
document.addEventListener('DOMContentLoaded', function () {
    let user = JSON.parse(localStorage.getItem('loggedInUser'));
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    let container = document.getElementById('posts-container');
    let loginBtn = document.getElementById('login-btn');
    let signupBtn = document.getElementById('signup-btn');
    let logoutBtn = document.getElementById('logout-btn');
    let profileImg = document.querySelector('.profile-img');


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
    } else {
        loginBtn.style.display = "block";
        signupBtn.style.display = "block";
        logoutBtn.style.display = "none";
        profileImg.style.display = "none"; // Hide profile image
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

// Function to delete all posts
function deleteAllPosts() {
    // Remove posts from localStorage
    localStorage.removeItem('posts');

    // Clear the posts from the DOM
    let container = document.getElementById('posts-container');
    container.innerHTML = '<h2>Recent Posts</h2>'; // Reset posts container

    alert("All posts have been deleted.");
}




           

       // proflie
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

    function logout() {
        localStorage.removeItem('loggedInUser');
        localStorage.removeItem('profileImage'); // Clear the saved profile image as well
        alert("Logged out successfully!");
        window.location.href = 'index.html'; // Redirect to the index page
    }

    function toggleDropdown() {
        let menu = document.getElementById('profile-dropdown-menu');
        menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
    }



        // create posts

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

            // Display the profile image and dropdown only if the user is logged in
            const profileImg = document.querySelector('.profile-img');
            const profileDropdown = document.getElementById('profile-dropdown-menu');

            if (user) {
                profileImg.style.display = 'block';
            } else {
                profileImg.style.display = 'none';
            }
        });

        // Logout function
        function logout() {
            localStorage.removeItem('loggedInUser');
            alert("Logged out successfully!");
            window.location.href = 'index.html';
        }

        // Dropdown toggle function
        function toggleDropdown() {
            let menu = document.getElementById('profile-dropdown-menu');
            menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
        }