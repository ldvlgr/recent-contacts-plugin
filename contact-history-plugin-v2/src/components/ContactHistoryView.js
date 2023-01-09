import React, { useState } from 'react';
import { Actions, withTheme } from '@twilio/flex-ui';
import { useDispatch, useSelector } from 'react-redux';

import { Actions as ContactHistoryActions } from '../states/ContactHistoryState';
import ChatTranscript from './ChatTranscript/ChatTranscript';
import RecentContacts from '../utils/RecentContacts';

import { Theme } from '@twilio-paste/core/theme';
import { Button, Flex, Box, Table, THead, TBody, Th, Tr } from "@twilio-paste/core";

import ContactRecord from './ContactRecord';
import ConversationUtil from '../utils/ConversationUtil';

const PLUGIN_NAME = 'RecentContactsPlugin';

const ContactHistory = () => {
  const [selectedConversationSid, setSelectedConversationSid] = useState();
  const [messages, setMessages] = useState([]);
  const [conversationFriendlyName, setConversationFriendlyName] = useState('');

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
    let messages = convoData.messages;
    let conversationFriendlyName = convoData.friendly_name;
    if (!messages) conversationFriendlyName = "Not Available";
    //if no data show notification
    setSelectedConversationSid(conversationSid);
    setMessages(messages);
    setConversationFriendlyName(conversationFriendlyName);
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
            > Clear History </Button>
          </Box>
          <Table>
            <THead>
              <Tr>
                <Th>Channel</Th>
                <Th>Phone Number</Th>
                <Th>Name</Th>
                <Th>Date & Time</Th>
                <Th align="center">Duration</Th>
                <Th>Queue</Th>
                <Th>Outcome</Th>
                <Th align="center">Status</Th>
                <Th>Notes</Th>
                <Th>Transcript</Th>
              </Tr>

            </THead>
            <TBody>
              {contactList?.map((rc) => (
                <ContactRecord rc={rc} startContact={startContact} openTranscript={openTranscript} />
              ))}
            </TBody>
          </Table>
        </Flex>
        <ChatTranscript key="chat-transcript"
          conversationSid={selectedConversationSid}
          conversationFriendlyName={conversationFriendlyName}
          messages={messages}
          resetConversation={resetConversation} />
      </Flex>
    </Theme.Provider>
  );

}

export default withTheme(ContactHistory);