function incrementWinStreak() {
    $.ajax({
        url: '/increment_win_streak/',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            var winStreak = data.win_streak;
            updateWinStreakUI(winStreak);
        },
        error: function(xhr, status, error) {
            console.error(error);
        }
    });
}

function updateWinStreakUI(winStreak) {
    $('#win-streak').text('Win Streak: ' + winStreak);
}

function getWinStreak() {
    $.ajax({
        url: '/get_win_streak/',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            var winStreak = data.win_streak;
            updateWinStreakUI(winStreak);
        },
        error: function(xhr, status, error) {
            console.error(error);
        }
    });
}