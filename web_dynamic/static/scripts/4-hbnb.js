$(function () {
  var amenities = {};
  let ameniID = [];
  $('input:checkbox').change(function () {
    let ameniName = [];
    $(':checkbox').each(function () {
      if ($(this).is(":checked")) {
        ameniID.push($(this).data('id'));
        ameniName.push($(this).data('name'));
      } else {
        delete amenities[$(this).data('id')];
      }
    });
    $('div.amenities h4').text(ameniName.join(', '));
    console.log(ameniID);
  });
});
  
$(function () {
  $.get("https://0.0.0.0:5001/api/v1/status/", function (data) {
    if (data.status === "OK") {
      $("#api_status").addClass("available");
    } else {
      $("#api_status").removeClass("available");
    }
  });
});
  
$('#searchBtn').click(function () {
  $.ajax({
    url: "https://0.0.0.0:5001/api/v1/places_search/",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify({amenities: ameniID}),
    success: function (response) {
      $('.places').empty();
      response.forEach(function (place) {
        var article = $('<article>').append(
          $('<div>').addClass('title').append(
            $('<h2>').text(place.name),
            $('<div>').addClass('price_by_night').text(place.price_by_night)
          ),
          $('<div>').addClass('information').append(
            $('<div>').addClass('max_guest').append(
              $('<i>').addClass('fa fa-users fa-3x'),
              $('<br>'),
              place.max_guests + "Guests"
            ),
            $('<div>').addClass('number_rooms').append(
              $('<i>').addClass('fa fa-users fa-3x'),
              $('<br>'),
              place.number_bathrooms + "Bathroom"
            )
          ),
          $('<div>').addClass('description').text(place.description)
        );
        $('.places').append(article);
      });
    }
  });
});
