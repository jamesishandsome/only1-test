import { createServerFn } from '@tanstack/start'
import { setResponseStatus } from 'vinxi/http'
import * as jose from 'jose'

export const getServerTime = createServerFn('GET', async () => {
    setResponseStatus(201)
    return new Date().toISOString()
})

export const currentUser = createServerFn('GET', async () => {
    // return {
    //     name: 'John Doe',
    //     email: '',
    //     verified: false,
    // }
    //     return a jwt token
    const alg = 'RS256'
    const pkcs8 = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCxnZfMR7kxn4n8
4fAvPmBO4Gii3t6FRqD4fUF51XPjjYvw7eg8d/O3tzrjaryLEhUYrY5u4HNql/nL
HBqeHTEXCf6yREV95JnyJJ2YVw9b7M1dM9GexLHoRrCX5MYmC1uV56yDQZJAkaWx
lIsS+l3rf7B3rklKsLLiezFYFsGw8OQBuHGhrhqC8Cp2Fy6LJh8h3qtNU+zIJ1gT
elYl4NC4hVEMhWc4i6cPVI2iJa3kye1hhjhQAaMyJh3HvYVba+F1CnXKRduNJf0J
p/nMXwozBc0oz8rzlOsaFQcSh+nnyhVA7n0yONpV46kNBuZJD/dOLweWHyW49IAm
PMynmYrFAgMBAAECggEAGlD5ihKxcZUMFqwqUHGrRtyQnFstuK0FkjPK1QCnplZV
Xvn9ACKcuYJ8RvBMZcWk2w5yDWMTrr48TFgKaJV2Lc31Dxg2/Kd3mM1MjWMO20Wr
iuzv2NiXbI02wpaqtj3WENCt+penUgpSdMyHy6TNcCRv8tefs+GY654pqj3a7nqP
bTaejJUHg5JadJUxifWFbG6UQsl9ZNVFpW5vgT8ic5WwYgiFfoxbWOlgoA+mQZcI
S3gGD2mfxW222bAYUF5O42MvPMm6bCXFkaWv04Ly13oZnvatdt8dM8p+ri+dsm4b
FUzdQg+8Gt1Ts7QM1akI/a8plRYJY/Cj6cQsHpxzKQKBgQDdt6lJDHM/X1bHBgGz
VaIx5gHGt8jy58UDcmimGqgenPOGrXp/kZ7kM6TfCE5+OA+yMDEkLoPf+s1N42RO
MkdVxCfiIJ1abNCMbbD0ox5ZKTvT53J0ntNk82o/wvEMX/R5DYpvMIA8Kom7kPhz
239b2yE5FyLEpi2lN6/IwEohuQKBgQDNFDrB6qdIFc7JrA7O2d9zuVC8w9gtj50r
MxVXO3UGN0Y0wcPEjaOjFtPmAZuzb2W+nC7y93tsrOJWrGLP13HFnSZXhwRYFLwv
/KQjrcAZVES8CxR+5bB8ApHaLRPn4kEsq7ePkUQjRXx9LiGczxn9+Nwd6SS+MPS+
1JSEzxYnbQKBgF7ACTktd+biMGx3NazU8K6QU7v/eIHN6FTTxMMPaz9B5ZRteIch
zRxKsa+alii8foCwtZ93vWWvgaNChPAh7nhJjp3FQFmPXQRWMCQrvWFvDKE/LJuH
8GEY4RQElAysyQYeckWYHYUYzKl6h6LDb8bqe2UxbOtK9QDBLn8FJekJAoGBAMBp
d4uTjyoKE/+R6D7Zmlaoi4DgO0bcFPmAL0iuJ2kSmVNMbVJQFjUhaOTHo39iSFLj
lQUvf+UB/EaX7QnWuQ9RF7VNn5zIr5xSbOpwzei18NuBhdRdyw0/F/tdCe0pkj7I
Sixwfj6dpmSI0M6gXWG1iUijA29S3X7iUwqchcutAoGAB78UOOUtu0H/ietSpRnN
uBwwInxGKYkQYXgptVImq+hxHt2vBChWc0W4prSC7X++2H/f1HNeYHEVX+tRdbFV
p2IY8vhITJTVtlOmNr/Ymhh1TZdZ9i5a+HD0y2Bu8UbprUVVs98tqgS/ih80Gkin
kpb1ezIAFL7OETlbAFcrN60=
-----END PRIVATE KEY-----`

    const privateKey = await jose.importPKCS8(pkcs8, alg)
    const jwtToken = await new jose.SignJWT({
        name: 'John Doe',
        email: '',
        verified: false,
    })
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setIssuer('James')
        .setAudience('Only1')
        .setExpirationTime('2h')
        .sign(privateKey)

    return { token: jwtToken }
})
