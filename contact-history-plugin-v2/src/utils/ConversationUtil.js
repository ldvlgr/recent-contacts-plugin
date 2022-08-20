import { Manager, Notifications } from '@twilio/flex-ui';
const manager = Manager.getInstance();
const PLUGIN_NAME = 'RecentContactsPlugin';

class ConversationUtil {

  getConversation = async (conversationSid) => {
    console.debug('Getting all Conversation Messages');
    const fetchUrl = `${process.env.FLEX_APP_FUNCTIONS_BASE}/get-conversation`;
    const fetchBody = {
      Token: manager.store.getState().flex.session.ssoTokenPayload.token,
      conversationSid
    };
    const fetchOptions = {
      method: 'POST',
      body: new URLSearchParams(fetchBody),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      }
    };

    let convoData = {};
    try {
      const response = await fetch(fetchUrl, fetchOptions);
      convoData = await response.json();
      console.log(PLUGIN_NAME, 'Conversation Data:', convoData )
    } catch (error) {
      console.error(PLUGIN_NAME, 'Failed to get conversation');
      Notifications.showNotification("UnableToGetConversation")
    }
    return convoData;
  }


}

const conversationUtil = new ConversationUtil();

export default conversationUtil;