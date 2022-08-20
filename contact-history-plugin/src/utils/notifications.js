import {
  Notifications,
  NotificationBar,
  NotificationType,
} from "@twilio/flex-ui";


const registerFailedToGetChat = (manager) => {
  manager.strings.UnableToGetChat = 'Unable to Retrieve Chat Transcript';
  Notifications.registerNotification({
    id: "UnableToGetChat",
    content: "UnableToGetChat", // template
    closeButton: true,
    timeout: 3000,
    type: NotificationType.warning
  });
};


const registerNotifications = (manager) => {
  registerFailedToGetChat(manager);
};

export default registerNotifications;
