  $(document).ready(function(){
    $('ul.tabs').tabs();
    // $('#query').on('input', function(e){
    //   var data = e.target.value;
    //   $.ajax({
    //     url:'/search/' + data,
    //     type: 'GET',
    //     dataType: 'json',
    //     success: function(result){
    //       console.log(result)
    //     }
    //   })
    // })
    $("#query").on("input", function(event) {
      if (event.target.value.length > 3) {
        $.ajax({
          url: "/search/" + event.target.value,
          type: "GET",
          dataType: "json",
          success: function(data) {
            if (data) {
              document.getElementById("locationCollection").innerHTML = "";
              data.forEach(function(result) {
                document.getElementById(
                  "locationCollection"
                ).innerHTML += `<a href="/student/${result._id}" class="collection-item">${result.name} -- ${result.sponsor}</a>`;
              });
            } else document.getElementById("locationCollection").innerHTML = "";
          }
        });
      } else document.getElementById("locationCollection").innerHTML = "";
    });
  });