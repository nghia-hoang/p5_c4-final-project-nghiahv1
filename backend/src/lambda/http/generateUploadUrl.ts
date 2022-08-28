import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { v4 as uuidv4 } from 'uuid';
import { AttachmentUtils } from '../../helpers/attachmentUtils';
import { updateAttachmentUrl as updateAttachmentUrl } from '../../helpers/todos'
import { getUserId } from '../utils';

const attachmentUtils = new AttachmentUtils()
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const attachmentId = uuidv4()
    const userId = getUserId(event)
    let uploadUrl = await attachmentUtils.createAttachmentPresignedUrl(attachmentId);

    const attachmentUrl = await attachmentUtils.getAttachmentUrl(attachmentId)
    console.log(attachmentUrl)

    await updateAttachmentUrl(userId, todoId, attachmentUrl)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
       'Content-type' : 'application/json',
      },
      body: JSON.stringify({
        uploadUrl
      })
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
