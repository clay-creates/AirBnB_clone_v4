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