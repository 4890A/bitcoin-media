import os

import pandas as pd
import numpy as np
import pprint

import re 
import tweepy 
from tweepy import OAuthHandler 
from textblob import TextBlob 
import json

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

#################################################
# Database Setup
#################################################

#app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', '') or "sqlite:///db/bellybutton.sqlite"

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/project2db.sqlite"

db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)

# Save references to each table for tweet data
Articles = Base.classes.articles1
Tweets = Base.classes.tweets1
Tweets_loc = Base.classes.tweets_loc1
Sentiment = Base.classes.sentiment1

#Tables for Bitcoin Gold and SP index prices
BTC_Quotes = Base.classes.BTC_Quotes1
GLD_Quotes = Base.classes.GLD_Quotes1
SPX_Quotes = Base.classes.SPX_Quotes1

#Table with coordinates for world countries
country_coordinate = Base.classes.country_coordinate1

@app.route("/")
def index():
    """Return the homepage."""
    # return render_template("index1.html")
    return render_template("sentimenttweet.html")
 

#Route to present World Heat Map where tweets occurred is rendered
@app.route("/tweetmap")
def tweetmap():
    return render_template("maptweets.html")


#
@app.route("/tweetsloc")
def tweetsloc():
    """Return a list with location for tweets and sentiment values"""

    # Use Pandas to perform the sql query
    stmt = db.session.query(Tweets_loc).statement
    df = pd.read_sql_query(stmt, db.session.bind)

    latitude = list(df['latitude'])
    longitude = list(df['longitude'])

    locations = []

    for i in range(0, len(latitude)):
        locations.append([latitude[i], longitude[i]])

    # Return a dictionary with tweets location and sentiment
    return jsonify(locations)

#Get the number of positive, negative and neutral tweets read
@app.route("/tweetsent")
def tweetssent():
    """Return a dictionary with split of tweets by type of sentiment (positive, negative & neutral)"""

    # Use Pandas to perform the sql query
    stmt = db.session.query(Sentiment).statement
    df = pd.read_sql_query(stmt, db.session.bind)

    sentiment = {
        "positive" : list(df["positive"]),
        "negative" : list(df["negative"]),
        "neutral" : list(df["neutral"])
    }

    # Return a dictionary with sentiment split
    return jsonify(sentiment)


#Read tweets live - what people are tweeting about BITCOIN now
@app.route("/readtweets")
def readtweets():
    """Read tweets live"""

    # Load twitter credentials from json file
    with open("twitter_credentials.json", "r") as file:
        creds = json.load(file)

    class TwitterClient(object): 
        
        #Generic Twitter Class for sentiment analysis. 
        
        def __init__(self): 
            
            #Class constructor or initialization method. 
            
            # keys and tokens from the Twitter Dev Console 
            consumer_key = creds['CONSUMER_KEY']
            consumer_secret = creds['CONSUMER_SECRET']
            access_token = creds['ACCESS_TOKEN']
            access_token_secret = creds['ACCESS_SECRET']
    
            # attempt authentication 
            try: 
                # create OAuthHandler object 
                self.auth = OAuthHandler(consumer_key, consumer_secret) 
                # set access token and secret 
                self.auth.set_access_token(access_token, access_token_secret) 
                # create tweepy API object to fetch tweets 
                self.api = tweepy.API(self.auth) 
            except: 
                print("Error: Authentication Failed") 
    
        def clean_tweet(self, tweet): 
            
            #Utility function to clean tweet text by removing links, special characters 
            # using simple regex statements. 
            
            return ' '.join(re.sub("(@[A-Za-z0-9]+)|([^0-9A-Za-z \t])|(\w+:\/\/\S+)", " ", tweet).split()) 
    
        def get_tweet_sentiment(self, tweet): 
            
            #Utility function to classify sentiment of passed tweet 
            # using textblob's sentiment method 
            
            # create TextBlob object of passed tweet text 
            analysis = TextBlob(self.clean_tweet(tweet)) 
            # set sentiment 
            if analysis.sentiment.polarity > 0: 
                return 'positive'
            elif analysis.sentiment.polarity == 0: 
                return 'neutral'
            else: 
                return 'negative'
        
        #Get 10 tweets at the time to avoid getting error
        def get_tweets(self, query, count = 10): 
            
            #Main function to fetch tweets and parse them. 
            
            # empty list to store parsed tweets 
            tweets = [] 
    
            try: 
                # call twitter api to fetch tweets 
                fetched_tweets = self.api.search(q = query, count = count, since="2017-04-03") 
    
                # parsing tweets one by one 
                for tweet in fetched_tweets: 
                    # empty dictionary to store required params of a tweet 
                    parsed_tweet = {} 
    
                    # saving text of tweet 
                    parsed_tweet['text'] = tweet.text 
                    # saving sentiment of tweet 
                    parsed_tweet['sentiment'] = self.get_tweet_sentiment(tweet.text) 
    
                    # appending parsed tweet to tweets list 
                    if tweet.retweet_count > 0: 
                        # if tweet has retweets, ensure that it is appended only once 
                        if parsed_tweet not in tweets: 
                            tweets.append(parsed_tweet) 
                    else: 
                        tweets.append(parsed_tweet) 
    
                # return parsed tweets 
                return tweets 
    
            except tweepy.TweepError as e: 
                # print error (if any) 
                print("Error : " + str(e)) 

    # creating object of TwitterClient Class 
    api = TwitterClient() 
    # calling function to get tweets 
    topic = 'Bitcoin'
    tweets = api.get_tweets(query = topic, count = 200) 
  
    # picking positive tweets from tweets 
    ptweets = [tweet for tweet in tweets if tweet['sentiment'] == 'positive'] 

    # percentage of positive tweets 
    pptweets = 100*len(ptweets)/len(tweets) 
    # picking negative tweets from tweets 
    ntweets = [tweet for tweet in tweets if tweet['sentiment'] == 'negative'] 

    neutweets = [tweet for tweet in tweets if tweet['sentiment'] == 'neutral']

    # percentage of negative tweets 
    pntweets = 100*len(ntweets)/len(tweets) 
    # percentage of neutral tweets 

    pneutral = 100 * (len(tweets) - len(ntweets) - len(ptweets))/len(tweets)

    tsentiment = {
        'negative' : pntweets,
        'positve' : pptweets,
        'neutral' : pneutral}

    nsentiment = {
        'negative' : len(ntweets),
        'positve' : len(ptweets),
        'neutral' : len(tweets) - len(ptweets) - len(ntweets)
        }

    tweetsdict = {
        'psentiment': tsentiment,
        'nsentiment' : nsentiment,
        'positive': ptweets,
        'negative': ntweets,
        'neutral' : neutweets,
        'all': tweets
        }

    # Return a list of the column names (sample names)
    return jsonify(tweetsdict)
    #return jsonify(nsentiment)

if __name__ == "__main__":
    app.run()
