import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('TodosAccess')
export class TodosAccess {

    constructor(
        private readonly dbAccess: DocumentClient = getDynamoDBClient(),
        private readonly todosTable = process.env.TODOS_TABLE
        ) {
    }

    async getTodos(userId: string): Promise<TodoItem[]> {
        logger.info('call TodosAccess.getTodos');
        const params = {
            TableName: this.todosTable,
            KeyConditionExpression: "#userId = :userId",
            ExpressionAttributeValues: {
              ":userId": userId
            },
            ExpressionAttributeNames: {
              "#userId": "userId"
            },
            ScanIndexForward: true
          };
        logger.info('call TodosAccess.getTodos2');
        const result = await this.dbAccess.query(params).promise();  
        logger.info('call TodosAccess.getTodos3'); 
        const items = result.Items
        logger.info('getTodos result: ' + items);
        return items as TodoItem[]
    }  
    async createTodo(newItem: TodoItem): Promise<TodoItem> {
        logger.info('call TodosAccess.createTodo');
        await this.dbAccess.put({
            TableName: this.todosTable,
            Item: newItem
        }).promise()
        logger.info('createTodo result: ' + newItem);
        return newItem
    }
    async updateTodo(todoId: string, todoUpdate: TodoUpdate, userId: string): Promise<TodoUpdate> {
        logger.info('call updateTodoAccess');
        var params = {
            TableName: this.todosTable,
            Key: {
                todoId: todoId,
                userId: userId
            },
            UpdateExpression: 'set #name = :name, #dueDate = :dueDate, #done = :done',
            ExpressionAttributeValues: {
                ':name': todoUpdate.name,
                ':dueDate': todoUpdate.dueDate,
                ':done': todoUpdate.done,
            },
            ExpressionAttributeNames: { 
                "#name": "name",
                '#dueDate': "dueDate",
                '#done': "done",
             }
        };

        await this.dbAccess.update(params, function (err, data) {
            if (err) logger.error(err);
            else logger.info(data);
        }).promise()
        logger.info('result: ' + todoUpdate);
        return todoUpdate
    }
    async deleteTodo(todoId: string, userId: string) {
        logger.info('call deleteTodo acess');
        var params = {
            TableName: this.todosTable,
            Key: {
                todoId: todoId,
                userId: userId
            }
        };

        await this.dbAccess.delete(params, function (err, data) {
            if (err) logger.error(err);
            else logger.info(data);
        })
        logger.info('deleteTodo acess: done');
    }
    
    async updateAttachmentUrl(todoId: string, uploadUrl: string, userId: string): Promise<string> {
        logger.info('call updateAttachmentUrl acess: '+ uploadUrl);
        var params = {
            TableName: this.todosTable,
            Key: {
                todoId: todoId,
                userId: userId
            },
            UpdateExpression: 'set #attachmentUrl = :attachmentUrl',
            ExpressionAttributeValues: {
                ':attachmentUrl': uploadUrl.split("?")[0]
            }
            ,
            ExpressionAttributeNames: { 
                "#attachmentUrl": "attachmentUrl",
            }
        };

        await this.dbAccess.update(params, function (err, data) {
            if (err) logger.error(err);
            else logger.info(data);
        }).promise()
        logger.info('updateAttachmentUrl result: ' + uploadUrl);
        return uploadUrl
    }
}

function getDynamoDBClient() {
    
    AWSXRay.setContextMissingStrategy("LOG_ERROR");
    logger.info('Creating a local DynamoDB instance1')
    // if (process.env.IS_OFFLINE) {
    //     let AWS = require('aws-sdk');
    //     const AWSXRay = require('aws-xray-sdk');
    //     AWS = AWSXRay.captureAWS(require('aws-sdk'));
    // }
    if (process.env.IS_OFFLINE) {
        logger.info('Creating a local DynamoDB instance2')
        return new XAWS.DynamoDB.DocumentClient({
            region: 'us-east-1',
            endpoint: 'http://localhost:8000'
        })
    }

    return new XAWS.DynamoDB.DocumentClient()
}
