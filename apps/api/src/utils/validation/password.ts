export const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  if (password.length < 8) errors.push("Must be at least 8 characters");
  if (!/[A-Z]/.test(password)) errors.push("Must contain uppercase letter");
  if (!/[a-z]/.test(password)) errors.push("Must contain lowercase letter");
  if (!/[0-9]/.test(password)) errors.push("Must contain a number");
  if (!/[!@#$%^&*]/.test(password)) errors.push("Must contain special character");
  return { valid: errors.length === 0, errors };
};
export const getPasswordStrength = (password: string): "weak" | "medium" | "strong" => {
  let score = 0;
  if (password.length >= 8) score++; if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[!@#$%^&*]/.test(password)) score++;
  return score >= 4 ? "strong" : score >= 2 ? "medium" : "weak";
};
