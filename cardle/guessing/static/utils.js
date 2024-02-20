// globals.js
var suggestionClicked = false;

$(function() {
    $("#car-model-input").on('click', function() {
        $(".suggestions-panel").scrollTop(0); 
    });
    $("#car-model-input").on('input', function() {
        let inputText = $(this).val();
        if (inputText.trim() === '') {
            $(".suggestions-panel").hide();
            return;
        }
        $.ajax({
            url: '/car-suggestions/',
            method: 'GET',
            data: { 'search_term': inputText },
            success: function(data) {
                $(".suggestions-panel").scrollTop(0); 
                let suggestions = data.suggestions;
                let suggestionsPanel = $(".suggestions-panel");
                suggestionsPanel.empty();
                if (suggestions.length > 0) {
                    suggestionsPanel.show();
                    for (let i = 0; i < suggestions.length; i++) {
                        suggestionsPanel.append('<div class="suggestion">' + suggestions[i] + '</div>');
                    }
                } else {
                    suggestionsPanel.hide();
                }
            }
        });
    });

    $("#car-model-input").on('focus', function() {
        let inputText = $(this).val().trim();

        if (inputText !== '') {
            $.ajax({
                url: '/car-suggestions/',
                method: 'GET',
                data: { 'search_term': inputText },
                success: function(data) {
                    let suggestions = data.suggestions;
                    let suggestionsPanel = $(".suggestions-panel");
                    suggestionsPanel.empty();
                    if (suggestions.length > 0) {
                        suggestionsPanel.show();
                        for (let i = 0; i < suggestions.length; i++) {
                            suggestionsPanel.append('<div class="suggestion">' + suggestions[i] + '</div>');
                        }
                    } else {
                        suggestionsPanel.hide();
                    }
                }
            });
        }
    });
    $("#car-model-input").on('keydown', function(e) {
        var suggestionsPanel = $(".suggestions-panel");
        var suggestionItems = suggestionsPanel.find('.suggestion');
        var selectedSuggestion = suggestionsPanel.find('.selected');
    
        if (e.key === 'ArrowDown' && suggestionItems.length > 0) {
            e.preventDefault();
    
            if (selectedSuggestion.length === 0 || selectedSuggestion.index() === suggestionItems.length - 1) {
                suggestionItems.removeClass('selected');
                suggestionItems.first().addClass('selected');
            } else {
                selectedSuggestion.removeClass('selected').next().addClass('selected');
            }
        } else if (e.key === 'ArrowUp' && suggestionItems.length > 0) {
            e.preventDefault();
    
            if (selectedSuggestion.length === 0 || selectedSuggestion.index() === 0) {
                suggestionItems.removeClass('selected');
                suggestionItems.last().addClass('selected');
            } else {
                selectedSuggestion.removeClass('selected').prev().addClass('selected');
            }
        } else if (e.key === 'Enter' && selectedSuggestion.length > 0) {
            e.preventDefault();
            var suggestionText = selectedSuggestion.text();
            $("#car-model-input").val(suggestionText);
            $(".suggestions-panel").empty();
            suggestionClicked = true;
            $('#car-search-form').submit();
        }
    });
    $(document).on('click', function(event) {
        if (!$(event.target).closest('#car-model-input, .suggestions-panel').length) {
            $(".suggestions-panel").hide();
        }
    });

    $(document).on('click', '.suggestion', function() {
        suggestionClicked = true;
        let selectedSuggestion = $(this).text();
        $("#car-model-input").val(selectedSuggestion);
        $(".suggestions-panel").empty();
        $('#car-search-form').submit();
    });
});

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
                    '<div class="name-column">Brand</div>' +
                    '<div class="name-column">Fuel</div>' +
                    '<div class="name-column">Car type</div>' +
                    '<div class="name-column">Engine conf.</div>' +
                    '<div class="name-column">Drive wheel</div>' +
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

                text += compareCarAttribute(selectcarbrand, searchedcarbrand, 'Brand');
                text += compareCarAttribute(selectcarfuel, searchedcarfuel, 'Fuel');
                text += compareCarAttribute(selectcartype, searchedcartype, 'CarType');
                text += compareCarAttribute(selectcarengine, searchedcarengine, 'EngineConf');
                text += compareCarAttribute(selectcarwheel, searchedcarwheel, 'DriveWheel');
                
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
                suggestionClicked = false;
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
        if (firstSuggestion && !suggestionClicked && $('#car-model-input').val() !== '') {
            carModel = firstSuggestion;
        } else {
            suggestionClicked = false;
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
                if (typeof searchedcarmodel !== 'undefined'){ 
                    if (nb_guess === 0){
                        $('#name-placement').prepend('<div class="all-infos">' +
                        '<div class="name-column">Model</div>' +
                        '<div class="name-column">Brand</div>' +
                        '<div class="name-column">Fuel</div>' +
                        '<div class="name-column">Car type</div>' +
                        '<div class="name-column">Engine conf.</div>' +
                        '<div class="name-column">Drive wheel</div>' +
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

                    text += compareCarAttribute(selectcarbrand, searchedcarbrand, 'Brand');
                    text += compareCarAttribute(selectcarfuel, searchedcarfuel, 'Fuel');
                    text += compareCarAttribute(selectcartype, searchedcartype, 'CarType');
                    text += compareCarAttribute(selectcarengine, searchedcarengine, 'EngineConf');
                    text += compareCarAttribute(selectcarwheel, searchedcarwheel, 'DriveWheel');
                    
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

                    container.find('.Brand').hide().delay((10)).fadeIn(fadeInDuration);
                    container.find('.Fuel').hide().delay((1 * fadeInDelay)).fadeIn(fadeInDuration);
                    container.find('.CarType').hide().delay((2 * fadeInDelay)).fadeIn(fadeInDuration);
                    container.find('.EngineConf').hide().delay((3 * fadeInDelay)).fadeIn(fadeInDuration);
                    container.find('.DriveWheel').hide().delay((4 * fadeInDelay)).fadeIn(fadeInDuration);
                    container.find('.Year').hide().delay((5 * fadeInDelay)).fadeIn(fadeInDuration);
                    nb_guess++;
                    if (searchedcarmodel === selectcarmodel){
                        winmessage(nb_guess);
                    }
                    $('#car-model-input').val('');
                    $(".suggestions-panel").hide();
                    suggestionClicked = false;
                }
            },
            error: function(xhr, status, error) {
                $('#car-model-input').val('');
                $(".suggestions-panel").hide();
                suggestionClicked = false;
                console.error(error);
            }
        });
    });
});

