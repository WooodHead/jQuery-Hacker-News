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
      htmlAddition+='<tr class="athing">';
      htmlAddition+='<td align="right" valign="top" class="title">';
      htmlAddition+='<span class="rank">'+storyNo;
      htmlAddition+='.</span>';
      htmlAddition+='</td>';
      htmlAddition+='<td valign="top" class="votelinks">';
      htmlAddition+='<center>';
      htmlAddition+='<div class="votearrow" title="upvote"></div>';
      htmlAddition+='</center>';
      htmlAddition+='</td>';
      htmlAddition+='<td class="title">';
      htmlAddition+=objJSON.title;
      htmlAddition+='<span class="sitebit comhead"> (';
      htmlAddition+=masterUrl;
      htmlAddition+=')</span>';
      htmlAddition+='</td>';
      htmlAddition+='</tr>';
      htmlAddition+='<tr>';
      htmlAddition+='<td colspan="2"></td>';
      htmlAddition+='<td class="subtext">';
      htmlAddition+='<span class="score">';
      htmlAddition+=objJSON.score;
      htmlAddition+=' points | </span> by ';
      htmlAddition+=objJSON.by;
      htmlAddition+=' | <span class="age">';
      htmlAddition+=objJSON.time+' ago</span> | ';
      htmlAddition+=objJSON.descendants+' comments</td>';
      htmlAddition+='</tr>';
      htmlAddition+='<tr class="spacer"></tr>';
    });
    $('tbody').append(htmlAddition);
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
