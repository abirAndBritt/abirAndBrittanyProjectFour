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
        console.log(result);

    });
}
drinkApp.eventListener=function(){
    $('.mood').on('click', function(){
        if($(this).attr('id')==='sleepy'){
            drinkApp.apiCall('coffee')
        }

    });
}

drinkApp.init=function (){
drinkApp.eventListener();
    
}
$(function(){
    drinkApp.init();
})