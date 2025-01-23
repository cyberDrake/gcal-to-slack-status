function main() {
  const calendarId = CalendarApp.getId();
  const date = new Date();
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0);
  const endDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59);
  let eventStatus = getDefaultStatus();
  
  const events = CalendarApp.getCalendarById(calendarId).getEvents(today, endDay);

  // If there are events
  if (events.length > 0) {
    let nonAllDayEventFound = false;

    for (let i in events) {
      let status = events[i].getMyStatus();
      let isMultiDayEvent = (events[i].getEndTime() - events[i].getStartTime()) > 24 * 60 * 60 * 1000;
      let isAllDayEvent = events[i].isAllDayEvent();

      // Skip if the event spans multiple days or is an all-day event
      if (isMultiDayEvent || isAllDayEvent) {
        continue;
      }

      // If the current time is between the event's start and end times and the status is confirmed
      if (events[i].getStartTime() <= date && events[i].getEndTime() >= date &&
          status != "NO" && status != "MAYBE" && status != "INVITED") {
        nonAllDayEventFound = true;
        eventStatus = getMeetingStatus();
        break;
      }
    }
  }

  postSlackStatus(eventStatus);
}

function getDefaultStatus() {
  return JSON.stringify({
    "profile": {
      "status_text": "",
      "status_emoji": ":boar:"
    }
  });
}

function getMeetingStatus() {
  return JSON.stringify({
    "profile": {
      "status_text": "in a meeting",
      "status_emoji": ":crying-boar:"
    }
  });
}

function postSlackStatus(eventStatus) {
  const token = PropertiesService.getScriptProperties().getProperty("SLACK_BOT_TOKEN");
  if (!token) {
    Logger.log("Slack bot token is not set. Please add it to the script properties.");
    return;
  }

  const url = "https://slack.com/api/users.profile.set";

  const headers = {
    "Authorization": "Bearer " + token,
    "Content-Type": "application/json; charset=utf-8"
  };

  const postData = {
    "headers": headers,
    "method": "POST",
    "payload": eventStatus
  };

  return UrlFetchApp.fetch(url, postData);
}

// Function to create a time-driven trigger for the main function
function createTimeDrivenTrigger() {
  ScriptApp.newTrigger('main')
    .timeBased()
    .everyMinutes(1) // Change this to the desired frequency
    .create();
}