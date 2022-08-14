var SELECTED;
var KEYS = new Array();
var RECORD = null;
var TOTAL = null;
var LOADED = null;

function Play(id){
    if(id){
	var span = jQuery("#button-"+id);
    }else{
	var span = jQuery("#button-"+SELECTED);
    }
    
    if (span.hasClass("on")){
	changeState(SELECTED, "off");
	changeState(SELECTED, "on");
    } else {
	changeState(SELECTED, "on");
    }
}

function AssignKey(){
    jQuery("#message").css("background-color","lightblue");
    jQuery("#message").html("<p>Please press a key.</p>");
    RECORD = true;
}

function Stop(){
    changeState(SELECTED, "off");
}

function Download(){
    var url = jQuery("#button-"+SELECTED).attr("alt");
    document.location.href = "/documents/"+url;
}


function changeState(filename, state){
    var span = jQuery("#button-"+filename);
    switch(state){
    case "on":
	span.addClass("on");
	jQuery("#stage").append("<div id='sound-"+filename+"'><audio src='/documents/Eye/"+filename+"'></audio></div>");
	break;
    case "off":
	span.removeClass("on");
	jQuery("#stage > #sound-"+filename).remove();
	break;
    case "loading":
	span.addClass("loading");
		changeState(filename, "loaded");
		LOADED += 1;
		if (LOADED >= TOTAL){
		       jQuery("#message").css("background-color","lightgreen");
		    jQuery("#message").html("<p>Please play these 8-second audio loops into infinite audio collages.</p>");
		};
	break;
    case "loaded":
	span.removeClass("loading");
	span.addClass("loaded");
	break;
    }
}

function keyPress(filename, mode, e){
    switch(mode){
    case "menu":
	SELECTED = filename;
	var span = jQuery("#button-"+filename);
	var ahref = span.parent();
	menu = eval('('+document.getElementById('edit').firstChild.data+')');
	showMenu(menu.contents,e);
	break;
    case "toggle":
	var span = jQuery("#button-"+filename);
	if (span.hasClass("on")){
	    changeState(filename, "off");
	} else {
	    changeState(filename, "on");
	}
	break;
    case "trigger":
	changeState(filename, "off");
	changeState(filename, "on");
	break;
    case "gate":
	changeState(filename, "off");
	changeState(filename, "on");
	break;
    }

}

function keyRelease(filename, mode, e){
    switch(mode){
    case "menu":
	var span = jQuery("#button-"+filename);
	var ahref = span.parent();
        ahref.attr("id=''");
	break;
    case "toggle":
	break;
    case "trigger":
	break;
    case "gate":
	changeState(filename, "off");
	break;
    }
	
}

jQuery(document).ready(function(){



    jQuery.getJSON("/json/filenames",{"document_type":"Ear"},
		   function(data){
		       var filenames = data.map((v) => v.Ear).reduce((a, b) => a.concat(b));
		       TOTAL = data.length;
		       jQuery("#message").css("background-color","yellow");
		       jQuery("#message").html("<p>Preloading all 8-second audio loops.</p>");
		       for(i=0,l=data.length;i<l;i++){
			   changeState(filenames[i], "loading");
		       }
		   });

    jQuery("a[ref='audio']").bind("mousedown",
				  function(e) {
				      var mode = jQuery("#button :radio").fieldValue()[0];
				      var url = jQuery(this).attr("href");
				      var filename = url.split("/")[2].replace(".swf","");
				      keyPress(filename, mode, e);
				  });
    jQuery("a[ref='audio']").bind("click",
				  function (e) {
				      var mode = jQuery("#button :radio").fieldValue()[0];
				      var url = jQuery(this).attr("href");
				      var filename = url.split("/")[2].replace(".swf","");
				      keyRelease(filename, mode, e);
				      return false;
				  });
    jQuery(document).keydown(
	function(e){
	    var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;

	    switch(key){
	    case 49:
		jQuery("#button > :radio[value='trigger']").select();
		break;
		
	    case 50:
		jQuery("#button > :radio[value='gate']").select();
		break;

	    case 51:
		jQuery("#button > :radio[value='menu']").select();
		break;

	    }

	    for(var i=0,length=KEYS.length;i<length;i++){
		if(KEYS[i][0]==key){	    
		    var mode = jQuery("#button :radio").fieldValue()[0];
		    keyPress(KEYS[i][1], mode, e)
			};
	    }
	}
    );

    jQuery(document).keyup(
	function(e){

	    var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;

	    if (key == 49 || key == 50 | key == 51) {
		jQuery("#button > :radio[value='toggle']").select();
	    }

	    for(var i=0,length=KEYS.length;i<length;i++){
		if(KEYS[i][0]==key){
		    var mode = jQuery("#button :radio").fieldValue()[0];
		    keyRelease(KEYS[i][1], mode, e)
			};
	    }

	    if (RECORD){
		KEYS.push([key, SELECTED]);
		RECORD=null;
		jQuery("#message").css("background-color","lightgreen");
		jQuery("#message").html("<p>You assigned "+SELECTED+" to keycode: "+key+"</p>");
	    };

	}
    );
 });