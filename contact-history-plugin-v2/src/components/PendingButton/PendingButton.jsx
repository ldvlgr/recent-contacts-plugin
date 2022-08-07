import React from 'react';
import { Manager, withTheme, withTaskContext } from '@twilio/flex-ui';

import { Theme } from '@twilio-paste/core/theme';
import { Flex, Box, Button } from "@twilio-paste/core";
import { PauseIcon } from "@twilio-paste/icons/esm/PauseIcon";

import { updateTaskAttributes } from '../../utils/taskUtil'
let manager = Manager.getInstance();
const PLUGIN_NAME = 'RecentContactsPlugin';

class PendingButton extends React.PureComponent {

	onClickHandler = async () => {

		await updateTaskAttributes(this.props.task, { chatStatus: 'Pending' });
		console.log('Change Chat to long lived / Pending / Parked...', this.props.task);

		//Needs updates for parking/pending chat. Long lived is deprecated
		let conversationSid = this.props.task.attributes.conversationSid;
		manager.conversationsClient.getConversationBySid(conversationSid)
			.then(async (conversation) => {
				let convoAttributes = await conversation.getAttributes();

				console.log(PLUGIN_NAME, 'Channel Attributes:', convoAttributes);
				let workerName = manager.workerClient.name;
				const newConvoAttr = { ...convoAttributes, workerName, long_lived: true };
				console.log(PLUGIN_NAME, 'Updated Conversation Attributes:', newConvoAttr);
				await conversation.updateAttributes(newConvoAttr);
				console.log(PLUGIN_NAME, 'Wrapping Task/Reservation', this.props.task);
				await this.props.task.wrapUp();
			});
	}

	render() {
		return (
			<Theme.Provider theme="flex">
				<Flex>
					<Box padding="space40">
						<Button variant="primary" size="small"
							title="Park Conversation and End Chat"
							onClick={() => this.onClickHandler()}
						>
							<PauseIcon decorative={false} title="Pending/Parked" />
						</Button>
					</Box>
				</Flex>
			</Theme.Provider>
		);
	}
}

export default withTheme(withTaskContext(PendingButton));
