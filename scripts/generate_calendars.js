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
const keys = require("./config/keys");

const API_KEY = keys.api_key;
const ICS_SCHEDULES_DIR = keys.path.ICS_SCHEDULES_DIR;
const ICS_USERS_DIR = keys.path.ICS_USERS_DIR;
const CALENDAR_HTML_FILE = keys.path.CALENDAR_HTML_FILE;
const SCHEDULES_URL = keys.path.SCHEDULES_URL;
const BASE_URL = keys.path.BASE_URL;

// File system stuff

// create the directories if they do not exist
if (!fs.existsSync(ICS_SCHEDULES_DIR))
  fs.mkdirSync(ICS_SCHEDULES_DIR, { recursive: true });
if (!fs.existsSync(ICS_USERS_DIR))
  fs.mkdirSync(ICS_USERS_DIR, { recursive: true });
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
  //   console.log(`Done getting access token ${access_token}`);

  // Get all teams
  console.log(`Getting teams ...`);
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
  //   console.log(`Instantiating user_events to capture all the user events`);
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
    // console.log(
    //   `Generating calendar for schedule with id ${schedule.id} and name ${schedule.name}`
    // );
    console.log(
      `Getting all on call events for schedule ${schedule.name} with id ${schedule.id} ...`
    );
    await sq
      .getAllOnCallEvents(access_token, schedule.id)
      .then((res) => (onCallEvents = res))
      .catch((err) => console.log(err));

    // console.log(
    //   `Done getting the oncall events for schedule with id ${schedule.id} ...`
    // );
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
      });
    });

    // Footer of ICS File
    schedule_ics += "END:VCALENDAR";

    await hf.write_file(
      schedule_ics,
      `${ICS_SCHEDULES_DIR}/${schedule.id}.ics`
    );
    // console.log(`Done generating calendar for schedule with id ${schedule.id}`);
  });

  // Close out all the user files
  // HACK BELOW! Need to fix this to wait for all Promises to resolve rather than set the timeout below
  setTimeout(() => {
    users.forEach(async (user) => {
      await hf.close_user_file(user);
    });
    hf.build_html(
      teams,
      active_users,
      schedules,
      CALENDAR_HTML_FILE,
      SCHEDULES_URL
    );
    console.log("All files have been generated");
    console.log(`Open your browser to ${BASE_URL}`);
  }, 2000);
};

get_calendars();
