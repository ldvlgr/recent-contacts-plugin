import styled from 'react-emotion';
import { FlexBox } from '@twilio/flex-ui';

export const Caption = styled('div')`
  font-size: 12px;
  margin: 12px;
  font-weight: bold;
  text-align: center;
`;

export const Container = styled(FlexBox)`
  font-size: 12px;
  margin-bottom: 4px;
  margin-left: 12px;
  margin-right: 4px;
`;

export const MessageBoxAgent = styled(FlexBox)`
  width: 100%;
  display: flex;
  font-size: 12px;
  justify-content: right;
`;

export const MessageBoxCustomer = styled(FlexBox)`
  width: 100%;
  display: flex;
  font-size: 12px;ß
`;

export const MessageBubbleAgent = styled('div')`
  width: 200px;
  border: 2px solid blue;
  background-color: lightblue;
  border-radius: 10px;
  margin: 5px;
  padding: 10px;
`;

export const MessageBubbleCustomer = styled('div')`
  width: 200px;
  border: 2px solid grey;
  background-color: lightgrey;
  border-radius: 10px;
  margin: 5px;
  padding: 10px;
`;

export const MessageBody = styled('div')`
  font-size: 14px;
`;
export const MessageFrom = styled('div')`
  font-size: 12px;
  font-weight: bold;
`;
