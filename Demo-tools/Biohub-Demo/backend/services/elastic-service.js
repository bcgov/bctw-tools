const { Client } = require('@elastic/elasticsearch');

const ElasticSearchIndices = {
    EML: 'eml'
};

class ESService {
    esClient = undefined;

    // Instantiate the connection to the service
    getEsClient() {
        if(!this.esClient) {
            this.esClient = new Client({ 
                node: 'https://elasticsearch-a0ec71-dev.apps.silver.devops.gov.bc.ca' 
            });
        }
        return this.esClient;
    }

    // Generic function to handle queries
    async _elasticSearch(SearchRequest) {
        const {index, ...request} = SearchRequest;
        const esClient = this.getEsClient();


        const response = await esClient.search({
            index: String(index).toLowerCase(),
            ...request
        });

        return response.hits.hits;
    }

    // Use the generic function when given a String to return a result
    async keywordSearchEml(query) {
        return this._elasticSearch({
            index: ElasticSearchIndices.EML,

            query: {
                multi_match: {
                    fields: ['*'],
                    type: 'phrase_prefix',
                    query
                }
            }
        });
    }

    // Use the generic function to find an entire dataset when given an array of IDs
    async datasetSearchEml(datasetId) {
        return this._elasticSearch({
            index: ElasticSearchIndices.EML,
            query: {
                ids: {
                    values: [datasetId]
                }
            },
            fields: ['*']
        });
    }
}

module.exports = { ElasticSearchIndices, ESService }
