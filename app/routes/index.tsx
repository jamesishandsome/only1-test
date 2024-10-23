'use client'
import {
    createFileRoute,
    redirect,
    useNavigate,
    useRouter,
} from '@tanstack/react-router'
import { createServerFn } from '@tanstack/start'
import { getCurrentUser } from '@/api'
import { verifyUser } from '@/utils'
import localforage from 'localforage'
import { useLayoutEffect } from 'react'
import { tokenAtom } from '@/stores'
import { useAtom } from 'jotai'
import { useQuery } from '@tanstack/react-query'
import HomePage from '@/components/home'
import { useQueryClient } from '@tanstack/react-query'

export const Route = createFileRoute('/')({
    component: () => {
        return <Home />
    },
})

function Home() {
    const navigate = useNavigate()
    const [token, setToken] = useAtom(tokenAtom)
    if (!token) {
        navigate({ to: '/login' })
    } else {
        const { isPending, isError, data, error } = useQuery({
            queryKey: ['currentUser'],
            queryFn: async () => {
                return await getCurrentUser(token)
            },
        })
        // if (data.payload.verfied === false) {
        //     const navigate = useNavigate()
        //     navigate({ to: '/login' })
        // }
        if (data && data.payload && !data.payload.verified) {
            alert('Please verify your account first')
            navigate({ to: '/login' })
        }
        return data ? <HomePage /> : null
    }
}
