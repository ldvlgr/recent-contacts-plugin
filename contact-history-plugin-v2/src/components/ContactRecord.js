
import { Icon } from '@twilio/flex-ui';

import { Button, Flex, Box, Text, Tooltip, Tr, Td } from "@twilio-paste/core";

import { ArrowBackIcon } from "@twilio-paste/icons/esm/ArrowBackIcon";
import { ArrowForwardIcon } from "@twilio-paste/icons/esm/ArrowForwardIcon";
import { CheckboxCheckIcon } from "@twilio-paste/icons/esm/CheckboxCheckIcon";
import { PauseIcon } from "@twilio-paste/icons/esm/PauseIcon";
import { SMSCapableIcon } from "@twilio-paste/icons/esm/SMSCapableIcon";
import { ProductChatIcon } from "@twilio-paste/icons/esm/ProductChatIcon";

const ContactRecord = ({ rc, startContact, openTranscript }) => {

  return (
    <Tr key={rc.taskSid}>
      <Td textAlign="center">
        <Flex hAlignContent="center">
          <Box>
            {rc.channelType == 'voice' &&
              <Button variant="link" size="small"
                title='Call'
                onClick={() => {
                  startContact(rc);
                }}
              > <Icon icon='Call' />
                {rc.direction == 'inbound' && <ArrowBackIcon decorative={false} title="Incoming" />}
                {rc.direction == 'outbound' && <ArrowForwardIcon decorative={false} title="Outgoing" />}
              </Button>
            }
            {rc.channelType == 'sms' &&
              <Button variant="link" size="small"
                title='SMS'
                onClick={() => {
                  startContact(rc);
                }}
              > <Icon icon='Sms' /> </Button>
            }
            {rc.channelType == 'web' &&
              <Icon icon='Message' />
            }
            {rc.channelType == 'custom' &&
              <ProductChatIcon decorative={false} title="Custom Chat" />
            }
          </Box>
        </Flex>
      </Td>
      <Td>{rc.number}</Td>
      <Td>{rc.name}</Td>
      <Td>{rc.dateTime}</Td>
      <Td textAlign="center">{rc.duration}</Td>
      <Td>{rc.queue}</Td>
      <Td>{rc.outcome}</Td>
      <Td textAlign="center">
        {rc.chatStatus == 'Pending' ?
          <PauseIcon decorative={false} title="Pending/Parked" /> :
          <CheckboxCheckIcon decorative={false} title="Completed" />
        }
      </Td>
      <Td>
        {rc.notes &&
          <Tooltip text={rc.notes} placement="bottom">
            <Text>{rc.notes.substring(0, 10).concat('...')} </Text>
          </Tooltip>
        }
      </Td>
      <Td textAlign="center">
        {rc.channel !== 'voice' &&
          <Button variant="link" size="small"
            disabled={rc.channel == 'voice'}
            onClick={() => {
              openTranscript(rc.conversationSid);
            }}
          >
            <SMSCapableIcon decorative={false} title="Chat Transcript" />
          </Button>
        }
      </Td>
    </Tr>         
  );

}

export default ContactRecord;
