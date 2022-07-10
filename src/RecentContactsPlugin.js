import React from 'react';
import { Actions, VERSION, View } from '@twilio/flex-ui';
import { FlexPlugin } from '@twilio/flex-plugin';

import reducers, { namespace } from './states';
import RecentContactsNavButton from './components/RecentContactsNavButton';

import RecentContacts from './utils/RecentContacts';

import ContactHistory from './components/ContactHistoryView';
import DispositionDialog from './components/DispositionDialog';

import { Actions as ContactHistoryActions } from './states/ContactHistoryState';

const PLUGIN_NAME = 'RecentContactsPlugin';

export default class RecentContactsPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  init(flex, manager) {
    this.registerReducers(manager);


    //Recent Contacts side nav button and new view
    flex.SideNav.Content.add(
      <RecentContactsNavButton key="recent-contacts-sidenav-button" />, { sortOrder: 2 }
    );

    // Add view to the ViewCollection

    flex.ViewCollection.Content.add(
      <View name="recent-contacts-view" key="recent-contacts-view">
        <ContactHistory key="co-recent-view" />
      </View>
    );
    //Init Redux from local storage
    const contactList = RecentContacts.getRecentContactsList();
    console.log(PLUGIN_NAME, 'Contact List from local storage:', contactList);
    if (contactList && contactList.length > 0) {
      console.log(PLUGIN_NAME, 'Adding contact list to Redux');
      manager.store.dispatch(ContactHistoryActions.setContactList(contactList));
    }

    flex.AgentDesktopView.Panel1.Content.add(<DispositionDialog
      key="disposition-modal"
    />, { sortOrder: 100 });


    manager.workerClient.on("reservationCreated", reservation => {
      console.log('reservationCreated: ', reservation);

      reservation.on('wrapup', reservation => {
        Actions.invokeAction('SetComponentState', {
          name: 'DispositionDialog',
          state: { isOpen: true }
        });
      });

      reservation.on('completed', reservation => {
        this.addContact(manager, reservation);
      });
    });
  }


  addContact(manager, reservation) {
    console.log('RESERVATION:', reservation);

    const channel = reservation.task.taskChannelUniqueName;
    const taskSid = reservation.task.sid;
    const queue = reservation.task.queueName;
    const dateTime = reservation.task.dateCreated.toLocaleString('en-US');
    const duration = reservation.task.age;
    //Enable caller name number lookup on phone number to populate name
    const { direction, from, outbound_to, call_sid, caller_name, channelType, name, channelSid } = reservation.task.attributes;


    let outcome = reservation.task.attributes?.conversations?.outcome || 'Completed';

    let contact = { direction, channel, call_sid, dateTime, taskSid, queue, duration, outcome, channelType, channelSid };

    //Default
    contact.name = 'Customer';

    if (channel === 'voice') {
      contact.channelType = channel;
      if (caller_name) {
        contact.name = caller_name;
      }
      if (direction === 'inbound') {
        contact.number = from;
      } else {
        contact.number = outbound_to;
      }
    }
    //For channelType = SMS, name will have phone number

    if (channelType == 'sms') {
      contact.number = name;
    }
    console.log('UPDATED CONTACT OBJECT:', contact);
    //Using localStorage to persist contact list
    RecentContacts.addNewContact(contact);

    //Using Redux app state
    manager.store.dispatch(ContactHistoryActions.addContact(contact));
  }



  /**
   * Registers the plugin reducers
   *
   * @param manager { Flex.Manager }
   */
  registerReducers(manager) {
    if (!manager.store.addReducer) {
      // eslint: disable-next-line
      console.error(`You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${VERSION}`);
      return;
    }

    manager.store.addReducer(namespace, reducers);
  }
}
