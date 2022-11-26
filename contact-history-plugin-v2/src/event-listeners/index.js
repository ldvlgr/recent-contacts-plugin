import { Actions } from '@twilio/flex-ui';
import RecentContacts from '../utils/RecentContacts';
import { updateTaskAndConversationsAttributes } from '../utils/taskUtil'
const PLUGIN_NAME = 'RecentContactsPlugin';

export default (manager) => {
  manager.workerClient.on("reservationCreated", (reservation) => {
    console.log(PLUGIN_NAME, 'reservationCreated: ', reservation);

    reservation.on('accepted', async (reservation) => {
      console.log(PLUGIN_NAME, 'Reservation Accepted: ', reservation);

      manager.conversationsClient.on("conversationAdded", async (conversation) => {
        try {
          console.log(PLUGIN_NAME, 'Conversation Added.');
          let convoAttributes = await conversation.getAttributes();
          console.log(PLUGIN_NAME, 'Conversation Added. Got Attributes:', convoAttributes);
          // TODO: How to check if this was a parked/pending conversation
          // let newAttr = {};
          // let convData = {}
          // if (convoAttributes.notes) newAttr.previousNotes = convoAttributes.notes;
          // if (convoAttributes.caseId) convData.case = convoAttributes.caseId;
          // await updateTaskAndConversationsAttributes(reservation.task, newAttr, convData);

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