
var selectcarmodel;
var searchedcarmodel;
var selectcarbrand;
var searchedcarbrand;
var selectcarfuel;
var searchedcarfuel;
var selectcartype;
var searchedcartype;
var selectcarengine;
var searchedcarengine;
var selectcarwheel;
var searchedcarwheel;
var selectcaryear;
var searchedcaryear;
var selectcarpicture;
var nb_guess = 0;

$(document).ready(function() {
    getWinStreak();
    updateWinStreakUI();
    
    function updateGuessedCarsOnLoad(guessedCars) {
        for (var i = 0; i < guessedCars.length; i++) {
            var carDetails = guessedCars[i];
            searchedcarmodel = carDetails.Model;
            searchedcarbrand = carDetails.Brand;
            searchedcarfuel = carDetails.Fuel;
            searchedcartype = carDetails['Car Type'];
            searchedcarengine =  carDetails['Engine conf'];
            searchedcarwheel = carDetails['Drive wheel'] ;
            searchedcaryear = carDetails.Year;
            if (typeof searchedcarmodel !== 'undefined'){ 
                if (nb_guess === 0){
                    $('#name-placement').prepend('<div class="all-infos">' +
                    '<div class="name-column">Model</div>' +
                    '<div class="name-column">Drive wheel</div>'+
                    '<div class="name-column">Fuel</div>' +
                    '<div class="name-column">Car type</div>' +
                    '<div class="name-column">Engine conf.</div>' +
                     '<div class="name-column">Brand</div>' +
                    '<div class="name-column">Release Year</div>' +
                    '</div>');
                }
                var container = $('<div class="guessing-car"></div>');
                var text = '';
                if (carDetails.Picture) {
                    text += '<div class="model"><img src="' + carDetails.Picture + '" alt="Car Image" class="square-image"><div class="car-name">' + carDetails.Model+'</div></div>';
                } else {
                    text += '<img src="/media/car_pics/no_image.jpg" alt="Default Car Image"  class="square-image">';
                }
                 text += compareCarAttribute(selectcarwheel, searchedcarwheel, 'DriveWheel');
                text += compareCarAttribute(selectcarfuel, searchedcarfuel, 'Fuel');
                text += compareCarAttribute(selectcartype, searchedcartype, 'CarType');
                text += compareCarAttribute(selectcarengine, searchedcarengine, 'EngineConf');
                text += compareCarAttribute(selectcarbrand, searchedcarbrand, 'Brand');
                
                if (selectcaryear === searchedcaryear){
                    text += '<div class="square-info-green Year" data-car-detail="Year">' + carDetails.Year + '</div></div>';
                } else if (selectcaryear > searchedcaryear){
                    text += '<div class="square-year-up Year" data-car-detail="Year">' + carDetails.Year + '</div></div>';
                } else {
                    text += '<div class="square-year-down Year" data-car-detail="Year">' + carDetails.Year + '</div></div>';
                }
                container.prepend(text);

                $('#selected-car-details').prepend(container);
                nb_guess++;
                if (searchedcarmodel === selectcarmodel){
                    var winMessageDiv = $('#win-message');
                    var winCarImage = $('#win-car-image');
                    var winMessageText = $('#win-message-text');
                    var winMessageGuess = $('#win-message-nbguess');
                
                    if (selectcarpicture) {
                        winCarImage.attr('src', selectcarpicture);
                    } else {
                        winCarImage.attr('src', '/media/car_pics/no_image.jpg');
                    }
                    winMessageText.css('color', 'white'); 
                    winMessageText.html('You guessed : <span style="color: #00bfff;">' + selectcarmodel + '</span>'); 
                    winMessageGuess.css('color', 'white');
                    winMessageGuess.html('Number of guesses : <span style="color: #00bfff;">' + nb_guess + '</span>'); 
                    winCarImage.addClass('pulse-animation');                
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
                }
                $('#car-model-input').val('');
                $(".suggestions-panel").hide();
            }
        }
    }
    
    $.ajax({
        url: '/get_random_car/',
        method: 'GET',
        dataType: 'json',
        success: function(data) { 
            selectcarmodel = data.car_details.Model;
            selectcarbrand = data.car_details.Brand;
            selectcarfuel = data.car_details.Fuel;
            selectcartype = data.car_details['Car Type'];
            selectcarengine = data.car_details['Engine conf'];
            selectcarwheel= data.car_details['Drive wheel'];
            selectcaryear = data.car_details.Year;
            selectcarpicture =  data.car_details.Picture;
            var yesterdaycar = data.car_details['Yesterday Car Model'];
            var yesterdayCarElement = $("#yesterday-car");
            if (yesterdayCarElement.length) {
                yesterdayCarElement.append('<p>Yesterday\'s car was : <span style="color: #00bfff;">' + yesterdaycar + '</span></p>');
            } else {
                console.error("Element with class 'yesterday-car' not found.");
            }
            callSecondAjax();
        },
        error: function(xhr, status, error) {
            console.error(error);
        }
    });
    function callSecondAjax() {
        $.ajax({
            url: '/get_guessed_cars/',
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                const guessedCars = data.guessed_cars_details;
                updateGuessedCarsOnLoad(guessedCars);
            },
            error: function(xhr, status, error) {
                console.error(error);
            }
        });
    }

    
    $('#car-search-form').on('submit', function(event) {
        event.preventDefault();
        var carModel = $('#car-model-input').val();
        var firstSuggestion = $('.suggestions-panel .suggestion:first').text();
        if (firstSuggestion && !globals.suggestionClicked && $('#car-model-input').val() !== '') {
            carModel = firstSuggestion;
        } else {
            globals.suggestionClicked = false;
        }

        $.ajax({
            url: '/get_car_details/',
            method: 'GET',
            data: { car_model: carModel, csrfmiddlewaretoken: '{{ csrf_token }}' },
            success: function(data) {
                searchedcarmodel = data.car_details.Model;
                searchedcarbrand = data.car_details.Brand;
                searchedcarfuel = data.car_details.Fuel;
                searchedcartype = data.car_details['Car Type'];
                searchedcarengine =  data.car_details['Engine conf'];
                searchedcarwheel = data.car_details['Drive wheel'] ;
                searchedcaryear = data.car_details.Year;
                console.log(searchedcarwheel);
                if (typeof searchedcarmodel !== 'undefined'){ 
                    if (nb_guess === 0){
                        $('#name-placement').prepend('<div class="all-infos">' +
                        '<div class="name-column">Model</div>' +
                        '<div class="name-column">Drive wheel</div>' +
                        '<div class="name-column">Fuel</div>' +
                        '<div class="name-column">Car type</div>' +
                        '<div class="name-column">Engine conf.</div>' +
                        '<div class="name-column">Brand</div>' +
                        '<div class="name-column">Release Year</div>' +
                        '</div>');
                    }
                    var container = $('<div class="guessing-car"></div>');
                    var text = '';
                    if (data.car_details.Picture) {
                        text += '<div class="model"><img src="' + data.car_details.Picture + '" alt="Car Image" class="square-image"><div class="car-name">' + data.car_details.Model+'</div></div>';
                    } else {
                        text += '<img src="/media/car_pics/no_image.jpg" alt="Default Car Image"  class="square-image">';
                    }

                    text += compareCarAttribute(selectcarwheel, searchedcarwheel, 'DriveWheel');
                    text += compareCarAttribute(selectcarfuel, searchedcarfuel, 'Fuel');
                    text += compareCarAttribute(selectcartype, searchedcartype, 'CarType');
                    text += compareCarAttribute(selectcarengine, searchedcarengine, 'EngineConf');
                    text += compareCarAttribute(selectcarbrand, searchedcarbrand, 'Brand');
                    
                    if (selectcaryear === searchedcaryear){
                        text += '<div class="square-info-green Year" data-car-detail="Year">' + data.car_details.Year + '</div></div>';
                    } else if (selectcaryear > searchedcaryear){
                        text += '<div class="square-year-up Year" data-car-detail="Year">' + data.car_details.Year + '</div></div>';
                    } else {
                        text += '<div class="square-year-down Year" data-car-detail="Year">' + data.car_details.Year + '</div></div>';
                    }

                    var fadeInDuration = 1800;
                    var fadeInDelay = 600;

                    container.prepend(text);

                    $('#selected-car-details').prepend(container);

                    container.find('.DriveWheel').hide().delay((10)).fadeIn(fadeInDuration);
                    container.find('.Fuel').hide().delay((1 * fadeInDelay)).fadeIn(fadeInDuration);
                    container.find('.CarType').hide().delay((2 * fadeInDelay)).fadeIn(fadeInDuration);
                    container.find('.EngineConf').hide().delay((3 * fadeInDelay)).fadeIn(fadeInDuration);
                    container.find('.Brand').hide().delay((4 * fadeInDelay)).fadeIn(fadeInDuration);
                    container.find('.Year').hide().delay((5 * fadeInDelay)).fadeIn(fadeInDuration);
                    nb_guess++;
                    if (searchedcarmodel === selectcarmodel){
                        winmessage(nb_guess);
                    }
                    $('#car-model-input').val('');
                    $(".suggestions-panel").hide();
                    globals.suggestionClicked = false;
                }
            },
            error: function(xhr, status, error) {
                $('#car-model-input').val('');
                $(".suggestions-panel").hide();
                globals.suggestionClicked = false;
                console.error(error);
            }
        });
    });
});
