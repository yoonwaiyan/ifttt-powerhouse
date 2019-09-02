import request from "request-promise-native";
import AWS from "aws-sdk";
import crypto from "crypto";

import config from "./config.json";

const s3 = new AWS.S3({
  apiVersion: "2006-03-01",
  region: config.region,
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey
});

export const main = async (event, context) => {
  const body = JSON.parse(event.body);

  const fileKey = crypto.randomBytes(3 * 4).toString("base64");
  const fullPath = `${config.path}/${body.albumName}/${fileKey}.heic`;

  const options = {
    uri: body.url,
    encoding: null
  };

  const result = await uploadToS3(options, fullPath);
  console.log("result", result);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: result
    })
  };
};

const uploadToS3 = async (options, key) => {
  const loadResult = await request(options);

  const uploadResult = await s3
    .upload({
      Bucket: config.bucket,
      Key: key,
      Body: loadResult
    })
    .promise();

  return uploadResult;
};
