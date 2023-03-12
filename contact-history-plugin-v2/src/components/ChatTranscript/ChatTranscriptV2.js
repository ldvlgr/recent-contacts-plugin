import * as React from 'react';
import { useSelector } from 'react-redux';
import {
  Actions,
  SidePanel,
  templates,
  Template
} from '@twilio/flex-ui';

import Paper from '@material-ui/core/Paper';

//New version using Paste components
import {
  ChatLog,
  ChatBookend,
  ChatBookendItem,
  ChatMessage,
  ChatBubble,
  ChatMessageMeta,
  ChatMessageMetaItem
} from "@twilio-paste/core";
import { PLUGIN_NAME } from '../../utils/constants';

const ChatTranscript = ({ conversationSid, dateCreated, messages, resetConversation }) => {

  const isOpen = useSelector(
    state => {
      const componentViewStates = state.flex.view.componentViewStates;
      const dialogState = componentViewStates && componentViewStates.ChatTranscript;
      return dialogState && dialogState.isOpen;
    }
  );

  const handleClose = () => {
    resetConversation();
    Actions.invokeAction('SetComponentState', {
      name: 'ChatTranscript',
      state: { isOpen: false }
    });
  }

  const chatStarted = new Date(dateCreated).toLocaleTimeString('en-US');
  return (

    <SidePanel
      displayName="ChatTranscriptPanel"
      title={<Template source={templates.ChatTranscriptHeading} />}
      isHidden={!isOpen}
      handleCloseClick={handleClose}
    >
      {messages &&
        <Paper elevation={2} style={{ height: 'auto', maxHeight: 600, overflow: 'auto', margin: '6px' }}>
          <ChatLog>
            <ChatBookend>
              <ChatBookendItem>{conversationSid}</ChatBookendItem>
              <ChatBookendItem>
                <strong>Chat Started</strong>・{chatStarted}
              </ChatBookendItem>
            </ChatBookend>
            {messages.map((m) => {
              let dt = new Date(m.date).toLocaleTimeString('en-US');
              let variant = "inbound";
              if (!m.author.includes('+')) variant = "outbound";
              return (
                <ChatMessage variant={variant} key={m.index}>
                  <ChatBubble>
                    {m.body}
                  </ChatBubble>
                  <ChatMessageMeta aria-label="message from author">
                    <ChatMessageMetaItem>
                      {m.author + " (" + dt + ")"}
                    </ChatMessageMetaItem>
                  </ChatMessageMeta>
                </ChatMessage>)
            })}
          </ChatLog>
        </Paper>
      }
    </SidePanel >
  );
}

export default ChatTranscript;
