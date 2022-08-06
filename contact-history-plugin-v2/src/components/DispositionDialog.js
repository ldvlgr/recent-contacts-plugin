import * as React from 'react';
import { connect } from 'react-redux';
import { Actions, withTheme, withTaskContext } from '@twilio/flex-ui';

import { Theme } from '@twilio-paste/core/theme';
import { Modal, ModalBody, ModalFooter, ModalFooterActions, ModalHeader, ModalHeading } from '@twilio-paste/core/modal';
import { Button, Text, Select, Option } from "@twilio-paste/core";

const DefaultDisposition = 'DEFAULT';

class DispositionDialog extends React.Component {
  state = {
    callDisposition: DefaultDisposition,
    options: ['Completed', 'NewOrder', 'OrderUpdated', 'Inquiry', 'CancelService', 'ChangeService', 'Renewal', 'FollowUp', 'CallBack']
  }

  handleClose = () => {
    this.closeDialog();
  }

  closeDialog = () => {
    Actions.invokeAction('SetComponentState', {
      name: 'DispositionDialog',
      state: { isOpen: false }
    });
  }

  handleChange = e => {
    const value = e.target.value;
    this.setState({ callDisposition: value });
  }

  handleSaveDisposition = async () => {
    //save disposition
    console.log('Saving call disposition');
    console.log('task: ', this.props.task);
    let dispValue = this.state.callDisposition
    if (dispValue != DefaultDisposition) {
      let newAttributes = { ...this.props.task.attributes };
      newAttributes.disposition = dispValue;
      //insights outcome
      let conversations = this.props.task.attributes.conversations;
      let newConv = {};
      if (conversations) {
        newConv = { ...conversations };
      }
      newConv.outcome = dispValue;
      newAttributes.conversations = newConv;

      await this.props.task.setAttributes(newAttributes);
      //clear disposition
      this.setState({ callDisposition: DefaultDisposition });
      this.closeDialog();
    }

  }

  render() {
    return (
      <Theme.Provider theme="flex">
        <Modal
          isOpen={this.props.isOpen || false}
          onDismiss={this.handleClose}
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
              value={this.state.callDisposition}
              onChange={this.handleChange}
              name="disposition"
            >
              <Option value={DefaultDisposition}>SELECT DISPOSITION</Option>
              {this.state.options.map((option) => (
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
                onClick={this.handleSaveDisposition}
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
}

const mapStateToProps = state => {
  const componentViewStates = state.flex.view.componentViewStates;
  const dispositionDialogState = componentViewStates && componentViewStates.DispositionDialog;
  const isOpen = dispositionDialogState && dispositionDialogState.isOpen;
  return {
    isOpen
  };
};

export default connect(mapStateToProps)(withTheme(withTaskContext(DispositionDialog)));
