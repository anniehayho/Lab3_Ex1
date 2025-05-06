import axios from 'axios';

class SentimentService {
  async analyzeText(text) {
    return await this.analyzeSentiment(text);
  }

  async analyzeSentiment(text) {
    try {
      try {
        const API_KEY = ''; //add your api key cause it's private

        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${API_KEY}`,
          {
            contents: [
              {
                parts: [
                  {
                    text: `Analyze the sentiment of the following text and respond only with a JSON object containing 'sentiment' (positive, negative, or neutral) and 'score' (confidence between 0 and 1): "${text}"`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.2,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            },
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        const aiResponse = response.data.candidates[0].content.parts[0].text.trim();

        try {
          const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const jsonString = jsonMatch[0];
            const parsedResponse = JSON.parse(jsonString);
            return {
              sentiment: parsedResponse.sentiment.toLowerCase(),
              score: parsedResponse.score,
              comparative: parsedResponse.score,
            };
          }
        } catch (parseError) {
          console.log('Falling back to local analysis due to parse error');
        }
      } catch (apiError) {
        console.log('Falling back to local analysis due to API error');
      }

      return this.localSentimentAnalysis(text);

    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      throw new Error('Failed to analyze sentiment');
    }
  }

  localSentimentAnalysis(text) {
    if (!text) {
      return { score: 0, comparative: 0, sentiment: 'neutral' };
    }

    const lowerText = text.toLowerCase();

    const positiveWords = [
      'good', 'great', 'happy', 'excellent', 'love',
      'wonderful', 'amazing', 'fantastic', 'beautiful',
      'enjoy', 'like', 'best', 'perfect', 'pleased',
      'glad', 'delighted', 'awesome', 'brilliant',
      'satisfied', 'impressive', 'success', 'win',
    ];

    const negativeWords = [
      'bad', 'terrible', 'sad', 'awful', 'hate',
      'horrible', 'disappointing', 'poor', 'ugly',
      'dislike', 'angry', 'mad', 'upset', 'annoyed',
      'frustrated', 'disaster', 'failure', 'worst',
      'broken', 'useless', 'waste', 'awful', 'regret',
    ];

    let positiveScore = 0;
    let negativeScore = 0;

    for (const word of positiveWords) {
      const regex = new RegExp('\\b' + word + '\\b', 'gi');
      const matches = lowerText.match(regex);
      if (matches) {
        positiveScore += matches.length;
      }
    }

    for (const word of negativeWords) {
      const regex = new RegExp('\\b' + word + '\\b', 'gi');
      const matches = lowerText.match(regex);
      if (matches) {
        negativeScore += matches.length;
      }
    }

    let sentiment;
    let score;

    if (positiveScore > negativeScore) {
      sentiment = 'positive';
      score = 0.5 + Math.min(0.49, (positiveScore * 0.05));
    } else if (negativeScore > positiveScore) {
      sentiment = 'negative';
      score = 0.5 + Math.min(0.49, (negativeScore * 0.05));
    } else {
      sentiment = 'neutral';
      score = 0.5;
    }

    return { sentiment, score, comparative: score };
  }
}

export default new SentimentService();
