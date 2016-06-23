var storiesID=[];
var storiesCount=0;
var storyNo=0;
var pageno=0;
var getURL='topstories';
var functionQueue=[];
var finished=1;
var p1=0,p2;
Date.now = function() { return new Date().getTime(); }

function loadMore(e,element){
  e.preventDefault();
  $('#more').remove();
  pageno++;
  batchLoad(20*pageno,20*pageno+20);
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
    finished=1;
    return;
  }
  if(s>=end){
    pagination(1);
    finished=1;
    return;
  }
  var ids=[];
  console.log(s);
  var e=s+5;
  if(s+5>=storiesCount)
    e=storiesCount;
  for(i=s;i<e;i++)
    ids.push(storiesID[i]);

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
          htmlAddition+='<a class="post-link" href="'+objJSON.url+'" target="_blank">';
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
      if(s==5 && functionQueue.length==0){
        $( "#overlay1" ).fadeOut( "slow");
      }
      batchLoad(s+5,end);
    }
  });
}

function load(t,e){
  e.preventDefault();
  p1=t;
  p2=e;
  $('#top').css({"background-color": "", "color": "#999999"});
  $('#new').css({"background-color": "", "color": "#999999"});
  $('#best').css({"background-color": "", "color": "#999999"});
  $('#show').css({"background-color": "", "color": "#999999"});
  $('#jobs').css({"background-color": "", "color": "#999999"});
  $('#'+e.target.id).css({"background-color": "#fff", "color": "black"});
  $('#content-table').empty();
  $( '#more' ).remove();
  $( "#overlay1" ).fadeIn( "slow");
  functionQueue.push(loadPage);
}
function loadPage(type,e){
  if(type===1){
    getURL='/'+e.target.id+'stories';
    storyNo=0;
  }
  else{
    $('#top').css({"background-color": "#fff", "color": "black"});
    getURL='/topstories';
  }
  $.get(getURL, function(data, status){
    if(status=="success")
    {
      storiesID=JSON.parse(data);
      storiesCount=storiesID.length;
      console.log(storiesCount);
      batchLoad(0,20);
    }
  });
}
$( document ).ready(function() {
  $("#menu-toggle").fadeOut("fast");
  functionQueue.push(loadPage);
  setInterval(function(){
    if(finished==1){
      if(functionQueue.length!=0){
        finished=0;
        (functionQueue.shift())(p1,p2);
      }
    }
  }, 100);
  $("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#menu-toggle").fadeOut("slow");
    $("#menu-toggle1").fadeIn("fast");
    $("#wrapper").toggleClass("toggled");
  });
  $("#menu-toggle1").click(function(e) {
    e.preventDefault();
    $("#menu-toggle").fadeIn("slow");
    $("#menu-toggle1").fadeOut("fast");
    $("#wrapper").toggleClass("toggled");
  });
});
