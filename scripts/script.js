//namespace
const drinkApp = {};
// a global variable to hold the drinks array
drinkApp.drinks;
// a global variable to hold the selected mood
drinkApp.mood;
// a global variable to hold the text that will be autocompleted in ingredient field of form
drinkApp.autoCompleteText = '';
// a function to make the call to api based on the search criteria
drinkApp.getDrinks = function (queryString, oneIngredient, calories, sugar, gluten, dairy) {
    $.ajax({
        url: 'https://api.spoonacular.com/recipes/complexSearch',
        method: 'GET',
        dataType: 'json',
        data: {
            // apiKey: 'b5a81aab75e347daa78075a3628b5389',
            apiKey: 'a60cdfa9200e4a088a41ebe8d60680fe',
            // apiKey: '8a2c682e514a439d902fe345650979ed',
            type: 'drink',
            addRecipeInformation: 'true',
            titleMatch: queryString,
            number: 100,
            instructionsRequired: 'true',
            includeIngredients: oneIngredient,
            maxCalories: calories,
            maxSugar: sugar,
            intolerances: gluten, dairy,
        }

    }).then(function (result) {
        $('.preloader').fadeOut('fast'); //to hide the preloader gif
        drinkApp.drinks = result.results;
        if (drinkApp.drinks.length !== 0) {
            $('.resultDiv').addClass('slide-in-bottom');
            $('.resultDiv').removeClass('hidden');
            drinkApp.showResult();
        }
        else {
            alert('There is no matching drink!! Please try again!!');
            $('form').removeClass('hidden');
        }

    });
}

// a function to get the drink ingredients and the instructions
drinkApp.getIngredientsAndInstructions = function (id) {
    $.ajax({
        url: `https://api.spoonacular.com/recipes/${id}/information`,
        method: 'GET',
        dataType: 'json',
        data: {
            apiKey: 'a60cdfa9200e4a088a41ebe8d60680fe',
            // apiKey: '8a2c682e514a439d902fe345650979ed',
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

// a function to autocomplete the ingredients in the search by ingredient box
drinkApp.autocompleteIngredients = function (text, newArray) {
    $.ajax({
        url: `https://api.spoonacular.com/food/ingredients/autocomplete`,
        method: 'GET',
        dataType: 'json',
        data: {
            //apiKey: 'a60cdfa9200e4a088a41ebe8d60680fe',
            apiKey: '8a2c682e514a439d902fe345650979ed',
            query: text,
            number: 10,
        }
    }).then(function (result) {
        result.forEach(function (item) {
            newArray.push(item.name);
        });
    });
}

// a function to generate a random number based on the array length
drinkApp.randomizer = function (resultLength) {
    const selectedDrinkIndex = Math.floor(Math.random() * resultLength);
    return selectedDrinkIndex;
}

// a function to remove the suggested drink from the array
drinkApp.removeDrink = function (index) {
    drinkApp.drinks.splice(index, 1);
}

// an event listener to show another drink button 
drinkApp.anotherOptionEventListener = function () {
    $('#anotherDrinkButton').on('click', function () {
        drinkApp.showResult()
    });
}

// a function to show the drink information
drinkApp.showResult = function () {
    console.log('hi');
    if (drinkApp.drinks.length > 0) {
        const selectedDrinkIndex = drinkApp.randomizer(drinkApp.drinks.length);
        console.log(drinkApp.drinks[selectedDrinkIndex]);
        $('#drinkTitle').text(drinkApp.drinks[selectedDrinkIndex].title);
        $('#drinkImage').attr('src', drinkApp.drinks[selectedDrinkIndex].image);
        $('#drinkImage').attr('alt', drinkApp.drinks[selectedDrinkIndex].title);
        drinkApp.getIngredientsAndInstructions(drinkApp.drinks[selectedDrinkIndex].id);
        $('#drinkLink').attr('href', drinkApp.drinks[selectedDrinkIndex].sourceUrl);
        drinkApp.removeDrink(selectedDrinkIndex);
    }
    else {
        alert('There are no more suggestions!!');
    }
}

// an event listener for the mood button
drinkApp.moodEventListener = function () {
    $('.mood').on('click', function () {

        
        $('#moodDiv').addClass('slideOutLeft');
        const t=setTimeout(() => {
            $('#moodDiv').addClass('hidden');
            $('form').removeClass('hidden');
            $('form').addClass('slideInRight');
            
        }, 800);
        // $('#moodDiv').removeClass('moodDiv');
        drinkApp.mood = $(this).attr('id');
    })
}

// an event listener to the submit button (which is used to search for a drink)
drinkApp.submitEventListener = function () {
    $('#submitButton').on('click', function (e) {
        e.preventDefault();
        $('form').addClass('slideInRight');
        const t = setTimeout(() => {
            $('form').addClass('hidden');
            $('.preloader').fadeIn('slow');

            let gluten = dairy = oneIngredient = '';
            let calories = sugar = 1000;
            if ($('#oneIngredient').val() !== '') {
                oneIngredient = $('#oneIngredient').val();
            }
            if ($('#calories').val() !== '') {
                calories = $('#calories').val();
            }
            if ($('#sugar').prop('checked') === true) {
                sugar = 0;
            }
            if ($('#gluten').prop('checked') === true) {
                gluten = $('#gluten').attr('id');
            }
            if ($('#dairy').prop('checked') === true) {
                dairy = $('#dairy').attr('id');
            }
            drinkApp.getDrinks(drinkApp.mood, oneIngredient, calories, sugar, gluten, dairy);
        }, 2000);
    });
}

// an event listener for a keypress in the search by ingredient to apply autocomplete on it
drinkApp.oneIngredientChange = function () {
    $('#oneIngredient').keypress(function (e) {
        let suggestionArray = [];
        const typedChar = String.fromCharCode(e.which);
        if ($('#oneIngredient').val() === '') {
            drinkApp.autoCompleteText = '';
        }
        drinkApp.autoCompleteText += typedChar;
        console.log(drinkApp.autoCompleteText);

        drinkApp.autocompleteIngredients(drinkApp.autoCompleteText, suggestionArray);
        $('#oneIngredient').autocomplete({
            source: suggestionArray
        });
    })
};

// an event listener to restart the search button
drinkApp.restartEventListener = function () {
    $('#restartSearchButton').on('click', function () {
        $("form").trigger("reset");
        $('.resultDiv').addClass('hidden');
        $('#moodDiv').removeClass('hidden');
        $('#moodDiv').addClass('moodDiv');
    })
}

// init method
drinkApp.init = function () {
    drinkApp.moodEventListener();
    drinkApp.submitEventListener();
    drinkApp.anotherOptionEventListener();
    drinkApp.oneIngredientChange();
    drinkApp.restartEventListener();
}

//document.ready method
$(function () {
    drinkApp.init();
})