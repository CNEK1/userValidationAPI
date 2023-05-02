# User Validation API (Development Version)
User Validation API is a web application backend built with Node.js that provides various user validation endpoints. This project is currently in development and some features may be underdeveloped or incomplete.

# Getting Started
To get started with User Validation API, you will need to have Node.js and npm installed on your computer. Once you have these dependencies, follow the steps below to install and run the project:

Clone this repository: git clone https://github.com/CNEK1/user-validation-api.git
Change into the project directory: cd user-validation-api
Install dependencies: npm install
Start the development server: npm start
# Features
## User Registration
Users can register for an account on the application using the /registerByUser endpoint. The endpoint requires a UserRegisterDto object in the request body for validation. Once the user is registered, they can log in to access the application's features.

## Admin Registration
Admins can register for an account on the application using the /registerByAdmin endpoint. The endpoint requires a UserRegisterDto object in the request body for validation. Once the admin is registered, they can log in to access the application's features.

## User Login
Users can log in to the application using the /login endpoint. The endpoint requires a UserLoginDto object in the request body for validation. Once the user is authenticated, they can access the protected endpoints.

## User Information
Authenticated users can access their own information using the /info endpoint. The endpoint requires a GuardMiddleware for authentication.

## User Logout
Authenticated users can log out of the application using the /logout endpoint. The endpoint does not require any middleware.

## User Management
Admins can manage users in the application using various endpoints, including:
<ol>
<li>/: Get all users in the system</li>
<li>/delete/:id: Delete a user by ID</li>
<li>/update/:id: Update a user by ID. The endpoint requires a UserUpdateDto object in the request body for validation.</li>
<li>/:id: Get a user by ID</li>
<li>/detail/:id: Get detailed information about a user by ID</li>
</ol>
All endpoints that modify the user data require appropriate middleware for validation and authentication.

# Contributing
If you would like to contribute to User Validation API, please feel free to fork the repository and submit a pull request. We welcome contributions of all kinds, including bug fixes, new features, and documentation improvements.

# Connected Repositories
Study Hub is also connected to another repository on GitHub. You can find this repository at the [following link](https://github.com/CNEK1/study-hub). This repository contains the backend code for the Study Hub application.

# License
This project is licensed under the MIT License - see the LICENSE file for details.
