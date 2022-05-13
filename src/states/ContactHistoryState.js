const ACTION_ADD_CONTACT = 'ADD_CONTACT';
const ACTION_CLEAR_HISTORY = 'CLEAR_HISTORY';
const MaxContacts = 25;

const initialState = {
  contactList: [],
};

export class Actions {
  static addContactToHistory = (contact) => ({ type: ACTION_ADD_CONTACT, contact });
  static clearHistory = () => ({ type: ACTION_CLEAR_HISTORY });
}

export function reduce(state = initialState, action) {
  switch (action.type) {
    case ACTION_ADD_CONTACT: {
      console.log('ADDING: ', action.contact);
      const newContactList = [action.contact].concat(state.contactList).slice(0, MaxContacts);
      console.log('NEWLIST: ', newContactList);
      return {
        contactList: newContactList
      };
    }
    case ACTION_CLEAR_HISTORY: {
      return initialState;
    }

    default:
      return state;
  }
}
