import { TodosAccess } from '../dataLayer/todosAcess'
import { AttachmentUtils } from '../dataLayer/attachmentUtils'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'

import * as uuid from 'uuid'
// import * as createError from 'http-errors'

// TODO: Implement businessLogic
const todosAccess = new TodosAccess()
const logger = createLogger('TodosLogic')

export async function getAllTodos(userId: string): Promise<TodoItem[]> {
  logger.info('Getting all todos')
  return todosAccess.getAllTodos(userId)
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {
  logger.info('Creating a todo item')
  const todoId = uuid.v4()

  const newTodo: TodoItem = {
    userId,
    todoId,
    createdAt: new Date().toISOString(),
    done: false,
    ...createTodoRequest
  }

  return todosAccess.createTodoItem(newTodo)
}

export async function updateTodo(
  todoId: string,
  userId: string,
  updateTodoRequest: UpdateTodoRequest
) {
  logger.info('Updating a todo item')
  const item = await todosAccess.getTodoItem(todoId, userId)

  if (!item) throw new Error('Item not found')

  if (item.userId !== userId) {
    throw new Error('User not authorized to update item')
  }
  return todosAccess.updateTodoItem(todoId, userId, updateTodoRequest)
}

export async function deleteTodo(
  todoId: string,
  userId: string
): Promise<void> {
  logger.info('Deleting a todo item')

  const item = await todosAccess.getTodoItem(todoId, userId)

  if (!item) throw new Error('Item not found')

  if (item.userId !== userId) {
    throw new Error('User not authorized to update item')
  }
  return todosAccess.deleteTodoItem(todoId, userId)
}

export async function generateUploadUrl(todoId: string): Promise<string> {
  logger.info('Generating upload url')
  const attachmentUtils = new AttachmentUtils()
  return attachmentUtils.getAttachmentUrl(todoId)
}

export async function updateTodoAttachment(
  todoId: string,
  userId: string
): Promise<void> {
  logger.info('Updating todo attachment')
  const attachmentUtils = new AttachmentUtils()
  const attachmentUrl = attachmentUtils.getAttachmentUrl(todoId)

  const item = await todosAccess.getTodoItem(todoId, userId)

  if (!item) throw new Error('Item not found')

  if (item.userId !== userId) {
    throw new Error('User not authorized to update item')
  }

  await todosAccess.updateTodoAttachmentUrl(todoId, userId, attachmentUrl)
}
