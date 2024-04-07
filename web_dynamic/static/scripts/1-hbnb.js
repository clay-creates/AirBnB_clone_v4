$(document).ready(function () {
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
