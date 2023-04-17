function main() {
  const calendar_id = CalendarApp.getId();
  const date = new Date();
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0);
  const end_day = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59);
  let event_status;
  const events = CalendarApp.getCalendarById(calendar_id).getEvents(today, end_day);

  event_status = JSON.stringify({
    "profile": {
      "status_text": "",
      "status_emoji": ""
    }
  });

  // イベントが存在する場合
  if (events.length > 0) {
    let allDayEvents = []; // 終日イベントを格納する配列
    let nonAllDayEventFound = false; // 終日イベント以外が見つかったかどうかを示すフラグ

    for (let i in events) {
      let status = events[i].getMyStatus();
      // 複数日にまたがるイベントかどうかを判定
      let isMultiDayEvent = (events[i].getEndTime() - events[i].getStartTime()) > 24 * 60 * 60 * 1000;
      let isAllDayEvent = events[i].isAllDayEvent();

      // 複数日にまたがるイベントの場合、スキップ
      if (isMultiDayEvent) {
        continue;
      }

      // 終日イベントの場合、配列に追加
      if (isAllDayEvent) {
        allDayEvents.push(events[i]);
        continue;
      }

      // 複数日にまたがるイベントでなく、現在の時刻がイベントの開始・終了時刻の間にある場合
      if (
        !isMultiDayEvent &&
        events[i].getStartTime() <= date &&
        events[i].getEndTime() >= date &&
        status != "NO" &&
        status != "MAYBE" &&
        status != "INVITED"
      ) {
        nonAllDayEventFound = true;
        event_status = identifyStatus(events[i]);
        break;
      }
    }

    // 終日イベント以外が見つからなかった場合、最初の終日イベントを使用
    if (!nonAllDayEventFound && allDayEvents.length > 0) {
      event_status = identifyStatus(allDayEvents[0]);
    }
  }

  postSlackStatus(event_status);
}

function identifyStatus(event) {
  const start_time = event.getStartTime().getHours() + ":" + ("00" + event.getStartTime().getMinutes()).slice(-2);
  const end_time = event.getEndTime().getHours() + ":" + ("00" + event.getEndTime().getMinutes()).slice(-2);

  const event_title = event.getTitle() + "（" + start_time + "〜" + end_time + "）";

  // イベントタイプの正規表現
  let EVENT_TYPE_MTG = /定例|MTG|ミーティング|会議|チェックイン/;
  let EVENT_TYPE_WORK = /作業|調査|処理|業務|設計|構築|準備|作成|情報収集|対応|棚卸し|Schedule|Check/;
  let EVENT_TYPE_BREAK = /休憩|昼休憩/;
  let EVENT_TYPE_OFF_HOURS = /退勤|業務時間外|早退|外出/;
  let EVENT_TYPE_MOVE = /移動|通勤/;
  let EVENT_TYPE_HOLYDAY = /公休|有給|時期指定休暇|夏季休暇|冬季休暇|長期休暇/;
  let EVENT_TYPE_TRAINING_CAMP = /お産|合宿/;

  // イベントタイプに応じたステータスを設定
  if (EVENT_TYPE_MTG.test(event_title)) {
    event_status = JSON.stringify({
      "profile": {
        "status_text": event_title,
        "status_emoji": ":meet:"
      }
    });

  } else if (EVENT_TYPE_WORK.test(event_title)) {
    event_status = JSON.stringify({
      "profile": {
        "status_text": event_title,
        "status_emoji": ":computer:"
      }
    });

  } else if (EVENT_TYPE_BREAK.test(event_title)) {
    event_status = JSON.stringify({
      "profile": {
        "status_text": event_title,
        "status_emoji": ":coffee:"
      }
    });

  } else if (EVENT_TYPE_OFF_HOURS.test(event_title)) {
    event_status = JSON.stringify({
      "profile": {
        "status_text": event_title,
        "status_emoji": ":exit:"
      }
    });

  } else if (EVENT_TYPE_MOVE.test(event_title)) {
    event_status = JSON.stringify({
      "profile": {
        "status_text": event_title,
        "status_emoji": ":bus:"
      }
    });

  } else if (EVENT_TYPE_HOLYDAY.test(event_title)) {
    event_status = JSON.stringify({
      "profile": {
        "status_text": event_title,
        "status_emoji": ":palm_tree:"
      }
    });

  } else if (EVENT_TYPE_TRAINING_CAMP.test(event_title)) {
    event_status = JSON.stringify({
      "profile": {
        "status_text": event_title,
        "status_emoji": ":いちごそば:"
      }
    });

  } else {
    event_status = JSON.stringify({
      "profile": {
        "status_text": event_title,
        "status_emoji": ":spiral_calendar_pad:"
      }
    });

  }

  return event_status;
}

function postSlackStatus(event_status) {
  const token = PropertiesService.getScriptProperties().getProperty("SLACK_BOT_TOKEN");
  const url = "https://slack.com/api/users.profile.set";

  const headers = {
    "Authorization": "Bearer " + token,
    "Content-Type": "application/json; charset=utf-8"
  };

  const post_data = {
    "headers": headers,
    "method": "POST",
    "payload": event_status
  };

  return UrlFetchApp.fetch(url, post_data);
}
