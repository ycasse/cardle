function compareCarAttribute(selectedAttribute, searchedAttribute, attributeName) {
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
        const textLength = searchedAttribute.length;
        if (textLength > 20) {
            result = result.replace('class="', 'class="square-info-large-font ');
        }

        return result;
    } else {
        return `<div class="square-info-red ${attributeName}" data-car-detail="${attributeName}">N/A</div>`;
    }
}