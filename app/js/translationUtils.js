import {setTextDirectionForLanguage} from "../../utils.js";
import constants from "../../constants.js";

const supportedLanguageCodes = ["ar", "de", "en", "en-gb", "es", "es-419", "fr", "ko", "nl", "pt-br", "uk", "it", "no", "pl"];

const langSubtypesMap = {
    "ar-ae": "ar",
    "ar-dz": "ar",
    "ar-bh": "ar",
    "ar-eg": "ar",
    "ar-iq": "ar",
    "ar-jo": "ar",
    "ar-kw": "ar",
    "ar-lb": "ar",
    "ar-ly": "ar",
    "ar-ma": "ar",
    "ar-om": "ar",
    "ar-qa": "ar",
    "ar-sa": "ar",
    "ar-sy": "ar",
    "ar-tn": "ar",
    "ar-ye": "ar",
    "de-de": "de",
    "en-au": "en",
    "en-bz": "en",
    "en-ca": "en",
    "en-ie": "en",
    "en-jm": "en",
    "en-nz": "en",
    "en-ph": "en",
    "en-za": "en",
    "en-tt": "en",
    "en-us": "en",
    "en-zw": "en",
    "es-ar": "es",
    "es-bo": "es",
    "es-cl": "es",
    "es-co": "es",
    "es-cr": "es",
    "es-do": "es",
    "es-ec": "es",
    "es-sv": "es",
    "es-gt": "es",
    "es-mx": "es",
    "es-ni": "es",
    "es-pa": "es",
    "es-py": "es",
    "es-pe": "es",
    "es-pr": "es",
    "es-uy": "es",
    "es-ve": "es",
    "es-us": "es",
    "es-es": "es",
    "es-419": "es",
    "fr-fr": "fr",
    "fr-be": "fr",
    "fr-ca": "fr",
    "ko-kr": "ko",
    "nl-nl": "nl",
    "pt-pt": "pt",
    "uk-ua": "uk",
    "zh-cn": "zh",
    "zh-hans": "zh",
    "zh-hant": "zh",
    "zh-hk": "zh",
    "nb": "no",
    "nn": "no",
    "nb-no": "no",
    "nn-no": "no",
    "it-ch": "it",
    "it-it": "it",
    "pl-pl": "pl"
}

function transformToISOStandardLangCode(code) {
    //language codes on phones have "_" instead of "-" and for base languages ends with "_"
    let replaceValue = "-";
    if (code.slice(-1) === "_") {
        replaceValue = "";
    }
    return code.replace("_", replaceValue);
}

async function fetchTranslation(langCode) {
    try {
        const dataModule = await import(`./../translations/${langCode}.js`);
        return dataModule.default
        // You can now use the 'translations' object for localization in your application
    } catch (error) {
        alert(`An error has occurred: ${error.message} on fetching translation for ${langCode} 
    Possible network issue!!! Check your network connection and try again`);
    }
}

let currentAppTranslation;

function setDefaultLanguage() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let appLang = urlParams.get("lang") || window.navigator.language.toLowerCase() || localStorage.getItem(constants.APP_LANG);
    appLang = transformToISOStandardLangCode(appLang);
    appLang = langSubtypesMap[appLang.toLowerCase()] || appLang;
    appLang = supportedLanguageCodes.includes(appLang) ? appLang : "en";
    localStorage.setItem(constants.APP_LANG, appLang);
    document.querySelector("body").setAttribute("app-lang", appLang);
    setTextDirectionForLanguage(appLang);
}

export async function translate() {
    setDefaultLanguage();
    let matches = document.querySelectorAll("[translate]");
    currentAppTranslation = await fetchTranslation(localStorage.getItem(constants.APP_LANG));
    matches.forEach((item) => {
        item.innerHTML = currentAppTranslation[item.getAttribute('translate')];
    });
}

export function getTranslation(key) {
    setDefaultLanguage();
    if (!currentAppTranslation) {
        fetchTranslation(localStorage.getItem(constants.APP_LANG)).then(result => {
            currentAppTranslation = result;
            return currentAppTranslation[key];
        });
    } else {
        return currentAppTranslation[key];
    }
}
