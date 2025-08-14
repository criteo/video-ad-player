export interface VastInformation {  
  clickThroughUrl: string | undefined;
  beacons: Beacons;
  adVerifications: AdVerification[];
  mediaFiles: MediaFile[];
}

export interface Beacons {
  impression: string | undefined;
  adStarted: string | undefined;
  adFirstQuartile: string | undefined;
  adMidpoint: string | undefined;
  adThirdQuartile: string | undefined;
  adCompleted: string | undefined;
  mute: string | undefined;
  unmute: string | undefined;
  pause: string | undefined;
  resume: string | undefined;
  clickThrough: string | undefined;
  verificationNotExecuted: string | undefined;
}

export interface AdVerification {
  javascriptResource: string | undefined;
  apiFramework: string | undefined;
  vendor: string | undefined;
  verificationParameters: string | undefined;
}

export interface MediaFile {
  mediaUrl: string | undefined;
  width?: string | undefined;
  height?: string | undefined;
  aspectRatio?: number | undefined;
  closedCaptionFile?: string | undefined;
  closedCaptionLanguage?: string | undefined;
}
