module.exports = {
  api_key:
    "41190cd87b0c6a27345bf77ad2498170a04b98709ff596d3706c0a2e16df20fe9184538c14e36ecd519ce2b3214cbedcde46378f97cfaf7ec687d2a7b98e1e60",
  path: {
    ICS_SCHEDULES_DIR: "../backend/static/calendars/schedules",
    ICS_USERS_DIR: "../backend/static/calendars/users",
    CALENDAR_HTML_FILE: `../backend/static/calendars/index.html`,
    SCHEDULES_DIR: "localhost:3000/calendars/schedules",
    USERS_DIR: "localhost:3000/calendars/users",
    CALENDAR_LIST_FILE: "../backend/static/calendars.html",
  },
  squadcast: {
    GET_ACCESS_TOKEN: "https://auth.squadcast.com/oauth/access-token",
    GET_ALL_TEAMS: "https://api.squadcast.com/v3/teams",
    GET_ALL_USERS: "https://api.squadcast.com/v3/users",
    GET_ALL_SCHEDULES: "https://api.squadcast.com/v3/schedules",
    GET_ALL_ONCALL_EVENTS: "https://api.squadcast.com/v3/schedules",
  },
};
