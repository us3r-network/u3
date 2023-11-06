export type Channel =
  | {
      name: string;
      parent_url: string;
      image: string;
      channel_id: string;
    }
  | {
      parent_url: string;
      channel_id: string;
      image: string;
      name?: undefined;
    };
