import { Manager } from '@twilio/flex-ui';
const RecentContactsKey = 'RECENT_CONTACTS';
const MaxContacts = '25';

class RecentContacts {
  
  getRecentContactsList() {
    const item = localStorage.getItem(RecentContactsKey);
    if (item) {
      return JSON.parse(item);
    } else {
      return []
    }
  }

  setContactList = (contactList) => {
    localStorage.setItem(RecentContactsKey, JSON.stringify(contactList));
  }

  addNewContact = (contact) => {
    console.log('Adding Contact:', contact);
    const contactList = this.getRecentContactsList()
    //Add as first in list and limit to Max
    const newList = [contact].concat(contactList).slice(0, MaxContacts);
    console.log('Updated Contact List:', newList);
    localStorage.setItem(RecentContactsKey, JSON.stringify(newList));
  }

  clearContactList = () => {
    localStorage.removeItem(RecentContactsKey);
  }

}

const recentContacts = new RecentContacts();

export default recentContacts;
