# audioTrimmer
Simple node.js script that trimms mp3 audio files according to srt sub files so the length of pauses between lines would be reduced to some given amount of milliseconds. 
## Use
All mp3 files should go to the directory named input, and all srt files should go to the directory named subs. Orders of files should match. 
Maximum gap in milliseconds between lines can be set by providing command line argument:
```
node index.js 5000
```
Default maximum gap is 1000 ms.
