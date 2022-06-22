var request = require('request');
//    var calendarUrl = 'webcal://rogerackroyd.app.opsgenie.com/webapi/webcal/getRecentSchedule?webcalToken=624fa53341713d6ec87d1a6fd23dc5181f3fb097941df0d31ec2afdea99fd320&scheduleId=7d65aa74-ded1-49b2-8058-44f9901e27e8';
    var calendarUrl = 'webcal://localhost:3000/test_cal.ics';

    var options = {
      url: calendarUrl.replace('webcal://', 'http://'),
      gzip: true
    };

    request(options, function (error, response, icalData) {
      console.log(icalData);
    });
