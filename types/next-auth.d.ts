import type { DefaultSession } from 'next-auth';

type UserRole = 'member' | 'admin';
type UserStatus = 'pending_kyc' | 'active' | 'suspended' | 'inactive';

declare module 'next-auth' {
  interface User {
    role: UserRole;
    status: UserStatus;
  }
  interface Session {
    user: {
      id: string;
      role: UserRole;
      status: UserStatus;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: UserRole;
    status: UserStatus;
  }
}
