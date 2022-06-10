
##packages necessary for api request stuff
library(httr)
library(jsonlite)
library(glue)
library(tidyverse)

###packages for downstream mapping
library(sf)
library(tmap)


####read credentials in saved as a csv file, needs to be saved someplace script can access
credentials <- read_csv("//spatialfiles.bcgov/work/wlap/kam/Workarea/BErnst/Caribou/MB_Credentials.csv")

###get api token based on the user details in credentials and the metabase url
token_data <- POST(
  "https://metabase-0dff19-tools-tools.apps.silver.devops.gov.bc.ca/api/session",
  body =   list(username = credentials$User, password = credentials$Pword),
  encode = "json"
) %>%
  content(as = "text") %>%
  fromJSON()

###from stackoverflow this is necessary to pass the token details to all subsequent api requests
headers <- add_headers("X-Metabase-Session" = token_data$id, "export-format" = "json")



###get details for all the "cards"(queries created on metabase webpage) that are saved on metabase account
cards <- GET("https://metabase-0dff19-tools-tools.apps.silver.devops.gov.bc.ca/api/card/", headers) %>%
  content(as = "text", encoding = "UTF-8") %>%
  fromJSON()

###filter cards to get details for the one you want data from, in this case name contains "CS" for central selkirks query, keep only fields necessary for next steps and description
TARGET <- cards %>%
  filter(str_detect(name, "CS")) %>%
  select(name, description, id)


###send the request to get the data from the query identified above, the glue function inserts the id value from target above which results in url "https://metabase-0dff19-tools-tools.apps.silver.devops.gov.bc.ca/api/card/16/query/json" that produces a json formatted dataset

dataset <- POST(glue("https://metabase-0dff19-tools-tools.apps.silver.devops.gov.bc.ca/api/card/{TARGET$id}/query/json"), headers) %>%
  content(as = "text") %>%
  fromJSON()

##couple check to just be sure I got some data, unnecessary 
names(dataset)

glimpse(dataset)


###convert the table to a sf spatial dataset, after filtering out rows without lat/long values  then some data cleaning like converting dates from text to date object, filter to desired date
DATA_SF <- st_as_sf(dataset %>%
  filter(!is.na(Longitude), Longitude<0),
coords = c("Longitude", "Latitude"),
crs = 4326
) %>%
  mutate(
    `Acquisition Date` = lubridate::as_datetime(`Acquisition Date`),
    Month = format(`Acquisition Date`, "%b"), 
    Deviceid=factor(Deviceid)
  ) %>% 
  filter(`Acquisition Date`>as.Date("2010-01-01"))


##bring in other data from network folder
HERD_BOUND <- st_read("//spatialfiles.bcgov/work/wlap/kam/Workarea/BErnst/Caribou/BC_Herd_Boundaries_20210430.gdb/BC_Herd_Boundaries_20210430.gdb", layer="BC_Herd_Boundaries_20210430") %>% st_cast("MULTIPOLYGON") %>% st_transform(4326) 


###make an interactive map
tmap_mode("plot")
tmap_options(basemaps = c("OpenTopoMap", "Esri.WorldImagery"))

tm_shape(HERD_BOUND %>% filter(ECO_GROUP=="Southern Mountain - Southern Group"))+
  tm_fill(alpha = 0, id="HERD_NAME")+
tm_borders(lwd = 4, col = "black" )+
tm_shape(DATA_SF) +
  tm_dots( id="Deviceid",
           col = "Deviceid",
           popup.vars=c("Deviceid","Acquisition Date", "Month" ),palette = "Accent" )+
  
  tm_basemap()
