import { Actions } from '@twilio/flex-ui';
import RecentContacts from '../utils/RecentContacts';
import { updateTaskAndConversationsAttributes } from '../utils/taskUtil'
const PLUGIN_NAME = 'RecentContactsPlugin';

export default (manager) => {
  manager.workerClient.on("reservationCreated", (reservation) => {
    console.log(PLUGIN_NAME, 'reservationCreated: ', reservation);

    reservation.on('accepted', async (reservation) => {
      console.log(PLUGIN_NAME, 'Reservation Accepted: ', reservation);

      // https://media.twiliocdn.com/sdk/js/chat/releases/3.2.4/docs/Client.html#event:channelAdded
      // Fired when a Channel becomes visible to the Client. 
      // Fired for created and not joined private channels and for all type of channels Client has joined or invited to.
      manager.chatClient.on("channelAdded", async (channel) => {
        try {
          console.log(PLUGIN_NAME, 'Channel Added.');
          let channelAttributes = await channel.getAttributes();
          console.log(PLUGIN_NAME, 'Channel Added. Got Channel Attributes:', channelAttributes);
          if (channelAttributes.long_lived) {
            let newAttr = {};
            let convData = {}
            if (channelAttributes.customerName) newAttr.customerName = channelAttributes.customerName;
            if (channelAttributes.notes) newAttr.previousNotes = channelAttributes.notes;
            if (channelAttributes.caseId) convData.case = channelAttributes.caseId;
            await updateTaskAndConversationsAttributes(reservation.task, newAttr, convData);
          }
        } catch (e) {
          console.log(PLUGIN_NAME, 'getChannel failed', e);
        }
      });
    });

    reservation.on('wrapup', reservation => {
      Actions.invokeAction('SetComponentState', {
        name: 'DispositionDialog',
        state: { isOpen: true }
      });
    });

    reservation.on('completed', reservation => {
      RecentContacts.addContact(reservation);
    });
  });
}