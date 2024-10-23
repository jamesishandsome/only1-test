'use client'

import { useCallback, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Check, Mail, UserPlus, X, Trash2 } from 'lucide-react'
import { Form } from 'react-aria-components'
import {
    acceptInvitation,
    changeInvitationPermission,
    deleteInvitation,
    getReceivedInvitations,
    getSentInvitations,
    rejectInvitation,
    sendInvitation,
} from '@/api'
import { tokenAtom } from '@/stores'
import { useAtom } from 'jotai'
import { useQuery } from '@tanstack/react-query'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Switch } from '@/components/ui/switch'
import { useNavigate } from '@tanstack/react-router'

// Custom hook for infinite scrolling
const useInfiniteScroll = (callback: () => void) => {
    const observer = useRef<IntersectionObserver | null>(null)

    const lastElementRef = useCallback(
        (node: Element | null) => {
            if (observer.current) observer.current.disconnect()
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    callback()
                }
            })
            if (node) observer.current.observe(node)
        },
        [callback]
    )

    return lastElementRef
}

// Simulated API call to fetch more invitations
const fetchMoreInvitations = (types: string, page: number, token: string) => {
    return new Promise((resolve) => {
        setTimeout(async () => {
            if (types === 'sent') {
                const newInvitations = await getSentInvitations({
                    token: token,
                    page: page,
                })
                resolve(newInvitations)
            }
            if (types === 'received') {
                const newInvitations = await getReceivedInvitations({
                    token: token,
                    page: page,
                })
                resolve(newInvitations)
            }
        }, 500)
    })
}

