import * as React from 'react';

import { Actions, withTaskContext, Icon, TaskHelper, Manager, FlexBox } from '@twilio/flex-ui';
import { Button } from "@twilio/flex-ui-core";
import {
  Container,
  Caption,
  NotesTableCell,
  AttributeName,
  AttributeTextField,
  ButtonsContainer
} from './AgentNotes.styles';

import {
  TableHead,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TextField
} from "@material-ui/core";

let manager = Manager.getInstance();
const PLUGIN_NAME = 'RecentContactsPlugin';

const INITIAL_STATE = {
  case_id: '',
  zipcode: '',
  notes: '',
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
        })
      } else {
        this.setState(INITIAL_STATE);
      }
    }
  }


  handleChange = e => {
    console.log('change event ', e.target);
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
      let newAttributes = { ...task.attributes };
      let conversations = task.attributes.conversations;
      let newConv = {};
      if (conversations) {
        newConv = { ...conversations };
      }
      newConv.case = this.state.case_id;
      newConv.conversation_attribute_10 = this.state.zipcode;
      newConv.content = this.state.notes;
      newAttributes.conversations = newConv;

      await this.props.task.setAttributes(newAttributes);
      console.log(PLUGIN_NAME, 'Task', task.sid, 'updated with', newAttributes);
      this.setState({ changed: false });

      if (TaskHelper.isChatBasedTask(task)) {
        //Update channel
        let channelSid = this.props.task.attributes.channelSid;
        manager.chatClient.getChannelBySid(channelSid)
          .then(async (channel) => {
            let channelAttributes = await channel.getAttributes();
            const newChanAttr = { ...channelAttributes, notes: this.state.notes };
            console.log(PLUGIN_NAME, 'Updated Channel Attributes:', newChanAttr);
            await channel.updateAttributes(newChanAttr);


          });


      }
    }
  }


  render() {
    const { task } = this.props;
    console.log(PLUGIN_NAME, 'Displaying task', task);
    const { changed, case_id, zipcode, notes } = this.state;
    return (

      <div>
        {task && <div>
          <Caption>
            {task && TaskHelper.isCallTask(task) &&
              <div><Icon icon='Call' />Call Notes</div>}
            {task && task.attributes.channelType == 'web' &&
              <div> <Icon icon='Message' />Web Chat Notes</div>}
            {task && task.attributes.channelType == 'sms' &&
              <div><Icon icon='Sms' />SMS Chat Notes </div>}
          </Caption>

          <Table>

            <TableBody>
              <TableRow key="task_sid">
                <NotesTableCell><AttributeName> Task </AttributeName></NotesTableCell>
                <TableCell> {task ? task.sid : 'No Active Task'} </TableCell>
              </TableRow>
              <TableRow key='case_id'>
                <NotesTableCell>
                  <AttributeName>Case ID</AttributeName>
                </NotesTableCell>
                <TableCell>
                  <AttributeTextField id='case_id' value={case_id} onChange={this.handleChange} />
                </TableCell>
              </TableRow>
              <TableRow key='zipcode'>
                <NotesTableCell>
                  <AttributeName>Zip Code</AttributeName>
                </NotesTableCell>
                <TableCell>
                  <AttributeTextField id='zipcode' value={zipcode} onChange={this.handleChange} />
                </TableCell>
              </TableRow>

              <TableRow key='notes'>
                <NotesTableCell>
                  <AttributeName>Notes</AttributeName>
                </NotesTableCell>
                <TableCell>
                  <textarea id="notes"
                    value={notes} onChange={this.handleChange}
                    rows="4" cols="40"
                  />
                </TableCell>
              </TableRow>
            </TableBody>

          </Table>




          <ButtonsContainer>
            <Button
              id="saveButton"
              onClick={this.saveAttributes}

              roundCorners={false}
              disabled={!changed}
            >
              SAVE
            </Button>
          </ButtonsContainer>
        </div>
        }
      </div>

    );
  }
}



export default withTaskContext(AgentNotes);
