import styled from 'react-emotion';
import { FlexBox } from '@twilio/flex-ui';
import { TableCell, TextField } from "@material-ui/core";

export const Caption = styled('div')`
  font-size: 14px;
  margin: 12px;
  font-weight: bold;
`;
export const NotesTableCell = styled(TableCell)`
  font-size: 12px;
  padding: 0px 3px 3px 0px
  height: 16px;
  width: 80px;
`;
export const AttributeName = styled("div")`
  font-size: 12px;
  font-weight: bold;
`;

export const AttributeTextField = styled(TextField)`
  padding: 0px 3px 3px 0px
  height: 16px;
  width: 180px;
  
`;

export const Container = styled(FlexBox)`
  font-size: 12px;
  margin-bottom: 4px;
  margin-left: 4px;
  margin-right: 4px;
`;

export const ButtonsContainer = styled("div")`
  margin-top: 12px;
  padding-left: 12px;
  padding-right: 12px;
  justify-content: center;
  align: center;
`;