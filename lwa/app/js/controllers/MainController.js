import {goToPage} from "../../../utils.js"
import {translate} from "../translationUtils.js";
import environment from "../../../environment.js";
import constants from "../../../constants.js";


function MainController() {

  this.toggleMenu = function () {
    let menuButton = document.getElementById("hamburger-menu-button");
    let menuExpanded = menuButton.getAttribute("aria-expanded") != "true";
    menuButton.setAttribute("aria-expanded", menuExpanded);
    let menuContainer = document.querySelector(".app-menu-container");
    menuContainer.classList.toggle("hidden");
  }

  this.checkOnboarding = function () {
    let usrAgreedTerms = JSON.parse(localStorage.getItem(constants.USR_AGREED_TERMS));
    if (!usrAgreedTerms) {
      document.querySelector(".welcome-container #onbording-text").classList.remove("hiddenElement")
      document.querySelector(".content-container").classList.add("hiddenElement");
      document.querySelector(".explain-container").classList.add("hiddenElement");
      document.querySelector(".scan-button-container").classList.add("hiddenElement");
    } else {
      document.querySelector(".terms-content-container").classList.add("hiddenElement");
      document.querySelector(".welcome-container #welcome-text").classList.remove("hiddenElement");
    }
    document.querySelector("#app_version_number").innerHTML = `${environment.appBuildVersion}`;
  }

  this.submitTerms = function (status) {
    if (status) {
      localStorage.setItem(constants.USR_AGREED_TERMS, true);
    }
    location.reload();
  }

  this.scanHandler = async function () {
    goToPage("/scan.html")
  }

  this.showModal = function (key) {
    this.toggleMenu();
    goToPage(`/${key}-page.html`)
  }


  let addEventListeners = () => {
    let menuContainer = document.querySelector(".app-menu-container");
    let menuButton = document.getElementById("hamburger-menu-button");

    const focusableElements = document.querySelectorAll('.app-menu-container li');

    // Add event listener to the menu to capture the Tab key press
    menuContainer.addEventListener("keydown", (event) => {
      if (event.key === "Tab") {
        event.preventDefault(); // Prevent the default tab behavior

        for (let i = 0; i < focusableElements.length; i++) {
          if (focusableElements[i] === document.activeElement) {
            let nextIndex = (i + 1) % focusableElements.length;
            focusableElements[nextIndex].focus();
            break;
          }
        }
      }
    });


    let liElements = menuContainer.querySelectorAll('li.forward-to-page');
    liElements.forEach(function (li) {
      li.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          li.click();
        }
      });
    });

    document.getElementById("hamburger-menu-button").addEventListener("click", this.toggleMenu);
    document.addEventListener('keydown', evt => {
      if (evt.key === 'Escape') {
        if (!menuContainer.classList.contains("hidden")) {
          menuContainer.classList.add("hidden");
        }
      }
    });
    document.querySelector("body").addEventListener("click", (event) => {
      if (event.target != menuContainer && event.target != menuButton) {
        menuContainer.classList.add("hidden");
      }
    })
    document.querySelectorAll(".app-menu-container li.forward-to-page").forEach(item => {
      item.addEventListener("click", (event) => {
        this.showModal(event.currentTarget.getAttribute("modal-name"))
      })
    })
    document.getElementById("disagree-button").addEventListener("click", () => {
      this.submitTerms(false)
    })
    document.getElementById("agree-button").addEventListener("click", () => {
      this.submitTerms(true)
    })
    document.getElementById("scan-button").addEventListener("click", this.scanHandler)

  }
  addEventListeners();
}

const mainController = new MainController();

window.onload = async (event) => {
  await translate();
  mainController.checkOnboarding();
  document.querySelector(".page-container").classList.remove("hiddenElement");
  document.querySelector(".loader-container").setAttribute('style', 'display:none');
  setTimeout(() => {
    document.querySelector(".app-menu-container ").style.position = "absolute";
  }, 0);
}
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let epiDomain = urlParams.get("setdomain") || localStorage.getItem(constants.EPI_DOMAIN) || environment.epiDomain;
localStorage.setItem(constants.EPI_DOMAIN, epiDomain);


window.mainController = mainController;

