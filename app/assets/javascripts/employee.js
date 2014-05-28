$(document).ready(function(){
  
  template2 = HandlebarsTemplates['employees/quick_details'];
  employeeCP = HandlebarsTemplates['employees/my_stats'];
  managerCP = HandlebarsTemplates['employees/managerCP'];
  

  Handlebars.registerHelper('shiftHours', function() {
    var st = moment(this.start_time).utc();
    var et = moment(this.end_time).utc();

    var shour = moment(st).get('hour');
    var smin = moment(st).get('minute');
    smin = smin / 60;
    var shours = shour + smin;

    var ehour = moment(et).get('hour');
    var emin = moment(et).get('minute');
    emin = emin / 60;
    var ehours = ehour + emin;

    var shiftDifference = 0;
    return shiftDifference = ehours - shours;
  });

  // Handlebars.registerHelper('index_of', function(context,ndx) {
  //   return context[ndx];
  // });

  Handlebars.registerHelper('shiftStart', function() {
    var st = this.start_time;
    var m = moment(st).utc();
    var t =  moment(m).format("dddd, MMMM Do, h:mm: a");
    return t;
  });

  Handlebars.registerHelper('shiftEnd', function() {
    var st = this.end_time;
    var m = moment(st).utc();
    var t =  moment(m).format("h:mm: a");
    return t;
  });



  Handlebars.registerHelper('locationHour', function(time) {
    var utcConvertedTime = moment(time).utc();
    return moment(utcConvertedTime).format("h:mm a");
  });  

  Handlebars.registerHelper('durationStart', function() {
    var st = this.duration_start;
    var m = moment(st).utc();
    var t =  moment(m).format("h:mm a");
    return t;
  });

   Handlebars.registerHelper('durationEnd', function() {
    var st = this.duration_end;
    var m = moment(st).utc();
    var t =  moment(m).format("h:mm a");
    return t;
  });


  $('.ui.dropdown').dropdown();

});
