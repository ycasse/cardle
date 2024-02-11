$(function() {
    $("#car-model-input").on('input', function() {
        let inputText = $(this).val();
        // Perform AJAX request to get suggestions based on inputText
        $.ajax({
            url: '/car-suggestions/',  // URL to fetch suggestions (adjust this to your Django view)
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
/*  */
    $(document).on('click', '.suggestion', function() {
        let selectedSuggestion = $(this).text();
        $("#car-model-input").val(selectedSuggestion);
        $(".suggestions-panel").hide();
    });

    $("#search-button").on('click', function() {
        let searchTerm = $("#car-model-input").val();
    });
});

