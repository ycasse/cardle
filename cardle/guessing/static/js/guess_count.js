function updateLiveCount() {
    $.ajax({
        url: 'get_live_count/',
        method: 'GET',
        success: function(data) {
            $('#live-count').css({
                'color' : 'white',
                'font-size' : '1.2em',
                'font-weight': 'bold',
                'text-shadow': '2px 2px rgb(2, 3, 41)',
                'margin-bottom' : '5%',
            }); 
            $('#live-count').html('<span style="color: #00bfff;">' + data.count + '</span> people already found out!');
        },
        error: function(error) {
            console.error('Error fetching live count:', error);
        }
    });
}

// Function to increment the count (call this function when a user guesses correctly)
function incrementCount() {
    $.ajax({
        url: 'increment_count/',
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken')  // Include CSRF token for POST request
        },
        success: function(data) {
            if (data.success) {
                console.log('Count incremented successfully.');
            } else {
                console.error('Error incrementing count:', data.error);
            }
        },
        error: function(error) {
            console.error('Error incrementing count:', error);
        }
    });
}

// Function to refresh count every 30 seconds
setInterval(updateLiveCount, 30000);

// Utility function to get CSRF token
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}