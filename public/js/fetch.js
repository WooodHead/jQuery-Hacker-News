var topStoriesID=[];
var storiesCount=0;
var storyNo=0;
Date.now = function() { return new Date().getTime(); }
function loadPage(e,i){
  e.preventDefault();
  batchLoad(0,i-1);
}
function showModal(e,element){
  e.preventDefault();
  var url=element.children[0].innerHTML;
  console.log(url);
  var iframe='<iframe src="'+url+'" style="width: 100%; height:75%;"></iframe>';
  $('.modal-body').html(iframe);
  $('#myModal').modal('show');
  return false;
}
function getTimeDiff(time){
  var now=Date.now()/1000;
  var diff=Math.ceil(now-time);
  if(Math.floor(diff/3600) === 0){
    if(Math.floor(diff/60) === 0){
      return diff+' seconds';
    }
    else {
      return Math.floor(diff/60)+' minutes';
    }
  }
  else{
    return Math.floor(diff/3600)+' hours';
  }
}

function pagination(){
  var htmladd='<center><ul class="pagination">';
  for(var i=1;i<=Math.floor(storiesCount/30);i++)
  {
    if(i==1)
      htmladd+='<li class="active"><a href="#" onclick="loadPage(event,'+i+')">'+i+'</a></li>';
    else {
      htmladd+='<li><a href="#" onclick="loadPage(event,'+i+')">'+i+'</a></li>';
    }
  }
  htmladd+="</ul></center>";
  $('#page-content-wrapper').append(htmladd);
}
function batchLoad(s,p){
  if(s==5 && p==0){
    pagination();
    return;
  }
  var ids=[];
  console.log(s*6+p*30+6);//s*6+p*30
  for(i=s*6+p*30;i<s*6+p*30+6;i++)
    ids.push(topStoriesID[i]);

  $.post("/loadStories",{ids:ids},function(data, status){
    if(status=="success"){
      var htmlAddition='';
      data.forEach(function(obj){
        var objJSON=JSON.parse(obj);
        var time=getTimeDiff(objJSON.time);
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
        if(typeof objJSON.url!== 'undefined'){
          var masterUrl=objJSON.url.split("/")[2];
          htmlAddition+='<a class="post-link" href="#" onclick="showModal(event,this)">';
          htmlAddition+='<div style="display:none;">'+objJSON.url+'</div>';
        }
        htmlAddition+=objJSON.title;
        if(typeof objJSON.url !== 'undefined'){
          htmlAddition+='</a>';
          htmlAddition+='<span> (';
          htmlAddition+=masterUrl;
          htmlAddition+=')</span>';
        }
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
        htmlAddition+=time+' ago</span> | ';
        htmlAddition+=objJSON.descendants+' comments</td>';
        htmlAddition+='</tr>';
        htmlAddition+='<tr class="spacer"></tr>';
      });
      if(p!=1 && s==0)
        $('tbody').empty();
      $('tbody').append(htmlAddition);
      batchLoad(s+1,p);
    }
  });
}
$( document ).ready(function() {
  $("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
  });

  $.get("/topstories", function(data, status){
    if(status=="success")
    {
      topStoriesID=JSON.parse(data);
      storiesCount=topStoriesID.length;
      console.log(storiesCount);
      batchLoad(0,0);
    }
  });
});
