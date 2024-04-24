import boto3  # AWS SDK for Python - layered here
import json
import os
from datetime import datetime
from tzlocal import get_localzone
from dateutil import tz
 
# Q Business client
q_client = boto3.client('qbusiness')
ddb_client = boto3.client('dynamodb', region_name=os.environ['DDBRegion'])
 
q_app = os.environ['AppID']
ddb_table = os.environ['DDBTable']
user_timezone = get_localzone()
 
def qamplify_core (event, context):
    # print("Event object: ", event)
    body = event.get("body")
    resp = {}
    if body is not None:
        body_dict = json.loads(body)
        userID = body_dict.get("user", None)
        convID = body_dict.get("conv", None)
        message = body_dict.get("message", None)
    else:
        message = None
        userID = None
        convID = None
        
    if userID and message:
        if convID:
            # continue conversation
            convID, Qmessage = continue_conv(userID,convID,message)
        else:
            # new conversation
            convID, Qmessage = initiate_conv(userID,message)
            
        resp['conv'] = convID
        resp['message'] = Qmessage
        resp['timestamp'] = datetime.now(user_timezone).strftime("%Y-%m-%d %H:%M:%S.%f%z")
        
        return resp

    elif convID and userID and not message:
        # CRUD request i.e. open conversation, delete conversation
        action = body_dict.get("action", None)
        if action == 'open':
            resp = retrieve_conversation(userID,convID)
            return resp
        elif action == 'delete':
            
            resp['conv'] = convID
            resp['action'] = action
            
            if delete_conversation(userID,convID):
                resp['status'] = 'success'
            else:
                resp['status'] = 'failed'
            print ('deleted: ', convID)
            return resp
            
    else:
        # non-conversational request i.e. user login, page refresh etc.
        validate_user(userID)
        if list_conversations(userID):
            resp=list_conversations(userID)
            return resp
 
def validate_user(userId):
    try:
        response = q_client.get_user(
            applicationId=q_app,
            userId=userId
        )
    except q_client.exceptions.ResourceNotFoundException:
        response = q_client.create_user(
            applicationId=q_app,
            userId=userId
        )
 
def list_conversations(userId):
    response = q_client.list_conversations(
        applicationId=q_app,
        userId=userId
    )
    if response:
        # Collect results in a list 
        processed_conversations = []
        for conversation in response['conversations']:
            conversation_id = conversation['conversationId']
            #off_messageId = retrieve_conv_ddb(conversation_id)
            processed_conversation = {
                'conv': conversation_id,
                'title': conversation['title'],
                #'off_messageId': off_messageId
            }
            processed_conversations.append(processed_conversation)
        return processed_conversations
    else:
        return
 
def delete_conversation(userId,convId):
    response = q_client.delete_conversation(
        applicationId=q_app,
        conversationId=convId,
        userId=userId
    )
    response = ddb_client.delete_item(
        TableName=ddb_table, 
        Key={'conversationid': {'S': convId}}
    )
 
    if response:
        return 1
    else:
        return None
 
def retrieve_conversation(userId,convId):
    response = q_client.list_messages(
        applicationId=q_app,
        conversationId=convId,
        userId=userId
    )
    if response:
        # Collect results in a list 
        processed_messages = []
        for message in response['messages']:
            body = message['body']
            type = message['type']
            timed = datetime.strptime(str(message['time']), "%Y-%m-%d %H:%M:%S.%f%z")
            timedd = str(timed.astimezone(user_timezone))
            #off_messageId = retrieve_conv_ddb(conversation_id)
            processed_message = {
                'message': body,
                'type': type,
                'timestamp': timedd
            }
            processed_messages.append(processed_message)
            processed_messages.reverse()
        return processed_messages
    else:
        return
    # Fetch conv state from DDB
    response = dynamodb_client.scan(
        TableName=dynamodb_table_name,
        FilterExpression=boto3.dynamodb.conditions.Attr('conversationId').eq(convId)
    )
    if len(response['Items']) > 0:
        item = response['Items'][0]
        return item['off_messageId']['S']
    else:
        return None
def continue_conv(userid,convid,message):
    systemMessageId = query_ddb(convid)
    if systemMessageId:
        response = q_client.chat_sync(
            applicationId=q_app,
            conversationId=convid,
            parentMessageId=systemMessageId,
            userId=userid,
            userMessage=message
        )
        if response:
            log_conv_ddb(response['conversationId'], response['systemMessageId'])
            #print(response['conversationId'] + '~' + response['systemMessage'])
            return [
                response['conversationId'],
                response['systemMessage']
            ]
        else:
            return []
 
def initiate_conv(userid,message):
    response = q_client.chat_sync(
        applicationId=q_app,
        userId=userid,
        userMessage=message
    )
    if response:
        log_conv_ddb(response['conversationId'], response['systemMessageId'])
        # print(response['conversationId'] + '~' + response['systemMessage'])
        return [
            response['conversationId'],
            response['systemMessage']
        ]
    else:
        return []
 
def query_ddb(convID):
    response = ddb_client.query(
        TableName=ddb_table,
        KeyConditionExpression='conversationid = :convID', 
        ExpressionAttributeValues={
            ':convID': {'S': str(convID)}  # Assuming string type
        }
    )
    convs = response.get('Items', [])
    if convs:
        return convs[0]['systemmessageid']['S']
    else:
        return None
 
def log_conv_ddb(convID,systemMessageId):
    try:
        ddb_client.put_item(
            TableName=ddb_table,
            Item={'conversationid': {'S': convID}, 'systemmessageid': {'S': systemMessageId}}
        )
    except:
        return {
        'statusCode': 400,
        'body': json.dumps('Error writing to DynamoDB.')
        }