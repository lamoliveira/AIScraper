$(document).ready(function () {

      //function to post a note to server
      function sendNote(element) {
        let note = {};
        note.articleId = $(element).attr('data-id'),
          note.title = $('#noteTitleEntry').val().trim();
        note.body = $('#noteBodyEntry').val().trim();
        if (note.title && note.body) {
          $.ajax({
            url: '/notes/createNote',
            type: 'POST',
            data: note,
            success: function (response) {
              showNote(response, note.articleId);
              $('#noteBodyEntry, #noteTitleEntry').val('');
            },
            error: function (error) {
              showErrorModal(error);
            }
          });
        }
      } //end of sendNote function

      //function to post a config to server
      function sendConfig(element) {
        let config = {};
        console.log("sendconfig");
        $("#warningconfigsite").text("");
        config._id = $('#configsiteIdEntry').val().trim();
        console.log("sendconfigId" + config._id);
        config.title = $('#configsiteTitleEntry').val().trim();
        config.url = $('#configsiteUrlEntry').val().trim();
        config.panel = $('#configsitePanelEntry').val().trim();
        config.link = $('#configsiteLinkEntry').val().trim();
        config.ref = $('#configsiteRefEntry').val().trim();
        config.header = $('#configsiteHeaderEntry').val().trim();
        config.summary = $('#configsiteSummaryEntry').val().trim();
        config.img = $('#configsiteImgEntry').val().trim();
        config.imgattr = $('#configsiteImgattrEntry').val().trim();
        config.author = $('#configsiteAuthorEntry').val().trim();
        console.log(config);
        // if ID does not exist create a new config
        if (!config._id) {
          var url = '/configsites/createConfigsite';
          $.ajax({
              url: url,
              type: 'POST',
              data: config,
              success: function (response) {
                  console.log(response);
                  if (response.errmsg) { // test if insert was realized
                    $("#warningconfigsite").text("You can't insert this config. " + response.errmsg); //@@@@ improve error msgs
                    console.log(response.errmsg);
                  } else {
                    $('#configArea').empty();
                    $('.configsiteInput').val('');
                  }
                },
                error: function (error) {
                //  showErrorModal(error);
                $("#warningconfigsite").text(error.errmsg);
                }
              });
          }
          else { // if ID exists update a new config
            var url = '/configsites/updateConfigsite';
            $.ajax({
              url: url,
              type: 'POST',
              data: config,
              success: function (response) {
                if (response.n === 0) { // test if update was realized
                  $("#warningconfigsite").text("You can't update this config");
                } else {
                  $('#configArea').empty();
                  openConfigModal();
                }
              },
              error: function (error) {
                //showErrorModal(error);
                $("#warningconfigsite").text(JSON.stringify(error));
              }
            });
          }
        } //end of send config function

        function openConfigModal() {
          $('#configsiteArea').empty();
          $('.configsiteEntry').val('');

          var url = '/configsites/getConfigsites';
          console.log("url: " + url);

          // get site configurations
          $.ajax({
            url: url,
            type: 'GET',
            success: function (data) {
              $.each(data, function (i, item) {
                showConfig(item, item._id);
              });
              $('#configsiteModal').modal('show');
            },
            error: function (error) {
              showErrorModal(error);
            }
          });
        }

        //function to display error modal on ajax error
        function showErrorModal(error) {
          $('#error').modal('show');
        }


        //function to display notes in notemodal
        function showNote(element, articleId) {
          let $title = $('<p>')
            .text(element.title)
            .addClass('noteTitle');
          let $deleteButton = $('<button>')
            .text('X')
            .addClass('deleteNote');
          let $note = $('<div>')
            .append($deleteButton, $title)
            .attr('data-note-id', element._id)
            .attr('data-article-id', articleId)
            .addClass('note')
            .appendTo('#noteArea');
        } //end of showNote function


        //function to display config in config modal
        function showConfig(element, Id) {
          // console.log("showConfig");
          // console.log(element);
          let $title = $('<p>')
            .text(element.title)
            .addClass('configTitle');
          let $deleteButton = $('<button>')
            .text('X')
            .addClass('deleteConfig');
          let $config = $('<div>')
            .append($deleteButton, $title)
            .attr('data-config-id', element._id)
            .addClass('config')
            .appendTo('#configsiteArea');
        } //end of showConfig function

        //event listener to reload root when user closes modal showing
        //number of scraped articles
        $('#alertModal').on('hide.bs.modal', function (e) {
          window.location.href = '/';
        });

        //click event to scrape new articles
        $('#scrape').on('click', function (e) {
          e.preventDefault();
          var configsiteSelect = $("#configsite");
          var configsiteId = configsiteSelect.val();
          console.log("configsiteidscrape" + configsiteId);
          $.ajax({
            url: '/scrape/newArticles/' + configsiteId,
            //      configsiteSelect: configsiteSelect,
            type: 'GET',
            success: function (response) {
              console.log("sucess: " + response.count);
              $('#numArticles').text(response.count);
            },
            error: function (error) {
              showErrorModal(error);
            },
            complete: function (result) {
              $('#alertModal').modal('show');
            }
          });
        }); //end of #scrape click event

        //click event to save an article
        $(document).on('click', '#saveArticle', function (e) {
          let articleId = $(this).data('id');
          $.ajax({
            url: '/articles/save/' + articleId,
            type: 'GET',
            success: function (response) {
              window.location.href = '/';
            },
            error: function (error) {
              showErrorModal(error);
            }
          });
        }); //end of #saveArticle click event

        //click event to open note modal and populate with notes
        $('.addNote').on('click', function (e) {
          $('#noteArea').empty();
          $('#noteTitleEntry, #noteBodyEntry').val('');
          let id = $(this).data('id');
          $('#submitNote, #noteBodyEntry').attr('data-id', id);
          $.ajax({
            url: '/notes/getNotes/' + id,
            type: 'GET',
            success: function (data) {
              $.each(data.notes, function (i, item) {
                showNote(item, id);
              });
              $('#noteModal').modal('show');
            },
            error: function (error) {
              showErrorModal(error);
            }
          });
        }); //end of .addNote click event


        //click event to open config modal and populate with config
        $('#configsitebutton').on('click', function (e) {
          openConfigModal();
        });


        //click event to create a note
        $('#submitNote').on('click', function (e) {
          e.preventDefault();
          sendNote($(this));
        }); //end of #submitNote click event

        //click event to create a config
        $('#submitConfig').on('click', function (e) {
          console.log("submitconfig");
          e.preventDefault();
          sendConfig($(this));
        }); //end of #submit Config click event

        //keypress event to allow user to submit note with enter key
        $('#noteBodyEntry').on('keypress', function (e) {
          if (e.keyCode === 13) {
            sendNote($(this));
          }
        }); //end of #noteBodyEntry keypress(enter) event

        //click event to delete an article from savedArticles
        $('.deleteArticle').on('click', function (e) {
          e.preventDefault();
          let id = $(this).data('id');
          $.ajax({
            url: '/articles/deleteArticle/' + id,
            type: 'DELETE',
            success: function (response) {
              window.location.href = '/articles/viewSaved';
            },
            error: function (error) {
              showErrorModal(error);
            }
          });
        }); //end of .deleteArticle click event

        //click event to delete a note from a saved article
        $(document).on('click', '.deleteNote', function (e) {
          e.stopPropagation();
          let thisItem = $(this);
          let ids = {
            noteId: $(this).parent().data('note-id'),
            articleId: $(this).parent().data('article-id')
          };

          $.ajax({
            url: '/notes/deleteNote',
            type: 'POST',
            data: ids,
            success: function (response) {
              thisItem.parent().remove();
            },
            error: function (error) {
              showErrorModal(error);
            }
          });
        }); //end of .deleteNote click event

        //click event to delete a config 
        $(document).on('click', '.deleteConfig', function (e) {
          e.stopPropagation();
          $("#warningconfigsite").text("");
          let thisItem = $(this);
          let id = $(this).parent().data('config-id');
          console.log("iddelete:" + id)
          $.ajax({
            url: '/configsites/deleteConfigsite',
            data: {
              "id": id
            },
            type: 'POST',
            //data: id,
            success: function (response) {
              if (response.n === 0) { // test if delete was realized
                $("#warningconfigsite").text("You can't delete this config");
              } else {
                thisItem.parent().remove();
              }
            },
            error: function (error) {
              showErrorModal(error);
              $("#warningconfigsite").text(JSON.stringify(error));
            }
          });
        }); //end of .deleteNote click event

        //click event to retrieve the title and body of a single note
        //and populate the note modal inputs with it
        $(document).on('click', '.note', function (e) {
          e.stopPropagation();
          var id = $(this).data('note-id');
          $.ajax({
            url: '/notes/getSingleNote/' + id,
            type: 'GET',
            success: function (note) {
              $('#noteTitleEntry').val(note.title);
              $('#noteBodyEntry').val(note.body);
            },
            error: function (error) {
              console.log(error);
              showErrorModal(error);
            }
          });
        }); //end of .note click event

        //click event to retrieve the fields of a single config
        //and populate the config modal inputs with it
        $(document).on('click', '.config', function (e) {
          e.stopPropagation();
          let id = $(this).data('config-id');
          $.ajax({
            url: '/configsites/getSingleConfigsite/' + id,
            type: 'GET',
            success: function (config) {
              //$('#configsiteId').val(config._id);
              //console.log("configid: " + config._id);
              $("#warningconfigsite").text("");

              $('#configsiteIdEntry').val(config._id);
              $('#configsiteTitleEntry').val(config.title);
              $('#configsiteUrlEntry').val(config.url);
              $('#configsitePanelEntry').val(config.panel);
              $('#configsiteLinkEntry').val(config.link);
              $('#configsiteRefEntry').val(config.ref);
              $('#configsiteHeaderEntry').val(config.header);
              $('#configsiteSummaryEntry').val(config.summary);
              $('#configsiteImgEntry').val(config.img);
              $('#configsiteImgattrEntry').val(config.imgattr);
              $('#configsiteAuthorEntry').val(config.author);
            },
            error: function (error) {
              console.log(error);
              showErrorModal(error);
            }
          });
        }); //end of .note click event
      }); //end of document ready function