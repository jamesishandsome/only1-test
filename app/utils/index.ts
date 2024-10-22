import * as localforage from 'localforage'
import * as jose from 'jose'

const verifyUser = async () => {
    const token = await localforage.getItem('token')
    if (!token) {
        return { status: 'error', message: 'No token found' }
    }
    const alg = 'RS256'
    const spki = `-----BEGIN PUBLIC KEY-----
MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHqg150fMvAvWi61ffFr7cvGSFHr
UR8FPiHDJcP81w8Yk6cn5Rf7YqpmgXuj8skOB0fHh1Yg2MqDBSEW4amtkxKPK93O
18R+EsOv5c04PYr/IlKHyaV+GkuJnI2hHEmupuBR9JsqDkYRYTkK6HDwn46LjSXw
KvXiBkBHL4aAd9HnAgMBAAE=
-----END PUBLIC KEY-----`
    const publicKey = await jose.importSPKI(spki, alg)
    const { payload, protectedHeader } = await jose.jwtVerify(
        token,
        publicKey,
        {
            issuer: 'James',
            audience: 'Only1',
        }
    )
}
