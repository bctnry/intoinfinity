# Into Infinity

Into Infinity was [an art and music exhibition hosted by dublab & Creative Commons](https://www.dublab.com/archive/into-infinity-an-exploration-of-on-and-on-and-on-and-on/). This is a rewrite of the original CGI program.

All artworks belong to their respective creators and are shared under the Creative Commons BY-NC 3.0 License. The original code is shared under GNU GPLv3.

This code is shared under BSD-3-Clause.

## Run locally

```
npm install
npm run dev
```

## A few notes

+ There was no `eye_mojovisions_3.png` from the archive.
+ There were no `media/play_black.png` and `media/pause_white.png` from the archive; I have to assume that it's `play_white.png` and `pause_black.png` with inverted colors.
+ The mixer will not preload all the audio clips. (200+ MBytes total)
