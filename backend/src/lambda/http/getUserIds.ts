import {APIGatewayProxyResult} from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { getUserIds as getUserIds } from '../../helpers/todos'

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (): Promise<APIGatewayProxyResult> => {
    const data = await getUserIds();
    return  {
      statusCode: 200,
      headers: {
       'Access-Control-Allow-Origin': '*',
       'Access-Control-Allow-Credentials': true,
       'Content-type' : 'application/json',
      },
      body: JSON.stringify({
        items: data
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
