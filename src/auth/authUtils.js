// Advanced security utilities for authentication
// Note: This is still client-side authentication, which is not truly secure
// For real applications, use server-side authentication

// Hardcoded credentials with careful spacing and special characters
// Made extra sure there are no hidden characters or typos
const VALID_CREDENTIALS = {
  username: "RJShaheen38!",
  password: "%RLakeJ!92"
};

// Very simple verification with detailed logging
export const verifyCredentials = (username, password) => {
  if (!username || !password) {
    console.log("Empty username or password");
    return false;
  }
  
  // Log the comparison for debugging (will remove in production)
  console.log("Trying to log in with:", { 
    inputUsername: username,
    inputPassword: password,
    validUsername: VALID_CREDENTIALS.username,
    validPassword: VALID_CREDENTIALS.password,
    usernameMatches: username === VALID_CREDENTIALS.username,
    passwordMatches: password === VALID_CREDENTIALS.password
  });
  
  // Super simple equality check
  return username === VALID_CREDENTIALS.username && 
         password === VALID_CREDENTIALS.password;
};

// Create a secure session token
export const createSession = () => {
  try {
    // Simple session with timestamp
    const timestamp = Date.now();
    const sessionData = JSON.stringify({
      auth: true,
      exp: timestamp + (24 * 60 * 60 * 1000), // 24 hours expiration
      created: timestamp
    });
    
    // Base64 encode and store in local storage
    return btoa(sessionData);
  } catch (e) {
    console.error("Session creation failed", e);
    return null;
  }
};

// Verify if user has a valid session
export const checkSession = () => {
  try {
    const sessionToken = localStorage.getItem('adminSession');
    if (!sessionToken) return false;
    
    const sessionData = JSON.parse(atob(sessionToken));
    if (!sessionData.auth) return false;
    
    // Check expiration
    if (sessionData.exp < Date.now()) {
      localStorage.removeItem('adminSession');
      return false;
    }
    
    return true;
  } catch (e) {
    console.error("Session verification failed", e);
    localStorage.removeItem('adminSession');
    return false;
  }
};

// Logout function
export const logout = () => {
  localStorage.removeItem('adminSession');
}; 