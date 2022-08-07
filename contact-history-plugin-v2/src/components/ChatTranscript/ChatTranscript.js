import * as React from 'react';
import { connect } from 'react-redux';
import { Actions, withTheme, SidePanel, MessagingCanvas } from '@twilio/flex-ui';

import { Theme } from '@twilio-paste/core/theme';
import { Flex, Box, Text } from "@twilio-paste/core";

const PLUGIN_NAME = 'RecentContactsPlugin';

const INITIAL_STATE = {};

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


  render() {
    const { isOpen, conversationSid } = this.props;
    console.log(PLUGIN_NAME, 'Transcript for:', conversationSid );
    return (
      <Theme.Provider theme="flex">

        <SidePanel
          displayName="ChatTranscriptPanel"
          className="chatTranscript"
          title={<div>Chat Transcript</div>}
          isHidden={!isOpen}
          handleCloseClick={this.handleClose}
        >
          <Flex vertical>
            <Box>
              {this.props.conversationSid ?
                <MessagingCanvas
                  sid={this.props.conversationSid}
                  autoInitChannel={true} // Must do this to see the messages!
                  showWelcomeMessage={false}
                  inputDisabledReason='Chat History'
                />
                :
                <Text>Select Conversation</Text>}
            </Box>
          </Flex>
        </SidePanel >
      </Theme.Provider>
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
