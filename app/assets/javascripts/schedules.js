var scheduleShifts = [],
    employeeShifts = [];
var shiftID = 1001;

$(document).ready(function() {

  var page_id = $("#page_id").val();

  // $("#view_next_week").click(function() {
  //   document.location = "http://localhost:3000/schedules/2014-05-26";
  // });


  // SCHEDULE MANAGEMENT
  if ( page_id == 'new_schedule' || page_id == 'show_schedule' ) {

    // Get day width
    var colWidth = getColWidth();

    // Decide whether to show the side panel based on the manager status
    var manager = $("#is_manager").val();
    if ( manager != "true" ) {
      $("#side_panel").css({
        display: "none"
      })
    }

    $('.ui.selection.dropdown').dropdown();
    $('.ui.checkbox').checkbox();
    $('.employee_detail_modal').modal('setting', 'transition', 'vertical flip');

    fixScale();
    $(window).resize(function() {
      fixScale();
    })   

    // Get business open/close time
    var openTime  = getOpenTime(),
        closeTime = getCloseTime(),
        hourHeight = getHourHeight(),
        topBuffer = getTopBuffer(openTime);

    // Assign event handler to the week/location starting form button
    $("#update_starting_stats").click(function() {
      $("#week_of").val( $("#week_of_select").val() );
      $("#location_id").val( $("#location_select").val() );
      $("#get_week_and_location_backdrop").fadeOut(500);
    });


    // For schedule show page, iterate through shift divs, showing them at the appropriate place!
    $("#generated_shifts_container").children().each(function(index) {
      // Get data from data-attributes.
      var day_num = $(this).data("weekday"),
          shift_start = $(this).data("start-time"),
          shift_length = $(this).data("shift-length");

      // Convert time from UTC to local time
      var time = new Date(),
          time_offset = time.getTimezoneOffset() / 60;

      // Get our usable data
      var distance_to_top = (shift_start - time_offset) * hourHeight + topBuffer,
          distance_to_left = $(this).width() * day_num,
          shift_height = shift_length * hourHeight;

      $(this).css({
        top: distance_to_top + "px",
        left: distance_to_left + "px",
        height: shift_height + "px"
      });
    });



    // Apply the slider for shift start/end
    $( "#shift_slider" ).slider({
      range: true,
      min: openTime,
      max: closeTime,
      values: [ openTime, openTime+5 ],
      step: 0.5,
      slide: function( event, ui ) {
        updateSliderValues(ui.values[0], ui.values[1]);
      }
    });

    updateSliderValues( openTime, openTime+5, 1 );


    // Quick select radiobuttons
    $("input:radio[name='quickselect']").change(function() {
      dayQuickSelect();
    });

    // Make the day select checkboxes un-select the radio buttons
    $(".day_checkbox").click(function() {
      $(".day_radio").prop("checked",false);
    })
  }  

  // Show existing shifts on show schedule page

  // Add Shift To Schedule
  $("#add_shift").click(function() {
    var startTime = parseFloat($("#shift_start_time").val()),
        endTime = parseFloat($("#shift_end_time").val()),
        dayWidth = parseInt($(".day").css("width"));

    var numDays = numOfDaysSelected();
    
    // Check to see if this is a valid shift!

    // Is at least 1 day selected? Is the start time at least an hour before the end time?

    if ( numDays.length == 0 ) {
      alert("Please select at least 1 day!");
      return false;
    } else if ( !endTime || !startTime || endTime - startTime < 1 ) {
      alert("The start time must be at least 1 hour before the end time!");
      return false;
    }



    // Iterate through the number of shifts requested, adding to the object and displaying to user.
    for (day in numDays) {

      console.log(numDays[day]);
      var thisDayStart = startTime,
          thisDayEnd   = endTime;

      // Adjust time based on if its outside the business hours.
      var dayOpen  = $("#hours_" + numDays[day] + "_open").val(),
          dayClose = $("#hours_" + numDays[day] + "_close").val();

      if ( thisDayStart < dayOpen ) {
        thisDayStart = dayOpen;
      }
      if ( thisDayEnd > dayClose ) {
        thisDayEnd = dayClose;
      }
      // Create the javascript object for the shift

      // Create the HTML for the new shift. Editable set to true.
      generateShiftHTML(thisDayStart, thisDayEnd, dayWidth, numDays[day]);

      // Add this shift to the javascript array!
      var shiftObj = {
        id:     shiftID,
        day:    numDays[day],
        start:  thisDayStart,
        end:    thisDayEnd
      };
      scheduleShifts.push(shiftObj);

      // Increment our shiftID global variable
      shiftID++;


    }
    
    // Reset our new shift controls.
    $(".day_checkbox, .day_radio").prop("checked",false);

  });

  $("#save_schedule_button").click(function() {
    $("#save_schedule_form").submit();
  })

  $("#save_schedule_form").submit(function(e) {
    e.preventDefault();

    $("#employees_roster_spacefiller").show();

    $("#new_schedule_submit_container").fadeOut(250);
    
    // Add our first javascript object to scheduleShifts, with our week-of data.
    scheduleShifts.unshift({
      week_of: $("#week_of").val(),
      location_id: $("#location_id").val()
    });

    $.ajax({
      url: $(this).attr("action"),
      type: 'POST',
      dataType: 'json',
      data: { schedule: scheduleShifts }
    }).done(function(data) {

      // Add our database shift data to 
      

      scheduleShifts = data["shifts"];

      // Switch our view to hide shift-adding stuff and show employee-adding stuff.
      $("#side_panel").animate({
        right: -300
      }, 500, function() {
        $("#employees_roster_spacefiller").show();
        $("#side_panel").hide();
        $("#new_schedule_submit_container").fadeOut(500);
        fixScale();
        

        // Change header text
        $("#schedule_header").fadeOut(500, function() {
          $(this).text("Add Employees to Shifts");
        }).fadeIn(500);

        $("#employees_roster").show("slide", { direction: "down" }, 1000, function() {
          $("#save_employees_button_container").fadeIn(500);

        });
        

        $('html, body').animate({
          scrollTop: $(document).height() - $(window).height()
        }, 1000, function() {

        });
      });

      // Remove resizing/deleting of shifts.
      $(".close").hide();
      $(".new_shift").resizable('destroy');

      // Make our shifts acceptable 'droppables'
      $(".new_shift").droppable({
        accept: function(d) { 
          if(d.hasClass("employee_avatar") || d.hasClass("employee_avatar_clone") ){ 
            return true;
          }
        },
        drop:function(event, ui) {
          // Is this employee already on the shift?
          var employee_id = ui.draggable.attr("id")
          if ( $(this).find('#'+employee_id).length == 0 ) {

            // Is this an original draggable (from the employee roster) or a clone?
            if ( ui.draggable.hasClass("employee_avatar") ) {
              ui.draggable.clone().detach().css({
                left: 'auto',
                top: 'auto'
              }).removeClass("employee_avatar").addClass("employee_avatar_clone").appendTo($(this)).draggable({
                helper: "clone",
                revert: "invalid"
              });

            } else {
              ui.draggable.detach().css({
                left: 'auto',
                top: 'auto'
              }).appendTo($(this));
            }

            // Add this employee to the shift.
            var _this = this;
            var employee_id = ui.draggable.attr("id").split("_")[1];

            var shift_id = scheduleShifts.filter(function( obj ) {
              return obj["id"] == $(_this).attr("id");
            })[0]["database_id"];
            
            employeeShifts.push({
              user_id: employee_id,
              shift_id: shift_id
            });
          }
          
          
        }
      });

    });
  });   



  // ADDING EMPLOYEES TO SHIFTS

  // Attach filter event listener
  $("#name_filter").keyup(function() {

    var search_term = $(this).val().toLowerCase();
    $(".employee_avatar").each(function() {
      var employee_name = $(this).data("fname");
      if ( employee_name.indexOf(search_term) === -1 ) {
        $(this).hide();
      } else {
        $(this).show();
      }
    });
  });

  $('.employee_avatar_box').on('click', function(ev){
    ev.preventDefault();
    $.ajax({ 
      url: ($(this).attr('href')),
      type: 'GET',
      dataType: 'json'
    }).done(function(data){
      console.log(data);
      $("#modal_first_name").html(data.fname);
      $("#modal_last_name").html(data.lname);
      $("#modal_role").html(data.role);
      $("#modal_avatar").attr("src",data.image.url);
      $("#modal_una_holder").html("&nbsp;")

      if ( data.unavailabilities.length > 0 ) {
        for ( var una in data.unavailabilities ) {

          $("#unavailability_header").text("Employee has requested the following days off:")

          var unavailability = data.unavailabilities[una];
          // var unaString = unavailability.day + " from " + unavailability.duration_start.toString + " to " unavailability.duration_end.toString;
          // console.log(unavailability)

          var start_time = moment(unavailability.duration_start).utc().format("h:mm a");
          var end_time = moment(unavailability.duration_end).utc().format("h:mm a");

          $("#modal_una_holder").append("<div class='modal_time_block'><span class='modal_una_day'>"+unavailability.day+"</span> from <span class='modal_una_time'>" + start_time + "</span> to <span class='modal_una_time'>" + end_time + "</span></div>");
        }
      } else {
        $("#unavailability_header").text("Available for all shifts this week.")
      }



      $("#employee_detail_modal").modal("show");
      // $('#employee_info').html(template2(data));
    });
  });


  $(".employee_avatar").draggable({
    helper: "clone",
    revert: "invalid"
  });
  $("#employee_container").droppable({
    
    accept: ".employee_avatar_clone",
    drop: function(event, ui) {
      ui.draggable.remove();
    }

  });

  // SAVING EMPLOYEE SHIFTS
  $("#save_employees_button").click(function() {
    $("#save_shifts_form").submit();
  });
  $("#save_shifts_form").submit(function(e) {
    e.preventDefault();


    $.ajax({
      url: $(this).attr("action"),
      type: 'POST',
      dataType: 'json',
      data: { shifts: employeeShifts }
    }).done(function(data) {
      $("#finished_employees").fadeIn(500);
    });

  });


  // $(".employee_avatar_clone").on("mouseover", function() {
  //   console.log("triggered!");
  //   $(this).draggable({
  //   });
  // });

});
// Check if at least 1 weekday is selected, when adding shifts
function numOfDaysSelected() {
  var daysSelected = [];
  $(".day_checkbox").each(function() {
    if ( $(this).is(":checked") ) {
      daysSelected.push( $(this).attr("id").substr(-1, 1) )
    }
  });
  return daysSelected;
}



