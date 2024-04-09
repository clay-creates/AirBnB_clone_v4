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

$.get('http://localhost:5001/api/v1/status/', (response) => {
  if (response.status === "OK") {
    $('div#api_status').addClass('available');
  } else {
    $('div#api_status').removeClass('available');
  }
});

$(document).ready(function () {
  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/places_search',
    type: 'POST',
    data: JSON.stringify({}),
    contentType: 'application/json',
    dataType: 'json',
    success: function (data) {
      const placesSection = $('section.places');

      data.forEach(place => {
        const article = $('<article></article>');

        const titleBox = $('<div class="title_box"></div>').html(`
          <h2>${place.name}</h2>
          <div class="price_by_night">$${place.price_by_night}</div>
        `);
        article.append(titleBox);

        const information = $('<div class="information"></div>').html(`
          <div class="max_guest">${place.max_guest} Guest${place.max_guest != 1 ? 's' : ''}</div>
          <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms != 1 ? 's' : ''}</div>
          <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms != 1 ? 's' : ''}</div>
        `);
        article.append(information);

        const description = $('<div class="description"></div>').text(place.description);
        article.append(description);

        placesSection.append(article);
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error('There was a problem with the AJAX request:', textStatus, errorThrown);
    }
  });
});
