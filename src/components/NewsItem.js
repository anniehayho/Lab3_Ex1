import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import moment from 'moment';

const NewsItem = ({ article, onPress, sentiment }) => {
  console.log('article', article);
  const sentimentScore = sentiment?.comparative || 0;
  const backgroundColor = sentimentScore > 0 
    ? `rgba(0, 255, 0, ${Math.min(Math.abs(sentimentScore) * 0.2, 0.2)})`
    : sentimentScore < 0 
      ? `rgba(255, 0, 0, ${Math.min(Math.abs(sentimentScore) * 0.2, 0.2)})` 
      : 'transparent';
  
  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor }]} 
      onPress={onPress}
    >
      {article.imageUrl ? (
        <Image source={{ uri: article.imageUrl }} style={styles.image} />
      ) : (
        <View style={styles.noImage} />
      )}
      
      <View style={styles.content}>
        <Text style={styles.title}>{article.title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {article.description}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.source}>{article.source}</Text>
          <Text style={styles.time}>
            {moment(article.publishedAt).format('HH:mm on MMM DD, YYYY')}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    padding: 16,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  noImage: {
    width: '100%',
    height: 100,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  source: {
    fontSize: 12,
    color: '#0066cc',
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
});

export default NewsItem;