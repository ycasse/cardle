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

    $(document).on('click', function(event) {
        if (!$(event.target).closest('#car-model-input, .suggestions-panel').length) {
            $(".suggestions-panel").hide();
        }
    });
    $(document).on('click', '.suggestion', function() {
        let selectedSuggestion = $(this).text();
        $("#car-model-input").val(selectedSuggestion);
        $(".suggestions-panel").hide();
    });

    $("#search-button").on('click', function() {
        let searchTerm = $("#car-model-input").val();
    });
});

