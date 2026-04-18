import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db";
// import { genericOAuth } from "better-auth/plugins";

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60, // Cache duration in seconds
        },
    },
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            prompt: "select_account",
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    // ... other config options
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "USER",
                input: false, // Prevent users from setting their own role during sign up
            },
        },
    },
    plugins: [
        // genericOAuth({
        //     config: [
        //         {
        //             providerId: "zalo",
        //             clientId: process.env.ZALO_APP_ID as string,
        //             clientSecret: process.env.ZALO_APP_SECRET as string,
        //             authorizationUrl: "https://oauth.zaloapp.com/v4/permission",
        //             tokenUrl: "https://oauth.zaloapp.com/v4/access_token",

        //             // Zalo requires app_id instead of client_id in the authorize URL
        //             authorizationUrlParams: {
        //                 app_id: process.env.ZALO_APP_ID as string,
        //             },

        //             pkce: true, // Zalo v4 uses PKCE

        //             // Custom token exchange for Zalo
        //             getToken: async ({ code, codeVerifier }) => {
        //                 const response = await fetch("https://oauth.zaloapp.com/v4/access_token", {
        //                     method: "POST",
        //                     headers: {
        //                         "Content-Type": "application/x-www-form-urlencoded",
        //                         "secret_key": process.env.ZALO_APP_SECRET as string
        //                     },
        //                     body: new URLSearchParams({
        //                         code: code,
        //                         app_id: process.env.ZALO_APP_ID as string,
        //                         grant_type: "authorization_code",
        //                         code_verifier: codeVerifier!
        //                     }).toString()
        //                 });
        //                 const data = await response.json();
        //                 console.log("getToken" + JSON.stringify(data))
        //                 return {
        //                     accessToken: data.access_token,
        //                     refreshToken: data.refresh_token,
        //                     accessTokenExpiresAt: new Date(Date.now() + parseInt(data.expires_in)), // 10 minus
        //                 } as any;
        //             },

        //             // Custom user info fetch for Zalo
        //             getUserInfo: async (tokens) => {
        //                 console.log(tokens)
        //                 const response = await fetch("https://graph.zalo.me/v2.0/me?fields=id,name,picture", {
        //                     method: "GET",
        //                     headers: {
        //                         "access_token": tokens.accessToken!
        //                     }
        //                 });
        //                 const data = await response.json();
        //                 console.log("getUserInfo" + JSON.stringify(data))
        //                 return {
        //                     id: data.id,
        //                     name: data.name,
        //                     image: data.picture?.data?.url || null,
        //                     email: `${data.id}@zalo.me`, // Fallback email since Zalo API doesn't provide it by default
        //                     emailVerified: true
        //                 } as any;
        //             }
        //         }
        //     ]
        // })
    ],
    advanced: {
        cookiePrefix: "kim-coffee"
    }
});