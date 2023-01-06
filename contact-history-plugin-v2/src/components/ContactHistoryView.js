import React from 'react';
import { Actions, withTheme } from '@twilio/flex-ui';

import { Actions as ContactHistoryActions } from '../states/ContactHistoryState';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import ChatTranscript from './ChatTranscript/ChatTranscript';
import RecentContacts from '../utils/RecentContacts';

import { Theme } from '@twilio-paste/core/theme';
import { Button, Flex, Box, Table, THead, TBody, Th, Tr } from "@twilio-paste/core";

import ContactRecord from './ContactRecord';
import ConversationUtil from '../utils/ConversationUtil';

const PLUGIN_NAME = 'RecentContactsPlugin';

const INITIAL_STATE = {
  selectedConversationSid: undefined,
  messages: [],
  conversationFriendlyName: ""
};

class ContactHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
  }

  startContact = async (contact) => {
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

  openTranscript = async (conversationSid) => {
    Actions.invokeAction('SetComponentState', {
      name: 'ChatTranscript',
      state: { isOpen: true }
    });
    
    const convoData = await ConversationUtil.getConversation(conversationSid);
    let messages = convoData.messages;
    let conversationFriendlyName = convoData.friendly_name;
    if (!messages) conversationFriendlyName = "Not Available";
    //if no data show notification
    this.setState({ selectedConvoSid: conversationSid, messages, conversationFriendlyName });
    
  }

  resetConversation = () => {
    this.setState(INITIAL_STATE);
  }


  render() {
    return (
      <Theme.Provider theme="flex">
        <Flex>
          <Flex vertical>
            <Box padding="space40">
              <Button variant="primary"
                onClick={() => {
                  this.props.clearHistory();
                  RecentContacts.clearContactList();
                }}
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
                {this.props.contactList.map((rc) => (
                  <ContactRecord rc={rc} startContact={this.startContact} openTranscript={this.openTranscript} />
                  )) }
              </TBody>
            </Table>
          </Flex>
          <ChatTranscript key="chat-transcript" 
          conversationSid={this.state.selectedConversationSid} 
          conversationFriendlyName={this.state.conversationFriendlyName} 
          messages={this.state.messages} 
          resetConversation={this.resetConversation} />
        </Flex>
      </Theme.Provider>
    );
  };
}


const mapStateToProps = state => {
  return {
    contactList: state['recent-contacts']?.contactHistory?.contactList
  };
}

const mapDispatchToProps = (dispatch) => ({
  clearHistory: bindActionCreators(ContactHistoryActions.clearHistory, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(ContactHistory));
