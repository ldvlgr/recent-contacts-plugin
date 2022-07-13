import { Manager } from '@twilio/flex-ui';
import { Actions as ContactHistoryActions } from '../states/ContactHistoryState';

let manager = Manager.getInstance();
const RecentContactsKey = 'RECENT_CONTACTS';
const MaxContacts = '25';
const PLUGIN_NAME = 'RecentContactsPlugin';

class RecentContacts {

  getRecentContactsList() {
    const item = localStorage.getItem(RecentContactsKey);
    if (item) {
      return JSON.parse(item);
    } else {
      return []
    }
  }

  initContactHistory = () => {
    const contactList = this.getRecentContactsList();
    console.log(PLUGIN_NAME, 'Contact List from local storage:', contactList);
    if (contactList && contactList.length > 0) {
      console.log(PLUGIN_NAME, 'Adding contact list to Redux');
      manager.store.dispatch(ContactHistoryActions.setContactList(contactList));
    }
  }


  setContactList = (contactList) => {
    localStorage.setItem(RecentContactsKey, JSON.stringify(contactList));
  }


  addContact = (reservation) => {
    console.log(PLUGIN_NAME, 'Add Contact for:', reservation);

    const channel = reservation.task.taskChannelUniqueName;
    const taskSid = reservation.task.sid;
    const queue = reservation.task.queueName;
    const dateTime = reservation.task.dateCreated.toLocaleString('en-US');
    const duration = reservation.task.age;
    //Enable caller name number lookup on phone number to populate name
    const { direction, from, outbound_to, call_sid, caller_name, channelType, name, channelSid, conversations, chatStatus } = reservation.task.attributes;

    let outcome = reservation.task.attributes?.conversations?.outcome || 'Completed';

    let contact = { direction, channel, call_sid, dateTime, taskSid, queue, duration, outcome, channelType, channelSid, chatStatus };
    contact.notes = conversations.content;

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
    console.log(PLUGIN_NAME, 'UPDATED CONTACT OBJECT:', contact);
    //Using localStorage to persist contact list
    const contactList = this.getRecentContactsList()
    //Add as first in list and limit to Max
    const newList = [contact].concat(contactList).slice(0, MaxContacts);
    console.log(PLUGIN_NAME, 'Updated Contact List:', newList);
    localStorage.setItem(RecentContactsKey, JSON.stringify(newList));
    //Using Redux app state
    manager.store.dispatch(ContactHistoryActions.addContact(contact));


  }


  // addNewContact = (contact) => {
  //   console.log('Adding Contact:', contact);
  //   const contactList = this.getRecentContactsList()
  //   //Add as first in list and limit to Max
  //   const newList = [contact].concat(contactList).slice(0, MaxContacts);
  //   console.log('Updated Contact List:', newList);
  //   localStorage.setItem(RecentContactsKey, JSON.stringify(newList));
  // }

  clearContactList = () => {
    localStorage.removeItem(RecentContactsKey);
  }

}

const recentContacts = new RecentContacts();

export default recentContacts;
