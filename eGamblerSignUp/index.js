'use strict'
var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
var bcrypt = require("bcryptjs");

exports.handler =  (event, context, callback) => {
   var tableName = 'eGambler';
       const response = {
        statusCode: 200,
    };

   const body = JSON.parse(event.body);
   console.log('Received event:', JSON.stringify(event.body));
bcrypt.hash(body.password,10).then((password) => {
   var param= {
        "TableName": 'eGambler',
        "Item" : {
            "PK" :{S:'USER#' + body.loginName} ,
            "SK1": {S:'DATA#GENERAL'},
            "password" : {S:password},
            "email":{S:body.email},
            "displayName" : {S: body.displayName}
        },
        "ReturnValues": "ALL_OLD"
}
   dynamodb.putItem(param, function(err, data) {
        console.log('err:' + err);
        console.log(data);
        if (err) {
            console.log('Error putting item into dynamodb failed: '+err);
           response.body = {"Result":"Fail"};
           response.statusCode = "500"
           context.fail(response);
        }
        else {
            console.log('Success: '+JSON.stringify(data, null, '  '));
           response.body  = {"Result":"Success"};
        }
        response.body = JSON.stringify((response.body));
        context.succeed(response);
    });


});


};
