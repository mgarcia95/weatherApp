export default function createElmts (list,zipCode,zipName,type) {

    let locationTitle,noLocation;

    if (type == 0){ //Session type
        locationTitle = document.querySelector('.js-locationlist .locationlist__item--header'); //Session's header
        noLocation = document.getElementById('noLocation');
    }else{ //Favorite type
        locationTitle = document.querySelector('.js-favlist .locationlist__item--header'); //Favorite's header
        noLocation = document.getElementById('noLocation1');
    }   
    
    locationTitle.classList.remove("d-none"); //Display header
    noLocation.classList.add("d-none"); //Remove feedback message
    
    let addLocation = document.createElement("li"); //<li class="locationlist__item js-location-item" data-code="Postcode">
    addLocation.classList.add('locationlist__item','js-location-item');
    addLocation.setAttribute('data-code',zipCode);
    list.appendChild(addLocation);
    
    let addCode = document.createElement("span"); //<span class="locationlist__item-code">Postcode</span>
    addCode.classList.add('locationlist__item-code');
    addCode.innerHTML = zipCode;
    addLocation.appendChild(addCode);
            
    let addName = document.createElement("span"); //<span class="locationlist__item-name">
    addName.classList.add('locationlist__item-name');
    addLocation.appendChild(addName);
        
    let addLink = document.createElement("a"); //<a href="#" class="link">Location Name</a>
    addLink.classList.add('link');
    addLink.innerHTML = zipName;
    addLink.setAttribute('href','#');
    addName.appendChild(addLink);
    
    let addAction = document.createElement("span"); //<span class="locationlist__item-actions">
    addAction.classList.add('locationlist__item-actions');
    addLocation.appendChild(addAction);
    
    let addLink1 = document.createElement("a"); //<a class="link js-item-fav" href="#" data-code="Postcode">
    addLink1.classList.add('link','js-item-fav');
    addLink1.setAttribute('href','#');
    addLink1.setAttribute('data-code',zipCode);
    addAction.appendChild(addLink1);
            
    let addIcon = document.createElement("span"); //<span class="icon link__icon">
    addIcon.classList.add('icon','link__icon');
    addLink1.appendChild(addIcon);
    
    let addImg = document.createElement("img"); //<img src="link" alt="">
    addIcon.appendChild(addImg);
    if (type == 0){
        addImg.setAttribute('src', 'img/ico-fav-outline.svg');
        addImg.setAttribute('alt','Add to favs');
    }else{
        addImg.setAttribute('src', 'img/ico-trash-outline.svg');
        addImg.setAttribute('alt','Remove from favs');
        
        return [zipCode,zipName];
    }
}

export function removeElmts () {
        
    document.querySelectorAll('.js-favlist .js-item-fav').forEach(item => { //For all the delete buttons
        item.addEventListener('click', event => {
            event.preventDefault();
            let zipCode = item.getAttribute('data-code');
            document.querySelector('.js-favlist [data-code="'+zipCode+'"]').remove(); //Remove element

            let removeFav = getCookie("favorites"); //Get favorites cookies
            let listFavs = removeFav.split(',');
            let listFavs2 = [];
            let counter = 0;

            for(let i=0; i < listFavs.length; i++){ //Loop to delete location from fav cookies
              if(listFavs[i]==zipCode){ //Skip deleted fav from new array
                i++; 
              }else{
                listFavs2[counter]=listFavs[i]; 
                counter++;
              }
            }

            document.cookie="favorites=" + listFavs2; //Save new cookies

            if(document.querySelectorAll('.js-favlist .js-location-item').length == 1 ){ //Look up for any fav location to display feedback message
                document.querySelector('.js-favlist .locationlist__item--header').classList.add("d-none");
                document.getElementById('noLocation1').classList.remove("d-none");
            }
        })
    })
}

export function getCookie(cname) { //Retrieve cookies
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  export function weatherIcon(sky) { //Show weather icon
    switch(sky){
      case "clear sky":
        return "http://openweathermap.org/img/wn/01d@2x.png";

      case "few clouds":
        return "http://openweathermap.org/img/wn/02d@2x.png";
        
      case "scattered clouds":
        return "http://openweathermap.org/img/wn/03d@2x.png";
        
      case "broken clouds":
        return "http://openweathermap.org/img/wn/04d@2x.png";

      case "overcast clouds":
        return "http://openweathermap.org/img/wn/04d@2x.png"; 
        
      case "shower rain":
        return "http://openweathermap.org/img/wn/09d@2x.png";
        
      case "rain":
        return "http://openweathermap.org/img/wn/10d@2x.png";
        
      case "thunderstorm":
        return "http://openweathermap.org/img/wn/11d@2x.png";
                
      case "snow":
        return "http://openweathermap.org/img/wn/13d@2x.png";
                
      case "mist":
        return "http://openweathermap.org/img/wn/50d@2x.png";
    }
  }