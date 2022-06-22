module.exports = {
  squadcast: {
    GET_ACCESS_TOKEN: "https://auth.squadcast.com/oauth/access-token",
    GET_ALL_TEAMS: "https://api.squadcast.com/v3/teams",
    GET_ALL_USERS: "https://api.squadcast.com/v3/users",
    GET_ALL_SCHEDULES: "https://api.squadcast.com/v3/schedules",
    GET_ALL_ONCALL_EVENTS: "https://api.squadcast.com/v3/schedules",
  },

  google: {
    clientID:
      "90453931290-8n359pudq56c8484618m5vmrhlod3llo.apps.googleusercontent.com",
    clientSecret: "WqmZEORy9-MFuzshHSTB-Pfu",
    callbackURL: "/api/users/google/redirect",
  },
  mongodb: {
    // dbURI:
    //   'mongodb://deepak:wgacaabaa@cluster0-shard-00-00-fk5gx.mongodb.net:27017,cluster0-shard-00-01-fk5gx.mongodb.net:27017,cluster0-shard-00-02-fk5gx.mongodb.net:27017/GTD?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority',
    dbURI_dev: "mongodb://localhost:27017/GTD",
    dbURI_prod:
      "mongodb://deepak:wgacaabaa@cluster0-shard-00-00-fk5gx.mongodb.net:27017,cluster0-shard-00-01-fk5gx.mongodb.net:27017,cluster0-shard-00-02-fk5gx.mongodb.net:27017/GTD?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority",
  },
  jwt: {
    secret: "deepakiscrazy",
  },
};
