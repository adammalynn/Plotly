function buildMetadata(sample) {
  
  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var url="/metadata/" + sample;

  var metadata_sample = d3.json(url).then(function(data) {
    console.log(data);
  
    // Use d3 to select the panel with id of `#sample-metadata`
  
    var metadata_id= d3.select("#sample-metadata");


    // Use `.html("") to clear any existing metadata
    metadata_id.html(" ");
    
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    Object.entries(data).forEach (([key, value]) => {
      var cell = metadata_id.append("p");
      cell.text(key + ":   " + value);
    });
  });
  
    

    // //BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {
  console.log(sample);
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  // d3.json("/samples/" + sample).then(function(data){
    d3.json(`/samples/${sample}`).then((data) => {
      console.log(data);
    
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    // To sort for top 10 using sorting method for more than one array

    
    // declare as variables 
    var sortvalues = data.sample_values;
    var sortlabels = data.otu_ids;
    var sortcontents = data.otu_labels;

    //1) combine the arrays:
    var list = [];
    for (var j = 0; j < sortlabels.length; j++) 
    list.push({'ids': sortlabels[j], 'values': sortvalues[j], 'contents': sortcontents[j]});
    console.log(list);
    //2) sort:
    list.sort(function(a, b) {
    return ((a.values > b.values) ? 1 : ((b.values == a.values) ? 1 : 0));
    // return ((a.values < b.values) ? -1 : ((a.values == b.values) ? 0 : 1));
    //Sort could be modified to, for example, sort on the age 
    // if the name is the same.
    });
    console.log(list);
    //3) separate them back out:
    for (var k = 0; k < list.length; k++) {
    sortlabels[k] = list[k].ids;
    sortvalues[k] = list[k].values;
    sortcontents[k] = list[k].contents;
    }

    
    // slice the data 
    const pie_value = sortvalues.slice(0,10);
    const pie_label = sortlabels.slice(0,10);
    const pie_content = sortcontents.slice(0,10);

    console.log("pie_value " + pie_value);
    console.log("pie_label " + pie_label);
    console.log("pie_content " + pie_content); 

    var pieData = [
      {
        values: pie_value,
        labels: pie_label,
        hovertext: pie_content,
        hoverinfo: "hovertext",
        type: "pie"
      }
    ];
 
    var pieLayout = {
      margin: { t: 20, l: 20 },
      
    };
 
    Plotly.plot("pie", pieData, pieLayout);


  // @TODO: Build a Bubble Chart using the sample data
  const otu_ids = data.otu_ids;
  const otu_labels = data.otu_labels;
  const sample_values = data.sample_values;

  // Build a Bubble Chart
  var bubbleLayout = {
    margin: { t: 0 },
    hovermode: "closest",
    xaxis: { title: "OTU ID" }
  };
  var bubbleData = [
    {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"
      }
    }
  ];

  Plotly.plot("bubble", bubbleData, bubbleLayout)

});
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")   
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
