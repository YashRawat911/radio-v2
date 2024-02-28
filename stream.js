const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
const axios = require("axios");

ffmpeg.setFfmpegPath(ffmpegPath);

let command;
var started = false;

const GetFirstIngest = async () => {
  const res = await axios.get("https://ingest.twitch.tv/ingests");
  return res.data.ingests[0].url_template.replace(
    "{stream_key}",
    process.env.STREAM_KEY
  );
};

module.exports.Start = async () => {
  started = true;
  console.log("Started streaming!");
  let ingest;
  if (!process.env.INGEST) ingest = await GetIngest();
  else ingest = process.env.INGEST;

  command = ffmpeg()
    .addInput("./assets/OSOD.gif")
    .addInputOption("-ignore_loop 0")
    .videoFilters([
      {
        filter: "drawtext",
        options: {
          fontfile: "./assets/vertopal.com_Chopsic.ttf",
          textfile: "./assets/livetext.txt",
          fontsize: 25,
          fontcolor: "white",
          x: "(w-tw)/2",
          y: "(main_h-130)",
          reload: 1,
          shadowcolor: "black",
          shadowx: 2,
          shadowy: 2,
        },
      },
      {
        filter: "drawtext",
        options: {
          fontfile: "./assets/vertopal.com_Chopsic.ttf",
          text: "NOW PLAYING",
          fontsize: 26,
		  fontcolor: "white",
          x: "(w-tw)/2",
          y: "(main_h-160)",
          shadowcolor: "black",
          shadowx: 2,
          shadowy: 2,
        },
      },
    ])
    .addInput(`http://localhost:${process.env.PORT || 3000}`)
    .size(process.env.VIDEO_SIZE)
    .videoBitrate(process.env.BITRATE)
    .withAspect("16:9")
    .videoCodec("libx264")
    .audioCodec("aac")
    .toFormat("flv")
    .save(ingest);
};

module.exports.Stop = async () => {
  command.ffmpegProc.stdin.write("q");
  started = false;
};
module.exports.Started = started;