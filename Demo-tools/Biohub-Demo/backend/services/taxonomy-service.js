const { ESService } = require('./elastic-service');

class TaxonomyService extends ESService {
    elasticSearch(searchRequest) {
        try {
            const esClient = this.getEsClient();
            return esClient.search({
                index: 'taxonomy',
                ...searchRequest
            });
        } catch (error) {
            console.error(error.message)
        }
    }

    sanitizeSpeciesData = (data) => {
        return data.map((item) => {
          const label = [
            [
              [item._source.unit_name1, item._source.unit_name2, item._source.unit_name3].filter(Boolean).join(' '),
              item._source.english_name
            ]
              .filter(Boolean)
              .join(', ')
          ]
            .filter(Boolean)
            .join(': ');
    
          return { id: item._id, code: item._source.code, label: label };
        });
      };
    
      async getTaxonomyFromIds(ids) {
        const response = await this.elasticSearch({
          query: {
            terms: {
              _id: ids
            }
          }
        });
    
        return (response && response.hits.hits.map((item) => item._source)) || [];
      }
    
      async getSpeciesFromIds(ids) {
        const response = await this.elasticSearch({
          query: {
            terms: {
              _id: ids
            }
          }
        });
    
        return response ? this.sanitizeSpeciesData(response.hits.hits) : [];
      }
    
      async searchSpecies(term) {
        const searchConfig = [];
    
        const splitTerms = term.split(' ');
    
        splitTerms.forEach((item) => {
          searchConfig.push({
            wildcard: {
              english_name: { value: `*${item}*`, boost: 4.0, case_insensitive: true }
            }
          });
          searchConfig.push({
            wildcard: { unit_name1: { value: `*${item}*`, boost: 3.0, case_insensitive: true } }
          });
          searchConfig.push({
            wildcard: { unit_name2: { value: `*${item}*`, boost: 3.0, case_insensitive: true } }
          });
          searchConfig.push({
            wildcard: { unit_name3: { value: `*${item}*`, boost: 3.0, case_insensitive: true } }
          });
          searchConfig.push({ wildcard: { code: { value: `*${item}*`, boost: 2, case_insensitive: true } } });
          searchConfig.push({
            wildcard: { tty_kingdom: { value: `*${item}*`, boost: 1.0, case_insensitive: true } }
          });
        });
    
        const response = await this.elasticSearch({
          query: {
            bool: {
              should: searchConfig
            }
          }
        });
    
        return response ? this.sanitizeSpeciesData(response.hits.hits) : [];
      }
}

module.exports = TaxonomyService;