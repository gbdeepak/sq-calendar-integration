// This is a NodeJS script to :
// 1. Accept an API key
// 2. Get Access Token
// 3. Get All Users (using the Refresh token)
// 4. Get All Schedules
// 5. Get All OnCall Events
// 6. Create ICS file for the entire team - save it to local file
// 7. Create ICS files for each user (user calendar) - save it to local files
// 8. Move files to web server to serve it

"use strict";

// load modules
const axios = require("axios");
const fs = require("fs");
const fsp = require("fs").promises;
const fsExtra = require("fs-extra");
const uuid = require("uuid");
const sq = require("./config/sq_api_calls");
const hf = require("./config/helper_functions");

// API Key - main parameter - required
const API_KEY =
  "41190cd87b0c6a27345bf77ad2498170a04b98709ff596d3706c0a2e16df20fe9184538c14e36ecd519ce2b3214cbedcde46378f97cfaf7ec687d2a7b98e1e60";
const ICS_SCHEDULES_DIR = "../backend/static/calendars/schedules";
const ICS_USERS_DIR = "../backend/static/calendars/users";
const CALENDAR_HTML_FILE = `../backend/static/calendars/index.html`;
const SCHEDULES_DIR = "localhost:3000/calendars/schedules";
const CALENDAR_LIST_FILE = "../backend/static/calendars.html";

// File system stuff
// delete the base directory files
fsExtra.emptyDirSync(ICS_SCHEDULES_DIR);
fsExtra.emptyDirSync(ICS_USERS_DIR);

// The main function that gets all the data for the schedule calendar
const get_calendars = async () => {
  var access_token;
  var teams;
  var users;
  var schedules;
  var onCallEvents;
  var schedule_ics;
  var active_users = [];

  // Get access token
  console.log(`Getting access token ...`);
  await sq
    .getAccessToken(API_KEY)
    .then((res) => (access_token = res))
    .catch((err) => console.log(err));
  console.log(`Done getting access token ${access_token}`);

  // Get all teams
  console.log(`Getting all teams ...`);
  await sq
    .getAllTeams(access_token)
    .then((res) => (teams = res))
    .catch((err) => console.log(err));
  console.log(`Done getting ${teams.length} teams`);

  // Get all users
  console.log(`Getting all users ...`);
  await sq
    .getAllUsers(access_token)
    .then((res) => (users = res))
    .catch((err) => console.log(err));
  console.log(`Done getting ${users.length} users`);
  console.log(`Instantiating user_events to capture all the user events`);
  //   users.forEach((user) => user_events.push({ id: user.id, events: "" }));
  users.forEach(async (user) => {
    await hf.create_user_file(user);
  });
  console.log(`User files created`);

  // Get all schedules
  console.log(`Getting all schedules ...`);
  await sq
    .getAllSchedules(access_token)
    .then((res) => (schedules = res))
    .catch((err) => console.log(err));
  console.log(`Done getting ${schedules.length} schedules`);

  // Get all oncall events per schedule
  await schedules.forEach(async (schedule) => {
    console.log(
      `Generating calendar for schedule with id ${schedule.id} and name ${schedule.name}`
    );
    console.log(
      `Getting all on call events for schedule with id ${schedule.id} ...`
    );
    await sq
      .getAllOnCallEvents(access_token, schedule.id)
      .then((res) => (onCallEvents = res))
      .catch((err) => console.log(err));

    console.log(
      `Done getting the oncall events for schedule with id ${schedule.id} ...`
    );
    schedule_ics =
      "BEGIN:VCALENDAR\nVERSION:2.0\nCALSCALE:GREGORIAN\nPRODID:SQUADCAST-ICAL-1.0\n";

    await onCallEvents.forEach((event) => {
      event.user_ids.forEach(async (user) => {
        var event_ics = "";
        var user = users.find((u) => u.id == user);
        const fname = user.first_name;
        const lname = user.last_name;
        if (!active_users.find((u) => u.id == user.id)) {
          active_users.push(user);
        }

        // Using event_ics below
        event_ics += "BEGIN:VEVENT\nDTSTAMP:20220614T183000Z\n"; //Rather than hardcoding, change the DTSTAMP to the current date-time
        event_ics += `DTSTART;VALUE=DATE-TIME:${event.start_time.replace(
          /[&\/\\#,+()$~%.\-'":*?<>{}]/g,
          ""
        )}\n`;
        event_ics += `DTEND;VALUE=DATE-TIME:${event.end_time.replace(
          /[&\/\\#,+()$~%.\-'":*?<>{}]/g,
          ""
        )}\n`;
        event_ics += `SUMMARY:${fname} ${lname} is on call for schedule : ${event.calendar.name}\n`;
        event_ics += `UID:${uuid.v1()}\n`;
        event_ics += "END:VEVENT\n";
        schedule_ics += event_ics;

        // for the given user, append the event to their personal calendar
        await hf.append_user_event(event_ics, user);

        // user_events.map((obj) => {
        //   if (obj.id == user.id) {
        //     // console.log("FOUND - Adding event");
        //     obj.events += event_ics;
        //   }
        // });
        // user_events.map((obj) => {
        //   if (obj.id == user.id) {
        //     console.log(`Updated event of ${obj.id} to ${obj.events}`);
        //   }
        // });
      });
    });

    // Footer of ICS File
    schedule_ics += "END:VCALENDAR";

    await hf.write_file(
      schedule_ics,
      `${ICS_SCHEDULES_DIR}/${schedule.id}.ics`
    );
    console.log(`Done generating calendar for schedule with id ${schedule.id}`);
  });

  // Close out all the user files
  setTimeout(() => {
    users.forEach(async (user) => {
      await hf.close_user_file(user);
    });
    hf.build_html(
      teams,
      active_users,
      schedules,
      CALENDAR_HTML_FILE,
      SCHEDULES_DIR
    );
  }, 2000);

  //    console.log(`User Events is of length ${user_events.length}`);
  //hf.write_user_files(user_events);
  //   user_events.forEach((user_event) => {
  //     if (user_event.events.length != 0) {
  //       console.log(`User events for ${user_event.id}\n${user_event.events}`);
  //     }
  //   });
};

get_calendars();
