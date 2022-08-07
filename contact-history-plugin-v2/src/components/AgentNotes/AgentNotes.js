import * as React from 'react';

import { withTaskContext, withTheme, Icon, TaskHelper, Manager } from '@twilio/flex-ui';
import { Theme } from '@twilio-paste/core/theme';
import { Button, Input, Flex, Box, Label, Text, TextArea, Table, THead, TBody, Th, Tr, Td } from "@twilio-paste/core";

import { updateConversations } from '../../utils/taskUtil'
let manager = Manager.getInstance();
const PLUGIN_NAME = 'RecentContactsPlugin';

const INITIAL_STATE = {
  case_id: '',
  zipcode: '',
  notes: '',
  previousNotes: '',
  changed: false
}

class AgentNotes extends React.Component {
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):

    if (this.props.task !== prevProps.task) {
      //Init state from task
      const task = this.props.task;
      if (task) {
        this.setState({
          case_id: task.attributes?.conversations?.case || '',
          zipcode: task.attributes?.conversations?.conversation_attribute_10 || '',
          notes: task.attributes?.conversations?.content || '',
          previousNotes: task.attributes?.previousNotes || ''
        });
      } else {
        this.setState(INITIAL_STATE);
      }
    }
  }


  handleChange = e => {
    const value = e.target.value;
    //Text Field id needs to match State property
    const id = e.target.id;
    let newState = { changed: true };
    newState[id] = value;
    this.setState(newState);
  }

  saveAttributes = async () => {
    console.log(PLUGIN_NAME, 'Saving notes', this.state);

    let task = this.props.task;
    if (task) {
      let convData = {
        case: this.state.case_id,
        conversation_attribute_10: this.state.zipcode,
        content: this.state.notes
      };
      await updateConversations(task, convData);
      this.setState({ changed: false });

      if (TaskHelper.isChatBasedTask(task)) {
        //Update channel
        let conversationSid = this.props.task.attributes.conversationSid;
        manager.conversationsClient.getConversationBySid(conversationSid)
          .then(async (conversation) => {
            let convoAttributes = await conversation.getAttributes();
            //Combine old and new notes
            let newNotes = "";
            if (this.state.previousNotes.length > 0) {
              newNotes = this.state.previousNotes + " | " + this.state.notes;
            } else {
              newNotes = this.state.notes;
            }
            const newConvoAttr = { ...convoAttributes, notes: newNotes, caseId: this.state.case_id };
            console.log(PLUGIN_NAME, 'Updated Conversation Attributes:', newConvoAttr);
            await conversation.updateAttributes(newConvoAttr);

          });
      }
    }
  }


  render() {
    const { task } = this.props;
    const { changed, case_id, zipcode, notes, previousNotes } = this.state;
    return (
      <Theme.Provider theme="flex">
        <Flex>
          {task &&
            <Flex vertical>
              <Table>
                <THead>
                  <Tr>
                    <Th>
                      {task && TaskHelper.isCallTask(task) && <Icon icon='Call' />}
                      {task && task.attributes.channelType == 'web' && <Icon icon='Message' />}
                      {task && task.attributes.channelType == 'sms' && <Icon icon='Sms' />}
                    </Th>
                    <Th>
                      Conversation Notes
                    </Th>
                  </Tr>
                </THead>
                <TBody>
                  <Tr key="task_sid">
                    <Th scope="row"> Task </Th>
                    <Td> {task ? task.sid : 'No Active Task'} </Td>
                  </Tr>
                  <Tr key='case_id'>
                    <Th scope="row">
                      <Label htmlFor="case_id">Case ID</Label>
                    </Th>
                    <Td>
                      <Input id='case_id' value={case_id} onChange={this.handleChange} />
                    </Td>
                  </Tr>
                  <Tr key='zipcode'>
                    <Th scope="row">
                      <Label htmlFor="zipcode">Zip Code</Label>
                    </Th>
                    <Td>
                      <Input id='zipcode' value={zipcode} onChange={this.handleChange} />
                    </Td>
                  </Tr>
                  <Tr key='previous-notes'>
                    <Th scope="row"><Label>Previous Notes</Label></Th>
                    <Td>
                      {previousNotes}
                    </Td>
                  </Tr>
                  <Tr key='notes'>
                    <Th scope="row"><Label htmlFor="notes" required>Notes</Label></Th>
                    <Td>
                      <TextArea id="notes"
                        value={notes} onChange={this.handleChange}
                        rows="4" cols="40"
                      />
                    </Td>
                  </Tr>
                  <Tr key='button'>
                    <Td />
                    <Td>
                      <Button variant="primary" size="small"
                        id="saveButton"
                        onClick={this.saveAttributes}
                        disabled={!changed}
                      >
                        Save
                      </Button>
                    </Td>
                  </Tr>
                </TBody>
              </Table>
            </Flex>
          }
        </Flex>
      </Theme.Provider>
    );
  }
}



export default withTaskContext(withTheme(AgentNotes));
