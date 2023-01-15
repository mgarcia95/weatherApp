import location from './location.js';
import createElmts,{removeElmts,getCookie} from './functions.js';

export default class searchBox {

    btn; //Search button
    input; //Input data
    feedback; //Feedback message element

    constructor(){
        this.btn = document.querySelector('.js-search-btn');
        this.input = document.querySelector('.js-search-input');
        this.feedback = document.querySelector('.js-search-feedback');
        this.init();
    }

    init(){
        this.btn.addEventListener("click", (e) => {
            this.searchLocation(this.input.value);
        });
        if(getCookie("favorites") !== ''){ //Previous fav locations saved in cookies
            this.showFavs(); 
        };
        const ListElt = new location(); //Initiate a new location object
    }

    searchLocation(postCode) {


        if(postCode.length < 5 || !/^[0-9]+$/.test(postCode)){ //If postcode is shorter than 5 dig OR they are not numbers
            this.feedback.classList.remove("d-none"); //Display feedback message
        }else{
            fetch('http://api.openweathermap.org/geo/1.0/zip?zip='+ postCode + ',ES&appid=04b3be25b62982195ff856b58b2a6021') //API call with postcode
            .then(function (response){
                return response.json();
            }).then(function (data) {
                document.querySelector('.js-list-info').innerHTML = "Location at ZIPCODE \"" + data.zip + "\"";
                document.querySelector('.js-location-zip').innerHTML = data.zip; //Postcode
                document.querySelector('.js-location-name').innerHTML = data.name; //Location name
                document.querySelector('.js-location-lat').innerHTML = data.lat; //Latitude
                document.querySelector('.js-location-lon').innerHTML = data.lon; //Longitude
            })
            this.feedback.classList.add("d-none");
        }
    }

    showFavs(){
        let favorites = getCookie("favorites"); //Get existing cookies
        let listFavs = favorites.split(','); //Create an array
        for(let i = 0; i < listFavs.length; i=i+2){
            if(listFavs[i] != ""){ 
                createElmts(document.querySelector('.js-favlist'),listFavs[i],listFavs[i+1],1); //fav[i],fav[i+1] --> [Location,Postcode]
            }
        }
        removeElmts();
        
    }

}