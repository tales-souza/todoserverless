import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { document } from '@functions/utils/dynamdbClient';

const todosByUseId = async (event) => {

  const { user_id } = event.pathParameters;

  const response = await document
    .scan({
      TableName: "todos",
      FilterExpression: "#user_id = :user_id_val",
      ExpressionAttributeNames: {
        "#user_id": "user_id"
      },
      ExpressionAttributeValues: { ":user_id_val": user_id }
    }).promise();


  return formatJSONResponse({
    todos: response.Items
  });
};

export const main = middyfy(todosByUseId);
