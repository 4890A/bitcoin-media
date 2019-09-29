import os
import pandas as pd
from flask import Flask, jsonify, render_template
from flask_assets import Environment, Bundle
from tinydb import TinyDB, Query

app = Flask(__name__)

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
