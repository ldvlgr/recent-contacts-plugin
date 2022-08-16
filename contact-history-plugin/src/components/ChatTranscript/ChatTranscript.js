import * as React from 'react';
import { connect } from 'react-redux';
import { Actions, withTheme, SidePanel } from '@twilio/flex-ui';

import Paper from '@material-ui/core/Paper';

import {
  Caption,
  MessageBoxAgent,
  MessageBoxCustomer,
  MessageBubbleAgent,
  MessageBubbleCustomer,
  MessageBody,
  MessageFrom

} from './ChatTranscript.styles';

import ChatUtil from '../../utils/ChatUtil';

const PLUGIN_NAME = 'RecentContactsPlugin';

const INITIAL_STATE = { messages: [], fiendlyName: 'Loading...', channelType: '' };

//NEW SidePanel
class ChatTranscript extends React.Component {
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE
  }

  handleClose = () => {
    this.setState(INITIAL_STATE);
    Actions.invokeAction('SetComponentState', {
      name: 'ChatTranscript',
      state: { isOpen: false }
    });
  }

  async componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.channelSid && this.props.channelSid !== prevProps.channelSid) {
      //Get Chat messages and init component state
      const channelSid = this.props.channelSid;
      let chatData = await ChatUtil.getMessages(channelSid);

      this.setState({
        messages: chatData.messages,
        fiendlyName: chatData.chat_friendly_name,
        channelType: chatData.channel_type
      })
    }
  }


  render() {
    const { isOpen, channelSid } = this.props;

    return (

      <SidePanel
        displayName="ChatTranscriptPanel"
        title={<div>Chat Transcript</div>}
        isHidden={!isOpen}
        handleCloseClick={this.handleClose}
      >
        <Caption>{this.state.fiendlyName}</Caption>
        <Paper elevation={2} style={{ height: 'auto', maxHeight: 600, overflow: 'auto', margin: '6px 12px' }}>
          <div>
            {this.state.messages.map((m) => {
              let dt = new Date(m.date).toLocaleTimeString('en-US');
              return (<div>
                  {m.member_name == "Customer" &&
                    <MessageBoxCustomer key={m.index}>
                      <MessageBubbleCustomer>
                        <MessageFrom>{m.member_name + " (" + dt + ")"}</MessageFrom>
                        <MessageBody>{m.body}</MessageBody>
                        
                      </MessageBubbleCustomer>
                    </MessageBoxCustomer>}

                  {m.member_name !== "Customer" &&
                    <MessageBoxAgent key={m.index}>
                      <MessageBubbleAgent>
                        <MessageFrom>{m.member_name + " (" + dt + ")"}</MessageFrom>
                        <MessageBody>{m.body}</MessageBody>
                      </MessageBubbleAgent>
                    </MessageBoxAgent>}
                </div>)
            }
            )}
          </div>
        </Paper>

      </SidePanel >
    );
  }
}

const mapStateToProps = state => {
  const componentViewStates = state.flex.view.componentViewStates;
  const dialogState = componentViewStates && componentViewStates.ChatTranscript;
  const isOpen = dialogState && dialogState.isOpen;
  return {
    isOpen
  };
};

export default connect(mapStateToProps)(withTheme(ChatTranscript));
