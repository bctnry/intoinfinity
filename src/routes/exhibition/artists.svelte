<script lang="ts">
    // export let status: number;
    export let data: any;
</script>


<svelte:head>
<style>
body{font-family:Courier New, courier; font-size:13px;}img{border:0px;}
/*.uppercase{text-transform:uppercase}*/
</style>
</svelte:head>

<!-- 
World icon is based on the silk icon 
by FAMFAMFAM http://www.famfamfam.com/lab/icons/silk/ 
-->

<div style="width:820px; margin:auto; text-align:center;">
<a href="/exhibition"><img src='/media/nav/logo1.png' alt="into infinity logo"></a>
<h1>"INTO INFINITY" ARTIST INDEX</h1>


<div style="text-align:left;width:390px;float:left;padding:10px;line-height:20px;">
"EYES"
<p>
    {#each data.eyes as eye}
        <a href={`/exhibition/${encodeURIComponent(eye[0])}?type=eye`} class="uppercase">{eye[0]}</a> - {eye[1].Location} <a href={`http://${eye[1].Url}`}>URL</a><br/>
        
    {/each}
</p>
</div>

<div style="text-align:left;width:390px;float:left;padding:10px;line-height:20px;">
"EARS"
<p>
    {#each data.ears as ear}
        <a href={`/exhibition/${encodeURIComponent(ear[0])}?type=ear`} class="uppercase">{ear[0]}</a> - {ear[1].Location} <a href={`http://${ear[1].Url}`}>URL</a><br/>
        
    {/each}
</p>
</div>
<br style="clear:both;"/>
</div>

<div style="margin:auto;padding-top:5px;width:500px;text-align:center;text-transform:uppercase;"><a href='/exhibition/downloads'>Downloads</a> | <a href='/exhibition/about'>About</a> | <a href='/exhibition'>Exhibition</a>  | <a href='/mixer'>Mixer</a> | <a href='/nesting'>SLIDESHOW</a></div>

<div style="margin:auto;width:500px;text-align:center;padding:15px 0 0 0;"><a href="http://dublab.com/"><img src="/media/d1.png"></a> <a href="http://creativecommons.org/"><img src="/media/cc1.png"></a><p></p></div>

<div style="margin:auto;width:500px;text-align:center;padding:15px 0 0 0;"><a rel="license" href="http://creativecommons.org/licenses/by-nc/3.0/"><img alt="Creative Commons License" style="border-width:0" src="http://i.creativecommons.org/l/by-nc/3.0/80x15.png" /></a></div>


<div style="margin:auto;width:500px;text-align:center;padding:15px 0 0 0;">Exhibition program rewritten by <a href="https://sebastian.graphics">Sebastian René Higgins</a></div>
