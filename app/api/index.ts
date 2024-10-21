import { createServerFn } from '@tanstack/start'
import { setResponseStatus } from 'vinxi/http'

export const getServerTime = createServerFn('GET', async () => {
    setResponseStatus(201)
    return new Date().toISOString()
})
