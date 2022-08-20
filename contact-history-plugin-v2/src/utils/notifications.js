import {
  Notifications,
  NotificationBar,
  NotificationType,
} from "@twilio/flex-ui";


const registerFailedToGetConversation = (manager) => {
  manager.strings.UnableToGetConversation = 'Unable to Retrieve Conversation Transcript';
  Notifications.registerNotification({
    id: "UnableToGetConversation",
    content: "UnableToGetConversation", // template
    closeButton: true,
    timeout: 3000,
    type: NotificationType.warning
  });
};


const registerNotifications = (manager) => {
  registerFailedToGetConversation(manager);
};

export default registerNotifications;
