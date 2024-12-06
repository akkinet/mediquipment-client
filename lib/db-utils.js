import { ddbDocClient } from "../config/ddbDocClient";
import { QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

export const getByUsername = async (username) => {
  const params = {
    TableName: "Users",
    KeyConditionExpression: "username = :username",
    ExpressionAttributeValues: {
      ":username": username,
    },
  };

  try {
    const result = await ddbDocClient.send(new QueryCommand(params));
    return result.Items; // Returns an array of matching items
  } catch (err) {
    console.error("Error fetching by username:", err);
    throw new Error("Could not fetch user by username");
  }
};

export const getByEmail = async (email) => {
  const params = {
    TableName: "Users",
    FilterExpression: "email = :email",
    ExpressionAttributeValues: {
      ":email": email,
    },
  };

  try {
    const result = await ddbDocClient.send(new ScanCommand(params));
    return result.Items; // Returns an array of matching items
  } catch (err) {
    console.error("Error fetching by email:", err);
    throw new Error("Could not fetch user by email");
  }
};

export const getUser = async (info) => {
  const username = await getByUsername(info);
  if (username.length > 0) {
    // Fetch by username
    return username[0];
  } else {
    // Fetch by email
    const user = await getByEmail(info);
    if (user.length > 0) return user[0];
    else throw new Error("Either username or email must be provided");
  }
};
