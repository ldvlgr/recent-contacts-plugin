import { Manager, Notifications } from '@twilio/flex-ui';
const manager = Manager.getInstance();
const PLUGIN_NAME = 'RecentContactsPlugin';

class ChatUtil {

  getMessages = async (channelSid) => {
    console.debug('Getting all Chat Messages');
    const fetchUrl = `${process.env.FLEX_APP_FUNCTIONS_BASE}/get-chat-messages`;
    const fetchBody = {
      Token: manager.store.getState().flex.session.ssoTokenPayload.token,
      channelSid
    };
    const fetchOptions = {
      method: 'POST',
      body: new URLSearchParams(fetchBody),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      }
    };

    let chatData = {};
    try {
      const response = await fetch(fetchUrl, fetchOptions);
      chatData = await response.json();
      console.log(PLUGIN_NAME, 'Chat Data:',chatData )
    } catch (error) {
      console.error(PLUGIN_NAME, 'Failed to get messages');
      Notifications.showNotification("UnableToGetChat")
    }
    return chatData;
  }


}

const chatUtil = new ChatUtil();

export default chatUtil;