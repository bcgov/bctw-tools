const { default: axios } = require('axios');
const express = require('express');
const TaxonomyService = require('./services/taxonomy-service') 
const service = new TaxonomyService()
const app = express();

const port = 9000;

app.use(express.json());
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
  
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization, responseType');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-store');
  
    next();
});

app.post('/get-taxonomy/', async (req, res) => {
    const searchRequest = req.body;
    console.log(searchRequest)
    try {
        const result = await service.elasticSearch(searchRequest);
        res.status(200).json(result);
    } catch (error) {
        console.error(error.message)
    }
});

app.post('/get-taxonomy/sanitized', async (req, res) => {
    const searchRequest = req.body;
    console.log(searchRequest)
    try {
        const result = await service.elasticSearch(searchRequest);
        const sanitizedResult = service.sanitizeSpeciesData(result.hits.hits);
        res.status(200).json(sanitizedResult);
    } catch (error) {
        console.error(error.message)
    }
});

app.post('/get-all-taxonomy/', async (req, res) => {
    try {
        const result = await service.elasticSearch();
        res.status(200).json(result);
    } catch (error) {
        console.error(error.message)
    }
});

app.post('/get-all-taxonomy/sanitized', async (req, res) => {
    try {
        const result = await service.elasticSearch();
        const sanitizedResult = service.sanitizeSpeciesData(result.hits.hits);
        res.status(200).json(sanitizedResult);
    } catch (error) {
        console.error(error.message)
    }
});

app.post('/get-taxonomy-by-ids', async (req, res) => {
    const searchRequest = req.body;
    console.log(searchRequest);
    try {
        
    } catch (error) {
        console.error(error.message);
    }
});

/**
 * NatureServe API Routes
 */

app.get('/nature/get-taxon', async (req, res) => {
    try {
        axios.get('https://explorer.natureserve.org/api/data/taxon/ELEMENT_GLOBAL.2.154701').then((response) => {
            console.log(response.status)
            if(response.status === 200) {
                res.status(200).send(response.data);
            } else {
                res.status(403).send('id does not exist')
            }
        })
    } catch (error) {
        console.error(error.message);
    }
});

app.get('/nature/get-alt-taxon', async (req, res) => {
    try {
        axios.get('https://explorer.natureserve.org/api/data/taxonSearch/?ouSeqUid=ELEMENT_GLOBAL.2.154701').then((response) => {
            console.log(response.status)
            if(response.status === 200) {
                res.status(200).send(response.data);
            } else {
                res.status(403).send('id does not exist')
            }
        })
    } catch (error) {
        console.error(error.message);
    }
});

app.get('/nature/get-ecosystem-hierarchy', async (req, res) => {
    try {
        axios.get('https://explorer.natureserve.org/api/data/ecosystemHierarchy/ELEMENT_GLOBAL.2.683060').then((response) => {
            console.log(response.status)
            if(response.status === 200) {
                res.status(200).send(response.data);
            } else {
                res.status(403).send('id does not exist')
            }
        })
    } catch (error) {
        console.error(error.message);
    }
});

app.post('/nature/search-by-text', (req, res) => {
    const data = {
        "criteriaType" : req.body.criteriaType,
        "textCriteria" : req.body.textCriteria || [],
        "statusCriteria" : req.body.statusCriteria || [],
        "locationCriteria" : req.body.locationCriteria || [],
        "pagingOptions" : {
          "page" : null,
          "recordsPerPage" : null
        },
        "recordSubtypeCriteria" : req.body.recordSubtypeCriteria || [],
        "modifiedSince" : null,
        "locationOptions" : null,
        "classificationOptions" : null,
        "recordTypeCriteria" : req.body.recordTypeCriteria || []
      };

      console.log(data)

      try {
        axios.post('https://explorer.natureserve.org/api/data/search', data).then((response) => {
            if(response.status === 200) {
                res.status(200).send(response.data);
            } else {
                res.status(403).send('cannot find anything')
            }
        });
      } catch (error) {
        console.error(error.message)
      }

});

