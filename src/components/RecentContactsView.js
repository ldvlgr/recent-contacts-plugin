import React, { Component } from 'react';
import { Actions, withTheme, Manager, IconButton } from '@twilio/flex-ui';
import RecentContacts from '../utils/RecentContacts';

//import styled from 'react-emotion';
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
            <TableCell>Name</TableCell>
            <TableCell>Number</TableCell>
            <TableCell>Date & Time</TableCell>
            <TableCell>Queue</TableCell>
            <TableCell>Direction</TableCell>

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

              <TableCell>{rc.name}</TableCell>
              <TableCell>{rc.number}</TableCell>
              <TableCell>{rc.dateTime}</TableCell>
              <TableCell>{rc.queue}</TableCell>
              <TableCell>{rc.direction}</TableCell>

            </TableRow>))}

        </TableBody>

      </Table>
    </div>

  );
}

export default withTheme(RecentContactsView);