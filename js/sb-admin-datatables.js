// Call the dataTables jQuery plugin
$(document).ready(function() {
    var username = document.cookie.match(/name=.*;?/);
    username = username[0].split('=')[1];
    $("#userName").html('<i class="fa fa-user" aria-hidden="true"></i>&nbsp'+username);
  $('#dataTable').DataTable();
});
