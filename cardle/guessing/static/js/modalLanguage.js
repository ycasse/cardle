document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('changeLanguageBtn').addEventListener('click', function () {
        document.getElementById('languageModal').style.display = 'block';
    });

    document.getElementById('closeLanguageModal').addEventListener('click', function () {
        document.getElementById('languageModal').style.display = 'none';
    });

    document.getElementById('changeLanguageSubmit').addEventListener('click', function () {
        var selectedLanguage = document.getElementById('languageSelect').value;
        var url = document.getElementById('languageForm').getAttribute('data-url') + '?language=' + selectedLanguage;
        window.location.href = url; // Redirect to the constructed URL
    });
});
