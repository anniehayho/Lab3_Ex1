import React, { useState, useEffect } from 'react';
import { 
  View, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator, 
  TextInput,
  TouchableOpacity,
  Text
} from 'react-native';
import NewsItem from '../components/NewsItem';
import NewsService from '../services/NewsService';
import SentimentService from '../services/SentimentService';

const NewsScreen = ({ navigation }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('covid');
  const [tempQuery, setTempQuery] = useState('covid');
  const [totalResults, setTotalResults] = useState(0);

  const fetchNews = async (reset = false) => {
    if (loading) return;
    
    try {
      setLoading(true);
      const currentPage = reset ? 1 : page;
      const { articles: newArticles, totalResults } = await NewsService.getNews(
        searchQuery, 
        currentPage
      );
      
      const articlesWithSentiment = await Promise.all(
        newArticles.map(async article => {
          const text = article.title + ' ' + (article.description || '');
          article.sentiment = await SentimentService.analyzeText(text);
          return article;
        })
      );
      
      if (reset) {
        setArticles(articlesWithSentiment);
      } else {
        setArticles(prevArticles => [...prevArticles, ...articlesWithSentiment]);
      }
      
      setTotalResults(totalResults);
      setPage(currentPage + 1);
      setHasMore(currentPage * 10 < totalResults);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews(true);
  }, [searchQuery]);

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchNews(true);
  };

  const handleEndReached = () => {
    if (hasMore && !loading) {
      fetchNews();
    }
  };

  const handleSearch = () => {
    setSearchQuery(tempQuery);
  };

  const renderFooter = () => {
    if (!loading) return null;
    
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={tempQuery}
          onChangeText={setTempQuery}
          placeholder="Search news..."
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.resultsText}>
        Showing {articles.length} of {totalResults} results
      </Text>
      
      <FlatList
        data={articles}
        renderItem={({ item }) => (
          <NewsItem
            article={item}
            sentiment={item.sentiment}
            onPress={() => navigation.navigate('NewsDetail', { article: item })}
          />
        )}
        keyExtractor={(item, index) => item.url + index}
        contentContainerStyle={styles.list}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  list: {
    padding: 8,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  searchButton: {
    width: 40,
    height: 40,
    backgroundColor: '#0066cc',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsText: {
    padding: 8,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  searchButtonText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default NewsScreen;