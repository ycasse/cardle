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
                suggestionsPanel.scrollTop(0);
            } else {
                selectedSuggestion.removeClass('selected').next().addClass('selected');
                suggestionsPanel.scrollTop(selectedSuggestion.next().position().top + suggestionsPanel.scrollTop());
            }
        } else if (e.key === 'ArrowUp' && suggestionItems.length > 0) {
            e.preventDefault();
    
            if (selectedSuggestion.length === 0 || selectedSuggestion.index() === 0) {
                suggestionItems.removeClass('selected');
                suggestionItems.last().addClass('selected');
                suggestionsPanel.scrollTop(suggestionsPanel[0].scrollHeight);
            } else {
                selectedSuggestion.removeClass('selected').prev().addClass('selected');
                suggestionsPanel.scrollTop(selectedSuggestion.prev().position().top + suggestionsPanel.scrollTop());
            }
        } else if (e.key === 'Enter' && selectedSuggestion.length > 0) {
            e.preventDefault();
            var suggestionText = selectedSuggestion.text();
            $("#car-model-input").val(suggestionText);
            $(".suggestions-panel").empty();
            globals.suggesitonClicked = true;
            $('#car-search-form').submit();
        }
    });
    $(document).on('click', function(event) {
        if (!$(event.target).closest('#car-model-input, .suggestions-panel').length) {
            $(".suggestions-panel").hide();
        }
    });

    $(document).on('click', '.suggestion', function() {
        globals.suggesitonClicked = true;
        let selectedSuggestion = $(this).text();
        $("#car-model-input").val(selectedSuggestion);
        $(".suggestions-panel").empty();
        $('#car-search-form').submit();
    });
});
