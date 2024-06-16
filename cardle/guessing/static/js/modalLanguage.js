document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('changeLanguageBtn').addEventListener('click', function () {
        document.getElementById('languagePopup').style.display = 'block';
    });

    document.getElementById('closeLanguagePopup').addEventListener('click', function () {
        document.getElementById('languagePopup').style.display = 'none';
    });

    document.getElementById('changeLanguageSubmit').addEventListener('click', function () {
        window.location.reload();
    });
});
