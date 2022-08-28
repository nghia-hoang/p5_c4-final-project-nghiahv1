import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createTodo as createTodo } from '../../helpers/todos'
import { getUserId } from '../utils';

export const handler = middy(
 async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body) 
  const userId = getUserId(event)
  if(newTodo.name.length === 0){
    return {
      statusCode: 403,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Content-type' : 'application/json',
      },
      body: JSON.stringify({
        item:"Error"
      })
    }
  }
  const item = await createTodo(newTodo, userId)
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Content-type' : 'application/json',
    },
    body: JSON.stringify({
      item:item
    })
  }
}
)
handler.use(httpErrorHandler())
.use(
  cors({
    origin:'*',
    credentials: true
  })
)
