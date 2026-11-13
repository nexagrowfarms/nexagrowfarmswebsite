/**
 * Re-export for backward compatibility. User model lives in lib/User.ts
 * so auth and register routes resolve it reliably in all build environments.
 */
export { default, type IUser } from '../lib/User';