// Function to make the schedule and cell sizes adjust to window size changes. Also fixes pixel-rounding bugs.
function fixScale() {
  var offset = 140;

  // Check if sidepanel is visible. If so, work it into the offset
  if ( $("#side_panel").is(":visible") ) {
    offset += $("#side_panel").width() + 50;
  }
  
  $("#new_schedule_container").css({
    width: $(window).width() - offset
  });
  var scheduleWidth = $("#new_schedule_container").width();
  var dayWidth = Math.floor(scheduleWidth/7);

  // Apply width
  $(".day, .shift, .new_shift").css({
    width: dayWidth + "px"
  });

  // Reset distance from left
  $(".new_shift").each(function(index) {
    $(this).css({
      left: ( $(this).data("weekday") * dayWidth ) + "px"
    });
  });
}

function dayQuickSelect() {
  var rChosen = $("input:radio[name='quickselect']:checked").val();
  if ( rChosen == 'all' ) {
    $(".day_checkbox").prop("checked",true);
  } else if ( rChosen == 'weekdays') {
    $("#day_0, #day_1, #day_2, #day_3, #day_4").prop("checked", true);
    $("#day_5, #day_6").prop("checked", false);
  } else if ( rChosen == 'weekend') {
    $("#day_5, #day_6").prop("checked", true);
    $("#day_0, #day_1, #day_2, #day_3, #day_4").prop("checked", false);
  } else {
    $(".day_checkbox").prop("checked",false);
  }  
}

