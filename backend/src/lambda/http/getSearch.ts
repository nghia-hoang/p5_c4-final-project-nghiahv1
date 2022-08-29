import {APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { search as search } from '../../helpers/todos'

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = event.pathParameters.userId
    const t = decodeURI(userId);
    console.log("userId nghia " + userId)
    const data = await search(t);
    return  {
      statusCode: 200,
      headers: {
       'Access-Control-Allow-Origin': '*',
       'Access-Control-Allow-Credentials': true,
       'Content-type' : 'application/json',
      },
      body: JSON.stringify({
        items: data,
        t
      })
    }
  })
handler.use(httpErrorHandler())
.use(
  cors({
    origin:'*',
    credentials: true
  })
)
