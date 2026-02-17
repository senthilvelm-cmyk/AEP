export const loginSelectors = {
  usernameInput:
    'input[name="username"], input[id="username"], input[type="email"]',
  passwordInput:
    'input[name="password"], input[id="password"], input[type="password"]',
  submitButton:
    'button[type="submit"], button:has-text("Login"), button:has-text("Sign in")'
} as const;
