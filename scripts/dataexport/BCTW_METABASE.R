

library(httr)
library(jsonlite)
library(glue)
library(tidyverse)
library(sf)
library(tmap)

credentials <- read_csv("//spatialfiles.bcgov/work/wlap/kam/Workarea/BErnst/Caribou/MB_Credentials.csv")

token_data <- POST(
  "https://metabase-0dff19-tools-tools.apps.silver.devops.gov.bc.ca/api/session",
  body =   list(username = credentials$User, password = credentials$Pword),
  encode = "json"
) %>%
  content(as = "text") %>%
  fromJSON()

headers <- add_headers("X-Metabase-Session" = token_data$id, "export-format" = "json")




cards <- GET("https://metabase-0dff19-tools-tools.apps.silver.devops.gov.bc.ca/api/card/", headers) %>%
  content(as = "text", encoding = "UTF-8") %>%
  fromJSON()

TARGET <- cards %>%
  filter(str_detect(name, "CN")) %>%
  select(name, description, id)



dataset <- POST(glue("https://metabase-0dff19-tools-tools.apps.silver.devops.gov.bc.ca/api/card/{TARGET$id}/query/json"), headers, body = list("export-format" = "json")) %>%
  content(as = "text") %>%
  fromJSON()


names(dataset)

glimpse(dataset)


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






tmap_mode("view")
tmap_options(basemaps = c("OpenTopoMap", "Esri.WorldImagery"))

tm_shape(DATA_SF) +
  tm_dots( id="Deviceid",
           col = "Deviceid", 
           popup.vars=c("Deviceid","Acquisition Date", "Month" ))+
  tm_basemap()
