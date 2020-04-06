export const AppConfig = {
    environment: "https://bodh.shikshalokam.org",
    apiBaseUrl:"https://api.shikshalokam.org",
    rootOrgId:"0124487522476933120",
    baseUrls: {
        kendraUrl: "/kendra/api/"
    },
    apiConstants: {
        searchAutoComplete: "v1/bodh/search/autocomplete",
        search:"v1/bodh/search/middleware",
        bodhSearch:"/api/content/v1/search?orgdetails=orgName,email&framework=NCF",
        pageAssemble:"/api/data/v1/page/assemble",
        middleware:"v1/bodh/request/middleware"
    },
}