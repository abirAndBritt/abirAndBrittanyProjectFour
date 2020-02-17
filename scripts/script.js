const drinkApp = {};
drinkApp.drinks;
drinkApp.apiCall = function (queryString) {
    $.ajax({
        url: 'https://api.spoonacular.com/recipes/complexSearch',
        method: 'GET',
        dataType: 'json',
        data: {
            apiKey: 'b5a81aab75e347daa78075a3628b5389',
            type: 'drink',
            addRecipeInformation: 'true',
            titleMatch: queryString,
            number: 100,
        }

    }).then(function (result) {
        drinkApp.drinks = result.results;
        drinkApp.showResult();

    });
}

drinkApp.getIngredients = function (id) {
    $.ajax({
        url: `https://api.spoonacular.com/recipes/${id}/information`,
        method: 'GET',
        dataType: 'json',
        data: {
            apiKey: 'b5a81aab75e347daa78075a3628b5389',
        }

    }).then(function (result) {
        $('.ingredients').empty();
        result.extendedIngredients.forEach(function (item) {
            const listItem = `<li>${item.original} </li>`;
            $('.ingredients').append(listItem);
        });

    });
}

drinkApp.randomizer = function (resultLength) {
    const selectedDrinkIndex = Math.floor(Math.random() * resultLength);
    return selectedDrinkIndex;
}
drinkApp.removeDrink = function (index) {
    drinkApp.drinks.splice(index, 1);

}
drinkApp.anotherOptionEventListener = function () {
    $('#anotherDrinkButton').on('click', function () {
        drinkApp.showResult()
    });

}


drinkApp.showResult = function () {
    const selectedDrinkIndex = drinkApp.randomizer(drinkApp.drinks.length);
    $('.moodDiv').addClass('hidden');
    $('.resultDiv').removeClass('hidden');
    $('#drinkTitle').text(drinkApp.drinks[selectedDrinkIndex].title);
    $('#drinkImage').attr('src', drinkApp.drinks[selectedDrinkIndex].image);
    $('#drinkImage').attr('alt', drinkApp.drinks[selectedDrinkIndex].title);
    drinkApp.getIngredients(drinkApp.drinks[selectedDrinkIndex].id);
    $('#drinkLink').attr('href', drinkApp.drinks[selectedDrinkIndex].sourceUrl);
    drinkApp.removeDrink(selectedDrinkIndex);


}

drinkApp.submitEventListener = function () {
    $('#submitButton').on('click', function (e) {
        e.preventDefault();
        const mood = $('input[type=radio]:checked').val();
        drinkApp.apiCall(mood);

    });
}

drinkApp.init = function () {
    drinkApp.submitEventListener();
    drinkApp.anotherOptionEventListener();

}
$(function () {
    drinkApp.init();
})