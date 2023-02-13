import './css/styles.css';
// import templateFunction from '../src/templates/country-card.hbs';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import "notiflix/dist/notiflix-3.2.6.min.css";
import { fetchCountries } from './js/fetch';

const DEBOUNCE_DELAY = 300;

const refs = {
    body: document.querySelector('body'),
    countriesList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
    searchBox: document.querySelector('#search-box'),
}

refs.searchBox.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY));

function onInputSearch(e) {
    e.preventDefault();
    const searchCountries = e.target.value.trim();

    if (!searchCountries) {
        hiddenBlocks();
        emptyBlocks();
        return;
    }


    fetchCountries(searchCountries)
        .then(output => {
            if (output.length > 10) {
                Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
                return;
            }
            renderedCountries(output);
        })
        .catch(error => {
            emptyBlocks();
            Notiflix.Notify.failure('Oops, there is no country with that name');
        })
};

function hiddenBlocks() {
    refs.countriesList.style.visibility = "hidden";
    refs.countryInfo.style.visibility = "hidden";
}

function emptyBlocks() {
    refs.countriesList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
}

function renderedCountries(output) {
    const inputLetters = output.length;

    if (inputLetters === 1) {
        refs.countriesList.innerHTML = '';
        refs.countriesList.style.visibility = "hidden";
        refs.countryInfo.style.visibility = "visible";
        countryCardMarkup(output);
    }

    if (inputLetters > 1 && inputLetters <= 10) {
        refs.countryInfo.innerHTML = '';
        refs.countryInfo.style.visibility = "hidden";
        refs.countriesList.style.visibility = "visible";
        countriesListMarkup(output);
    }
}


function countriesListMarkup(output) {
    const listMarkup = output.map((({ name, flags }) => {
        return `<li class="card-item">
            <div class="card-img-flag">
                <img src="${flags.svg}" alt="${flags.alt}" width="30" height="auto"> 
            </div>  
            <p class="card-name">${name.official}</p>
        </li>`})).join('');
    refs.countriesList.innerHTML = listMarkup;
    return listMarkup;
}

function countryCardMarkup(output) {
    const cardMarkup = output.map(({ flags, name, capital, population, languages }) => {
        languages = Object.values(languages).join(", ");
        return `<ul class="card">
            <li class="card-item top">
                <div class="card-img-flag">
                    <img src="${flags.png}" alt="${flags.alt}" width="60" height="auto">
                </div>
                <h2 class="card-name">${name.official}</h2>
            </li>
            <li class="card-item bottom">
                <ul class="card-item-list">
                    <li class="list-item">Capital: <span>${capital}</span></li>
                    <li class="list-item">Population: <span>${population}</span></li>
                    <li class="list-item">Languages: <span>${languages}</span></li>
                </ul>
            </li>
        </ul>`}).join('');
        refs.countryInfo.innerHTML = cardMarkup;
        return cardMarkup;
}