const HomePage = () => {
    const navigate = useNavigate()
    const [inviteEmail, setInviteEmail] = useState('')
    const [token] = useAtom(tokenAtom)
    const [selectedPermissions, setSelectedPermissions] = useState({
        writePost: false,
        readPost: false,
        writeMessage: false,
        readMessage: false,
        writeProfile: false,
        readProfile: false,
    })

    const [sentInvitations, setSentInvitations] = useState<
        {
            id: number
            username: string
            status: string
            permissions: {
                writePost: boolean
                readPost: boolean
                writeMessage: boolean
                readMessage: boolean
                writeProfile: boolean
                readProfile: boolean
            }
        }[]
    >([])
    const [receivedInvitations, setReceivedInvitations] = useState<
        {
            id: number
            username: string
            status: string
            permissions: {
                writePost: boolean
                readPost: boolean
                writeMessage: boolean
                readMessage: boolean
                writeProfile: boolean
                readProfile: boolean
            }
        }[]
    >([])
    const [sentPage, setSentPage] = useState(1)
    const [receivedPage, setReceivedPage] = useState(1)
    const [loadingSent, setLoadingSent] = useState(false)
    const [loadingReceived, setLoadingReceived] = useState(false)
    const [sentFinished, setSentFinished] = useState(false)
    const [receivedFinished, setReceivedFinished] = useState(false)

    const loadMoreSent = useCallback(() => {
        if (loadingSent) return
        if (sentFinished) return
        setLoadingSent(true)
        fetchMoreInvitations('sent', sentPage, token).then(
            (
                newInvitations: {
                    id: number
                    username: string
                    status: string
                    permissions: {
                        writePost: boolean
                        readPost: boolean
                        writeMessage: boolean
                        readMessage: boolean
                        writeProfile: boolean
                        readProfile: boolean
                    }
                }[]
            ) => {
                if (newInvitations.length === 0) {
                    setSentFinished(true)
                    setLoadingSent(true)
                    return
                }
                setSentInvitations((prev) => [...prev, ...newInvitations])
                setSentPage((prev) => prev + 1)
                setLoadingSent(false)
            }
        )
    }, [sentPage, loadingSent])

    const loadMoreReceived = useCallback(() => {
        if (loadingReceived) return
        if (receivedFinished) return
        setLoadingReceived(true)
        fetchMoreInvitations('received', receivedPage, token).then(
            (
                newInvitations: {
                    id: number
                    username: string
                    status: string
                    permissions: {
                        writePost: boolean
                        readPost: boolean
                        writeMessage: boolean
                        readMessage: boolean
                        writeProfile: boolean
                        readProfile: boolean
                    }
                }[]
            ) => {
                if (newInvitations.length === 0) {
                    setReceivedFinished(true)
                    setLoadingReceived(true)
                    return
                }
                setReceivedInvitations((prev) => [...prev, ...newInvitations])
                setReceivedPage((prev) => prev + 1)
                setLoadingReceived(false)
            }
        )
    }, [receivedPage, loadingReceived])

    const lastSentRef = useInfiniteScroll(loadMoreSent)
    const lastReceivedRef = useInfiniteScroll(loadMoreReceived)

    const currentUsers = [
        {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            permissions: ['View Account', 'Edit Profile'],
        },
        {
            id: 2,
            name: 'Jane Smith',
            email: 'jane@example.com',
            permissions: ['View Account', 'Manage Payments'],
        },
    ]

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log(
            'Inviting:',
            inviteEmail,
            'with permissions:',
            selectedPermissions
        )
        // Send invitation to API
        await sendInvitation({
            username: inviteEmail,
            permissions: selectedPermissions,
            token: token,
        })
        setInviteEmail('')
        setSelectedPermissions({
            writePost: false,
            readPost: false,
            writeMessage: false,
            readMessage: false,
            writeProfile: false,
            readProfile: false,
        })
    }

    const handlePermissionChange = (permission: string) => {
        setSelectedPermissions((prev) => ({
            ...prev,
            [permission]: !prev[permission],
        }))
    }

    return (
        <div className="container mx-auto p-4 max-w-6xl">
            <h1 className="text-2xl font-bold mb-4">Account Management</h1>
            <Tabs defaultValue="invite" className="w-full">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
                    <TabsTrigger value="invite">Invite Managers</TabsTrigger>
                    <TabsTrigger
                        value="sent"
                        onFocus={() => {
                            if (sentInvitations.length === 0) {
                                loadMoreSent()
                            }
                        }}
                    >
                        Sent Invitations
                    </TabsTrigger>
                    <TabsTrigger
                        value="received"
                        onFocus={() => {
                            if (receivedInvitations.length === 0) {
                                loadMoreReceived()
                            }
                        }}
                    >
                        Received Invitations
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="invite">
                    <Card>
                        <CardHeader>
                            <CardTitle>Invite Manager</CardTitle>
                            <CardDescription>
                                Invite someone to help manage your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form onSubmit={handleInvite}>
                                <div className="grid w-full items-center gap-4">
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="username">
                                            Username
                                        </Label>
                                        <Input
                                            id="username"
                                            placeholder="Enter username"
                                            type="username"
                                            value={inviteEmail}
                                            onChange={(e) =>
                                                setInviteEmail(e.target.value)
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label>Permissions</Label>
                                        <div className="flex flex-wrap gap-4">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="writePost"
                                                    checked={
                                                        selectedPermissions.writePost
                                                    }
                                                    onCheckedChange={() => {
                                                        if (
                                                            !selectedPermissions.writePost &&
                                                            !selectedPermissions.readPost
                                                        ) {
                                                            handlePermissionChange(
                                                                'writePost'
                                                            )
                                                            handlePermissionChange(
                                                                'readPost'
                                                            )
                                                        } else {
                                                            handlePermissionChange(
                                                                'writePost'
                                                            )
                                                        }
                                                    }}
                                                />
                                                <label
                                                    htmlFor="writePost"
                                                    className="text-sm whitespace-nowrap"
                                                >
                                                    Write Post
                                                </label>
                                            </div>
                                            <div className="flex flex-wrap gap-4">
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id="readPost"
                                                        checked={
                                                            selectedPermissions.readPost
                                                        }
                                                        onCheckedChange={() => {
                                                            //     if write is true and read is true, set both to false
                                                            if (
                                                                selectedPermissions.writePost &&
                                                                selectedPermissions.readPost
                                                            ) {
                                                                handlePermissionChange(
                                                                    'writePost'
                                                                )
                                                                handlePermissionChange(
                                                                    'readPost'
                                                                )
                                                            } else {
                                                                handlePermissionChange(
                                                                    'readPost'
                                                                )
                                                            }
                                                        }}
                                                    />
                                                    <label
                                                        htmlFor="readPost"
                                                        className="text-sm whitespace-nowrap"
                                                    >
                                                        Read Post
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-4">
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id="writeMessage"
                                                        checked={
                                                            selectedPermissions.writeMessage
                                                        }
                                                        onCheckedChange={() => {
                                                            if (
                                                                !selectedPermissions.writeMessage &&
                                                                !selectedPermissions.readMessage
                                                            ) {
                                                                handlePermissionChange(
                                                                    'writeMessage'
                                                                )
                                                                handlePermissionChange(
                                                                    'readMessage'
                                                                )
                                                            } else {
                                                                handlePermissionChange(
                                                                    'writeMessage'
                                                                )
                                                            }
                                                        }}
                                                    />
                                                    <label
                                                        htmlFor="writeMessage"
                                                        className="text-sm whitespace-nowrap"
                                                    >
                                                        Write Message
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-4">
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id="readMessage"
                                                        checked={
                                                            selectedPermissions.readMessage
                                                        }
                                                        onCheckedChange={() => {
                                                            if (
                                                                selectedPermissions.writeMessage &&
                                                                selectedPermissions.readMessage
                                                            ) {
                                                                handlePermissionChange(
                                                                    'writeMessage'
                                                                )
                                                                handlePermissionChange(
                                                                    'readMessage'
                                                                )
                                                            } else {
                                                                handlePermissionChange(
                                                                    'readMessage'
                                                                )
                                                            }
                                                        }}
                                                    />
                                                    <label
                                                        htmlFor="readMessage"
                                                        className="text-sm whitespace-nowrap"
                                                    >
                                                        Read Message
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-4">
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id="writeProfile"
                                                        checked={
                                                            selectedPermissions.writeProfile
                                                        }
                                                        onCheckedChange={() => {
                                                            if (
                                                                !selectedPermissions.writeProfile &&
                                                                !selectedPermissions.readProfile
                                                            ) {
                                                                handlePermissionChange(
                                                                    'writeProfile'
                                                                )
                                                                handlePermissionChange(
                                                                    'readProfile'
                                                                )
                                                            } else {
                                                                handlePermissionChange(
                                                                    'writeProfile'
                                                                )
                                                            }
                                                        }}
                                                    />
                                                    <label
                                                        htmlFor="writeProfile"
                                                        className="text-sm whitespace-nowrap"
                                                    >
                                                        Write Profile
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-4">
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id="readProfile"
                                                        checked={
                                                            selectedPermissions.readProfile
                                                        }
                                                        onCheckedChange={() => {
                                                            if (
                                                                selectedPermissions.writeProfile &&
                                                                selectedPermissions.readProfile
                                                            ) {
                                                                handlePermissionChange(
                                                                    'writeProfile'
                                                                )
                                                                handlePermissionChange(
                                                                    'readProfile'
                                                                )
                                                            } else {
                                                                handlePermissionChange(
                                                                    'readProfile'
                                                                )
                                                            }
                                                        }}
                                                    />
                                                    <label
                                                        htmlFor="readProfile"
                                                        className="text-sm whitespace-nowrap"
                                                    >
                                                        Read Profile
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        </CardContent>
                        <CardFooter>
                            <Button
                                type="submit"
                                className={
                                    'text-white bg-primary-600 hover:bg-primary-700'
                                }
                                onClick={handleInvite}
                            >
                                Send Invitation
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="sent">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sent Invitations</CardTitle>
                            <CardDescription>
                                Manage invitations you've sent to others
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {sentInvitations.map((invite, index) => {
                                    return (
                                        <Collapsible
                                            key={invite.id}
                                            className="mb-4 border rounded-lg"
                                            ref={
                                                index ===
                                                sentInvitations.length - 1
                                                    ? lastSentRef
                                                    : null
                                            }
                                        >
                                            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-gray-100">
                                                <div className="flex items-center space-x-4">
                                                    <div>
                                                        <p className="font-medium">
                                                            {invite.username}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Badge
                                                        variant={
                                                            invite.status ===
                                                            'pending'
                                                                ? 'secondary'
                                                                : 'default'
                                                        }
                                                    >
                                                        {invite.status}
                                                    </Badge>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={async () => {
                                                            await deleteInvitation(
                                                                {
                                                                    token,
                                                                    invitationId:
                                                                        invite.id,
                                                                }
                                                            )
                                                            alert(
                                                                'Invitation deleted'
                                                            )
                                                            setSentInvitations(
                                                                sentInvitations.filter(
                                                                    (item) =>
                                                                        item.id !==
                                                                        invite.id
                                                                )
                                                            )
                                                        }}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent className="p-4 border-t">
                                                <h4 className="font-semibold mb-2">
                                                    Permissions
                                                </h4>
                                                {Object.keys(
                                                    invite.permissions
                                                ).map((permission) => (
                                                    <div
                                                        key={permission}
                                                        className="flex items-center justify-between py-2"
                                                    >
                                                        <div>
                                                            <p className="font-medium">
                                                                {permission}
                                                            </p>
                                                        </div>
                                                        <Switch
                                                            checked={
                                                                invite
                                                                    .permissions[
                                                                    permission
                                                                ]
                                                            }
                                                            onCheckedChange={async (
                                                                e
                                                            ) => {
                                                                // this is true or false
                                                                setSentInvitations(
                                                                    sentInvitations.map(
                                                                        (
                                                                            item
                                                                        ) => {
                                                                            if (
                                                                                item.id ===
                                                                                invite.id
                                                                            ) {
                                                                                return {
                                                                                    ...item,
                                                                                    permissions:
                                                                                        {
                                                                                            ...item.permissions,
                                                                                            [permission]:
                                                                                                e,
                                                                                        },
                                                                                }
                                                                            }
                                                                            return item
                                                                        }
                                                                    )
                                                                )
                                                                const newPermission =
                                                                    {
                                                                        ...invite.permissions,
                                                                        [permission]:
                                                                            e,
                                                                    }
                                                                await changeInvitationPermission(
                                                                    {
                                                                        token,
                                                                        invitationId:
                                                                            invite.id,
                                                                        permissions:
                                                                            newPermission,
                                                                    }
                                                                )
                                                                console.log(e)
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                            </CollapsibleContent>
                                        </Collapsible>
                                    )
                                })}
                                {loadingSent && !sentFinished && (
                                    <div className="text-center py-4">
                                        Loading more...
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="received">
                    <Card>
                        <CardHeader>
                            <CardTitle>Received Invitations</CardTitle>
                            <CardDescription>
                                Manage invitations you've received from others
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {receivedInvitations.map((invite, index) => (
                                    <Collapsible
                                        key={invite.id}
                                        className="mb-4 border rounded-lg"
                                        ref={
                                            index ===
                                            receivedInvitations.length - 1
                                                ? lastSentRef
                                                : null
                                        }
                                    >
                                        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-gray-100">
                                            <div className="flex items-center space-x-2">
                                                <div>
                                                    <p className="font-medium">
                                                        {invite.username}
                                                    </p>
                                                </div>
                                                <Badge
                                                    variant={
                                                        invite.status ===
                                                        'pending'
                                                            ? 'secondary'
                                                            : 'default'
                                                    }
                                                >
                                                    {invite.status}
                                                </Badge>
                                                {invite.status ===
                                                    'pending' && (
                                                    <>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={async () => {
                                                                await acceptInvitation(
                                                                    {
                                                                        token,
                                                                        invitationId:
                                                                            invite.id,
                                                                    }
                                                                )
                                                                alert(
                                                                    'Invitation accepted'
                                                                )
                                                                //     set the status to accepted
                                                                setReceivedInvitations(
                                                                    receivedInvitations.map(
                                                                        (
                                                                            item
                                                                        ) => {
                                                                            if (
                                                                                item.id ===
                                                                                invite.id
                                                                            ) {
                                                                                return {
                                                                                    ...item,
                                                                                    status: 'accepted',
                                                                                }
                                                                            }
                                                                            return item
                                                                        }
                                                                    )
                                                                )
                                                            }}
                                                        >
                                                            <Check className="h-4 w-4 mr-2" />
                                                            Accept
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={async () => {
                                                                await rejectInvitation(
                                                                    {
                                                                        token,
                                                                        invitationId:
                                                                            invite.id,
                                                                    }
                                                                )
                                                                alert(
                                                                    'Invitation rejected'
                                                                )
                                                                //     set the status to rejected
                                                                setReceivedInvitations(
                                                                    receivedInvitations.map(
                                                                        (
                                                                            item
                                                                        ) => {
                                                                            if (
                                                                                item.id ===
                                                                                invite.id
                                                                            ) {
                                                                                return {
                                                                                    ...item,
                                                                                    status: 'rejected',
                                                                                }
                                                                            }
                                                                            return item
                                                                        }
                                                                    )
                                                                )
                                                            }}
                                                        >
                                                            <X className="h-4 w-4 mr-2" />
                                                            Reject
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent className="p-4 border-t">
                                            <h4 className="font-semibold mb-2">
                                                Granted Permissions
                                            </h4>
                                            {Object.keys(
                                                invite.permissions
                                            ).map((permission) => {
                                                if (
                                                    invite.permissions[
                                                        permission
                                                    ]
                                                ) {
                                                    return (
                                                        <div
                                                            key={permission}
                                                            className="py-2"
                                                        >
                                                            <p className="font-medium">
                                                                {permission}
                                                            </p>
                                                        </div>
                                                    )
                                                }
                                            })}
                                        </CollapsibleContent>
                                    </Collapsible>
                                ))}
                                {loadingReceived && !receivedFinished && (
                                    <div className="text-center py-4">
                                        Loading more...
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default HomePage
