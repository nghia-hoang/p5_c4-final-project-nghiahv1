
import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import { verify } from 'jsonwebtoken'
import { JwtPayload } from '../../auth/JwtPayload'

const cert = `-----BEGIN CERTIFICATE-----
MIIDDTCCAfWgAwIBAgIJYZoO7tGdZO8mMA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNV
BAMTGWRldi1ycWg5dzN6ai51cy5hdXRoMC5jb20wHhcNMjIwODE3MDcyNzQ3WhcN
MzYwNDI1MDcyNzQ3WjAkMSIwIAYDVQQDExlkZXYtcnFoOXczemoudXMuYXV0aDAu
Y29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmvq6ayn98/BVMCL6
4TJVxcf1ebJs3exek9XZntH+h2QNvjlbYF97xpk/d70r+blfvIh+6VK0UB3WWa14
ZkoQ0Ebxr0W0RZNLGncxn5/O6NPYYw1mleYtvGjbpLQiNXk40eSWF65HgrLsUCHU
TeqvF2qUawlbQt7dTCDI3VQLqH+sTTEefxBWkjX7h4o1XsXYmdnCmXrEnxcxPR92
NXj/6FxOFl84+m9Beh0tNKWpHSSN8dPapW2AXysSvnGf6RgBEQa3aTP3kJ3mWUdp
LLsIiRd0UKREBI7d5vtxoJxbJBq3mVyug7KDvDwClmxZ7OHAPFC1V6Mp+Qq/g6+Z
4UIbzQIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBRuUP5URseR
VVBF2F05NPLNDTsysjAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEB
AAGbQxBYviXZR0mj48YsClwAK1cEgcp41WohZ2woR1BGaPV3rpPWMCNl9ICRPUx0
diqXmFfkzMXtCGxmG1J1FxnSD2+6Xkq/6AEkpL4i44wAGoUtAd6BrccQWUl8o/zl
sS5rh3yP+V7/1pc0eMy5Qv5HdPto84gX7Zzq+b95/y7vuPrACuH+nD/Eh4PzJ461
jI0xms4j6frkuZu6COiFc7J3Ppdqjoeg02ieSHefWkpbdb7k/yB0HTvcVh+lmca5
CWuPDyZ9zg0Slg/BURpcIdTHii9Qy9RJt0hWoqcVdx+OEjRht3cGFWZbInybkWje
j5wL0Nn+hdXsnrhsQbpP2RA=
-----END CERTIFICATE-----`

export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  try {
    const jwtToken = verifyToken(event.authorizationToken)
    console.log('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    console.log('User authorized', e.message)
    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

function verifyToken(authHeader: string): JwtPayload {
  if (!authHeader)
    throw new Error('No authentication header')
  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')
  const split = authHeader.split(' ')
  const token = split[1]
  return verify(token, cert, { algorithms: ['RS256'] }) as JwtPayload
}
