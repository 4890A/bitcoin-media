import os

import pandas as pd
import numpy as np
import pprint

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

# Save references to each table
Articles = Base.classes.articles1
Tweets = Base.classes.tweets1
Tweets_loc = Base.classes.tweets_loc1
Sentiment = Base.classes.sentiment1

BTC_Quotes = Base.classes.BTC_Quotes1
GLD_Quotes = Base.classes.GLD_Quotes1
SPX_Quotes = Base.classes.SPX_Quotes1

country_coordinate = Base.classes.country_coordinate1

@app.route("/")
def index():
    """Return the homepage."""
    
    return render_template("index.html")
    #return ("HI")


    #stmt = db.session.query(Articles).statement
    #df = pd.read_sql_query(stmt, db.session.bind)
    #return jsonify(list(df['url']))


@app.route("/tweetsloc")
def names():
    """Return a list of sample names."""

    # Use Pandas to perform the sql query
    stmt = db.session.query(Tweets_loc).statement
    df = pd.read_sql_query(stmt, db.session.bind)

    location = {"lat" : list(df['latitude']),
                "lon" : list(df['longitude'])}

    # Return a list of the column names (sample names)
    return jsonify(location)


if __name__ == "__main__":
    app.run()
