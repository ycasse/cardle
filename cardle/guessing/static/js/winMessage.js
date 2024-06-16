
function winmessage(nb_guess) {
    $.ajax({
        url: 'get_user_count',
        method: 'GET',
        success: function(data) {
            var winMessageDiv = $('#win-message');
            var winCarImage = $('#win-car-image');
            var winMessageText = $('#win-message-text');
            var winMessageGuess = $('#win-message-nbguess');
            var winCount = $('#win-count');
        
            if (selectcarpicture) {
                winCarImage.attr('src', selectcarpicture);
            } else {
                winCarImage.attr('src', '/media/car_pics/no_image.jpg');
            }
            winMessageText.css('color', 'white'); 
            winMessageText.html('You guessed : <span style="color: #00bfff;">' + selectcarmodel + '</span>');
            winCount.css('color', 'white'); 
            winCount.html('You are the <span style="color: #00bfff;">' + data.count + '</span> to find the car of the day'); 
            winMessageGuess.css('color', 'white');
            winMessageGuess.html('Number of guesses : <span style="color: #00bfff;">' + nb_guess + '</span>'); 
            winCarImage.addClass('pulse-animation');
        
            setTimeout(function() {
                winMessageDiv.width($('#selected-car-details').width());
        
                winMessageDiv.show();
                $('#car-search-form').hide();
                $('#pannel-suggestions').hide();
                document.getElementById('win-car-image').scrollIntoView({
                    behavior: 'smooth',
                });
                setTimeout(function() {
                    winCarImage.removeClass('pulse-animation');
                }, 2000);
                incrementWinStreak();
            }, 4400);
        },
        error: function(error) {
            console.error('Error fetching live count:', error);
        }
    });
}
