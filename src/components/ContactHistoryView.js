import React from 'react';
import { Actions, withTheme, IconButton } from '@twilio/flex-ui';
//import RecentContacts from '../utils/RecentContacts';
import { Actions as ContactHistoryActions } from '../states/ContactHistoryState';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';

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

class ContactHistory extends React.Component {


  //let contacts = RecentContacts.getRecentContactsList();
  render() {
    return (
      <div>
        <Button
          onClick={() => {
            this.props.clearHistory();
          }}
        > CLEAR HISTORY </Button>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Channel</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Date & Time</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Queue</TableCell>
              <TableCell>Direction</TableCell>
              <TableCell>Outcome</TableCell>

            </TableRow>

          </TableHead>
          <TableBody>
            {this.props.contactList.map((rc) => (

              <TableRow key={rc.taskSid}>
                <TableCell>

                  <IconButton
                    icon={rc.channel == 'voice' ? 'Call' : 'Message'}
                    disabled={rc.channel == 'chat'}
                    style={{ "color": "green" }}
                    title={rc.channel == 'voice' ? 'Call' : 'Message'}
                    onClick={() => {
                      Actions.invokeAction("StartOutboundCall", {
                        destination: rc.number
                      });
                    }} />

                </TableCell>

                <TableCell><ContactData>{rc.number}</ContactData></TableCell>
                <TableCell><ContactData>{rc.name}</ContactData></TableCell>
                <TableCell><ContactData>{rc.dateTime}</ContactData></TableCell>
                <TableCell><ContactData>{rc.duration}</ContactData></TableCell>
                <TableCell><ContactData>{rc.queue}</ContactData></TableCell>
                <TableCell><ContactData>{rc.direction}</ContactData></TableCell>
                <TableCell><ContactData>{rc.outcome}</ContactData></TableCell>
              </TableRow>))}

          </TableBody>

        </Table>
      </div>
    );
  };
}


const mapStateToProps = state => {
  return {
    contactList: state['recent-contacts']?.contactHistory?.contactList
  };
}

const mapDispatchToProps = (dispatch) => ({
  clearHistory: bindActionCreators(ContactHistoryActions.clearHistory, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(ContactHistory));
