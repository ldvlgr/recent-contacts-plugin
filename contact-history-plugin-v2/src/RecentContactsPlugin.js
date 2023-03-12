import { Actions, VERSION } from '@twilio/flex-ui';
import { FlexPlugin } from '@twilio/flex-plugin';
import reducers, { namespace } from './states';
import { CustomizationProvider } from '@twilio-paste/core/customization';
import ConfigureFlexStrings from './strings';
import CustomizeFlexComponents from './components';
import RecentContacts from './utils/RecentContacts';
import registerNotifications from "./utils/notifications";
import registerEventListeners from "./event-listeners";
import { PLUGIN_NAME, Languages } from './utils/constants';

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
    flex.setProviders({
      PasteThemeProvider: CustomizationProvider,
    });

    const defaultLanguage = Languages.EN;
    const workerAttributes = manager.workerClient?.attributes;
    const language = workerAttributes?.language || defaultLanguage;
    ConfigureFlexStrings(manager, language);
    
    this.registerReducers(manager);
    registerNotifications(manager);
    CustomizeFlexComponents(manager);
    
    registerEventListeners(manager);

    //Init Redux from local storage
    RecentContacts.initContactHistory();

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
