# gcal-to-slack-status

This is an open-source Google Apps Script that updates your Slack status based on your current calendar events. The script identifies your current event type and sets your Slack status and emoji accordingly.

## Setup
1. Create a new Google Apps Script project in your Google Drive.
2. Copy and paste the code from code.js into your new project.
3. Replace the SLACK_BOT_TOKEN value in the postSlackStatus function with your Slack bot token.
4. Save the project and run the main function.
5. Authorize the script to access your Google Calendar and Slack account.

## Usage
The main function runs once a day and updates your Slack status based on your current calendar events. If you have an event scheduled during the day, the script will set your Slack status to the event type (meeting, work, break, off-hours, move, holyday, or training camp) and the corresponding emoji.

##Contributions
Contributions to this open-source project are welcome. If you find any bugs or have any suggestions, please open an issue or submit a pull request.

## License
This project is licensed under the MIT License. See LICENSE for more information.
