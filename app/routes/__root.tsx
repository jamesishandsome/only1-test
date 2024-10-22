// app/routes/__root.tsx
import { createRootRoute, redirect } from '@tanstack/react-router'
import { Outlet, ScrollRestoration } from '@tanstack/react-router'
import { Body, Head, Html, Meta, Scripts } from '@tanstack/start'
import * as React from 'react'
import appCss from '../styles/main.css?url'
import { currentUser } from '../api'
import * as localforage from 'localforage'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export const Route = createRootRoute({
    meta: () => [
        {
            charSet: 'utf-8',
        },
        {
            name: 'viewport',
            content: 'width=device-width, initial-scale=1',
        },
        {
            title: 'Only1 Test',
        },
    ],
    links: () => [
        {
            rel: 'stylesheet',
            href: appCss,
        },
    ],
    component: RootComponent,
    notFoundComponent: () => {
        return <p>Post not found!</p>
    },
})

const queryClient = new QueryClient()

function RootComponent() {
    return (
        <QueryClientProvider client={queryClient}>
            <RootDocument>
                <Outlet />
            </RootDocument>
        </QueryClientProvider>
    )
}

function RootDocument({ children }: { children: React.ReactNode }) {
    return (
        <Html>
            <Head>
                <Meta />
            </Head>
            <Body>
                {children}
                <ScrollRestoration />
                <Scripts />
            </Body>
        </Html>
    )
}
