const drinkApp={};
drinkApp.apiCall = function (queryString){
    $.ajax({
        url: 'https://api.edamam.com/search',
        method: 'GET',
        dataType: 'json',
        data: {
            app_id: '64e44f2c',
            app_key: 'a227b3ca7e2072598902a784d880a927',
            q: queryString,
            dishtype: 'drinks'

        }
    }).then(function (result) {
        drinkApp.showResult(result);
    });
}

drinkApp.randomizer =function(resultLength){
    const selectedDrinkIndex = Math.floor(Math.random() * resultLength);
    return selectedDrinkIndex;
}

drinkApp.showResult =function(result){
    const selectedDrinkIndex = drinkApp.randomizer(result.hits.length);
    $('.moodDiv').toggleClass('hidden');
    $('.resultDiv').toggleClass('hidden');
    $('#drinkTitle').text(result.hits[selectedDrinkIndex].recipe.label);
    $('#drinkImage').attr('src', result.hits[selectedDrinkIndex].recipe.image);
    $('#drinkImage').attr('alt', result.hits[selectedDrinkIndex].recipe.label);
}

drinkApp.eventListener=function(){
    $('.moodButton').on('click', function(){
        if($(this).attr('id')==='sleepy'){
            drinkApp.apiCall('coffee');
        } else if ($(this).attr('id') === 'boost') {
            drinkApp.apiCall('smoothie'); 
        } else {
            drinkApp.apiCall('alcohol');
        }
    });
}

drinkApp.init=function (){
drinkApp.eventListener();
    
}
$(function(){
    drinkApp.init();
})