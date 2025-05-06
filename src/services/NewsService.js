import axios from 'axios';
import Article from '../models/Article';

const API_KEY = ''; //add your api key cause it's private
const BASE_URL = 'https://newsapi.org/v2';

const NewsService = {
  async getTopHeadlines(country = 'us', category = '', page = 1) {
    try {
      const response = await axios.get(`${BASE_URL}/top-headlines`, {
        params: {
          country,
          category: category || undefined,
          page,
          apiKey: API_KEY,
        },
      });

      return {
        articles: response.data.articles.map(item => Article.fromAPI(item)),
        totalResults: response.data.totalResults,
      };
    } catch (error) {
      console.error('Error fetching top headlines:', error);
      throw error;
    }
  },

  async getNews(query, page = 1) {
    return this.searchNews(query, page);
  },

  async searchNews(query, page = 1) {
    try {
      const response = await axios.get(`${BASE_URL}/everything`, {
        params: {
          q: query,
          page,
          apiKey: API_KEY,
        },
      });

      return {
        articles: response.data.articles.map(item => Article.fromAPI(item)),
        totalResults: response.data.totalResults,
      };
    } catch (error) {
      console.error('Error searching news:', error);
      throw error;
    }
  },
};

export default NewsService;
