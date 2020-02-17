const drinkApp={};
drinkApp.drinks;
drinkApp.apiCall = function (queryString){
    $.ajax({
        url: 'https://api.spoonacular.com/recipes/search',
        method: 'GET',
        dataType: 'json',
        data: {
            app_id: '64e44f2c',
            app_key: 'a227b3ca7e2072598902a784d880a927',
            from:0,
            to:100,
            q: queryString,
            dishtype:type
           
        }
    }).then(function (result) {
        drinkApp.drinks=result;
        console.log(drinkApp.drinks);
        drinkApp.showResult();
       
    });
}

drinkApp.randomizer =function(resultLength){
    const selectedDrinkIndex = Math.floor(Math.random() * resultLength);
    return selectedDrinkIndex;
}
drinkApp.removeDrink=function ( index){
    
    // console.log(index);
    drinkApp.drinks.hits.splice(index,1);
   
}
drinkApp.anotherOptionEventListener=function(hits){
    $('#anotherDrinkButton').on ('click',function(){
        drinkApp.showResult()
    });

}


drinkApp.showResult =function(){
    const selectedDrinkIndex = drinkApp.randomizer(drinkApp.drinks.hits.length);
    $('.moodDiv').addClass('hidden');
    $('.resultDiv').removeClass('hidden');
    $('#drinkTitle').text(drinkApp.drinks.hits[selectedDrinkIndex].recipe.label);
    $('#drinkImage').attr('src', drinkApp.drinks.hits[selectedDrinkIndex].recipe.image);
    $('#drinkImage').attr('alt', drinkApp.drinks.hits[selectedDrinkIndex].recipe.label);
    $('.ingredients').empty();
    drinkApp.drinks.hits[selectedDrinkIndex].recipe.ingredients.forEach(function(item){
        const listItem =`<li>${item.text}</li>`;
        $('.ingredients').append(listItem);
    });

    $('#drinkLink').attr('href', drinkApp.drinks.hits[selectedDrinkIndex].recipe.url);
   drinkApp.removeDrink( selectedDrinkIndex);
    

}

drinkApp.eventListener=function(){
    $('#submitButton').on('click', function(e){
        e.preventDefault();
       const mood =$('input[type=radio]:checked').val();
            drinkApp.apiCall(mood);
        
    });
}

drinkApp.init=function (){
drinkApp.eventListener();
drinkApp.anotherOptionEventListener();
    
}
$(function(){
    drinkApp.init();
})