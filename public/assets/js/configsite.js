$(document).ready(function () {
  var configsiteSelect = $("#configsite");

  // Getting the authors, and their posts
  getConfigsite();

  
  // A function to get configsites and then render our list of configsites
  function getConfigsite() {
    //$.get("/api/configsites", renderConfigsiteList);
    /*var a = [{
        id:0,
        title: "NYTimes",
        url: 'https://www.nytimes.com/section/us',
        panel: "#latest-panel article.story.theme-summary",
        link: '.story-body>.story-link',
        ref: 'href',
        header: 'h2.headline',
        summary: 'p.summary',
        img: 'img',
        imgattr: "data-img",
        author: 'p.byline'
      },
      { id:1,
        title: "Globo",
        url: 'http://www.globo.com',
        panel: "div.hui-premium",
        link: 'a.hui-premium__link',
        ref: 'href',
        header: 'p.hui-premium__title',
        summary: '',
        img: 'a.hui-premium__link',
        imgattr: "data-img",
        author: ''
      }
    ];*/
   var url = '/configsites/getConfigsites';
    console.log("url: " + url);

    //$('.configsiteEntry').attr('data-id', id);
    $.ajax({
      url: url,
      type: 'GET',
      success: function (data) {
        //console.log(data);

        renderConfigsiteList(data);
        configsiteSelect.val("5ba27a466f39871c5c8f8ca3").attr("selected", true);

        //$('#configsiteModal').modal('show');
      },
      error: function (error) {
        showErrorModal(error);
      }
    });
  }
  // Function to either render a list of configsites, or if there are none, direct the user to the page
  // to create an configsite first
  function renderConfigsiteList(data) {

    var rowsToAdd = [];
    for (var i = 0; i < data.length; i++) {
      rowsToAdd.push(createConfigsiteRow(data[i]));
    }
    configsiteSelect.empty();
    console.log(rowsToAdd);
    console.log(configsiteSelect);
    configsiteSelect.append(rowsToAdd);
    configsiteSelect.val(configsite._id);
  }

  // Creates the author options in the dropdown
  function createConfigsiteRow(configsite) {
    var listOption = $("<option>");
    listOption.attr("value", configsite._id);
    listOption.text(configsite.title);
    return listOption;
  }

});