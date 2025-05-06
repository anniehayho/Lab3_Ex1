import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Linking 
} from 'react-native';
import moment from 'moment';

const NewsDetailScreen = ({ route }) => {
  const { article } = route.params;
  
  const getSentimentColor = () => {
    const sentimentScore = article.sentiment?.comparative || 0;
    if (sentimentScore > 0) return '#4CAF50';
    if (sentimentScore < 0) return '#F44336';
    return '#FFC107';
  };
  
  const openArticleUrl = () => {
    if (article.url) {
      Linking.openURL(article.url);
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      {article.imageUrl ? (
        <Image source={{ uri: article.imageUrl }} style={styles.image} />
      ) : (
        <View style={styles.noImage} />
      )}
      
      <View style={styles.content}>
        <Text style={styles.title}>{article.title}</Text>
        
        <View style={styles.metaContainer}>
          <Text style={styles.source}>{article.source}</Text>
          <Text style={styles.time}>
            {moment(article.publishedAt).format('HH:mm on MMM DD, YYYY')}
          </Text>
        </View>
        
        <View style={[styles.sentimentContainer, { backgroundColor: getSentimentColor() }]}>
          <Text style={styles.sentimentText}>
            Sentiment: {article.sentiment?.comparative > 0 ? 'Positive' : 
                         article.sentiment?.comparative < 0 ? 'Negative' : 'Neutral'}
          </Text>
          <Text style={styles.sentimentScore}>
            Score: {article.sentiment?.comparative !== undefined && article.sentiment?.comparative !== null 
              ? article.sentiment.comparative.toFixed(2) 
              : '0.00'}
          </Text>
        </View>
        
        <Text style={styles.description}>{article.description}</Text>
        
        {article.content && (
          <Text style={styles.contentText}>{article.content}</Text>
        )}
        
        <TouchableOpacity 
          style={styles.readMoreButton} 
          onPress={openArticleUrl}
        >
          <Text style={styles.readMoreText}>Read Full Article</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  image: {
    width: '100%',
    height: 250,
  },
  noImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 12,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  source: {
    fontSize: 14,
    color: '#0066cc',
  },
  time: {
    fontSize: 14,
    color: '#666',
  },
  sentimentContainer: {
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sentimentText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  sentimentScore: {
    color: '#FFF',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  contentText: {
    fontSize: 14,
    lineHeight: 24,
    marginBottom: 24,
  },
  readMoreButton: {
    backgroundColor: '#0066cc',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  readMoreText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default NewsDetailScreen;