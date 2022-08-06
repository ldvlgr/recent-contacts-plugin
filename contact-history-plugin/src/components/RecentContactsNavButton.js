import React from 'react';
import { SideLink, Actions } from '@twilio/flex-ui';
 
const RecentContactsNavButton = ({ activeView }) => {
   function navigate() {
       Actions.invokeAction('NavigateToView', { viewName: 'recent-contacts-view'});
       Actions.invokeAction('SetComponentState', {
        name: 'ChatTranscript',
        state: { isOpen: false }
      });
   }
 
   return (
       <SideLink
       showLabel={true}
       icon="Directory"
       iconActive="DirectoryBold"
       isActive={activeView === 'recent-contacts-view'}
       onClick={navigate}>
       Recent
       </SideLink>
   )
}
export default RecentContactsNavButton;