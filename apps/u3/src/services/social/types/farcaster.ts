export type Channel =
  | {
      name: string;
      parent_url: string;
      image: string;
      channel_id: string;
      channel_description?: undefined;
    }
  | {
      parent_url: string;
      channel_id: string;
      image: string;
      channel_description: string;
      name?: undefined;
    };
