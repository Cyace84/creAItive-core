const fs = require("fs");
const { exec } = require("child_process");

export function convertWebMtoOgg(inputFilePath, outputFilePath) {
  return new Promise((resolve, reject) => {
    const command = `ffmpeg -i ${inputFilePath} -c:a libopus ${outputFilePath}`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing FFmpeg: ${error.message}`);
        reject(error);
        return;
      }

      if (stderr) {
        console.error(`Error output from FFmpeg: ${stderr}`);
        reject(stderr);
        return;
      }

      console.log(`FFmpeg output: ${stdout}`);
      resolve(outputFilePath);
    });
  });
}
