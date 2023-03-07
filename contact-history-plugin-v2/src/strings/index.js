
import customStrings from '../localization/default';
import spanishStrings from '../localization/es-MX';
import { Languages } from '../utils/constants';

export default (manager, language) => {
  if (language == Languages.ES) {
    manager.strings = {
      ...spanishStrings,
      ...manager.strings
    };

  } else {
    manager.strings = {
      ...customStrings,
      ...manager.strings
    };
  }
  manager.strings.TaskHeaderLine ="{{#if task.attributes.customerName}} {{task.attributes.customerName}} {{else}} {{task.defaultFrom}} {{/if}}";
  
  //default string for outbound
  //TaskLineOutboundCallHeader = {{task.attributes.outbound_to}}
  //Add customerName
  manager.strings.TaskLineOutboundCallHeader=
  "{{#if task.attributes.customerName}} {{task.attributes.outbound_to}} [{{task.attributes.customerName}}] {{else}} {{task.attributes.outbound_to}} {{/if}}";

}