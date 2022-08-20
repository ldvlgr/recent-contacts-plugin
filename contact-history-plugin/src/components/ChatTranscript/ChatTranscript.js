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

const PLUGIN_NAME = 'RecentContactsPlugin';

//NEW SidePanel
class ChatTranscript extends React.Component {
  constructor(props) {
    super(props);
  }

  handleClose = () => {
    this.props.resetChannel();
    Actions.invokeAction('SetComponentState', {
      name: 'ChatTranscript',
      state: { isOpen: false }
    });
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
        <Caption>{this.props.chatFriendlyName}</Caption>
        {this.props.messages &&
          <Paper elevation={2} style={{ height: 'auto', maxHeight: 600, overflow: 'auto', margin: '6px 12px' }}>
            <div>
              {this.props.messages.map((m) => {
                let dt = new Date(m.date).toLocaleTimeString('en-US');
                return (<div key={"msg-" + m.index + dt}>
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
        }

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
