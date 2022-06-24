const axios = require("axios");
const keys = require("./keys");

// Squadcast API endpoints
// const GET_ACCESS_TOKEN = "https://auth.squadcast.com/oauth/access-token";
// const GET_ALL_TEAMS = "https://api.squadcast.com/v3/teams";
// const GET_ALL_USERS = "https://api.squadcast.com/v3/users";
// const GET_ALL_SCHEDULES = "https://api.squadcast.com/v3/schedules";
// const GET_ALL_ONCALL_EVENTS = "https://api.squadcast.com/v3/schedules";

const GET_ACCESS_TOKEN = keys.squadcast.GET_ACCESS_TOKEN;
const GET_ALL_TEAMS = keys.squadcast.GET_ALL_TEAMS;
const GET_ALL_USERS = keys.squadcast.GET_ALL_USERS;
const GET_ALL_SCHEDULES = keys.squadcast.GET_ALL_SCHEDULES;
const GET_ALL_ONCALL_EVENTS = keys.squadcast.GET_ALL_ONCALL_EVENTS;

// Get Access Token - get access token from an API_KEY
exports.getAccessToken = async (API_KEY) => {
  var resp = "";
  try {
    resp = await axios.get(GET_ACCESS_TOKEN, {
      headers: {
        "X-Refresh-Token": API_KEY,
      },
    });
    // console.log(resp.data.data.access_token);
  } catch (err) {
    // Handle Error Here
    console.error(err);
  }
  return resp.data.data.access_token;
};

// Get All Teams
exports.getAllTeams = async (access_token) => {
  var resp = "";
  try {
    resp = await axios.get(GET_ALL_TEAMS, {
      headers: {
        Authorization: `Bearer ${access_token} `,
      },
    });
    // console.log(resp.data.data.access_token);
  } catch (err) {
    // Handle Error Here
    console.error(err);
  }
  return resp.data.data;
};

// Get All Users
exports.getAllUsers = async (access_token) => {
  var resp = "";
  try {
    resp = await axios.get(GET_ALL_USERS, {
      headers: {
        Authorization: `Bearer ${access_token} `,
      },
    });
    // console.log(resp.data.data.access_token);
  } catch (err) {
    // Handle Error Here
    console.error(err);
  }
  return resp.data.data;
};

// Get All Schedules
exports.getAllSchedules = async (access_token) => {
  var resp = "";
  try {
    resp = await axios.get(GET_ALL_SCHEDULES, {
      headers: {
        Authorization: `Bearer ${access_token} `,
      },
    });
  } catch (err) {
    console.error(err);
  }
  return resp.data.data;
};

// Get All Oncall Events
// hardcoded for 15 days prior and 15 days after
exports.getAllOnCallEvents = async (access_token, schedule_id) => {
  var resp = "";
  try {
    resp = await axios.get(
      `${GET_ALL_ONCALL_EVENTS}/${schedule_id}/events?currentDate=""&daysBefore=15&daysAfter=15`,
      {
        headers: {
          Authorization: `Bearer ${access_token} `,
        },
      }
    );
  } catch (err) {
    // Handle Error Here
    console.error(err);
  }
  return resp.data.data;
};
