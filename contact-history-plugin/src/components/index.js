import * as Flex from "@twilio/flex-ui";
import AgentNotes from './AgentNotes/AgentNotes';
import PendingButton from './PendingButton/PendingButton';
import RecentContactsNavButton from './RecentContactsNavButton';
import ContactHistory from './ContactHistoryView';
import DispositionDialog from './DispositionDialog';

export default (manager) => {
  addAgentNotesPanel();
  addPendingChatButton();
  addContactHistory(manager);
  addDispositionDialog();
}

const addAgentNotesPanel = () => {
  Flex.AgentDesktopView.Panel2.Content.replace(<AgentNotes key="agent-notes" />);
}

const addPendingChatButton = () => {
  Flex.TaskCanvasHeader.Content.add(<PendingButton key="chat-pending-button" />, {
    sortOrder: 1,
    if: (props) =>
      props.task.attributes.channelType == "sms"
      && props.task.taskStatus === 'assigned',
  });
}

const addContactHistory = () => {
  //Recent Contacts side nav button and new view
  Flex.SideNav.Content.add(
    <RecentContactsNavButton key="recent-contacts-sidenav-button" />, { sortOrder: 2 }
  );

  // Add view to the ViewCollection
  Flex.ViewCollection.Content.add(
    <Flex.View name="recent-contacts-view" key="recent-contacts-view">
      <ContactHistory key="co-recent-view" />
    </Flex.View>
  );
}

const addDispositionDialog = () => {
  Flex.AgentDesktopView.Panel1.Content.add(<DispositionDialog
    key="disposition-modal"
  />, { sortOrder: 100 });
}
