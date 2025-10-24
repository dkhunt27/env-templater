export type BrunoEnvVarType = { key: string; value: string };

export type BrunoConfigCollectionType = {
  name: string;
  envVars: BrunoEnvVarType[];
};

export type BrunoConfigType = {
  awsRegion: string;
  brunoFolder: string;
  collections: BrunoConfigCollectionType[];
};

export type BrunoResultsType = {
  collectionName: string;
  envFilePath: string;
  envBackupFilePath: string | undefined;
  processedEnvVars: BrunoEnvVarType[];
  finished: boolean;
};
