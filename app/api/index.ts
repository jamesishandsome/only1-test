import { createServerFn } from '@tanstack/start'
import { setResponseStatus } from 'vinxi/http'
import { query } from '../db'
import * as crypto from 'node:crypto'
import { signToken, verifyUser } from '../utils'

export const getServerTime = createServerFn('GET', async () => {
    setResponseStatus(201)
    return new Date().toISOString()
})

export const getCurrentUser = createServerFn('GET', async (token: string) => {
    return await verifyUser(token)
})

export const login = createServerFn(
    'POST',
    async (formData: { username: string; password: string }) => {
        try {
            const { username, password } = formData
            // hash password and compare to db
            // if valid, return jwt token
            const hash = crypto
                .createHash('sha256')
                .update(password)
                .digest('hex')
            console.log(hash)
            const res = await query(
                'SELECT * FROM users WHERE username = $1 AND password = $2',
                [username, hash]
            )

            // if password exists in db, return jwt token
            // else return error
            if (res.rows.length === 0) {
                return { error: 'Invalid username or password' }
            } else if (res.rows.length > 1) {
                return { error: 'Multiple users with same username' }
            }
            const userid = res.rows[0].id
            if (!res.rows[0].verified) {
                //     check if there is any invitation under the user
                const invitationRes = await query(
                    'SELECT * FROM invitations WHERE to_user = $1',
                    [userid]
                )
                console.log(invitationRes.rows)
                if (invitationRes.rows.length === 0) {
                    return { token: await signToken(username, userid, false) }
                } else if (invitationRes.rows.length > 0) {
                    console.log(signToken(username, userid, true))
                    return { token: await signToken(username, userid, true) }
                }
            }
            return {
                token: await signToken(username, userid, res.rows[0].verified),
            }
        } catch (err) {
            console.error(err)
            setResponseStatus(500)
            return { error: 'An error occurred' }
        }
    }
)

export const sendInvitation = createServerFn(
    'POST',
    async (formData: {
        username: string
        permissions: {
            writePost: boolean
            readPost: boolean
            writeMessage: boolean
            readMessage: boolean
            writeProfile: boolean
            readProfile: boolean
        }
        token: string
    }) => {
        try {
            const { username, permissions } = formData
            const { payload } = await verifyUser(formData.token)
            if (payload?.userid) {
                const sender = payload.userid
                const receiverRes = await query(
                    'SELECT id FROM users WHERE username = $1',
                    [username]
                )
                if (receiverRes.rows.length === 0) {
                    return { error: 'User not found' }
                }
                const receiver = receiverRes.rows[0].id
                await query(
                    'INSERT INTO invitations (from_user, to_user, permissions,status) VALUES ($1, $2, $3, $4)',
                    [sender, receiver, permissions, 'pending']
                )
                return { status: 'success' }
            }
        } catch (err) {
            console.error(err)
            setResponseStatus(500)
            return { error: 'An error occurred' }
        }
    }
)

export const getReceivedInvitations = createServerFn(
    'GET',
    async (data: { token: string; page: number }) => {
        try {
            const { payload } = await verifyUser(data.token)
            if (payload?.userid) {
                const res = await query(
                    `SELECT invitations.id, invitations.from_user,invitations.to_user,invitations.permissions, invitations.status,users.username FROM invitations left join users on users.id = invitations.from_user WHERE to_user = $1 LIMIT 10 OFFSET $2`,
                    [payload.userid, (data.page - 1) * 10]
                )
                return res.rows
            }
        } catch (err) {
            console.error(err)
            setResponseStatus(500)
            return { error: 'An error occurred' }
        }
    }
)

export const getSentInvitations = createServerFn(
    'GET',
    async (data: { token: string; page: number }) => {
        try {
            const { payload } = await verifyUser(data.token)
            if (payload?.userid) {
                const res = await query(
                    // join user to get username
                    `SELECT invitations.id, invitations.from_user,invitations.to_user,invitations.permissions, invitations.status,users.username FROM invitations Left JOIN users ON users.id = invitations.to_user WHERE from_user = $1 LIMIT 10 OFFSET $2`,
                    [payload.userid, (data.page - 1) * 10]
                )
                return res.rows
            }
        } catch (err) {
            console.error(err)
            setResponseStatus(500)
            return { error: 'An error occurred' }
        }
    }
)

export const changeInvitationPermission = createServerFn(
    'POST',
    async (data: {
        token: string
        invitationId: number
        permissions: {
            writePost: boolean
            readPost: boolean
            writeMessage: boolean
            readMessage: boolean
            writeProfile: boolean
            readProfile: boolean
        }
    }) => {
        try {
            const { payload } = await verifyUser(data.token)
            if (payload?.userid) {
                const res = await query(
                    'UPDATE invitations SET permissions = $1 WHERE id = $2 and from_user = $3',
                    [data.permissions, data.invitationId, payload.userid]
                )
                console.log(res)
                return { status: 'success' }
            }
        } catch (err) {
            console.error(err)
            setResponseStatus(500)
            return { error: 'An error occurred' }
        }
    }
)

export const acceptInvitation = createServerFn(
    'POST',
    async (data: { token: string; invitationId: number }) => {
        try {
            const { payload } = await verifyUser(data.token)
            if (payload?.userid) {
                const res = await query(
                    'UPDATE invitations SET status = $1 WHERE id = $2 AND to_user = $3',
                    ['accepted', data.invitationId, payload.userid]
                )
                return { status: 'success' }
            }
        } catch (err) {
            console.error(err)
            setResponseStatus(500)
            return { error: 'An error occurred' }
        }
    }
)

export const rejectInvitation = createServerFn(
    'POST',
    async (data: { token: string; invitationId: number }) => {
        try {
            const { payload } = await verifyUser(data.token)
            if (payload?.userid) {
                const res = await query(
                    'UPDATE invitations SET status = $1 WHERE id = $2 AND to_user = $3',
                    ['rejected', data.invitationId, payload.userid]
                )
                return { status: 'success' }
            }
        } catch (err) {
            console.error(err)
            setResponseStatus(500)
            return { error: 'An error occurred' }
        }
    }
)

export const deleteInvitation = createServerFn(
    'POST',
    async (data: { token: string; invitationId: number }) => {
        try {
            const { payload } = await verifyUser(data.token)
            if (payload?.userid) {
                const res = await query(
                    'DELETE FROM invitations WHERE id = $1 AND from_user = $2',
                    [data.invitationId, payload.userid]
                )
                console.log(res)
                return { status: 'success' }
            }
        } catch (err) {
            console.error(err)
            setResponseStatus(500)
            return { error: 'An error occurred' }
        }
    }
)
