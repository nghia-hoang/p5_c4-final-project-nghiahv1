import {TodosAccess } from './todosAcess'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'

const logger = createLogger('businessLogic-todos')

const accessDB = new TodosAccess()
export async function createTodo(newTodo: CreateTodoRequest, userId: string): Promise<TodoItem> {
    const createdAt = new Date().toISOString()  
    const todoId = uuid.v4()
    let newItem: TodoItem = {
      userId,
      todoId,
      createdAt,
      done: false,
      ...newTodo,
      attachmentUrl: ''
    }
    logger.info('call createTodo Access: ' + newItem.createdAt);
    return await accessDB.createTodo(newItem)
  }
  
  export async function getTodos(userId: string): Promise<TodoItem[]> {
    logger.info('call getTodos Access: ' );
    return accessDB.getTodos(userId)
  }
    
  export async function updateTodo(todoId: string, updatedTodo: UpdateTodoRequest, userId: string): Promise<TodoUpdate> {
    let todoUpdate: TodoUpdate = {
      ...updatedTodo
    }
    logger.info('call updateTodo Access: ' + "," + todoId + "," + todoUpdate);
    return accessDB.updateTodo(todoId, todoUpdate, userId)
  }
  
  
    export async function deleteTodo(todoId: string, userId: string) {
      logger.info('call deleteTodo Access: ' + "," + todoId)
      return accessDB.deleteTodo(todoId, userId)
      
    }
    export async function updateAttachmentUrl(userId: string, todoId: string, attachmentUrl: string): Promise<string> {
      logger.info('call updateTodo Access: ' + todoId + "," + attachmentUrl);
      return accessDB.updateAttachmentUrl(todoId, attachmentUrl, userId)
    }
    

