import createElmts,{removeElmts,getCookie, weatherIcon} from './functions.js';

export default class location {

    addBtn; //"Add to session" button
    locationLi; //ul element
    dcode; //Postcode
    dName; //Location name
    repeatedCode; //Repeated locations

    constructor(){
        this.addBtn = document.querySelector('.js-add-btn');
        this.addLocation(); 
        this.showWeather();
    }

    addLocation () { //Add to session
        this.addBtn.addEventListener("click", () => {

            this.locationLi = document.querySelector('.js-locationlist'); //Session ul
            this.dcode= document.querySelector(".js-location-zip").innerHTML;
            this.dName= document.querySelector('.js-location-name').innerHTML;
            this.repeatedCode = document.querySelectorAll('.js-locationlist [data-code="'+this.dcode+'"]');

            if(this.repeatedCode.length == 0){ //Avoid repeated locations
                createElmts(this.locationLi,this.dcode,this.dName,0);
                this.addFav();
                this.showWeather();
            }
        })
    }

    addFav() {
        document.querySelectorAll('.js-locationlist .js-item-fav').forEach(item => { //When clicking any "Add to Fav" button
            item.addEventListener('click', event => {
                event.preventDefault();
                if(item.getAttribute('data-code')!=null){ 
                    this.dcode = item.getAttribute('data-code'); //Get postcode attribute
                    this.dName = document.querySelector('li[data-code="'+this.dcode+'"] a.link').innerHTML;
                    this.locationLi = document.querySelector('.js-favlist'); //Favorites' ul
                    this.repeatedCode = document.querySelectorAll('.js-favlist [data-code="'+this.dcode+'"]');

                    if(this.repeatedCode.length == 0){ //Avoid repeated fav locations
                        let newFav = createElmts(this.locationLi,this.dcode,this.dName,1); 
                        let favSessions = newFav + "," + getCookie("favorites"); //Update fav cookies
                        document.cookie="favorites=" + favSessions;
                        removeElmts();
                        this.showWeather();
                    }
                }
            })
          })
          
    }

