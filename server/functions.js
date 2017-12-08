$(document).ready(test);

function test(){
    console.log('reading this');
    click()
}


function click(response){
    $("#login").click(function(){
        console.log("Click clicked")
        console.log(response)
    });

    $.ajax({

    })
}

