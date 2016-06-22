var topStoriesID=[];
var storiesCount=0;
var storyNo=0;
var pageno=0;
Date.now = function() { return new Date().getTime(); }

function showModal(e,element){
  e.preventDefault();
  var url=element.children[0].innerHTML;
  console.log(url);
  var iframe='<iframe src="'+url+'" style="width: 100%; height:75%;"></iframe>';
  $('.modal-body').html(iframe);
  $('#myModal').modal('show');
  return false;
}

function loadMore(e,element){
  e.preventDefault();
  $('#more').remove();
  pageno++;
  batchLoad(30*pageno,30*pageno+30);
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

function pagination(type){
  if(type==1)
    var htmladd='<center id="more"><a href="#" onclick="loadMore(event,this)">More...</a></center>';
  if(type==2)
    var htmladd='<center id="more">No More...</center>';
  $('#page-content-wrapper').append(htmladd);
}
function batchLoad(s,end){
  if(s>=storiesCount){
    pagination(2);
    return;
  }
  if(s>=end){
    pagination(1);
    return;
  }
  var ids=[];
  console.log(s);
  var e=s+6;
  if(s+6>=storiesCount)
    e=storiesCount;
  for(i=s;i<e;i++)
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
      $('tbody').append(htmlAddition);
      if(s==6){
        $( "#overlay" ).fadeOut( "slow", function() {
          // Animation complete.
        });
      }
      batchLoad(s+6,end);
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
      batchLoad(0,30);
    }
  });
});
