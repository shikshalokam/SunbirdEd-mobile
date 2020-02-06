export const AppConfig = {
    environment: "https://devhome.shikshalokam.org",
    // environment: "https://bodh.shikshalokam.org",
    baseUrls: {
        kendraUrl: "/kendra-service/api/"
    },
    apiConstants: {
        searchAutoComplete: "v1/bodh/search/autocomplete",
        search:"v1/bodh/search/middleware",
        bodhSearch:"https://bodh.shikshalokam.org/api/content/v1/search?orgdetails=orgName,email&framework=NCF"
    }
}