import {APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { getTodos as getTodos } from '../../helpers/todos'
import { getUserId } from '../utils';

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    console.log("test " + process.env.TODOS_TABLE)
    const userId = getUserId(event)
    const data = await getTodos(userId);
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
