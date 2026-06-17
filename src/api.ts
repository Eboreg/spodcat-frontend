// import fetch, { type RequestInit, type Response } from "node-fetch";
import type {
  ChallengeModel,
  CommentModel,
  EpisodeModel,
  PartialEpisodePolymorphicModel,
  PartialPostPolymorphicModel,
  PodcastContentType,
  PodcastModel,
  PostModel,
  SeasonModel,
} from "@/types/api";

const BACKEND_HOST = import.meta.env.VITE_BACKEND_HOST;

async function backendFetch(path: string, init?: RequestInit): Promise<Response> {
  const response = await fetch(new URL(path, BACKEND_HOST), init);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text);
  }
  return response;
}

async function backendFetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await backendFetch(path, {
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    ...init,
  });

  return response.json() as Promise<T>;
}

function backendPostJson<T>(
  path: string,
  body: Record<string, unknown>,
  init?: RequestInit,
): Promise<T> {
  return backendFetchJson<T>(path, { method: "POST", body: JSON.stringify(body), ...init });
}

export async function createChallenge(
  podcastSlug: string,
  signal?: AbortSignal,
): Promise<ChallengeModel> {
  return backendPostJson("v2/challenges/", { podcast: podcastSlug }, { signal });
}

export function deleteChallenge(id: string, signal?: AbortSignal): Promise<Response> {
  return backendFetch(`v2/challenges/${id}/`, { method: "DELETE", signal });
}

export async function getEpisodeBySlug(
  podcastSlug: string,
  episodeSlug: string,
  signal?: AbortSignal,
): Promise<EpisodeModel> {
  return backendFetchJson(`v2/podcasts/${podcastSlug}/episodes/${episodeSlug}/`, { signal });
}

export async function getPodcastBySlug(slug: string, signal?: AbortSignal): Promise<PodcastModel> {
  return backendFetchJson(`v2/podcasts/${slug}/`, { signal });
}

export async function getPostBySlug(
  podcastSlug: string,
  postSlug: string,
  signal?: AbortSignal,
): Promise<PostModel> {
  return backendFetchJson(`v2/podcasts/${podcastSlug}/posts/${postSlug}/`, { signal });
}

export async function listComments(
  podcastSlug: string,
  contentSlug: string,
  contentType: PodcastContentType,
  signal?: AbortSignal,
): Promise<CommentModel[]> {
  return backendFetchJson(`v2/podcasts/${podcastSlug}/${contentType}s/${contentSlug}/comments/`, {
    signal,
  });
}

export async function listPodcastContents(
  slug: string,
  signal?: AbortSignal,
): Promise<(PartialEpisodePolymorphicModel | PartialPostPolymorphicModel)[]> {
  return backendFetchJson(`v2/podcasts/${slug}/contents/`, { signal });
}

export async function listPodcasts(signal?: AbortSignal): Promise<PodcastModel[]> {
  return backendFetchJson("v2/podcasts/", { signal });
}

export async function listPodcastSeasons(
  slug: string,
  signal?: AbortSignal,
): Promise<SeasonModel[]> {
  return backendFetchJson(`v2/podcasts/${slug}/seasons/`, { signal });
}

export async function postComment(
  name: string,
  text: string,
  challenge: string,
  challengeAnswer: string,
  podcastSlug: string,
  contentSlug: string,
  contentType: PodcastContentType,
  signal?: AbortSignal,
): Promise<CommentModel> {
  return backendPostJson(
    `v2/podcasts/${podcastSlug}/${contentType}s/${contentSlug}/comments/`,
    {
      name,
      text,
      challenge,
      challenge_answer: challengeAnswer,
    },
    { signal },
  );
}

export async function searchPodcastContents(
  term: string,
  signal?: AbortSignal,
): Promise<(PartialEpisodePolymorphicModel | PartialPostPolymorphicModel)[]> {
  return backendFetchJson(`v2/podcast-contents/?freetext=${term}`, { signal });
}
