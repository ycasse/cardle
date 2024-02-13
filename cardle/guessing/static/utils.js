// globals.js
var suggestionClicked = false;

$(function() {
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

// main.js
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

$(document).ready(function() {
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
        },
        error: function(xhr, status, error) {
            console.error(error);
        }
    });

    var nb_guess = 0;
    $('#car-search-form').on('submit', function(event) {
        event.preventDefault();
        var carModel = $('#car-model-input').val();

        var firstSuggestion = $('.suggestions-panel .suggestion:first').text();
        if (firstSuggestion && !suggestionClicked) {
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
                }
            },
            error: function(xhr, status, error) {
                console.error(error);
            }
        });
    });
});

function compareCarAttribute(selectedAttribute, searchedAttribute, attributeName) {
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
}

function winmessage(nb_guess) {
    var winMessageDiv = $('#win-message');
    var winCarImage = $('#win-car-image');
    var winMessageText = $('#win-message-text');

    if (selectcarpicture) {
        winCarImage.attr('src', selectcarpicture);
    } else {
        winCarImage.attr('src', '/media/car_pics/no_image.jpg');
    }

    winMessageText.text('Congratulations! You guessed the car in ' + nb_guess + ' attempts.');

    setTimeout(function() {
        winMessageDiv.width($('#selected-car-details').width());

        winMessageDiv.show();
        $('#car-search-form').hide();
        $('#pannel-suggestions').hide();
        document.getElementById('win-car-image').scrollIntoView({
            behavior : 'smooth',
        });
        
    }, 4400);
}
