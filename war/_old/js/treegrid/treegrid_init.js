// Called when the page is loaded
function drawTreeGrid() {
  var data = [
    {
      "firstname": "John",
      "lastname": "Smith",
      "age": 15,
      "class": "B10",
      "courses": [
        {
          "course": "physics", 
          "grade": "B", 
          "courses": [
            {"test": "test 1", "grade": "A"},
            {"test": "test 2", "grade": "B"},
            {"test": "final exam", "grade": "B"}
          ]
        },
        {"course": "maths", "grade": "C"},
        {"course": "economy", "grade": "B"}
      ]
    },
    {
      "firstname": "Susan",
      "lastname": "Brown",
      "age": 16,
      "class": "B10"
    },
    {
      "firstname": "David",
      "lastname": "Harris",
      "age": 14,
      "class": "B10",
      "courses": [
        {"course": "economy", "grade": "A"},
        {"course": "maths", "grade": "D"}
      ]           
    }
  ];
  var data2 = [
    {
      "firstname": "John2",
      "lastname": "Smith",
      "age": 15,
      "class": "B10",
      "courses": [
        {
          "course": "physics", 
          "grade": "B", 
          "courses": [
            {"test": "test 1", "grade": "A"},
            {"test": "test 2", "grade": "B"},
            {"test": "final exam", "grade": "B"}
          ]
        },
        {"course": "maths", "grade": "C"},
        {"course": "economy", "grade": "B"}
      ]
    },
    {
      "firstname": "Susan",
      "lastname": "Brown",
      "age": 16,
      "class": "B10"
    },
    {
      "firstname": "David",
      "lastname": "Harris",
      "age": 14,
      "class": "B10",
      "courses": [
        {"course": "economy", "grade": "A"},
        {"course": "maths", "grade": "D"}
      ]           
    }
  ];
  
  // specify options
  var options = {
    'width': '100%',
    'height': '200px'
  };

  // Instantiate our treegrid object.
  var container = document.getElementById('mytreegrid');
  var container2 = document.getElementById('mytreegrid2');
  var treegrid = new links.TreeGrid(container, options);
  var treegrid2 = new links.TreeGrid(container2, options);

  // Draw our treegrid with the created data and options 
  treegrid.draw(data);  
  treegrid2.draw(data2);        
}