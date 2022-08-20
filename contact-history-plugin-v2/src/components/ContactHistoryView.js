import React from 'react';
import { Actions, withTheme, Icon } from '@twilio/flex-ui';

import { Actions as ContactHistoryActions } from '../states/ContactHistoryState';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import ChatTranscript from './ChatTranscript/ChatTranscript';
import RecentContacts from '../utils/RecentContacts';

import { Theme } from '@twilio-paste/core/theme';
import { Button, Flex, Box, Label, Text, Tooltip, Table, THead, TBody, Th, Tr, Td } from "@twilio-paste/core";

import { ArrowBackIcon } from "@twilio-paste/icons/esm/ArrowBackIcon";
import { ArrowForwardIcon } from "@twilio-paste/icons/esm/ArrowForwardIcon";
import { CheckboxCheckIcon } from "@twilio-paste/icons/esm/CheckboxCheckIcon";
import { PauseIcon } from "@twilio-paste/icons/esm/PauseIcon";
import { SMSCapableIcon } from "@twilio-paste/icons/esm/SMSCapableIcon";
import { ProductChatIcon } from "@twilio-paste/icons/esm/ProductChatIcon";

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

                  <Tr key={rc.taskSid}>
                    <Td textAlign="center">
                      <Flex hAlignContent="center">
                        <Box>
                          {rc.channelType == 'voice' &&
                            <Button variant="link" size="small"
                              title='Call'
                              onClick={() => {
                                this.startContact(rc);
                              }}
                            > <Icon icon='Call' />
                              {rc.direction == 'inbound' && <ArrowBackIcon decorative={false} title="Incoming" />}
                              {rc.direction == 'outbound' && <ArrowForwardIcon decorative={false} title="Outgoing" />}
                            </Button>
                          }
                          {rc.channelType == 'sms' &&
                            <Button variant="link" size="small"
                              title='SMS'
                              onClick={() => {
                                this.startContact(rc);
                              }}
                            > <Icon icon='Sms' /> </Button>
                          }
                          {rc.channelType == 'web' &&
                            <Icon icon='Message' />
                          }
                          {rc.channelType == 'custom' &&
                            <ProductChatIcon decorative={false} title="Custom Chat" />
                          }
                        </Box>
                      </Flex>
                    </Td>
                    <Td>{rc.number}</Td>
                    <Td>{rc.name}</Td>
                    <Td>{rc.dateTime}</Td>
                    <Td textAlign="center">{rc.duration}</Td>
                    <Td>{rc.queue}</Td>
                    <Td>{rc.outcome}</Td>
                    <Td textAlign="center">
                      {rc.chatStatus == 'Pending' ?
                        <PauseIcon decorative={false} title="Pending/Parked" /> :
                        <CheckboxCheckIcon decorative={false} title="Completed" />
                      }
                    </Td>
                    <Td>
                      {rc.notes &&
                        <Tooltip text={rc.notes} placement="bottom">
                          <Text>{rc.notes.substring(0, 10).concat('...')} </Text>
                        </Tooltip>
                      }
                    </Td>
                    <Td textAlign="center">
                      {rc.channel !== 'voice' &&
                        <Button variant="link" size="small"
                          disabled={rc.channel == 'voice'}
                          onClick={() => {
                            this.openTranscript(rc.conversationSid);
                          }}
                        > 
                        <SMSCapableIcon decorative={false} title="Chat Transcript" />
                         </Button>
                      }
                    </Td>
                  </Tr>))}
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
