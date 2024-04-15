import environment from "../environment.js";

const appPages = ["main.html", "scan.html", "leaflet.html", "error.html", "about-page.html", "help-page.html", "privacy-page.html", "terms-page.html"];
const gs1DigitalLinkRegex = /\/01\/(\d{14})\/10\/(\w{1,20})\?17=(\d{6})/;

window.onload = () => {
    debugger;
    try {
        let urlParts = location.href.split(location.origin)[1].split("/").filter(function (item) {
            return item !== "";
        })

        let pageWithQuery = urlParts[urlParts.length - 1].split("?");
        let page = pageWithQuery[0];
        let query = pageWithQuery[1]

        if (appPages.indexOf(page) === -1) {
            validateAndRedirect(constructUrl("main.html"));
        } else {
            validateAndRedirect(constructUrl(page, query));
        }

    } catch (e) {
        goTo404ErrPage()
    }

}

function getGS1Url() {
    let gs1Url;
    let gs1Split = window.location.href.split(window.location.origin);
    if (gs1Split && gs1Split[1] && gs1DigitalLinkRegex.test(gs1Split[1])) {
        const match = gs1Split[1].match(gs1DigitalLinkRegex);
        const gtin = match[1];
        const batchNumber = match[2];
        const expiry = match[3];
        gs1Url = `/leaflet.html?gtin=${gtin}&batch=${batchNumber}&expiry=${expiry}`;
    }
    return gs1Url;
}

function goTo404ErrPage() {
    debugger;
    let pageUrl = "/404.html";
    let err404Page = `/app${pageUrl}`;
    if (environment.enableRootVersion) {
        err404Page = `/${environment.appBuildVersion}${pageUrl}`;
    }
    window.location.href = window.location.origin + err404Page;
}

function constructUrl(page, query) {
    let gs1Url = getGS1Url();

    if (gs1Url) {
        return `${window.location.origin}/${environment.appBuildVersion}${gs1Url}`;
    }

    return query ? `${window.location.origin}/${environment.appBuildVersion}/${page}?${query}` : `${window.location.origin}/${environment.appBuildVersion}/${page}`
}

function validateAndRedirect(url) {
    if (url.startsWith(`${window.location.origin}/${environment.appBuildVersion}`)) {
        window.location.href = url;
    } else {
        throw new Error("Invalid or potentially harmful URL.")
    }
}
