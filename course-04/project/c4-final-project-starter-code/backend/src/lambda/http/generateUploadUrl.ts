import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import {
  // updateTodoAttachment,
  createAttachmentPresignUrl
} from '../../businessLogic/todos'
// import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('updateTodoAttachment')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    // const userId = getUserId(event)
    logger.info('Processing genrate upload url event: ', event)

    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id

    const uploadUrl = await createAttachmentPresignUrl(todoId)

    // await updateTodoAttachment(todoId, userId)
    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadUrl: uploadUrl
      })
    }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
