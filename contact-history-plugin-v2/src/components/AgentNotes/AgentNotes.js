import React, { useState, useEffect } from 'react';

import { Actions, withTaskContext, withTheme, Icon, TaskHelper, Manager } from '@twilio/flex-ui';
import { Theme } from '@twilio-paste/core/theme';
import { Button, Input, Flex, Box, Label, Text, TextArea, Table, THead, TBody, Th, Tr, Td } from "@twilio-paste/core";

let manager = Manager.getInstance();
const PLUGIN_NAME = 'RecentContactsPlugin';


//Agent Notes Flex UI 2.0 Refactor with Hooks
const AgentNotes = ({ task }) => {

  //console.log(PLUGIN_NAME, 'Show Agent notes for task:', task);
  const [customerName, setCustomerName] = useState('');
  const [caseId, setCaseId] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [notes, setNotes] = useState('');
  const [previousNotes, setPreviousNotes] = useState('');
  const [changed, setChanged] = useState(false);

  //Init state from task attributes on initial mount ONLY
  useEffect(() => {
    console.log(PLUGIN_NAME, 'useEffect to update state from task:', task);
    if (task) {
      setCustomerName(task.attributes?.customerName || '');
      setCaseId(task.attributes?.conversations?.case || '');
      setZipcode(task.attributes?.conversations?.conversation_attribute_10 || '');
      setNotes(task.attributes?.conversations?.content || '');
      setPreviousNotes(task.attributes?.previousNotes || '');
    }
    //No return cleanup function
  }, [task])


  const handleChange = e => {
    const value = e.target.value;
    //Text Field id needs to match State property
    const id = e.target.id;
    setChanged(true);
    switch (id) {
      case 'customerName': 
        setCustomerName(value);
        break;
      case 'caseId': 
        setCaseId(value);
        break;
      case 'zipcode': 
        setZipcode(value);
        break;
      case 'notes': 
        setNotes(value);
        break;
    }

  }

  const saveAttributes = async () => {
    console.log(PLUGIN_NAME, 'Saving notes');

    if (task) {
      let convData = {
        case: caseId,
        conversation_attribute_10: zipcode,
        content: notes
      };
      let newTaskAttr = { customerName, conversations: convData };
      // Use new Flex 2.0 Action 
      // See: https://www.twilio.com/docs/flex/developer/ui/migration-guide#new-actions-and-flex-events-for-the-taskrouter-sdk
      await Actions.invokeAction("SetTaskAttributes", { sid: task.sid, attributes: newTaskAttr, mergeExisting: true });
      setChanged(false);

      if (TaskHelper.isChatBasedTask(task)) {
        //Update channel
        let conversationSid = task.attributes.conversationSid;
        manager.conversationsClient.getConversationBySid(conversationSid)
          .then(async (conversation) => {
            let convoAttributes = await conversation.getAttributes();
            //Combine old and new notes
            let newNotes = "";
            if (previousNotes.length > 0) {
              newNotes = previousNotes + " | " + notes;
            } else {
              newNotes = notes;
            }
            const newConvoAttr = {
              ...convoAttributes,
              notes: newNotes,
              caseId: caseId,
              customerName: customerName
            };
            console.log(PLUGIN_NAME, 'Updated Conversation Attributes:', newConvoAttr);
            await conversation.updateAttributes(newConvoAttr);

          });
      }
    }
  }



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
                <Tr key='customerName'>
                  <Th scope="row">
                    <Label htmlFor="customerName">Customer Name</Label>
                  </Th>
                  <Td>
                    <Input id='customerName' value={customerName} onChange={handleChange} />
                  </Td>
                </Tr>
                <Tr key='caseId'>
                  <Th scope="row">
                    <Label htmlFor="caseId">Case ID</Label>
                  </Th>
                  <Td>
                    <Input id='caseId' value={caseId} onChange={handleChange} />
                  </Td>
                </Tr>
                <Tr key='zipcode'>
                  <Th scope="row">
                    <Label htmlFor="zipcode">Zip Code</Label>
                  </Th>
                  <Td>
                    <Input id='zipcode' value={zipcode} onChange={handleChange} />
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
                      value={notes} onChange={handleChange}
                      rows="4" cols="40"
                    />
                  </Td>
                </Tr>
                <Tr key='button'>
                  <Td />
                  <Td>
                    <Button variant="primary" size="small"
                      id="saveButton"
                      onClick={saveAttributes}
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


export default withTaskContext(withTheme(AgentNotes));
