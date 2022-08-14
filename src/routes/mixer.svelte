<script lang="ts">
import type { IArtist } from "$lib/database";
import { onMount } from "svelte";
import Downloads from "./exhibition/downloads.svelte";

    


    export let earAuthorList: IArtist[] = [];

    let messageElem: HTMLDivElement;
    let selected: string;
    let isRecording: boolean = false;
    let mode: string = 'toggle';
    let radioToggle: HTMLInputElement;
    let radioTrigger: HTMLInputElement;
    let radioGate: HTMLInputElement;
    let radioMenu: HTMLInputElement;
    let KEYS: [number,string][] = [];

    function setMessage(message: string, backgroundColor?: string) {
        messageElem.innerHTML = `<p>${message}</p>`;
        if (backgroundColor) {
            messageElem.style.setProperty('background-color', backgroundColor);
        }
    }
    
    function PlayPiece(id?: string) {
        id = id || selected;
        let span: HTMLSpanElement = document.getElementById(`button-${id}`)!;
        if (span.classList.contains('on')) {
            changeState(selected, 'off');
        }
        changeState(selected, 'on');
    }
    (globalThis as any).PlayPiece = PlayPiece;

    function AssignKey() {
        setMessage('Please press a key.', 'lightblue');
        isRecording = true;
    }
    (globalThis as any).AssignKey = AssignKey;

    function StopPiece() {
        changeState(selected, 'off');
    }
    (globalThis as any).StopPiece = StopPiece;

    function Download() {
        document.location.href = `/documents/Ear/${selected}.flac`;
    }
    (globalThis as any).Download = Download;

    function changeState(name: string, state: string) {
        let span: HTMLSpanElement = document.getElementById(`button-${name}`)!;
        let audio: HTMLAudioElement = document.getElementById(`audio-${name}`) as any;
        switch (state) {
            case 'on': {
                span.classList.add('on');
                audio.play();
                break;
            }
            case 'off': {
                span.classList.remove('on');
                audio.pause();
                break;
            }
        }
        // NOTE: we don't preload files here so case"loading" and case"loaded"
        // are unnecessary.
    }

    function keyPress(name: string, mode: string, e: MouseEvent|KeyboardEvent) {
        console.log(`keypres`, name, mode, e);
        switch (mode) {
            case 'menu': {
                selected = name;
                let span: HTMLSpanElement = document.getElementById(`button-${name}`)!;
                // NOTE: in the original code showMenu is a piece of code that creates a circular
                // menu around the event position.
                (globalThis as any).showMenu(
                    [
                        ["Play", "PlayPiece()", null],
                        ["Stop", "StopPiece()", null],
                        ["Download", "Download()", null],
                        ["Assign Key", "AssignKey()", null],
                    ],
                    e
                );
                break;
            }
            case 'toggle': {
                let span: HTMLSpanElement = document.getElementById(`button-${name}`)!;
                changeState(name, span.classList.contains('on')? 'off' : 'on');
                break;
            }
            case 'trigger': {
                changeState(name, 'off');
                changeState(name, 'on');
                break;
            }
            case 'gate': {
                changeState(name, 'off');
                changeState(name, 'on');
                break;
            }
        }
    }

    function keyRelease(name: string, mode: string, e: MouseEvent|KeyboardEvent) {
        switch (mode) {
            case 'menu': {

                break;
            }
            case 'toggle': {
                break;
            }
            case 'trigger': {
                break;
            }
            case 'gate': {
                changeState(name, 'off');
            }
        }
    }

    function handlePaused(name: string) {
        (document.getElementById(`audio-${name}`) as HTMLAudioElement).currentTime = 0;
    }

    onMount(() => {
        setMessage('Please play these 8-second audio loops into infinite audio collages.');

        document.addEventListener('keydown', (e) => {
            let key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
            switch (key) {
                case 49: {
                    radioTrigger.checked = true;
                    mode = 'trigger';
                    break;
                }
                case 50: {
                    radioGate.checked = true;
                    mode = 'gate';
                    break;
                }
                case 51: {
                    radioMenu.checked = true;
                    mode = 'menu';
                    break;
                }

            }
            for (let i = 0; i < KEYS.length; i++) {
                if (KEYS[i][0] === key) {
                    keyPress(KEYS[i][1], mode, e);
                }
            }
        });

        document.addEventListener('keyup', (e) => {
            let key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
            if (key === 49 || key === 50 || key === 51) {
                radioToggle.checked = true;
                mode = 'toggle';
            }
            for (let i = 0; i < KEYS.length; i++) {
                keyRelease(KEYS[i][1], mode, e);
            }
            if (isRecording) {
                KEYS.push([key, selected]);
                isRecording = false;
                setMessage(`You assigned ${selected} to keycode: ${key}`, 'lightgreen');
            }
        });


    })
</script>


