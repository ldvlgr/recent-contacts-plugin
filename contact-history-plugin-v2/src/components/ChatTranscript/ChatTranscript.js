import * as React from 'react';
import { connect } from 'react-redux';
import { 
  Actions, 
  withTheme, 
  SidePanel,
  templates,
  Template 
} from '@twilio/flex-ui';

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

class ChatTranscript extends React.Component {
  constructor(props) {
    super(props);
  }

  handleClose = () => {
    this.props.resetConversation();
    Actions.invokeAction('SetComponentState', {
      name: 'ChatTranscript',
      state: { isOpen: false }
    });
  }

  render() {
    const { isOpen } = this.props;

    return (

      <SidePanel
        displayName="ChatTranscriptPanel"
        title={<Template source={templates.ChatTranscriptHeading} />}
        isHidden={!isOpen}
        handleCloseClick={this.handleClose}
      >
        <Caption>{this.props.conversationFriendlyName}</Caption>
        {this.props.messages &&
          <Paper elevation={2} style={{ height: 'auto', maxHeight: 600, overflow: 'auto', margin: '6px 12px' }}>
            <div>
              {this.props.messages.map((m) => {
                let dt = new Date(m.date).toLocaleTimeString('en-US');
                return (<div key={"msg-" + m.index + dt}>
                  {m.author.includes('+') &&
                    <MessageBoxCustomer key={m.index}>
                      <MessageBubbleCustomer>
                        <MessageFrom>{m.author + " (" + dt + ")"}</MessageFrom>
                        <MessageBody>{m.body}</MessageBody>

                      </MessageBubbleCustomer>
                    </MessageBoxCustomer>}

                  {!m.author.includes('+') &&
                    <MessageBoxAgent key={m.index}>
                      <MessageBubbleAgent>
                        <MessageFrom>{m.author + " (" + dt + ")"}</MessageFrom>
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
