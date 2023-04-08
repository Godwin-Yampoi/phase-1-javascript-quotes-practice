$(document).ready(function() {
    const baseUrl = "http://localhost:3000";
  
    // Get all quotes and render them on the page
    $.ajax({
      url: `${baseUrl}/quotes?_embed=likes`,
      method: "GET",
      dataType: "json"
    }).done(function(quotes) {
      renderQuotes(quotes);
    });
  
    // Handle form submission to create a new quote
    $("#new-quote-form").submit(function(event) {
      event.preventDefault();
      const quote = $("#new-quote").val();
      const author = $("#author").val();
      $.ajax({
        url: `${baseUrl}/quotes`,
        method: "POST",
        dataType: "json",
        data: { quote, author }
      }).done(function(quote) {
        renderQuote(quote);
        $("#new-quote-form")[0].reset();
      });
    });
  
    // Handle click event for deleting a quote
    $("#quote-list").on("click", ".btn-danger", function(event) {
      event.preventDefault();
      const quoteId = $(this).closest(".quote-card").data("id");
      $.ajax({
        url: `${baseUrl}/quotes/${quoteId}`,
        method: "DELETE",
        dataType: "json"
      }).done(function() {
        $(`.quote-card[data-id="${quoteId}"]`).remove();
      });
    });
  
    // Handle click event for adding a like to a quote
    $("#quote-list").on("click", ".btn-success", function(event) {
      event.preventDefault();
      const quoteId = $(this).closest(".quote-card").data("id");
      $.ajax({
        url: `${baseUrl}/likes`,
        method: "POST",
        dataType: "json",
        data: { quoteId }
      }).done(function(like) {
        $(`.quote-card[data-id="${quoteId}"] .btn-success span`).text(like.length);
      });
    });
  
    // Handle click event for sorting quotes by author
    let sorted = false;
    $("#sort-btn").on("click", function(event) {
      event.preventDefault();
      if (sorted) {
        $.ajax({
          url: `${baseUrl}/quotes?_sort=id&_embed=likes`,
          method: "GET",
          dataType: "json"
        }).done(function(quotes) {
          renderQuotes(quotes);
          sorted = false;
        });
      } else {
        $.ajax({
          url: `${baseUrl}/quotes?_sort=author&_embed=likes`,
          method: "GET",
          dataType: "json"
        }).done(function(quotes) {
          renderQuotes(quotes);
          sorted = true;
        });
      }
    });
  
    // Render a single quote on the page
    function renderQuote(quote) {
      const $quoteCard = $("<li>", { class: "quote
  