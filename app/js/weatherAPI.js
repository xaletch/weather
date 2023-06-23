import weatherInfo from './weather.js';

const apiKey = 'a7aa7e22b40045efa4635802232105';

const form = document.querySelector('.header__form');
const input = document.querySelector('.form__input');
const weatherContainer = document.querySelector('.weather__card--error');

let city;

const inputClear = function() {
    input.value = '';
    input.blur();
}

form.onsubmit = (event) => {
    event.preventDefault();
    
    city = input.value.trim();
    console.log(city);

    const url = ` http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

    fetch(url).then((response) => {
        return response.json();
    }).then((data) => {

        if(data.error) {
            const delCard = document.querySelector('.weather__card');
            
            if(delCard) {
                delCard.remove();
            }

            input.value = ''
            const errorHTML = `<div class='error'>Извините, но город, который вы ищете, не найден. Пожалуйста, попробуйте еще раз с другим названием города.</div>`;
            weatherContainer.insertAdjacentHTML('afterend', errorHTML);

        } else {
            const info = weatherInfo.find((obj) => {
                return obj.code === data.current.condition.code;
            });
            // console.log(info);

            const condition = data.current.is_day ? info['day'] : info['night'];
            const fileImage = data.current.is_day ? info.imageDay: info.imageNight;

            const wetherHTML = `
            <div class="weather">
                <div class="weather__card container">
                    <div class="weather__card--content">
                        <div class="weather__card--location">
                            <h3 class="weather__card--city">${data.location.name}</h3>
                            <h3 class="weather__card--country">${data.location.country}</h3>
                        </div>
                        <div class="weather__card--info">
                            <img src=${fileImage}>
                            <span class="weather__card--temperature">${data.current.temp_c} <pop>°C</pop> </span>
                            <span class="weather__card--precipitation">${condition}</span>
                        </div>
                    </div>
                </div>
            </div>
            `;
    
            weatherContainer.insertAdjacentHTML('afterend', wetherHTML);

            inputClear()
        }

            console.log(data);
    });
    const delCard = document.querySelector('.weather__card');

    if(delCard) {
        delCard.remove();
    };
};