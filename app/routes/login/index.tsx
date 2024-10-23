import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { Button } from 'react-aria-components'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { TextField, Label, Input, Form, Checkbox } from 'react-aria-components'
import { login } from '@/api'
import { tokenAtom } from '@/stores'
import { useAtom } from 'jotai'

export const Route = createFileRoute('/login/')({
    component: () => {
        return <LoginPage />
    },
})

const LoginPage = () => {
    const navigate = useNavigate()
    const [token, setToken] = useAtom(tokenAtom)
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setToken('')
        const data = new FormData(e.currentTarget)
        const username = data.get('username') as string
        const password = data.get('password') as string
        if (username && password) {
            const { token: tokenValue } = await login({ username, password })
            if (tokenValue) {
                setToken(tokenValue)
                await navigate({ to: '/' })
            } else alert('Invalid username or password')
        } else alert('Please fill in the form')
    }
    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <a
                    href="#"
                    className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
                >
                    Only1 Test
                </a>
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Sign in to your account
                        </h1>
                        <Form
                            onSubmit={handleSubmit}
                            className="space-y-4 md:space-y-6"
                        >
                            <TextField type="username">
                                <Label
                                    htmlFor="username"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Your username
                                </Label>
                                <Input
                                    type="username"
                                    name="username"
                                    id="username"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="username"
                                />
                            </TextField>
                            <TextField type="password">
                                <Label
                                    htmlFor="password"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Password
                                </Label>
                                <Input
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="••••••••"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                />
                            </TextField>
                            <div className="flex items-center justify-between">
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        alert('not functional yet')
                                    }}
                                    className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                                >
                                    Forgot password?
                                </a>
                            </div>
                            <button
                                type="submit"
                                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                            >
                                Sign in
                            </button>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Don’t have an account yet?{' '}
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        alert('not functional yet')
                                    }}
                                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                                >
                                    Sign up
                                </a>
                            </p>
                        </Form>
                    </div>
                </div>
            </div>
        </section>
    )
}
