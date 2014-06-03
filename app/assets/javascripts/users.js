$(document).ready(function() {

  // login form stuff
  $('#login_form').hide();
  $("#show_login_form").click(function(ev) {
    ev.preventDefault();
    $(".login_links").fadeOut(300, function() {
      $(".login_form").slideDown(400);
    });
  })

  var days = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];

  for (i in days) {
    $("#"+days[i]+"_slider").slider({
      range: true,
      min: 0,
      max: 24,
      values: [ 9, 17 ],
      step: 0.5,
      slide: function( event, ui ) {
        // Get the modified day
        var fiddleDay = $(this).attr("id").split("_")[0];
        companyUpdateSliderValues(ui.values[0], ui.values[1], fiddleDay);
      }
    })

    companyUpdateSliderValues( $( "#"+days[i]+"_slider" ).slider( "values", 0 ), $( "#"+days[i]+"_slider" ).slider( "values", 1 ), days[i] );

  }

});

function companyUpdateSliderValues(start, end, day) {
  console.log("Yeah!");
  $( "#location_" + day + "_open").val(simplerTimeConvert(start));
  $( "#location_" + day + "_close").val(simplerTimeConvert(end));
  $( "#" + day + "_start_label" ).html( convertFloatToTime(start) );
  $( "#" + day + "_end_label" ).html( convertFloatToTime(end) );  
}

function simplerTimeConvert(timeNum) {
  timeNum = timeNum.toString();

  if ( timeNum.substr(-2, 2) == ".5" ) {    // eg. if our number is 7.5
    var formattedTime = timeNum.slice(0, -2) + ":30";
  } else {                                  // eg. if our number is 13
    var formattedTime = timeNum + ":00";
  }

  return formattedTime;  
}