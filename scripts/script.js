const drinkApp = {};
drinkApp.drinks;
drinkApp.mood;
drinkApp.apiCall = function (queryString, calories, sugar, gluten, dairy) {
    $.ajax({
        url: 'https://api.spoonacular.com/recipes/complexSearch',
        method: 'GET',
        dataType: 'json',
        data: {
            // apiKey: 'b5a81aab75e347daa78075a3628b5389',
            apiKey: 'a60cdfa9200e4a088a41ebe8d60680fe',
            type: 'drink',
            addRecipeInformation: 'true',
            titleMatch: queryString,
            number: 100,
            instructionsRequired: 'true',
            maxCalories: calories,
            maxSugar: sugar,
            intolerances: gluten, dairy,
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
            apiKey: 'a60cdfa9200e4a088a41ebe8d60680fe',
        }

    }).then(function (result) {
        $('.ingredients').empty();
        console.log(result);
        result.extendedIngredients.forEach(function (item) {
            const listItem = `<li>${item.original} </li>`;
            $('.ingredients').append(listItem);
        }); 
        $('.instructions').empty();
        result.analyzedInstructions[0].steps.forEach(function (item) {
            const listItem = `<li>${item.step} </li>`;
            $('.instructions').append(listItem);
        });
    });
}

drinkApp.oneIngredientChangeListener = function(){
    $('#oneIngredient').autocomplete({source:
        console.log($('#oneIngredient').val());
        drinkApp.autocompleteIngredients($('#oneIngredient').val());
    })
}
drinkApp.autocompleteIngredients = function (text) {
    $.ajax({
        url: `https://api.spoonacular.com/food/ingredients/autocomplete`,
        method: 'GET',
        dataType: 'json',
        data: {
            apiKey: 'a60cdfa9200e4a088a41ebe8d60680fe',
            query: text,
            number: 10,
        }

    }).then(function (result) {
        console.log(result);
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
    console.log(drinkApp.drinks[selectedDrinkIndex]);
    $('#drinkTitle').text(drinkApp.drinks[selectedDrinkIndex].title);
    $('#drinkImage').attr('src', drinkApp.drinks[selectedDrinkIndex].image);
    $('#drinkImage').attr('alt', drinkApp.drinks[selectedDrinkIndex].title);
    drinkApp.getIngredients(drinkApp.drinks[selectedDrinkIndex].id);
    $('#drinkLink').attr('href', drinkApp.drinks[selectedDrinkIndex].sourceUrl);
    drinkApp.removeDrink(selectedDrinkIndex);
}

drinkApp.moodEventListener = function() {
    $('.mood').on('click', function(){
        $('form').removeClass('hidden');
        $('.moodDiv').addClass('hidden');
        drinkApp.mood = $(this).attr('id');
    })
}

drinkApp.submitEventListener = function () {
    $('#submitButton').on('click', function (e) {
        e.preventDefault();
        $('form').addClass('hidden');
        $('.resultDiv').removeClass('hidden');
        let gluten = dairy = '';
        let calories = sugar = 1000;
        if ($('#calories').val() !== '') {
            calories = $('#calories').val();
        }
        if ($('#sugar').prop('checked') === true) {
            //sugar = $('#sugar').attr('id');
            sugar = 0;
        }
        if ($('#gluten').prop('checked') === true) {
            gluten = $('#gluten').attr('id');
        }
        if ($('#dairy').prop('checked') === true) {
            dairy = $('#dairy').attr('id');
        }
        drinkApp.apiCall(drinkApp.mood, calories, sugar, gluten, dairy); 
    });
}

drinkApp.init = function () {
    drinkApp.moodEventListener();
    drinkApp.submitEventListener();
    drinkApp.anotherOptionEventListener();
    drinkApp.oneIngredientChangeListener();
}

$(function () {
    drinkApp.init();
})