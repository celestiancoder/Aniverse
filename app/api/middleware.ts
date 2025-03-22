export { auth as middleware } from "@/app/api/auth"

export const config = {
    runtime: 'nodejs', // Use Node.js runtime
    matcher: ['/((?!api/db|_next/static|_next/image|favicon.ico).*)'],
  };