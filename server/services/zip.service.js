import fs from "fs";
import path from "path";
import archiver from "archiver";

export function zipFolder(source, out) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(out);

    const archive = archiver("zip", {
      zlib: { level: 9 },
    });

    output.on("close", resolve);
    archive.on("error", reject);

    archive.pipe(output);

    const files = fs.readdirSync(source);

    for (const file of files) {
      // Không nén chính file zip
      if (file.toLowerCase().endsWith(".zip")) continue;

      archive.file(path.join(source, file), {
        name: file,
      });
    }

    archive.finalize();
  });
}