app.post('/nature/search-by-ecosystem', (req, res) => {
    const data = {
        "criteriaType" : req.body.criteriaType,
        "textCriteria" : req.body.textCriteria || [],
        "statusCriteria" : req.body.statusCriteria || [],
        "locationCriteria" : req.body.locationCriteria || [],
        "pagingOptions" : {
          "page" : null,
          "recordsPerPage" : null
        },
        "recordSubtypeCriteria" : req.body.recordSubtypeCriteria || [],
        "modifiedSince" : null,
        "locationOptions" : null,
        "classificationOptions" : null,
        "recordTypeCriteria" : req.body.recordTypeCriteria || []
      };

      console.log(data)

      try {
        axios.post('https://explorer.natureserve.org/api/data/ecosystemsSearch', data).then((response) => {
            
            if(response.status === 200) {
                res.status(200).send(response.data);
            } else {
                res.status(403).send('cannot find anything')
            }
        });
      } catch (error) {
        console.error(error.message)
      }

});

app.post('/nature/search-by-species', (req, res) => {
    const data = {
        "criteriaType" : req.body.criteriaType,
        "textCriteria" : req.body.textCriteria || [],
        "statusCriteria" : req.body.statusCriteria || [],
        "locationCriteria" : req.body.locationCriteria || [],
        "pagingOptions" : {
          "page" : null,
          "recordsPerPage" : null
        },
        "recordSubtypeCriteria" : req.body.recordSubtypeCriteria || [],
        "modifiedSince" : null,
        "locationOptions" : null,
        "classificationOptions" : null,
        "recordTypeCriteria" : req.body.recordTypeCriteria || []
      };

      console.log(data)

      try {
        axios.post('https://explorer.natureserve.org/api/data/speciesSearch', data).then((response) => {
            if(response.status === 200) {
                res.status(200).send(response.data);
            } else {
                res.status(403).send('cannot find anything')
            }
        });
      } catch (error) {
        console.error(error.message)
      }
});

/**
 * ITIS API Routes (JSON Service)
 */

app.get('/ITIS/searchForAnyMatch', (req, res) => {
    try {
        let srchKey = req.query.srchKey;
        axios.get(`http://www.itis.gov/ITISWebService/jsonservice/searchForAnyMatch?srchKey=${srchKey}`).then((response) => {
            if(response.status === 200) {
                res.status(200).send(response.data);
            } else {
                res.status(403).send('cannot connect to ITIS service');
            }
        });
    } catch (error) {
        console.error(error.message)
    } 
});

app.get('/ITIS/searchForAnyMatchPaged', (req, res) => {
    try {
      let srchKey = req.query.srchKey;
      let pageSize = req.query.pageSize;
      let pageNum = req.query.pageNum;
      let ascend = req.query.ascend;
      axios.get(`http://www.itis.gov/ITISWebService/jsonservice/searchForAnyMatchPaged?srchKey=${srchKey}&pageSize=${pageSize}&pageNum=${pageNum}&ascend=${ascend}`)
        .then((response) => {
          if (response.status === 200) {
            res.status(200).send(response.data);
          } else {
            res.status(403).send('Cannot connect to ITIS service');
          }
        });
    } catch (error) {
      console.error(error.message)
    }
  });

app.get('/ITIS/getAnyMatchCount', (req, res) => {
    try {
        let srchKey = req.query.srchKey;
        axios.get(`http://www.itis.gov/ITISWebService/jsonservice/getAnyMatchCount?srchKey=${srchKey}`).then((response) => {
            if(response.status === 200) {
                res.status(200).send(response.data);
            } else {
                res.status(403).send('cannot connect to ITIS service');
            }
        });
    } catch (error) {
        console.error(error.message)
    } 
});

