import React, { useState } from 'react';
import { Actions, withTheme, withTaskContext } from '@twilio/flex-ui';
import { useSelector } from 'react-redux';

import { Theme } from '@twilio-paste/core/theme';
import { Modal, ModalBody, ModalFooter, ModalFooterActions, ModalHeader, ModalHeading } from '@twilio-paste/core/modal';
import { Button, Text, Select, Option } from "@twilio-paste/core";

const DefaultDisposition = 'DEFAULT';
const outcomes = [
  'New Order',
  'Order Updated',
  'Product Inquiry',
  'Cancel Service',
  'Change Service',
  'Membership Renewal',
  'Refund Requested',
  'Product Replacement',
  'Extend Warranty'];

const DispositionDialog = ({ task }) => {
  const [disposition, setDisposition] = useState(DefaultDisposition);
  const isOpen = useSelector(
    state => {
      const componentViewStates = state.flex.view.componentViewStates;
      const dispositionDialogState = componentViewStates && componentViewStates.DispositionDialog;
      return dispositionDialogState && dispositionDialogState.isOpen;
    }
  );

  const handleClose = () => {
    closeDialog();
  }

  const closeDialog = () => {
    Actions.invokeAction('SetComponentState', {
      name: 'DispositionDialog',
      state: { isOpen: false }
    });
  }

  const handleChange = e => {
    const value = e.target.value;
    setDisposition( value );
  }

  const handleSaveDisposition = async () => {
    //save disposition
    console.log('Saving call disposition');
    console.log('task: ', task);
    if (disposition != DefaultDisposition) {
      let newAttributes = { ...task.attributes };
      newAttributes.disposition = disposition;
      //insights outcome
      let conversations = task.attributes.conversations;
      let newConv = {};
      if (conversations) {
        newConv = { ...conversations };
      }
      newConv.outcome = disposition;
      newAttributes.conversations = newConv;

      // Use new Flex 2.0 Action 
      // See: https://www.twilio.com/docs/flex/developer/ui/migration-guide#new-actions-and-flex-events-for-the-taskrouter-sdk
      await Actions.invokeAction("SetTaskAttributes", { sid: task.sid, attributes: newAttributes, mergeExisting: true });
      
      //await task.setAttributes(newAttributes);
      //clear disposition
      setDisposition(DefaultDisposition);
      closeDialog();
    }

  }

  return (
    <Theme.Provider theme="flex">
      <Modal
        isOpen={isOpen || false}
        onDismiss={handleClose}
      >
        <ModalHeader>
          <ModalHeading as="h3" id='disposition'>
            Select Conversation Outcome/Disposition.
          </ModalHeading>
        </ModalHeader>

        <ModalBody>
          <Text>
            Please choose the appropriate outcome/disposition value for this completed conversation.
          </Text>
          <Select
            value={disposition}
            onChange={handleChange}
            name="disposition"
          >
            <Option value={DefaultDisposition}>SELECT DISPOSITION</Option>
            {outcomes.map((option) => (
              <Option
                key={option}
                value={option}
              > {option}
              </Option>
            ))}
          </Select>
        </ModalBody>
        <ModalFooter>
          <ModalFooterActions>
            <Button
              onClick={handleSaveDisposition}
              variant="primary" size="small"
            >
              Save
            </Button>
          </ModalFooterActions>
        </ModalFooter>
      </Modal>
    </Theme.Provider>
  );
}

export default withTheme(withTaskContext(DispositionDialog));
