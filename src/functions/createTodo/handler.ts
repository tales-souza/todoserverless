import { document } from '@functions/utils/dynamdbClient';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import { v4 as uuidv4 } from "uuid"

interface ICreateTodo {
  user_id: string;
  title: string;
}



const createTodo = async (event) => {


  const { user_id, title } = event.body as ICreateTodo

  const uuidid = uuidv4()

  await document.put({
    TableName: "todos",
    Item: {
      id: uuidid,
      user_id,
      title,
      done: false,
      deadline: new Date().toString()
    }
  }).promise();

  const response = await document
    .query({
      TableName: 'todos',
      KeyConditionExpression: 'id = :id',
      ExpressionAttributeValues: {
        ':id': uuidid,
      },
    }).promise();


  return formatJSONResponse(response.Items[0]);
};

export const main = middyfy(createTodo);
