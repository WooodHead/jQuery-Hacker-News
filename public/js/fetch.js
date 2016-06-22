var topStoriesID=[];
var storyNo=0;
function doneLoading(){
  $( "#overlay" ).fadeOut( "slow", function() {
    // Animation complete.
  });
}
function batchLoad(s){
  if(s==6){
    return;
  }
  var ids=[];
  for(i=s;i<s+6;i++)
    ids.push(topStoriesID[i]);

  $.post("/loadStories",{ids:ids},function(data, status){
    var htmlAddition='';
    data.forEach(function(obj){
      var objJSON=JSON.parse(obj);
      var masterUrl=objJSON.url.split("/")[2];
      storyNo++;
      htmlAddition+='<div class="post col-xs-12 col-sm-6 col-md-6 col-md-offset-3">';
      htmlAddition+='<div class="post-content"><div class="sno">'+storyNo+'.&nbsp;&nbsp;&nbsp;</div>';
      htmlAddition+='<div class="content"><div class="post-title">';
      htmlAddition+='<a id="post-link" data-toggle="modal" href="#myModal">'+objJSON.title+'</a>';
      htmlAddition+='</div>';
      htmlAddition+='<div class="master-url">';
      htmlAddition+="("+masterUrl+")";
      htmlAddition+='</div>';
      htmlAddition+='<div class="post-author-name">';
      htmlAddition+=objJSON.score+" points ";
      htmlAddition+='by '+objJSON.by;
      htmlAddition+='</div></div></div></div>';
    });
    $('span').append(htmlAddition);
    if(s==1)
      doneLoading();
    batchLoad(s+1);
  });
}
$( document ).ready(function() {
  $.get("/topstories", function(data, status){
    topStoriesID=JSON.parse(data);
    batchLoad(0);
  });
});
