import type { Theme } from "@/utils";

export interface CategoryModel {
  cat: string;
  id: number;
  sub: string;
}

export interface ChallengeModel {
  challenge_string: string;
  id: string;
  podcast: string;
}

export interface CommentModel {
  created: string;
  id: number;
  is_approved: boolean;
  name: string;
  podcast_content: string;
  text_html: string;
  text: string;
}

export interface EpisodeSongModel {
  artists: { id: number; name: string }[];
  comment: string | null;
  end_time: number | null;
  id: number;
  image: string | null;
  start_time: number;
  title: string;
  url: string | null;
}

export interface PodcastLinkModel {
  custom_icon: string | null;
  icon?: "facebook" | "discord" | "patreon" | "apple" | "android" | "spotify" | "itunes";
  id: number;
  label: string;
  theme: Theme;
  url: string;
}

export interface PartialPodcastModel {
  banner: string | null;
  cover_thumbnail: string | null;
  name_font_family: string | null;
  name_font_size: string;
  name: string;
  slug: string;
  tagline: string | null;
}

export interface PodcastModel extends PartialPodcastModel {
  banner_height: number | null;
  banner_width: number | null;
  cover_height: number | null;
  cover_mimetype: string | null;
  cover_thumbnail_height: number | null;
  cover_thumbnail_mimetype: string | null;
  cover_thumbnail_width: number | null;
  cover_width: number | null;
  cover: string | null;
  description_html: string;
  description: string;
  enable_comments: boolean;
  episodes_fm_url: string;
  favicon_content_type: string | null;
  favicon: string | null;
  language: string | null;
  links: PodcastLinkModel[];
  name_font_face: number | null;
  require_comment_approval: boolean;
  rss_url: string;
}

export interface SeasonModel {
  id: number;
  image_thumbnail: string | null;
  name: string | null;
  number: number;
}

export interface VideoModel {
  id: number;
  title: string;
  video_id: string;
  video_type: string;
}

/** PodcastContent/Episode/Post stuff below */

export type PodcastContentType = "episode" | "post";

export interface PartialPodcastContentModel {
  id: string;
  name: string;
  podcast: string;
  published: string;
  slug: string;
}

export interface PodcastContentPolymorphicModel {
  resourcetype: PodcastContentType;
}

export interface PodcastContentModel extends PartialPodcastContentModel {
  created: string;
  description_html: string;
  description: string | null;
  podcast_name: string;
  videos: VideoModel[];
}

export interface PartialEpisodeModel extends PartialPodcastContentModel {
  audio_url: string;
  duration_seconds: number;
  has_songs: boolean;
  image_thumbnail: string | null;
  number: number | null;
  season: number | null;
}

export interface PartialPostModel extends PartialPodcastContentModel {}

export interface EpisodeModel extends PodcastContentModel, PartialEpisodeModel {
  dbfs_array: number[];
  image_height: number | null;
  image_mimetype: string | null;
  image_thumbnail_height: number | null;
  image_thumbnail_mimetype: string | null;
  image_thumbnail_width: number | null;
  image_width: number | null;
  image: string | null;
  songs: EpisodeSongModel[];
}

export interface PostModel extends PodcastContentModel {}

export interface PartialEpisodePolymorphicModel
  extends PartialEpisodeModel, PodcastContentPolymorphicModel {
  resourcetype: "episode";
}

export interface PartialPostPolymorphicModel
  extends PartialPostModel, PodcastContentPolymorphicModel {
  resourcetype: "post";
}
