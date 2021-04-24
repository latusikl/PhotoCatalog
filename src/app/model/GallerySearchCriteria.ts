export interface GallerySearchCriteria {
    name?: string;
    startDate?: Date;
    endDate?: Date;
    allowEmptyData?: boolean;
    minFocalLength?: number;
    minFNumber?: number;
    minExposureTime?: number;
    isExposureTimeInteger?: boolean;
    resolution?: number;
}
