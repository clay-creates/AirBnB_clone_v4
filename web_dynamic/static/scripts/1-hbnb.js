$(function () {
  const amenities = {};
  const ameniID = [];
  $('input:checkbox').change(function () {
    const ameniName = [];
    $(':checkbox').each(function () {
      if ($(this).is(':checked')) {
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
