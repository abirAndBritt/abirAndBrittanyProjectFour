const drinkApp = {};
drinkApp.drinks;
drinkApp.mood;
drinkApp.apiCall = function (queryString,oneIngredient ,calories, sugar, gluten, dairy) {
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
            includeIngredients: oneIngredient,
            maxCalories: calories,
            maxSugar: sugar,
            intolerances: gluten, dairy,
        }

    }).then(function (result) {
        drinkApp.drinks = result.results;
        if (drinkApp.drinks.length !== 0) {
            $('form').addClass('hidden');
            $('.resultDiv').removeClass('hidden');
            drinkApp.showResult();
        }
        else {
            alert('There is no matching drink!! Please try again!!');
        }
        
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

drinkApp.autocompleteIngredients = function (text, newArray) {
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
     result.forEach(function(item){
         newArray.push(item.name);
     });
    //  console.log(newArray);
    });
}

// drinkApp.autoComplete=function () {
  
//     $('#oneIngredient').autocomplete({
//         source: availableTutorials
// });
// }



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
        let gluten = dairy = oneIngredient= '';
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
        drinkApp.apiCall(drinkApp.mood, oneIngredient ,calories, sugar, gluten, dairy); 
        
       
    });
}
// drinkApp.counter=0;
//  drinkApp.suggestionArray=[];
drinkApp.autoCompleteText='';
drinkApp.oneIngredientChange = function(){
$('#oneIngredient').keypress( function(e){

    let suggestionArray =[];
    // if ($('#oneIngredient').val()!=='')
    // {
        // console.log('hi');
    const typedChar = String.fromCharCode(e.which);
    if ($('#oneIngredient').val() === ''){
        drinkApp.autoCompleteText='';
    }
    drinkApp.autoCompleteText+=typedChar;
    console.log(drinkApp.autoCompleteText);

    drinkApp.autocompleteIngredients(drinkApp.autoCompleteText, suggestionArray);
        $('#oneIngredient').autocomplete({
            source: suggestionArray
        });

    // }

})
};
drinkApp.restartEventListener = function (){
    $('#restartSearchButton').on('click', function(){
        // $('input[type=checkbox]').prop=false;
        $("form").trigger("reset");
        $('.resultDiv').addClass('hidden');
        $('.moodDiv').removeClass('hidden');

    })
}

drinkApp.init = function () {
    drinkApp.moodEventListener();
    drinkApp.submitEventListener();
    drinkApp.anotherOptionEventListener();
    drinkApp.oneIngredientChange();
    drinkApp.restartEventListener();
    
    // drinkApp.autocompleteIngredients($('#oneIngredient').val(),suggestionArray);
    // console.log(suggestionArray);
    
    // drinkApp.oneIngredientChangeListener();
    // drinkApp.autocompleteIngredients('a');
    // drinkApp.autoComplete();
}

$(function () {
    drinkApp.init();
    
   
})