import React from 'react';
import { Actions, withTheme, FlexBox } from '@twilio/flex-ui';

import { Actions as ContactHistoryActions } from '../states/ContactHistoryState';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import ChatTranscript from './ChatTranscript/ChatTranscript';
import RecentContacts from '../utils/RecentContacts';
import Tooltip from '@material-ui/core/Tooltip';
import styled from 'react-emotion';
import { Button } from "@twilio/flex-ui-core";
import {
  TableHead,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@material-ui/core";
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import CallIcon from '@material-ui/icons/Call';
import SmartphoneIcon from '@material-ui/icons/Smartphone';
import ChatIcon from '@material-ui/icons/Chat';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

import Paper from '@material-ui/core/Paper';

import ChatUtil from '../utils/ChatUtil';

//import { withStyles } from "@material-ui/core/styles";

const PLUGIN_NAME = 'RecentContactsPlugin';

const ContactData = styled('div')`
  font-size: 12px;
`;

const INITIAL_STATE = {
  selectedChannelSid: undefined,
  messages: [],
  chatFriendlyName: ""
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

  openTranscript = async (channelSid) => {
    Actions.invokeAction('SetComponentState', {
      name: 'ChatTranscript',
      state: { isOpen: true }
    });
    
    const chatData = await ChatUtil.getMessages(channelSid);
    let messages = chatData.messages;
    let chatFriendlyName = chatData.chat_friendly_name
    if (!messages) chatFriendlyName = "Not Available";
    //if no data show notification
    this.setState({ selectedChannelSid: channelSid, messages, chatFriendlyName });
  }

  resetChannel = () => {
    this.setState(INITIAL_STATE);
  }


  render() {
    const { theme } = this.props;
    //console.log('THEME: ', theme);
    return (
      <FlexBox>
        <FlexBox vertical>
          <Button
          themeOverride={theme.WorkerSkills.SaveButton}
          roundCorners={false}
            onClick={() => {
              this.props.clearHistory();
              RecentContacts.clearContactList();
            }}
          > CLEAR HISTORY </Button>
          <Paper elevation={0} style={{ maxHeight: '100%', overflow: 'auto', margin: '6px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Channel</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Date & Time</TableCell>
                <TableCell align="center">Duration</TableCell>
                <TableCell>Queue</TableCell>
                <TableCell>Outcome</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell>Notes</TableCell>
                <TableCell>Transcript</TableCell>
              </TableRow>

            </TableHead>
            <TableBody>
              {this.props.contactList.map((rc) => (

                <TableRow key={rc.taskSid}>
                  <TableCell>
                    {rc.channelType == 'voice' &&
                      <Button
                        title='Call'
                        onClick={() => {
                          this.startContact(rc);
                        }}
                      > <CallIcon />
                        {rc.direction == 'inbound' && <ArrowLeftIcon /> }
                        {rc.direction == 'outbound' && <ArrowRightIcon />}
                      </Button>
                    }

                    {rc.channelType == 'sms' &&
                      <Button
                        title='SMS'
                        onClick={() => {
                          this.startContact(rc);
                        }}
                      > <SmartphoneIcon /> </Button>
                    }
                    {rc.channelType == 'web' &&
                      <Button
                        title='WebChat'
                      > <ChatIcon /> </Button>
                    }
                    {rc.channelType == 'custom' &&
                      <Button
                        title='Custom Chat'
                      > <ChatBubbleOutlineIcon /> </Button>
                    }
                  </TableCell>
                  <TableCell><ContactData>{rc.number}</ContactData></TableCell>
                  <TableCell><ContactData>{rc.name}</ContactData></TableCell>
                  <TableCell><ContactData>{rc.dateTime}</ContactData></TableCell>
                  <TableCell align="center"><ContactData>{rc.duration}</ContactData></TableCell>
                  <TableCell><ContactData>{rc.queue}</ContactData></TableCell>
                  <TableCell><ContactData>{rc.outcome}</ContactData></TableCell>
                  <TableCell align="center"><ContactData>
                  { rc.chatStatus == 'Pending' ?
                       <Tooltip title='Pending SMS or Chat' placement="bottom">
                         <PauseCircleOutlineIcon /></Tooltip> :
                       <Tooltip title='Conversation Complete' placement="bottom">
                       <CheckCircleOutlineIcon /></Tooltip> }
                  </ContactData></TableCell>
                  <TableCell><ContactData>
                  {rc.notes &&
                  <Tooltip title={rc.notes} placement="bottom">
                    <div>{rc.notes.substring(0,10).concat('...')} </div>
                  </Tooltip>
                  }
                  </ContactData></TableCell>
                  <TableCell>
                    {rc.channel !== 'voice' &&
                      <Button
                        disabled={rc.channel == 'voice'}
                        onClick={() => {
                          this.openTranscript(rc.channelSid);
                        }}
                      > <QuestionAnswerIcon /> </Button>
                    }
                  </TableCell>
                </TableRow>))}
            </TableBody>
          </Table>
          </Paper>
        </FlexBox>
        <ChatTranscript key="chat-channel-transcript" 
        channelSid={this.state.selectedChannelSid} 
        chatFriendlyName={this.state.chatFriendlyName} 
        messages={this.state.messages} 
        resetChannel={this.resetChannel} />
      </FlexBox>
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