function convertFloatToTime(timeNum) {
  // Check if our time is AM or PM
  if ( timeNum >= 12 ) {
    var suffix = " PM";
  } else {
    var suffix = " AM";
  }

  // Convert 24h time into 12h time
  if ( timeNum >= 13 ) {
    timeNum -= 12;
  }

  // Make sure we have a string.
  timeNum = timeNum.toString();

  if ( timeNum.substr(-2, 2) == ".5" ) {    // eg. if our number is 7.5
    var formattedTime = timeNum.slice(0, -2) + ":30" + suffix;
  } else {                                  // eg. if our number is 13
    var formattedTime = timeNum + ":00" + suffix;
  }

  return formattedTime;
}


function updateSliderValues(start, end) {
  $("#shift_start_time").val(start);
  $("#shift_end_time").val(end);
  $( "#start_label" ).html( convertFloatToTime(start) );
  $( "#end_label" ).html( convertFloatToTime(end) );  
}
// generateShiftHTML(startTime, endTime, dayWidth, numDays[day]);
function generateShiftHTML(start, end, dayWidth, day) {
  var openTime   = getOpenTime(),
      closeTime  = getCloseTime(),
      hourHeight = getHourHeight(),
      topBuffer  = getTopBuffer(openTime),
      colWidth   = getColWidth();

  var distTop = hourHeight * ( start - openTime ) + topBuffer,
      shiftHeight = hourHeight * ( end - start ),
      distLeft = day * dayWidth;



  var newDiv = $("<div>")

  newDiv.css({
    top: distTop+"px",
    height: shiftHeight+"px",
    left: distLeft+1+"px",
    width: dayWidth+"px"
  }).addClass("new_shift").attr("id",shiftID).data("weekday", day);

  newDiv.append("<div class='close'>x</div>").append("<div class='filler'></div>");


  $("#generated_shifts_container").append(newDiv);

  // Add resize handler
  newDiv.resizable({
    grid: [ colWidth, hourHeight/2],
    handles: 'n, s',
    containment: "#generated_shifts_container"
  }).resize(function() {
    // On resize, update the JS array of objects.

    var shift_html_id = $(this).attr("id");

    var new_start_time = parseInt($(this).css("top")) / 30.0 + openTime,
        new_end_time   = new_start_time + ( parseInt($(this).outerHeight()) / 30.0 ) ;

    // Update the JS object!
    for (var i in scheduleShifts) {
       if (scheduleShifts[i]["id"] == shift_html_id) {
          scheduleShifts[i]["start"] = new_start_time;
          scheduleShifts[i]["end"]   = new_end_time;
          break;
       }
     }
  });

  // Add our delete shift click-handler
  $(".close").click(function() {

    var shift_html_id = $(this).parent().attr("id");

    for (var i in scheduleShifts) {
       if (scheduleShifts[i]["id"] == shift_html_id) {
          scheduleShifts.splice(i, 1);
          break;
       }
     }

     $(this).parent().remove();
  });


}

function getOpenTime() {
  return parseFloat( $("#open_hour").val() )
}

function getColWidth() {
  return $(".day").width();
}

function getCloseTime() {
  return parseFloat( $("#close_hour").val() )
}

function getHourHeight() {
  return parseInt($(".hour").css("height")) * 2
}

function getTopBuffer(open) {
  if ( open % 1 != 0 ) {
    var topBuffer = getHourHeight() / 2;
  } else {
    var topBuffer = 0;
  }

  return topBuffer;
}














