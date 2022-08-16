const TokenValidator = require("twilio-flex-token-validator").functionValidator;

exports.handler = TokenValidator(async function (context, event, callback) {
  const client = context.getTwilioClient();
  const response = new Twilio.Response();

  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Access-Control-Allow-Methods", "OPTIONS, POST, GET");
  response.appendHeader("Access-Control-Allow-Headers", "Content-Type");

  const channelSid = event.channelSid
  console.log('Channel Sid: ', channelSid);
  const chatService = context.TWILIO_CHAT_SERVICE;

  try {
    const channel = await client.chat.v2.services(chatService)
    .channels(channelSid)
    .fetch()

    let chat_friendly_name = channel.friendlyName;
    let channelAttributes = JSON.parse(channel.attributes);
    let channel_type = channelAttributes.channel_type;

    const members = await client.chat.v2.services(chatService)
      .channels(channelSid)
      .members
      .list({ limit: 20 })

    let guest = members.find(m => {
      let attr = JSON.parse(m.attributes)
      return (attr.member_type === "guest");
    });
    console.log('Guest Member:', guest);

    const messages = await client.chat.v2.services(chatService)
      .channels(channelSid)
      .messages
      .list();

    console.log('Msg Count:', messages.length);
    let msgList = [];
    let member_name;
    messages.forEach(m => {
      let msgBody
      if (m.type == 'text') {
        msgBody = m.body
      } else {
        msgBody = "[media: " + m.media.filename + "]";
      }
      if (m.from == guest.identity) {
        member_name = "Customer";
      } else if (m.from == channelSid) {
        member_name = "System";
      } else {
        member_name = m.from;
      }
      let msgText = "Date/Time: " + m.dateCreated + ", From: " + member_name + ", Message: " + msgBody;
      console.log(msgText);
      msgList.push({ date: m.dateCreated, index: m.index, from: m.from, member_name, body: msgBody });
    });

    let chatData = { chat_friendly_name, channel_type, messages:msgList}

    response.appendHeader("Content-Type", "application/json");
    response.setBody(chatData);
    return callback(null, response);
  } catch (err) {
    returnError(callback, response, err.message);
  }
});

const returnError = (callback, response, errorString) => {
  console.error(errorString);
  response.appendHeader("Content-Type", "plain/text");
  response.setBody(errorString);
  response.setStatusCode(500);
  return callback(null, response);
};
