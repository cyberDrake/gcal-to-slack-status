# Google Calendar to Slack Status Updater

This Google Apps Script updates your Slack status based on your Google Calendar events. It sets your status to `:crying-boar: "in a meeting"` if there is an ongoing event, and reverts to the default status `:boar:` when you are not in a meeting.
## TODO:
1. allow for customization of status message
2. allow for finer grained control - different status messages for different meeting types (possibly, may skip this)

## Prerequisites

1. A Google account with access to Google Calendar.
2. A Slack workspace with a bot token.

## Setup Instructions

### Step 1: Create a Google Apps Script Project

1. Go to [Google Apps Script](https://script.google.com/).
2. Click on the `+ New project` button.
3. Name your project (e.g., "Google Calendar to Slack Status Updater").

### Step 2: Add the Script

1. In the script editor, delete any existing code.
2. Add the provided script to the script editor.

### Step 3: Set Up Script Properties

1. Click on `File` > `Project properties`.
2. Go to the `Script Properties` tab.
3. Add a new property with the key `SLACK_BOT_TOKEN` and the value set to your Slack bot token.

### Step 4: Create the Time-Driven Trigger

1. In the script editor, select the `createTimeDrivenTrigger` function from the dropdown and click the `Run` button.
2. Grant the necessary permissions when prompted.

### Step 5: Deploy the Script

1. Save the script.
2. The script will now run every minute and update your Slack status based on your Google Calendar events.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
