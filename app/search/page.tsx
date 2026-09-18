import React from "react";
import type { Metadata } from "next";
import { searchLearningPlatform, SearchOptions } from "@/sanity/lib/search";
import { SearchResultsView } from "@/components/search/search-results-view";

export const dynamic = "force-dynamic";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    query?: string;
    sort?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;
  const q = params.q || params.query || "";
  const cleanQuery = q.trim();

  if (!cleanQuery) {
    return {
      title: "Search Courses & Lessons | AI-LMS",
      description: "Search across courses, lessons, and video moments on AI-LMS.",
    };
  }

  return {
    title: `Results for "${cleanQuery}" | AI-LMS Search`,
    description: `Intelligent video moment and lesson search results for "${cleanQuery}" on AI-LMS.`,
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const q = params.q || params.query || "data fetching";
  const sort = (params.sort || "relevance") as SearchOptions["sort"];

  const cleanQuery = q.trim();

  // Perform server-side search
  const results = await searchLearningPlatform(cleanQuery, {
    sort,
  });

  return (
    <SearchResultsView
      key={`${cleanQuery}-${sort}`}
      initialData={results}
      initialQuery={cleanQuery}
      initialSort={sort}
    />
  );
}
