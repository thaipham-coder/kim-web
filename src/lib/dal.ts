import "server-only"

import { cache } from "react"
import { headers } from "next/headers"
import { auth } from "./auth"
import { redirect } from "next/navigation"

export const verifySession = cache(async () => {
    const session = await auth.api.getSession({
        headers: await headers() // you need to pass the headers object.
    })

    if (!session?.user.id) {
        redirect('/login')
    }

    return session
})

export const getUser = cache(async () => {
    const session = await verifySession()
    if (!session) return null

    return session.user
})

export const getSession = cache(async () => {
    const session = await verifySession()

    return session.session
})