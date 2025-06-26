
// This is a mock in-memory user store for the prototype.
// In a real app, use a database like Firestore and hash passwords.
export interface UserEntry {
  id: string;
  name: string;
  userId: string; // This can be an email or a custom user ID
  email?: string; // Explicit email if userId is not an email
  password?: string; // Plain text for prototype
}
export const users: Record<string, UserEntry> = {};
