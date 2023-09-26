//constantes, buscando datos del html. Mayormente datos para la api de paises
const countries= document.querySelector('.countries')
const input= document.querySelector('.search')
let countriesInfo = "";
let weatherCountry = "";
let find= "";
const showCountry = document.querySelector(".country")

let container = '';
showCountry.innerHTML = `
<div class="lds-circle"><div></div></div>
`;



//Api paises
const urlCountries = 'https://restcountries.com/v3.1/all'

//Datos para la api del clima


// Llamando a la api, convirtiendo sus componentes en objetos, mostrando sus datos y notificando errores
const apiCountries = () => {
fetch(urlCountries) //Consiguiendo todos los datos de la Api
.then (response => response.json()) //Me devuelve los datos en un objeto
.then (data => showData(data))//Muestra los datos de la Api
}

// Guardar los datos de la api
const showData= (data) => {
    showCountry.innerHTML ="";
 countriesInfo = data;
}



//Para que funcione la api
apiCountries();
countries.addEventListener('input', e => {
        //Funcion que tome lo escrito en el input
        filtrar(countries.value)
    
});

// Funcion para mostrar mensajes y filtrar los paises
const filtrar = (country) => {
    find= countriesInfo.filter(find => find.name.common.toLowerCase().startsWith(country.toLowerCase()));
    showCountry.innerHTML = `<div class= "show-country">`;
    const message = input.children[2]
    const advice = input.children[1]
    if ( find.length <= 249 && find.length >=10 ) {
        message.classList.remove("information-2")
        message.classList.add("show-country");
        advice.classList.add("information-1")
        advice.classList.remove("show-country");
    } else if (find.length === 0){
        advice.classList.remove("information-1");
        advice.classList.add("show-country");
        message.classList.add("information-2")
        message.classList.remove("show-country");
    } else if (!countries.value){
        advice.classList.add("information-1");
        advice.classList.remove("show-country");
        message.classList.add("information-2")
        message.classList.remove("show-country");
        showCountry.style.display = "none"
        //Si el input coincide con menos de 10 paises pero mas que 1, ocurre este suceso
    } else {
        message.classList.remove("show-country");
        advice.classList.remove("show-country");
        message.classList.add("information-2")
        advice.classList.add("information-1")
        showCountry.innerHTML = "";
        showCountry.style.display = "block"
        find.forEach(a => {
            showCountry.style.display = "flex"
            showCountry.innerHTML += `<div class= "card"><img class="imgflag" src="${a.flags.png}" alt=""><p class="text">${a.name.common}</p></div>`;
        });
        countryComplete(find);
        // Cliqueando paises para que me salgan los  datos
        let block = document.querySelectorAll(".card")
        block.forEach(children => {
            const getData = children.textContent;
            showCountry.addEventListener('click', e => {
                if (e.target.innerHTML === getData) {
                    countries.value = getData
                    filtrar(getData)
                } 
             });
        });
        
    };
}

    const countryComplete = (find) => {
        if(find.length === 1){
            (async() => {
                try {
                    showCountry.innerHTML = `
                    <div class="lds-circle"><div></div></div>
                    `;
                    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${find[0].name.common}&appid=d644b65ed6d78ac27a3bf8b4bfe17466`)
                    if (response.status >= 400){
                        throw new Error('tamalo')
                    }
                    const data = await response.json();
                    countryData(data,find);
                    
                } catch (error) {
                    console.log(error);
                    alert("No signal :(")
                }
            })();
        }
    };

    const countryData = (data, find) => {
        showCountry.innerHTML = `<div class= "card"><img class="imgflag" src="${find[0].flags.png}" alt=""><p>${find[0].name.common}</p><p>Capital: ${find[0].capital}</p><p>Population: ${find[0].population.toLocaleString("es-ES")}</p><p>Region: ${find[0].region}</p><p>Temperature: ${(data.main.temp-273.15).toFixed(2)}℃</p><div class= "img-weather"><p>Weather: ${data.weather[0].description}<span><img class="weather" src= "https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt=""></span></p></div></div></div>`;   
            }


            