app.get('/ITIS/searchByCommonName', (req, res) => {
    try {
        let srchKey = req.query.srchKey;
        axios.get(`http://www.itis.gov/ITISWebService/jsonservice/searchByCommonName?srchKey=${srchKey}`).then((response) => {
            if(response.status === 200) {
                res.status(200).send(response.data);
            } else {
                res.status(403).send('cannot connect to ITIS service');
            }
        });
    } catch (error) {
        console.error(error.message)
    } 
});

app.get('/ITIS/searchByCommonNameBeginsWith', (req, res) => {
    try {
        let srchKey = req.query.srchKey;
        axios.get(`http://www.itis.gov/ITISWebService/jsonservice/searchByCommonNameBeginsWith?srchKey=${srchKey}`).then((response) => {
            if(response.status === 200) {
                res.status(200).send(response.data);
            } else {
                res.status(403).send('cannot connect to ITIS service');
            }
        });
    } catch (error) {
        console.error(error.message)
    } 
});

app.get('/ITIS/searchByCommonNameEndsWith', (req, res) => {
    try {
        let srchKey = req.query.srchKey;
        axios.get(`http://www.itis.gov/ITISWebService/jsonservice/searchByCommonNameEndsWith?srchKey=${srchKey}`).then((response) => {
            if(response.status === 200) {
                res.status(200).send(response.data);
            } else {
                res.status(403).send('cannot connect to ITIS service');
            }
        });
    } catch (error) {
        console.error(error.message)
    } 
});

app.get('/ITIS/searchByScientificName', (req, res) => {
    try {
        let srchKey = req.query.srchKey;
        axios.get(`http://www.itis.gov/ITISWebService/jsonservice/searchByScientificName?srchKey=${srchKey}`).then((response) => {
            if(response.status === 200) {
                res.status(200).send(response.data);
            } else {
                res.status(403).send('cannot connect to ITIS service');
            }
        });
    } catch (error) {
        console.error(error.message)
    }
});

app.get('/ITIS/getITISTerms', (req, res) => {
    try {
        let srchKey = req.query.srchKey;
        axios.get(`http://www.itis.gov/ITISWebService/jsonservice/getITISTerms?srchKey=${srchKey}`).then((response) => {
            if(response.status === 200) {
                res.status(200).send(response.data);
            } else {
                res.status(403).send('cannot connect to ITIS service');
            }
        });
    } catch (error) {
        console.error(error.message)
    }
});

app.get('/ITIS/getITISTermsFromCommonName', (req, res) => {
    try {
        let srchKey = req.query.srchKey;
        axios.get(`http://www.itis.gov/ITISWebService/jsonservice/getITISTermsFromCommonName?srchKey=${srchKey}`).then((response) => {
            if(response.status === 200) {
                res.status(200).send(response.data);
            } else {
                res.status(403).send('cannot connect to ITIS service');
            }
        });
    } catch (error) {
        console.error(error.message)
    }
});

app.get('/ITIS/getITISTermsFromScientificName', (req, res) => {
    try {
        let srchKey = req.query.srchKey;
        axios.get(`http://www.itis.gov/ITISWebService/jsonservice/getITISTermsFromScientificName?srchKey=${srchKey}`).then((response) => {
            if(response.status === 200) {
                res.status(200).send(response.data);
            } else {
                res.status(403).send('cannot connect to ITIS service');
            }
        });
    } catch (error) {
        console.error(error.message)
    }
});

app.get('/ITIS/getTsnByVernacularLanguage', (req, res) => {
    try {
        let language = req.query.language;
        axios.get(`http://www.itis.gov/ITISWebService/jsonservice/getTsnByVernacularLanguage?language=${language}`).then((response) => {
            if(response.status === 200) {
                res.status(200).send(response.data);
            } else {
                res.status(403).send('cannot connect to ITIS service');
            }
        });
    } catch (error) {
        console.error(error.message)
    }
});


app.listen(port, () => {
    console.log('I am listening on: ' + port);
});