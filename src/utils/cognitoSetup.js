import { CognitoUserPool } from 'amazon-cognito-identity-js';

const POOL_DATA = {
  UserPoolId: 'us-east-1_qmn8LpGk9',
  ClientId: '23m3lvis3ava8geatio6sll85c'
};

export const userPool = new CognitoUserPool(POOL_DATA);

export const AWSURL = 'https://wlhi41bngi.execute-api.us-east-1.amazonaws.com/dev/lunch-picker';
