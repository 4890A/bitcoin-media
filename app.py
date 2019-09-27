import os
import pandas as pd
from flask import Flask, jsonify, render_template
from flask_assets import Environment, Bundle
from tinydb import TinyDB, Query

app = Flask(__name__)

# assets = Environment(app)

# bundle_leaf = {
#     "search_js" : Bundle("js/config.js", "js/trendData.js", "js/trend-logic2.js", "js/trend-logic.js", output="gen/packed_search.js"),
#     "search_css" : Bundle("css/style.css", output="gen/packed_search.css"),
#     "search_db" : Bundle("db/google-trend-data.json", output="gen/packed_search.db")
# }

# assets.register(bundle_leaf)

@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")

@app.route("/googletrends")
def googletrends():
    db = TinyDB('google-trend-data.db')
    data = db.all()
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True  )
