import Parser from "rss-parser";

export async function getFeed(url: string) {
  const parser = new Parser();
  return parser.parseURL(url);
}
