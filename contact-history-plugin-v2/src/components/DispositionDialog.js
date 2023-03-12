import React, { useState } from 'react';
import {
  Actions,
  withTaskContext,
  templates,
  Template,
  useFlexSelector
} from '@twilio/flex-ui';
import { useSelector } from 'react-redux';

import { Modal, ModalBody, ModalFooter, ModalFooterActions, ModalHeader, ModalHeading } from '@twilio-paste/core/modal';
import { Button, Text, Select, Option } from "@twilio-paste/core";
import { useUID } from "@twilio-paste/uid-library";

import { PLUGIN_NAME, Languages } from '../utils/constants';
import { outcomes } from '../strings/DispositionCustomValues';


const DispositionDialog = ({ task }) => {
  const [disposition, setDisposition] = useState('');
  const isOpen = useSelector(
    state => {
      const componentViewStates = state.flex.view.componentViewStates;
      const dispositionDialogState = componentViewStates && componentViewStates.DispositionDialog;
      return dispositionDialogState && dispositionDialogState.isOpen;
    }
  );
  // Get current language from worker attributes in Flex AppState
  const language = useFlexSelector((state) => {
    let workerLanguage = state?.flex?.worker?.attributes?.language || Languages.EN;
    //Todo: Trigger reload all strings
    return (workerLanguage);
  });


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
    setDisposition(value);
  }

  const handleSaveDisposition = async () => {
    //save disposition
    console.log('Saving call disposition');
    console.log('task: ', task);
    if (disposition) {
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
      setDisposition('');
      closeDialog();
    }

  }

  const modalHeadingID = useUID();
  return (
    <Modal
      ariaLabelledby={modalHeadingID}
      size="default"
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
          <Template source={templates.DispositionSelectOutcome} />
        </Text>
        <Select
          value={disposition}
          onChange={handleChange}
          name="disposition"
        >
          {/* <Option value={DefaultDisposition}>SELECT DISPOSITION</Option> */}
          {outcomes.map((option) => (
            <Option
              key={option.value}
              value={option.value}
            > {option.labels[language]}
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
            <Template source={templates.Save} />
          </Button>
        </ModalFooterActions>
      </ModalFooter>
    </Modal>
  );
}

export default withTaskContext(DispositionDialog);
