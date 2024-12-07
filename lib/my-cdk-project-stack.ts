import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class MyCdkProjectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // **Step 1: Create an S3 Bucket**
    const myBucket = new s3.Bucket(this, 'MyFirstBucket', {
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Only for dev/test environments
    });

    // **Step 2: Create a Lambda Function**
    const myLambda = new lambda.Function(this, 'MyLambda', {
      runtime: lambda.Runtime.NODEJS_14_X, // Lambda runtime environment
      handler: 'index.handler',           // Entry point
      code: lambda.Code.fromInline(`
        exports.handler = async function(event) {
          console.log('Lambda invoked!');
          return { statusCode: 200, body: 'Hello, World!' };
        }
      `), // Inline Lambda function code
      environment: {
        BUCKET_NAME: myBucket.bucketName, // Pass the bucket name as an environment variable
      },
    });

    // Grant Lambda permissions to access the S3 bucket
    myBucket.grantReadWrite(myLambda);

    // **Step 3: Create a DynamoDB Table**
    const myTable = new dynamodb.Table(this, 'MyTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      tableName: 'MyTable',
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Only for dev/test environments
    });

    // Optional: Output resource names to the console for easy access
    new cdk.CfnOutput(this, 'BucketName', {
      value: myBucket.bucketName,
    });

    new cdk.CfnOutput(this, 'TableName', {
      value: myTable.tableName,
    });
  }
}
