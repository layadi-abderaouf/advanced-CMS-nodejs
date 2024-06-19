 
    function notify() {
    var x=document.getElementById("Id-Notify");
     var y =document.getElementById("Id-user-change"); 
    if(x.style.display == "none"){
        x.style.display ="block";
        x.style.visibility ="visible";
        y.style.display ="none";
        y.style.visibility ="hidden";
    }
    else{
        x.style.display = "none";
        x.style.visibility ="hidden";

    }

}
function OnUserchange(){
    var x=document.getElementById("Id-Notify");
     var y =document.getElementById("Id-user-change"); 
    if(y.style.display == "none"){
        y.style.display ="block";
        y.style.visibility ="visible";
        x.style.display ="none";
        x.style.visibility ="hidden";
    }
    else{
        y.style.display = "none";
        y.style.visibility ="hidden";

    }

}

async function getdat() {
    var input =document.getElementById("add").value;
    const url="http://localhost:3000/api/get_json"
    const reponse=await fetch(url);
    const data= await reponse.json();
    console.log(input);
    for(let i=0;i<data.length;i++){
        if(data[i].code == input ){
            window.location.replace("http://localhost:3000/home?add="+ input);
        }
        console.log(data[i].code);

    }
        
    
}