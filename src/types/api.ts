import type { Theme } from "@/utils";

export interface CategoryModel {
  cat: string;
  id: number;
  sub: string;
}

export interface ChallengeModel {
  id: string;
  challenge_string: string;
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
  id: number;
  artists: { id: number; name: string }[];
  start_time: number;
  end_time: number | null;
  image: string | null;
  url: string | null;
  comment: string | null;
  title: string;
}

export interface PodcastLinkModel {
  custom_icon: string | null;
  icon?: "facebook" | "discord" | "patreon" | "apple" | "android" | "spotify" | "itunes";
  id: number;
  label: string;
  theme: Theme;
  url: string;
}

export interface PodcastModel {
  banner_height: number | null;
  banner_width: number | null;
  banner: string | null;
  cover_height: number | null;
  cover_mimetype: string | null;
  cover_thumbnail_height: number | null;
  cover_thumbnail_mimetype: string | null;
  cover_thumbnail_width: number | null;
  cover_thumbnail: string | null;
  cover_width: number | null;
  cover: string | null;
  description_html: string;
  description: string;
  enable_comments: boolean;
  episode_rss_suffix: string | null;
  episodes_fm_url: string;
  favicon_content_type: string | null;
  favicon: string | null;
  itunes_type: string;
  language: string | null;
  links: PodcastLinkModel[];
  name_font_face: number | null;
  name_font_family: string | null;
  name_font_size: string;
  name: string;
  require_comment_approval: boolean;
  rss_url: string;
  slug: string;
  tagline: string | null;
}

export interface SeasonModel {
  id: number;
  image_height: number | null;
  image_mimetype: string | null;
  image_thumbnail_height: number | null;
  image_thumbnail_mimetype: string | null;
  image_thumbnail_width: number | null;
  image_thumbnail: string | null;
  image_width: number | null;
  image: string | null;
  name: string | null;
  number: number;
}

export interface VideoModel {
  id: number;
  video_type: string;
  video_id: string;
  title: string;
}

/** PodcastContent/Episode/Post stuff below */

export type PodcastContentType = "episode" | "post";

export interface PartialPodcastContentModel {
  id: string;
  name: string;
  podcast: string;
  podcast_name: string;
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
  audio_content_type: string;
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
