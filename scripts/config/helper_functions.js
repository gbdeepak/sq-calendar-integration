const fs = require("fs");
const fsp = require("fs").promises;
const keys = require("./keys");

const ICS_USERS_DIR = "../backend/static/calendars/users";
const SCHEDULES_DIR = "localhost:3000/calendars/schedules";
const USERS_DIR = "localhost:3000/calendars/users";

exports.write_file = async (content, file) => {
  await fs.exists(file, async (exists) => {
    if (exists) {
      console.log(` ${file} exists and will be deleted ...`);
      await fs.unlinkSync(file);
      console.log("Done");
    }
    await fsp.writeFile(file, content);
  });
};

exports.create_user_file = async (user) => {
  const filename = `${ICS_USERS_DIR}/${user.id}.ics`;
  await fsp.appendFile(
    filename,
    `BEGIN:VCALENDAR\nVERSION:2.0\nCALSCALE:GREGORIAN\nPRODID:SQUADCAST-ICAL-1.0\n`
  );
};

exports.append_user_event = async (event, user) => {
  const filename = `${ICS_USERS_DIR}/${user.id}.ics`;
  // var content = "";
  // await fs.exists(filename, (exists) => {
  //   if (!exists) {
  //     content = `Top of file\n${event}`;
  //     console.log(`Now will write \n${content}`);
  //   } else content = event;
  // });
  // console.log(`Now will write content\n${content}`);
  await fsp.appendFile(filename, event);
};

exports.close_user_file = async (user) => {
  const filename = `${ICS_USERS_DIR}/${user.id}.ics`;
  await fsp.appendFile(filename, `END:VCALENDAR`);
};

exports.write_user_files = (users) => {
  users.forEach = (user) => {
    console.log(`User event for ${user.id} is ${user.events}`);
  };
};

exports.build_html = (teams, users, schedules, filename, schedule_dir) => {
  var stream = fs.createWriteStream(filename);

  stream.once("open", (fd) => {
    var header = `
  <!doctype html>
  <html lang="en">
    <head>
      <!-- Required meta tags -->
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  
      <!-- Bootstrap CSS -->
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
  
      <title>Published Calendars</title>
    </head>
    <body>
  
  <div class="container">
      <h1>Schedule Calendars</h1>
  
      <table class="table">
          <thead>
            <tr>
              <th scope="col">Team</th>
              <th scope="col">Schedule</th>
              <th scope="col">Download</th>
              <th scope="col">Open</th>
            </tr>
          </thead>
          <tbody>
    `;

    var schedules_content = ``;

    schedules.forEach((schedule) => {
      const team = teams.find((team) => team.id == schedule.owner.id);
      schedules_content += `
        <tr>
        <td>${team.name}</td>
        <td>${schedule.name}</td>
        <td><a href="http://${SCHEDULES_DIR}/${schedule.id}.ics">Download</a></td>
        <td><a href="webcal://${schedule_dir}/${schedule.id}.ics">Open</a></td>
      </tr>
        `;
    });

    var middle = `
    </tbody>
    </table>
    <h1>User Calendars</h1>
  
    <table class="table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Download</th>
            <th scope="col">Open</th>
          </tr>
        </thead>
        <tbody>
    `;

    var users_content = ``;

    users.forEach((user) => {
      users_content += `
        <tr>
        <td>${user.first_name} ${user.last_name}</td>
        <td><a href="http://${USERS_DIR}/${user.id}.ics">Download</a></td>
        <td><a href="webcal://${USERS_DIR}/${user.id}.ics">Open</a></td>
      </tr>
        `;
    });

    var footer = `
  </tbody>
      </table>
</div>
  
  `;

    stream.end(header + schedules_content + middle + users_content + footer);
  });
};
