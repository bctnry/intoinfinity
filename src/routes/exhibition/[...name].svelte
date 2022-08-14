<script lang="ts">
    export let eye: { author: string, location: string, fileName: string };
    export let ear: { author: string, location: string, fileName: string };
    export let type: string;

</script>

<svelte:head>
    <style>
    body{font-family:Courier New, courier; font-size:13px;}
    img{border:0px;}
    </style>
</svelte:head>

<div style='width:800px;margin:auto;'>
    <div style='width:100%;'>
      <div style='text-align:right;float:left;width:335px;padding:0 10px 0 0;'>
        <!-- <a href={`/exhibition/${encodeURIComponent(eye.author)}?type=eye`}>{eye.author}</a><br/> -->
        <a href={type==='Eye'?'javascript:window.location.reload(true)':`/exhibition/${encodeURIComponent(eye.author)}?type=eye`}>{eye.author}</a><br/>
          {eye.location}<br/>
      </div>
      <a href="/exhibition"><img src='/media/nav/logo1.png' style='float:left;'></a>
      <div style='text-align:left;float:left;width:335px; padding:0 0 0 10px;'>
        <a href={type==='Ear'?'javascript:window.location.reload(true)':`/exhibition/${encodeURIComponent(ear.author)}?type=ear`}>{ear.author}</a><br/>
        {ear.location}<br/>
        <!--<a href="http://$ear.url">$ear.url</a>-->
      </div>
      <div style='width=100%;margin:auto;text-align:center;padding:55px 0 0 0;'>
          <!--
           #try
               #set $artist_url = "/exhibition/%s" % urlize($artist)
           #except
               #set $artist_url = False
           #end try
          #if $artist_url
               More with <a href="$artist_url">$artist</a>
          #end if
          -->
        </div>  
    </div>
  


    <div style='margin:auto;width:600px;padding-top:15px;'>
      <img src={eye.fileName} usemap="#eye" style="width:600px;" alt="Eye art piece">
        <map name="eye">
          <area shape="circle" href="/exhibition" coords="299,299,300" />
        </map>
    </div>

    

    <div style='margin:auto;width:600px;padding-top:15px;text-align:center'>
      <audio
          controls
          autoplay
          loop
          src={ear.fileName}>
              Your browser does not support the
              <code>audio</code> element.
      </audio>
    </div>
<object width='1' height='1'><param name='movie' value='/documents/$ear.swf_file_path'><embed src='/documents/$ear.swf_file_path' type='application/x-shockwave-flash' width='1' height='1'></object>


  <div style="padding:20px 0 5px 0; width:800px; text-align:center;">Download: <a href={eye.fileName}>Eye</a> | <a href={ear.fileName}>Ear</a></div>

<div style="padding-top:5px;width:800px;text-align:center;text-transform:uppercase;"><a href='/exhibition/artists'>Artist Index</a> | <a href='/exhibition/downloads'>Downloads</a> | <a href='/exhibition/about'>About</a> | <a href='/mixer'>Mixer</a> | <a href='/nesting'>Slideshow</a></div>

<div style="margin:auto;width:500px;text-align:center;padding:15px 0 0 0;"><a href="http://dublab.com/"><img src="/media/d1.png"></a> <a href="http://creativecommons.org/"><img src="/media/cc1.png"></a></div>

<div style="margin:auto;width:500px;text-align:center;padding:15px 0 0 0;"><a rel="license" href="http://creativecommons.org/licenses/by-nc/3.0/"><img alt="Creative Commons License" style="border-width:0" src="http://i.creativecommons.org/l/by-nc/3.0/80x15.png" /></a></div>

<div style="margin:auto;width:500px;text-align:center;padding:15px 0 0 0;">Exhibition program rewritten by <a href="https://sebastian.graphics">Sebastian René Higgins</a></div>

</div>



