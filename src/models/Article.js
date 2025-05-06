class Article {
    constructor(id, title, description, content, url, imageUrl, publishedAt, source) {
      this.id = id;
      this.title = title;
      this.description = description;
      this.content = content;
      this.url = url;
      this.imageUrl = imageUrl;
      this.publishedAt = publishedAt;
      this.source = source;
    }

    static fromAPI(item) {
      return new Article(
        item.url,
        item.title,
        item.description,
        item.content,
        item.url,
        item.urlToImage,
        item.publishedAt,
        item.source.name
      );
    }
  }

export default Article;