    showWeather(){
        document.querySelectorAll('.locationlist__item-name a').forEach(item => { //When clicking any location link
            item.addEventListener('click', event => {
                event.preventDefault();
                document.querySelector('.locationdetail').classList.add("locationdetail--show"); //Show overlay detail page
                
                this.dcode = (item.parentElement.parentElement).getAttribute('data-code'); //Get postcode attribute from parent element
                this.dName = item.innerHTML; 
                this.locationLi = document.querySelector('.js-favlist');
                this.repeatedCode = document.querySelectorAll('.js-favlist [data-code="'+this.dcode+'"]'); 
                let favStatus = document.querySelector('.js-locationdetail-fav-label'); //Add-Remove fav link
                let favIcon = document.querySelector('.js-locationdetail-fav-icon'); //Add-Remove fav icon
                
                document.querySelector('.js-locationdetail-code').innerHTML= this.dcode;
                document.querySelector('.js-locationdetail-name').innerHTML= this.dName; 
                
                fetch('http://api.openweathermap.org/geo/1.0/zip?zip='+this.dcode+',ES&appid=04b3be25b62982195ff856b58b2a6021') //API call to get lat and lon
                .then(function (response){
                    return response.json();
                }).then(function (data) {
                    fetch('https://api.openweathermap.org/data/2.5/weather?lat='+data.lat+'&lon='+data.lon+'&appid=04b3be25b62982195ff856b58b2a6021') //API call to get the rest of information
                    .then(function (response){
                        return response.json();
                    }).then(function (data) {
                        
                        document.querySelector('.js-locationdetail-icon').setAttribute('src',weatherIcon(data.weather[0].description)); //Weather Icon
                        document.querySelector('.js-locationdetail-icon').setAttribute('alt',data.weather[0].description); //Weather Icon
                        document.querySelector('.js-locationdetail-list div:nth-child(1) p').innerHTML=data.weather[0].description; //Weather description
                        document.querySelector('.js-locationdetail-list div:nth-child(2) p').innerHTML=Math.floor(Number(data.main.temp)-273.15)+"º"; //Temperature
                        document.querySelector('.js-locationdetail-list div:nth-child(3) p').innerHTML=Math.floor(Number(data.main.feels_like)-273.15)+"º"; //Feels like Temp
                        document.querySelector('.js-locationdetail-list div:nth-child(4) p').innerHTML=Math.floor(Number(data.main.temp_min)-273.15)+"º"; //Min Temp
                        document.querySelector('.js-locationdetail-list div:nth-child(5) p').innerHTML=Math.floor(Number(data.main.temp_max)-273.15)+"º"; //Max Temp
                        document.querySelector('.js-locationdetail-list div:nth-child(6) p').innerHTML=data.main.pressure; //Pressure
                        document.querySelector('.js-locationdetail-list div:nth-child(7) p').innerHTML=data.main.humidity; //Humidity
                        document.querySelector('.js-locationdetail-list div:nth-child(8) p').innerHTML=data.visibility; //Visibility
                        document.querySelector('.js-locationdetail-list div:nth-child(9) p').innerHTML=new Date(data.sys.sunrise * 1000).toISOString().slice(11, 19); //Sunrise time
                        document.querySelector('.js-locationdetail-list div:nth-child(10) p').innerHTML=new Date(data.sys.sunset * 1000).toISOString().slice(11, 19); //Sunset time
                    })
                })

                if(this.repeatedCode.length == 0){ //If location is not repeated
                    favStatus.innerHTML = "Add to favs";
                    favIcon.setAttribute('src','img/ico-fav-outline.svg'); 
                }else{
                    favStatus.innerHTML = "Remove from favs";
                    favIcon.setAttribute('src','img/ico-trash-outline.svg'); 
                }

                document.querySelector('.locationdetail__addfav').addEventListener('click', event => { //When clicking add-remove fav link
                    event.preventDefault(); 
                    this.repeatedCode = document.querySelectorAll('.js-favlist [data-code="'+this.dcode+'"]'); 
                    if(this.repeatedCode.length == 0){ //Add to fav
                        let newFav = createElmts(this.locationLi,this.dcode,this.dName,1);
                        let favSessions = newFav + "," + getCookie("favorites");
                        document.cookie="favorites=" + favSessions;
                        console.log("Add");
                        favStatus.innerHTML = "Remove from favs"; //Switch link
                        favIcon.setAttribute('src','img/ico-trash-outline.svg'); 
                    }else{ //Remove from favs
                        document.querySelector('.js-favlist [data-code="'+this.dcode+'"]').remove();
                        console.log("Remove");
                        let removeFav = getCookie("favorites"); //Update cookies
                        let listFavs = removeFav.split(',');
                        let listFavs2 = [];
                        let counter = 0;

                        for(let i=0; i < listFavs.length; i++){
                            if(listFavs[i]==this.dcode){
                                i++; 
                            }else{
                                listFavs2[counter]=listFavs[i];
                                counter++;
                            }
                        }

                        document.cookie="favorites=" + listFavs2;
                        
                        favStatus.innerHTML = "Add to favs"; //Switch link
                        favIcon.setAttribute('src','img/ico-fav-outline.svg'); 

                        if(document.querySelectorAll('.js-favlist .js-location-item').length == 1 ){ //Check fav list is empty
                            document.querySelector('.js-favlist .locationlist__item--header').classList.add("d-none"); //Display feedback message
                            document.getElementById('noLocation1').classList.remove("d-none");
                        }
                    }
                })
            })
        })

        document.getElementById("closeTab").addEventListener("click", event => { //Close tab
            event.preventDefault();
            document.querySelector('.locationdetail').classList.remove("locationdetail--show");
            this.showWeather();
            removeElmts();
        });
    }
}