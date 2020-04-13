export const AppConfig = {
    environment: "https://bodh.shikshalokam.org",
    apiBaseUrl:"https://api.shikshalokam.org",
    baseUrls: {
        kendraUrl: "/kendra/api/"
    },
    apiConstants: {
        searchAutoComplete: "v1/bodh/search/autocomplete",
        search:"v1/bodh/search/middleware",
        bodhSearch:"/api/content/v1/search?orgdetails=orgName,email&framework=NCF",
        sync:"v1/bodh/batch/enrol"
    }
}