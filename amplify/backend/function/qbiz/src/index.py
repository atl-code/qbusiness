import json
import qbiz as qb

def lambda_handler(event, context):
    # TODO implement
    response = qb.qamplify_core(event,context)
    return {
        'statusCode': 200,
        'headers': {
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
      },
        'body': json.dumps(response)
    }