function compareCarAttribute(selectedAttribute, searchedAttribute, attributeName) {
    console.log(selectedAttribute, searchedAttribute);
    if (selectedAttribute && searchedAttribute) {
        var selectedOptions = selectedAttribute.split(',').map(option => option.trim());
        var searchedOptions = searchedAttribute.split(',').map(option => option.trim());
        var result;

        if (
            selectedOptions.every(option => searchedOptions.includes(option)) &&
            searchedOptions.every(option => selectedOptions.includes(option))
        ) {
            result = `<div class="square-info-green ${attributeName}" data-car-detail="${attributeName}">${searchedAttribute}</div>`;
        } else if (selectedOptions.some(option => searchedOptions.includes(option))) {
            result = `<div class="square-info-orange ${attributeName}" data-car-detail="${attributeName}">${searchedAttribute}</div>`;
        } else {
            result = `<div class="square-info-red ${attributeName}" data-car-detail="${attributeName}">${searchedAttribute}</div>`;
        }

        return result;
    } else {
        return `<div class="square-info-red ${attributeName}" data-car-detail="${attributeName}">N/A</div>`;
    }
}


function winmessage(nb_guess) {
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

    }, 4400);
}
document.addEventListener("DOMContentLoaded", function () {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 1);
    targetDate.setHours(0, 0, 0, 0);

    const countdownElement = document.getElementById("countdown");
    setInterval(updateCountdown, 1000);

    function updateCountdown() {
        const currentDate = new Date();
        const timeDifference = targetDate - currentDate;

        if (timeDifference > 0) {
            const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

            const formattedHours = hours < 10 ? `0${hours}` : hours;
            const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
            const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
        
            countdownElement.textContent = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
        
        } else {
            countdownElement.textContent = "It's a new day!";
        }
    }

    updateCountdown();
});

