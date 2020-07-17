'use strict'
var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
var dynamodb = new AWS.DynamoDB.DocumentClient();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

exports.handler =  async (event, context, callback) => {
 var tableName = 'eGambler';
 console.log('I RUNNNNNNN');
 console.log(event.body);
 var response = {
        statusCode: 200,
     headers: {
         'Access-Control-Allow-Origin': '*',
         'Access-Control-Allow-Headers':'Origin, X-Requested-With, Content-Type, Accept, Authorization',
         "Access-Control-Allow-Methods":"GET, POST, PATCH, PUT, DELETE, OPTIONS",
         'Access-Control-Allow-Credentials': true
     },
     body: "HEY FUCK"
    };

    context.succeed(response);
 //TODO move to system parameter store
const jwtSecret = 'MY_SECRET_ABCDEF'
 const body = JSON.parse(event.body);
 console.log('Received event:', JSON.stringify(event, null, 2));

var param = {
      ExpressionAttributeValues: {
   ":PK": 'USER#' + body.loginName,
   ":SK": 'DATA#GENERAL'

  }, 
  KeyConditionExpression: 'PK = :PK and SK1= :SK',
  TableName: "eGambler"
}

var result = await dynamodb.query(param).promise().then(function(data) {
    console.log('data: ' + JSON.stringify(data));
    return data
  }).catch(err=>{
   console.log(err);
   functionFail(err);
  });
console.log('Result' + result);
var retrievePassword = result.Items[0].password;
//TODO no password
if (!retrievePassword) {
 functionFail("Wrong Password Or Username.")
}

var comparePassword = await bcrypt.compare(body.password,retrievePassword).then(result => {return result})
if (!comparePassword) {
 functionFail("Wrong Password Or Username.")
}

var jwtToken = await jwt.sign({loginName: body.loginName},jwtSecret);
console.log('JWTTOKEN: ' + jwtToken);
response.body = JSON.stringify("Success");
context.succeed(response);
};

function functionFail(message, statusCode = 500) {
 var failResponse = {
     statusCode: statusCode,
     body: JSON.stringify({"message":message})
 };
    return context.fail(failResponse);
}
