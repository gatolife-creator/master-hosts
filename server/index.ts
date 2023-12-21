import express from "express";
import fs from "fs";
import util from "util";
import Joi from "joi";

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

// バリデーションスキーマ
const schema = Joi.object({
  site: Joi.string().required(),
});

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(express.static("../client/dist"));

fs.chmod("/etc/hosts", 0o666, (err) => {
  if (err) {
    console.error(`Failed to change permissions of the file: ${err}`);
  } else {
    console.log(`Permissions of the file have been changed to read/write.`);
  }
});

app.post("/api/block", async (req, res) => {
  const { error, value } = schema.validate(req.body);

  if (error) {
    console.error(error);
    return res.status(400).send(error.details[0].message);
  }

  const hostsPath = "/etc/hosts";
  try {
    const hostsContent = await readFile(hostsPath, "utf-8");
    const lines = hostsContent.split("\n");

    const startLineIndex = lines.findIndex(
      (line) => line.trim() === "# manually added"
    );
    const endLineIndex = lines.findIndex(
      (line) => line.trim() === "# external filter list"
    );

    if (startLineIndex === -1 || endLineIndex === -1) {
      return res
        .status(500)
        .send("Could not find the specified lines in the hosts file.");
    }

    const newEntry = `127.0.0.1\t${value.site}`;
    lines.splice(endLineIndex, 0, newEntry);

    const newHostsContent = lines.join("\n");
    await writeFile(hostsPath, newHostsContent);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send("An error occurred while processing your request.");
  }

  res.send(`Blocked ${value.site}`).end();
});

app.get("*", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

try {
  app.listen(3000, () => console.log("Server listening on port 3000"));
} catch (err) {
  console.error(`Failed to start server: ${err}`);
}
