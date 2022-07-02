module.exports = {
  api_key:
    "",
  path: {
    ICS_SCHEDULES_DIR: "../backend/static/calendars/schedules",
    ICS_USERS_DIR: "../backend/static/calendars/users",
    CALENDAR_HTML_FILE: `../backend/static/calendars/index.html`,
    SCHEDULES_URL: "localhost:3000/calendars/schedules",
    USERS_URL: "localhost:3000/calendars/users",
    BASE_URL: "http://localhost:3000/calendars/index.html",
    // CALENDAR_LIST_FILE: "../backend/static/calendars.html",
  },
  squadcast: {
    GET_ACCESS_TOKEN: "https://auth.squadcast.com/oauth/access-token",
    GET_ALL_TEAMS: "https://api.squadcast.com/v3/teams",
    GET_ALL_USERS: "https://api.squadcast.com/v3/users",
    GET_ALL_SCHEDULES: "https://api.squadcast.com/v3/schedules",
    GET_ALL_ONCALL_EVENTS: "https://api.squadcast.com/v3/schedules",
  },
};
