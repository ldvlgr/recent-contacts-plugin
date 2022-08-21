# Recent Contact History Flex Plugin

## Your custom Twilio Flex Plugin

Twilio Flex Plugins allow you to customize the appearance and behavior of [Twilio Flex](https://www.twilio.com/flex). If you want to learn more about the capabilities and how to use the API, check out our [Flex documentation](https://www.twilio.com/docs/flex).

## How it works
This Flex plugin adds a Recent Contacts View to the Flex UI and allows agents to make outbound calls (click-to-dial) back to the customers. The recent contacts list is stored in the Redux state (and persisted in localStorage browser cache). The Max Number of Contacts retained is configurable and agents can clear their contact history by clicking the Clear History button.  

Note: Upgrade to Flex UI 2.0 in progress.  Updated source for Flex UI 2.0 can found in -v2 folder.


<img width="800px" src="images/ContactHistoryWithNewTranscript.png"/>

This plugin also provides a modal Call Disposition window to agent after hangup (wrap up) to encourage agents to select the call outcome, before completing the call.  The outcome is saved in the task and displayed in the view.

<img width="500px" src="images/outcomeDisposition.png"/>

NEW (July 2022): This plugin now also contains a form in the CRM Panel where the agent can to capture notes about the conversation, the customer's case number and Zip Code. Notes are stored in the task attributes and as Chat Channel Attributes.

Furthermore, Chat and SMS conversations can be changed to "Pending" which updates the chat channel attribute long_lived = true and adds the workerName to the channel attributes. (Flex 1.x only)

<img width="800px" src="images/PendingChatAgentNotes.png"/>


This plugin leverages Serverless functions to retrieve all messages from the Chat Channel (Conversation).  The list of messages is used to populate the Chat Transcript component.


# Configuration

## Requirements

To deploy this plugin, you will need:

- An active Twilio account with Flex provisioned. Refer to the [Flex Quickstart](https://www.twilio.com/docs/flex/quickstart/flex-basics#sign-up-for-or-sign-in-to-twilio-and-create-a-new-flex-project%22) to create one.
- npm version 5.0.0 or later installed (type `npm -v` in your terminal to check)
- Node.js version 12 or later installed (type `node -v` in your terminal to check). We recommend the _even_ versions of Node.
- [Twilio CLI](https://www.twilio.com/docs/twilio-cli/quickstart#install-twilio-cli) along with the [Flex CLI Plugin](https://www.twilio.com/docs/twilio-cli/plugins#available-plugins) and the [Serverless Plugin](https://www.twilio.com/docs/twilio-cli/plugins#available-plugins). Run the following commands to install them:

```
# Install the Twilio CLI
npm install twilio-cli -g
# Install the Serverless and Flex as Plugins
twilio plugins:install @twilio-labs/plugin-serverless
twilio plugins:install @twilio-labs/plugin-flex
```

## Setup
This solution contains both the Flex 1.x UI version as well as a new Flex UI 2.0 version.

Install the dependencies by running `npm install`:

```bash
cd recent-contacts-plugin/contact-history-plugin
npm install
```

or for Flex UI 2.0

```bash
cd recent-contacts-plugin/contact-history-plugin-v2
npm install
```
From the root directory, rename `public/appConfig.example.js` to `public/appConfig.js`.

```bash
mv public/appConfig.example.js public/appConfig.js
```

## Serverless Functions


### Deployment

Create the Serverless config file by copying `.env.example` to `.env`.

```bash
cd serverless
cp .env.example .env
```
Edit `.env` and set the `TWILIO_CHAT_SERVICE` variable to your Chat Service Sid. Next, deploy the Serverless functions:

```bash
cd serverless
twilio serverless:deploy
```
After successfully deploying your function, you should see at least the following:
```bash
✔ Serverless project successfully deployed
Domain: chat-transcript-xxxx-dev.twil.io

Functions:
   https://chat-transcript-xxxx-dev.twil.io/get-chat-messages
   https://chat-transcript-xxxx-dev.twil.io/get-conversation
```

Your functions will now be present in the Twilio Functions Console and be part of the "chat-transcript" service. Copy the base URL from the function.

## Flex Plugin

### Development

Create the plugin config file by copying `.env.example` to `.env`.

```bash
cd recent-contacts-plugin
cp .env.example .env
```

Edit `.env` and set the `FLEX_APP_FUNCTIONS_BASE` variable to your Twilio Functions base URL (like https://chat-transcript-xxxx-dev.twil.io). 

To run the plugin locally, you can use the Twilio Flex CLI plugin. Using your command line, run the following from the root directory of the plugin.

```bash
cd recent-contacts-plugin
twilio flex:plugins:start
```

This will automatically start up the webpack dev server and open the browser for you. Your app will run on `http://localhost:3000`.

When you make changes to your code, the browser window will be automatically refreshed.


### Deploy your Flex Plugin

Once you are happy with your Flex plugin, you have to deploy then release it on your Flex application.

Run the following command to start the deployment:

```bash
twilio flex:plugins:deploy --major --changelog "Releasing Contact History plugin" --description "Contact History plugin"
```

After running the suggested next step, navigate to the [Plugins Dashboard](https://flex.twilio.com/admin/) to review your recently deployed plugin and confirm that it’s enabled for your contact center.

**Note:** Common packages like `React`, `ReactDOM`, `Redux` and `ReactRedux` are not bundled with the build because they are treated as external dependencies so the plugin will depend on Flex to provide them globally.

You are all set to test this plugin on your Flex application!

## License

[MIT](http://www.opensource.org/licenses/mit-license.html)

## Disclaimer

No warranty expressed or implied. Software is as is.












