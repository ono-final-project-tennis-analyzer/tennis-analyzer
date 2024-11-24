export interface Video {
  id: string;
  name: string;
  upload_date: string;
  status: string;
  event_data: {
    file_name: string;
    stage: string;
    progress: number;
  };
}
