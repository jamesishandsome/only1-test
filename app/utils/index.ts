import * as jose from 'jose'

export const verifyUser = async (token: string) => {
    if (!token) {
        return { status: 'error', message: 'No token found' }
    }
    const alg = 'RS256'
    const spki = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAh5uAUL3yuyhSEV0IE2m8
NEp8hmYC1g1QgA1ezEKERNPnYvwmJQOav6WyzWbbprl71saIsX2txEn/Q7Yywxcm
tZAZla5H1UFiUBt7b7cxZGpjUWhdJS3B13p36QLfJSjNrupZq4Ak6T6XWNgO3RnD
zMngDlHSgBbmarDcwKHaIFLmpHMJ/pqnXSO9Det8ZInfX7IHniJBkc4wqv2XECiv
fBfwMpJ+vUU9QIaA3JDrc7pgcDr9Xz1sYk/146GkJ+Gb2JweC9lFCKEuWCC9ZsMi
jkkI8YF4YftUatKm5gU49bfpZ1XRMx4cZtlnauXVtw0O58e8pJqCFTIC1woE5sNM
xwIDAQAB
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
    return { status: 'success', payload, protectedHeader }
}

export const signToken = async (
    username: string,
    userid: string,
    verified: boolean
) => {
    const alg = 'RS256'
    const pkcs8 = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCHm4BQvfK7KFIR
XQgTabw0SnyGZgLWDVCADV7MQoRE0+di/CYlA5q/pbLNZtumuXvWxoixfa3ESf9D
tjLDFya1kBmVrkfVQWJQG3tvtzFkamNRaF0lLcHXenfpAt8lKM2u6lmrgCTpPpdY
2A7dGcPMyeAOUdKAFuZqsNzAodogUuakcwn+mqddI70N63xkid9fsgeeIkGRzjCq
/ZcQKK98F/Aykn69RT1AhoDckOtzumBwOv1fPWxiT/XjoaQn4ZvYnB4L2UUIoS5Y
IL1mwyKOSQjxgXhh+1Rq0qbmBTj1t+lnVdEzHhxm2Wdq5dW3DQ7nx7ykmoIVMgLX
CgTmw0zHAgMBAAECggEAboGbuTBxQ28CIcAsOpWplvs0KtmqagCDnzZGEDIMU4JT
RuivtO4RByfiY1v0lxMEBevXrLv8BL9AU0+AYlbVZpO9JarWQsR7d0hN+KXSjD/e
G5LuhMOa+RuF5849RazQoD+9PvK4IZKuBupagnbihlnkSgcHgPYoYr0px5idhkSY
j0qfIELbac8GHLN2cG0B+7sgxSprmcYYoc5vorDmQXFSTgTWD3XeCDVt6SNEtcgX
reThp7kl7QaJeKG7iGIzoLFuC3WgkRqoyjXUgB/QVY14cU/T9crRzuL3CDX+zQPm
nY0ZDA5K/wiBVFk2qYI7RUNmX2TfftbqYnSSJUHNgQKBgQC+NRuZDO7V9RR/kq3o
ZJ+N6GB3aJkOjzC5iKcDTHAlF/g1vWaKz2bR1BEX5LnJOF+Bikv/a+SA8mOLUHp7
EslhdgijtfbYgKpVz29nHE9lsJ4Q3U9dTYKMskNjXMdxDPZQqJ1obCo37QmibaLm
s7CdKx8vjgoTxVuePJQhPlSS4QKBgQC2g44EgvOio2Gj6NmcEokpiG+APGKIDhUg
qRFhoQhiunJedHxM87oPDZupTagv7TLKUKmJax9oyRvK5hVz3pqP+4fV9pKc0SeW
GhXS7kqWot9BmOzy+FSU8LnNK42Hn7qqxWTsYZB9dTPiVyVfTS0ekptceoL55iif
tbie/0L8pwKBgAmItfJtAIe++iEO5CKy8IB3dmZl2s4tBT83h0+WBEUHt4xSCxLI
JJo97AFrmJhqd/cRTI/oA5MnEzBHf2wt2+RDu1khZNcjU+ZrOGVNuPka6kFkJndB
zFprEQ+o9eJHyQzv9rvmOBOHkSUQI8s2lJK8N5r1nrGxAc+jr7Ue37RhAoGAX/ZH
g4O+yfKRcfcKA4+TYq0Dwy78t4CAB04df3GF0TMq0xL4EBXN7ABBqgDUv2492DYV
DdWvDA9Bd6sF+IhASBf+Ubd1WtJ1t+w7MU5tFUrJi9n2K8H55t2zM3cE0Rxgr01e
RRL/P5eSEh2z3qnbYUnAOh2IJBCpp1+KlL6t390CgYEAj2Yk5ibASwHo8SUil4Hw
zvcqeIvF8UTM2brE1HQ6ZK7xWq8LwImbafTLIbIummw/wUPZkTQyvZlBVfghPaWb
xQyJU5jKI1vUi5E6sELYIgX/LKkiA9aJoGc9fsmDphjCqyVtxbguWMvYxP4TtbWF
bfBbTLxCj19PXnQzGrT7O68=
-----END PRIVATE KEY-----`

    const privateKey = await jose.importPKCS8(pkcs8, alg)
    return await new jose.SignJWT({
        name: username,
        userid: userid,
        verified,
    })
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setIssuer('James')
        .setAudience('Only1')
        .setExpirationTime('2h')
        .sign(privateKey)
}
