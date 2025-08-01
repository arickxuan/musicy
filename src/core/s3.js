import { S3Client } from "@aws-sdk/client-s3";
import { ListBucketsCommand, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { Upload } from "@aws-sdk/lib-storage";

import {
    ProgressBar,
    logger,
} from "@aws-doc-sdk-examples/lib/utils/util-log.js";


// Create an S3 service client object.
export function NewS3Client(key, secret, endpoint, region) {
    const credentials = {
        accessKeyId: key,
        secretAccessKey: secret
    };
    const s3Client = new S3Client({
        endpoint: endpoint,//"https://s3.tebi.io",
        credentials: credentials,
        region: region //"global"
    });
    return s3Client;
}

export async function ListBuckets(s3Client) {
    // List buckets
    const buckets_data = await s3Client.send(
        new ListBucketsCommand({})
    );
    console.log(buckets_data);
}

export async function PutFile(s3Client, bucket, fileName, content) {
    const upload_data = await s3Client.send(
        new PutObjectCommand({
            Bucket: bucket,
            Key: fileName,
            Body: content
        })
    );
    console.log(upload_data);
}

export async function PutFilePath(s3Client, bucketName, filePath) {
    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: await readFile(filePath),
    });
    const data = await s3Client.send(command)
    console.log(data);
}

export const PutBigFile = async (client, bucketName, fileName, buffer ) => {
    // const str = createString();
    // const buffer = Buffer.from(str, "utf8");
    const progressBar = new ProgressBar({
        description: `Uploading "${key}" to "${bucketName}"`,
        barLength: 30,
    });

    try {
        const upload = new Upload({
            client: new client,
            params: {
                Bucket: bucketName,
                Key: fileName,
                Body: buffer,
            },
        });

        upload.on("httpUploadProgress", ({ loaded, total }) => {
            progressBar.update({ current: loaded, total });
        });

        await upload.done();
    } catch (caught) {
        if (caught instanceof Error && caught.name === "AbortError") {
            logger.error(`Multipart upload was aborted. ${caught.message}`);
        } else {
            throw caught;
        }
    }
};


export async function GetUrl(s3Client, bucket, fileName) {
    // Generate a presigned URL
    const get_command = new GetObjectCommand({
        Bucket: bucket,
        Key: fileName,
        ResponseContentDisposition: 'attachment; filename="' + fileName + '"'
    });
    const url = await getSignedUrl(s3Client, get_command, { expiresIn: 3600 });
    console.log(url);
}

export async function DelFile(s3Client, bucket, fileName) {
    const upload_data = await s3Client.send(
        new DeleteObjectCommand({
            Bucket: bucket,
            Key: fileName,
        }),
    );
    console.log(upload_data);
}
export async function DelFiles(s3Client, bucket, fileNames) {
    const { Deleted } = await s3Client.send(
        new DeleteObjectsCommand({
            Bucket: bucket,
            Delete: {
                Objects: fileNames.map((k) => ({ Key: k })),
            },
        }),
    );
    console.log(Deleted);
}