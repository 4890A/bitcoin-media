d3.json("../data/articles.json", data1 => {
  d3.json("http://127.0.0.1:5000/btcquotes", data2 => {
    console.log(data1)
    console.log(data2)
    var btcValues = data2.map(quote => ({
      "x": quote.unix,
      "y": quote.average
    })).reverse();
    var linear = everpolate.linear
    console.log(linear(2.34345, [1,2,3],[4,5,6]))
  })
})   