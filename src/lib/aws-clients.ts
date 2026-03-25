import { S3Client } from "@aws-sdk/client-s3";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { SQSClient } from "@aws-sdk/client-sqs";
import { LambdaClient } from "@aws-sdk/client-lambda";
import { SNSClient } from "@aws-sdk/client-sns";
import { IAMClient } from "@aws-sdk/client-iam";
import { CloudWatchLogsClient } from "@aws-sdk/client-cloudwatch-logs";

const LOCALSTACK_ENDPOINT = process.env.LOCALSTACK_ENDPOINT ?? "http://localhost:4566";

const commonConfig = {
  endpoint: LOCALSTACK_ENDPOINT,
  region: process.env.AWS_REGION ?? "us-east-1",
  credentials: {
    accessKeyId: "test",
    secretAccessKey: "test",
  },
};

export const s3Client = new S3Client({ ...commonConfig, forcePathStyle: true });
export const dynamodbClient = new DynamoDBClient(commonConfig);
export const sqsClient = new SQSClient(commonConfig);
export const lambdaClient = new LambdaClient(commonConfig);
export const snsClient = new SNSClient(commonConfig);
export const iamClient = new IAMClient(commonConfig);
export const cloudwatchLogsClient = new CloudWatchLogsClient(commonConfig);
