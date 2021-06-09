import React, { Component } from 'react';
import { Actions, withTheme, Manager, IconButton } from '@twilio/flex-ui';
import RecentContacts from '../utils/RecentContacts';

import styled from 'react-emotion';
import {
  Button,
  TableHead,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@material-ui/core";
//import { withStyles } from "@material-ui/core/styles";

const ContactData = styled('div')`
  font-size: 12px;
`;

//Initial version using localStorage

const RecentContactsView = () => {

  let contacts = RecentContacts.getRecentContactsList();
  return (
    <div>
      <Button
      onClick={() => {
        RecentContacts.clearContactList();
      }}
      > CLEAR HISTORY </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Channel</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Direction</TableCell>
            <TableCell>Phone Number</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Date & Time</TableCell>
            <TableCell>Queue</TableCell>
            <TableCell>Outcome</TableCell>
          </TableRow>

        </TableHead>
        <TableBody>
          {contacts.map((rc) => (

            <TableRow key={rc.taskSid}>
              <TableCell>
            
                <IconButton
                  icon={rc.channel == 'voice' ? 'Call': 'Message'}
                  disabled={rc.channel == 'chat'}
                  style={{ "color": "green" }}
                  title={rc.channel == 'voice' ? 'Call': 'Message'}
                  onClick={() => {
                    Actions.invokeAction("StartOutboundCall", {
                      destination: rc.number
                    });
                  }} />
          
              </TableCell>
              <TableCell><ContactData>{rc.channelType}</ContactData></TableCell>
              <TableCell><ContactData>{rc.direction}</ContactData></TableCell>
              <TableCell><ContactData>{rc.number}</ContactData></TableCell>
              <TableCell><ContactData>{rc.name}</ContactData></TableCell>
              <TableCell><ContactData>{rc.dateTime}</ContactData></TableCell>
              <TableCell><ContactData>{rc.queue}</ContactData></TableCell>
              <TableCell><ContactData>{rc.outcome}</ContactData></TableCell>
            </TableRow>))}

        </TableBody>

      </Table>
    </div>

  );
}

export default withTheme(RecentContactsView);