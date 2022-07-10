import * as React from 'react';
import { connect } from 'react-redux';
import { Actions, withTheme, Manager, SidePanel, FlexBox, MessagingCanvas } from '@twilio/flex-ui';
import {
  Container,
  Caption,

} from './ChatTranscript.styles';




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
    const { isOpen, channelSid, theme } = this.props;

    return (

      <SidePanel
        displayName="ChatTranscriptPanel"
        className="chatTranscript"
        title={<div>Chat Transcript</div>}
        isHidden={!isOpen}
        handleCloseClick={this.handleClose}
      >
        <Container vertical>
          <MessagingCanvas
            sid={this.props.channelSid}
            autoInitChannel={true} // Must do this to see the messages!
            showWelcomeMessage={false}
            inputDisabledReason='Chat History'
          />

        </Container>
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
