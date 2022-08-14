<script lang="ts">
import type { IDocument } from "$lib/database";
import { onMount } from "svelte";


    let elemOne: HTMLImageElement;
    let elemTwo: HTMLImageElement;
    let elemThree: HTMLImageElement;
    let btnPlay: HTMLImageElement;
    let btnPause: HTMLImageElement;

    let eyes: IDocument[] = [];
    let pp: boolean = true;

    let c = 0;

    async function randomEye() {
        await fetch('/json/random?document_type=Eye').then((v) => v.json()).then((v) => {
            eyes.push(v);
            play();
        }).catch(() => {
            randomEye();
        });
    }
    function update(c: number, one: string, two: string, three: string) {
        if (c >= 3) {
            elemOne.setAttribute('src', one);
            elemTwo.setAttribute('src', two);
            elemThree.setAttribute('src', three);
            setTimeout(next, 3500);
        }
    }
    function next() {
        eyes.shift();
        randomEye();
    }

    function play() {
        if (!pp) { return; }
        if (eyes.length === 3) {
            c = 0;
            let one = eyes[2].gallerySizePath!;
            let two = eyes[1].mediumSizePath!;
            let three = eyes[0].smallSizePath!;
            fetch(one).then(() => { c++; update(c, one, two, three); })
            fetch(two).then(() => { c++; update(c, one, two, three); })
            fetch(three).then(() => { c++; update(c, one, two, three); })

        } else {
            randomEye();
        }
    }

    onMount(() => {
        randomEye();
    });

</script>


<svelte:head>
    <style>
        body{font-family:Courier New, courier; font-size:13px;background-color:black;color:white;}
        html{height:110%;}
        img{border:0px;}
        #stage{position:relative;width:600px;height:700px;margin:auto;text-align:center;margin-top:40px;}
        #one{position:absolute;width:600px;height:600px;top:0;left:0;z-index:10;}
        #two{position:absolute;width:300px;height:300px;top:115px;left:115px;z-index:20;}
        #three{position:absolute;width:150px;height:150px;top:225px;left:225px;z-index:30;}
        #controls{position:absolute;margin:auto;width:600px;top:640px;text-align:center;}
        a:link, a:visited {color:#777;}
    </style>
</svelte:head>

<div id="stage">Loading...
<div id='one'><img bind:this={elemOne} src="" alt="one"></div>
<div id='two'><img bind:this={elemTwo} src="" alt="two"></div>
<div id='three'><img bind:this={elemThree} src="" alt="three"></div>
<div id='controls'>
<img bind:this={btnPlay}
    on:mouseover={() => {
        btnPlay.setAttribute('src', '/media/play_white.png');
    }}
    on:focus={() => {}}
    on:mouseout={() => {
        if (!pp) { btnPlay.setAttribute('src', '/media/play_black.png'); }
    }}
    on:blur={() => {}}
    on:click={() => {
        if (!pp) {
            next();
            pp = true;
            btnPlay.setAttribute('src', '/media/play_white.png');
            btnPause.setAttribute('src', '/media/pause_blackz.png');
        }
    }}
    alt="play button"
    id='play' src="/media/play_white.png">
<img bind:this={btnPause}
    on:mouseover={() => {
        btnPause.setAttribute('src', '/media/pause_white.png');
    }}
    on:focus={() => {}}
    on:mouseout={() => {
        if (pp) { btnPause.setAttribute('src', '/media/pause_black.png'); }
    }}
    on:blur={() => {}}
    on:click={() => {
        pp = false;
        btnPause.setAttribute('src', '/media/pause_white.png');
        btnPlay.setAttribute('src', '/media/play_black.png');
    }}
    alt="pause button"
    id='pause' src="/media/pause_black.png">

<br/><br/><br/><br/><br/>

<p>
<a href="/exhibition/about">ABOUT</a> | <a href="/exhibition/artists">ARTIST INDEX</a> | <a href="/exhibition/downloads">DOWNLOADS</a> | <a href="/exhibition">EXHIBITION</a> | <a href="/mixer">MIXER</a>
</p>


<p>
  <a href="http://dublab.com/"><img src="/media/d1_inv.png" alt="dublab logo"></a> 
  <a href="http://creativecommons.org/"><img src="/media/cc1_inv.png" alt="creative common logo"></a><br/><br/>
  <a rel="license" href="http://creativecommons.org/licenses/by-nc/3.0/">
     <img alt="Creative Commons License" style="border-width:0" src="http://i.creativecommons.org/l/by-nc/3.0/80x15.png" />
  </a>
</p>

</div>
</div>


