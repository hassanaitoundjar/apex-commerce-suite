import { createPrismaModelAdapter } from "@/lib/prismaModelAdapter";

const StorageSettings = createPrismaModelAdapter("storageSettings", {
  activeStorageProvider: "local",
  doEndpoint: "nyc3.digitaloceanspaces.com",
  doRegion: "nyc3",
  doKey: "",
  doSecret: "",
  doBucket: "snapshop-spaces",
  s3Bucket: "snapshop-bucket",
  s3Region: "us-east-1",
  s3Key: "",
  s3Secret: "",
  gcsBucket: "snapshop-gcs",
  gcsKey: "",
  gcsSecret: "",
  b2Bucket: "snapshop-b2",
  b2Endpoint: "s3.us-west-004.backblazeb2.com",
  b2KeyId: "",
  b2Key: "",
});

export default StorageSettings;