<svelte:head>
	<!-- <script type='text/javascript' src='/media/jquery-1.2.6.min.js'></script> -->
	<!-- <script type='text/javascript' src='/media/jquery.form.js'></script> -->
	<!-- <script type='text/javascript' src='/media/minimixer.js'></script> -->
	<script type='text/javascript' src='/media/menu.js'></script>
    <style>
        body{font-family:Courier New, courier; font-size:13px;}
        html{height:110%;}
        
        img{border:0px;}
        #stage{visibility:hidden;}
        #bank{margin:auto;width:60%;line-height:40px;text-align:center;line-height:45px;}
        #bank .set {float:left;clear:right;margin:0 20px 0 0;}
        .board{line-height:40px;width:90%;float:left;}
        #bank a:link, #bank a:visited {text-decoration:none;}
        .board .channel{background-color:yellow;padding:10px;width:50px;margin:0 5px 0 5px;float:left;}
        .audio{background-image:url('/media/b_loading.png'); background-repeat:no-repeat;padding:11px     14px;color:#333;color:#777;}
        .audio.on{background-image:url('/media/b_on.png') !important;}    
        .audio.loading{}    
        .audio.loaded{background-image:url('/media/b_off.png');}
        
        hr{clear:both;}
        #button input{}
        .keycode {color:green;}
        
        #message{position:relative;top:0;left:0;background-color:lightgreen;}
        
        #log {visibility:hidden;position:absolute;height:50%;top:25%;left:0px;opacity:0.5;overflow:auto;}
        .cmd-wrap {position:absolute;visibility:hidden;border:5px solid red}
        .cmd {position:absolute;top:-50%;left:-50%;visibility:visible;background-color:#bbb;padding:1em     1em}
        .cmd.active {color:#fff;background-color:lightgreen;}    
        div.menu {background-color:rgba(255,255,255,0)}    
        .menu.downlevel {opacity:0.5}
        #tests {position:absolute;top:50%;width:90%;text-align:center}
        #tests > span {margin:10em}
        pre {display:none}
    </style>

</svelte:head>

<ul id="log"><li>Log:</li></ul>

<div id="bank">

<a href="/exhibition"><img src='/media/nav/logo1.png' alt="into infinity logo"></a>
<h1>INTO INFINITY "AUDIO MEGA-MIXER"</h1>


<div id="message" bind:this={messageElem}>
</div>


{#each earAuthorList as earAuthor}
    {earAuthor.Name}
    {#each earAuthor.Ear as ear, i}
        <!-- svelte-ignore a11y-missing-attribute -->
        <a title={`${earAuthor.Name} : ${i+1}`}
            style="cursor:pointer; user-select:none;"
            on:mousedown={(e) => {
                let name = ear.split('.')[0];
                keyPress(name, mode, e)
            }}
            on:click={(e) => {
                let name = ear.split('.')[0];
                keyRelease(name, mode, e)
            }}
        >
            <span id={`button-${ear.split('.')[0]}`} class="audio loading" alt={ear}>{i+1}</span>
        </a>
        <audio
            id={`audio-${ear.split('.')[0]}`}
            src={`/documents/Ear/${ear}`}
            style="display:none;"
            on:pause={() => handlePaused(ear.split('.')[0])}
            loop
        />
    {/each}
{/each}

<p>
<!--Name: <input type="text"/>
<input type="submit" value="SAVE"/>

Embed Code: <input type="text" value="<div><object..."/>

Preset URL: <a href="#">http://...</a>
-->
</p>

<form id="button">
Mode: <input type="radio" name="mode" value="toggle" checked on:change={() => { console.log("!"); mode='toggle';}} bind:this={radioToggle}/>Toggle Play/Stop | <input type="radio" name="mode" value="trigger" on:change={() => mode='trigger'} bind:this={radioTrigger}/>Trigger <span class="keycode">(Hold 1)</span> | <input type="radio" name="mode" value="gate" on:change={() => mode='gate'} bind:this={radioGate} />Gate <span class="keycode">(Hold 2)</span> | <input type="radio" name="mode" value="menu" on:change={() => mode='menu'}  bind:this={radioMenu} />Menu <span class="keycode">(Hold 3)</span>
</form>


<p>
<a href="/exhibition/about">ABOUT</a> | <a href="/exhibition/artists">ARTIST INDEX</a> | <a href="/exhibition/downloads">DOWNLOADS</a> | <a href="/exhibition">EXHIBITION</a>  | <a href='/nesting'>SLIDESHOW</a>
</p>


<p>
  <a href="http://dublab.com/"><img src="/media/d1.png"></a> 
  <a href="http://creativecommons.org/"><img src="/media/cc1.png"></a><br/>
  <a rel="license" href="http://creativecommons.org/licenses/by-nc/3.0/">
     <img alt="Creative Commons License" style="border-width:0" src="http://i.creativecommons.org/l/by-nc/3.0/80x15.png" />
  </a>
</p>




</div>

<!--<p>
##  <a href="/exhibition"><img src='/images/nav/logo1.png' style='float:left;'></a>
##  #set $artist_url = "/exhibition/" + urlize($ear.author)
##  <a href="$artist_url">$ear.author</a><br/>
##  $ear.location<br/>
##  <object type="application/x-shockwave-flash" data="/documents/$ear.swf_file_path" width="10" height="10" id=""></object><br/>
##  Download: <a href="/documents/$ear.file_path">Ear</a>
##</p>

<p>
DOWNLOAD ALL BANK IN HI-FIDELITY (150MB)
</p>
<hr/>


-->

<div id="stage">
<img src="/media/b_on.png"><img src="/media/b_off.png"><img src="/media/b_loading.png">
</div>


