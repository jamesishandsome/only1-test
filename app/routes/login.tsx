import { createFileRoute } from '@tanstack/react-router'
import { Button } from 'react-aria-components'
import { useQuery } from '@tanstack/react-query'
import { currentUser } from '../api'

export const Route = createFileRoute('/login')({
    component: () => {
        const { isPending, isError, data, error } = useQuery({
            queryKey: ['currentUser'],
            queryFn: async () => {
                return await currentUser()
            },
        })
        return (
            <Button
                className={
                    'group inline-block rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-[2px] hover:text-white focus:outline-none focus:ring active:text-opacity-75'
                }
                onPress={async () => {
                    if (data?.token) {
                        const { token } = data
                        console.log('token', token)
                    }
                }}
            >
                <span className="block rounded-full bg-white px-8 py-3 text-sm font-medium group-hover:bg-transparent">
                    Press me
                </span>
            </Button>
        )
    },
})
