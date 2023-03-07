import React, { useState } from 'react';
import { 
  Actions, 
  withTheme,
  templates,
  Template
} from '@twilio/flex-ui';
import { useDispatch, useSelector } from 'react-redux';

import { Actions as ContactHistoryActions } from '../states/ContactHistoryState';
import ChatTranscript from './ChatTranscript/ChatTranscriptV2';
import RecentContacts from '../utils/RecentContacts';

import { Theme } from '@twilio-paste/core/theme';
import { Button, Flex, Box, Table, THead, TBody, Th, Tr } from "@twilio-paste/core";

import ContactRecord from './ContactRecord';
import ConversationUtil from '../utils/ConversationUtil';
import { PLUGIN_NAME } from '../utils/constants';

const ContactHistory = () => {
  const [selectedConversationSid, setSelectedConversationSid] = useState();
  const [messages, setMessages] = useState([]);
  const [conversationFriendlyName, setConversationFriendlyName] = useState('');
  const [conversationDateCreated, setConversationDateCreated] = useState('');
  

  const contactData = useSelector(
    state => { return {contactList: state['recent-contacts']?.contactHistory?.contactList }; }
  );
  //console.log(PLUGIN_NAME, 'contactData:', contactData);
  let contactList = contactData?.contactList || [];
  const dispatch = useDispatch();

  const startContact = async (contact) => {
    console.log(PLUGIN_NAME, contact);
    if (contact.channel == "sms") {
      //send SMS
      console.log(PLUGIN_NAME, "Sending SMS");
      //Needs implementation
    } else if (contact.channel == "voice") {
      //voice
      console.log(PLUGIN_NAME, "Starting Outbound Call to", contact.number);
      Actions.invokeAction("StartOutboundCall", {
        destination: contact.number,
      });
    }
  };

  const openTranscript = async (conversationSid) => {
    Actions.invokeAction('SetComponentState', {
      name: 'ChatTranscript',
      state: { isOpen: true }
    });

    const convoData = await ConversationUtil.getConversation(conversationSid);
    console.log(PLUGIN_NAME, convoData);
    let messages = convoData.messages;
    let conversationFriendlyName = convoData.friendlyName;
    if (!messages) conversationFriendlyName = "Not Available";
    setConversationFriendlyName(conversationFriendlyName);
    setConversationDateCreated(convoData.conversationDateCreated);

    //if no data show notification
    setSelectedConversationSid(conversationSid);
    setMessages(messages);
    console.log(PLUGIN_NAME, messages);
    
  }

  const resetConversation = () => {
    setSelectedConversationSid(undefined);
    setMessages([]);
    setConversationFriendlyName('');
  }

const clearHistory = ()=> {
  dispatch(ContactHistoryActions.clearHistory());
  RecentContacts.clearContactList();
}

  return (
    <Theme.Provider theme="flex">
      <Flex>
        <Flex vertical >
          <Box padding="space40">
            <Button variant="primary"
              onClick={clearHistory}
            > 
            <Template source={templates.ClearHistory} />
            </Button>
          </Box>
          <Table>
            <THead>
              <Tr>
                <Th><Template source={templates.ContactChannel} /></Th>
                <Th><Template source={templates.ContactPhoneNumber} /></Th>
                <Th><Template source={templates.ContactName} /></Th>
                <Th><Template source={templates.ContactDateTime} /></Th>
                <Th align="center"><Template source={templates.ContactDuration} /></Th>
                <Th><Template source={templates.ContactQueue} /></Th>
                <Th><Template source={templates.ContactOutcome} /></Th>
                <Th align="center"><Template source={templates.ContactStatus} /></Th>
                <Th><Template source={templates.ContactNotes} /></Th>
                <Th><Template source={templates.ContactTranscript} /></Th>
              </Tr>

            </THead>
            <TBody>
              {contactList?.map((rc) => (
                <ContactRecord key={rc.taskSid} rc={rc} startContact={startContact} openTranscript={openTranscript} />
              ))}
            </TBody>
          </Table>
        </Flex>
        <ChatTranscript key="chat-transcript"
          conversationSid={selectedConversationSid}
          conversationFriendlyName={conversationFriendlyName}
          dateCreated={conversationDateCreated}
          messages={messages}
          resetConversation={resetConversation} />
      </Flex>
    </Theme.Provider>
  );

}

export default withTheme(ContactHistory);