function confirmDelete(subscriberID) {
    let confirmAction = confirm('Are you sure you want to delete this item?');

    if (confirmAction) {
        const formID = document.getElementById(`${subscriberID}-form`);
        formID.submit();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const showAlertParam = urlParams.get('showAlert');

    if (showAlertParam === 'true') {
        const successMessage = urlParams.get('success');
        const dangerMessage = urlParams.get('danger');

        if (successMessage) {
            showAlert('ca-success');
        } else if (dangerMessage) {
            showAlert('ca-danger');
        }
        // showAlert();
    }
});

function showAlert(alertClass) {
    var alert = document.querySelector(`.${alertClass}`);
    alert.style.display = "block";

    // You can customize the timeout or use other events to close the alert
    setTimeout(function () {
        alert.style.display = "none";
    }, 10000); // Hide after 3 seconds
}

function closeAlert(alertId) {
    var alert = document.getElementById(alertId);
    alert.style.display = "none";
}

