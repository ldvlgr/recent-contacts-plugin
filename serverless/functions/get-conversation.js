const TokenValidator = require("twilio-flex-token-validator").functionValidator;

exports.handler = TokenValidator(async function (context, event, callback) {
  const client = context.getTwilioClient();
  const response = new Twilio.Response();

  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Access-Control-Allow-Methods", "OPTIONS, POST, GET");
  response.appendHeader("Access-Control-Allow-Headers", "Content-Type");

  const conversationSid = event.conversationSid
  console.log('Conversation Sid: ', conversationSid);
  //const conversationService = context.TWILIO_CONVERSATION_SERVICE;

  try {
    const conversation = await client.conversations.v1
      .conversations(conversationSid)
      .fetch()
      
    const friendlyName = conversation.friendlyName;
    const conversationDateCreated  = conversation.dateCreated;
    const conversationDateUpdated = conversation.dateUpdated;
    let conversationAttributes = JSON.parse(conversation.attributes);
    console.log('CONVERSATION:', conversation);
    
    const participants = await client.conversations.v1
      .conversations(conversationSid)
      .participants
      .list({limit: 20})

    const messages = await client.conversations.v1.conversations(conversationSid)
      .messages
      .list()

    console.log('Msg Count:', messages.length);
    let msgList = [];
    
    messages.forEach(m => {
      const { dateCreated, index, author, participantSid, body, media } = m;
      let file
      if (media) {
        file = media.filename;
      }
      
      let msgText = "Date/Time: " + dateCreated + ", Author: " + author + ", Body: " + body;
      console.log(msgText);
      
      msgList.push({ date: dateCreated, index, author, participantSid, body, file });
    });

    const chatData = { 
      friendlyName, 
      conversationDateCreated, 
      conversationDateUpdated, 
      participants, 
      messages:msgList
    }

    response.appendHeader("Content-Type", "application/json");
    response.setBody(chatData);
    return callback(null, response);
  } catch (err) {
    return returnError(callback, response, err.message);
  }
});

const returnError = (callback, response, errorString) => {
  console.error(errorString);
  response.appendHeader("Content-Type", "plain/text");
  response.setBody(errorString);
  response.setStatusCode(500);
  return callback(null, response);
};
