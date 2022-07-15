
const PLUGIN_NAME = 'RecentContactsPlugin';

export const updateConversations = async (task, conversationsData = {}) => {
  let newAttributes = { ...task.attributes };
  let conversations = task.attributes.conversations;
  let newConv = {};
  if (conversations) {
    newConv = { ...conversations };
  }
  let convAttributes = Object.keys(conversationsData);
  if (convAttributes.length > 0) {
    for (const attr of convAttributes) {
      newConv[attr] = conversationsData[attr];
    }
    newAttributes.conversations = newConv;
    console.log(PLUGIN_NAME, 'Updating task with new attributes:', newAttributes);
    await task.setAttributes(newAttributes);
  }
}


export const updateTaskAttributes = async (task, attributes = {}) => {
  let newAttributes = { ...task.attributes, ...attributes };
  console.log(PLUGIN_NAME, 'Updating task with new attributes:', newAttributes);
  await task.setAttributes(newAttributes);

}


export const updateTaskAndConversationsAttributes = async (task, attributes = {}, conversationsData = {}) => {
  console.log(PLUGIN_NAME, 'Received attributes', attributes);
  console.log(PLUGIN_NAME, 'and Conversation Data', conversationsData);
  let newAttributes;
  if (Object.keys(attributes).length > 0) {
    newAttributes = { ...task.attributes, ...attributes };
  } else {
    newAttributes = { ...task.attributes };
  }
  let conversations = task.attributes.conversations;
  let newConv = {};
  if (Object.keys(conversationsData).length > 0) {
    if (conversations) {
      newConv = { ...conversations, ...conversationsData };
    } else {
      newConv = { ...conversationsData };
    }
  }
  newAttributes.conversations = newConv;
  console.log(PLUGIN_NAME, 'Updating task with new attributes:', newAttributes);
  await task.setAttributes(newAttributes);
}
