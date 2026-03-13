import { genericOAuthClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: process.env.BETTER_AUTH_URL, // the base url of your auth server
    plugins: [
        // genericOAuthClient(),
    ]
})

export const { signIn, signUp, signOut, useSession } = authClient;