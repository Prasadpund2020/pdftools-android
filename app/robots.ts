import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  // Comprehensive list of legitimate search engines, AI search engines, and chat agents
  const aiSearchAgents = [
    // OpenAI / ChatGPT
    "OAI-SearchBot",
    "ChatGPT-User",
    "GPTBot",
    // Perplexity AI
    "PerplexityBot",
    // Anthropic / Claude
    "ClaudeBot",
    "Claude-Web",
    "anthropic-ai",
    // Google Gemini & Googlebot
    "Googlebot",
    "Google-Extended",
    // Microsoft Copilot & Bing
    "Bingbot",
    // Apple Intelligence & Siri
    "Applebot",
    "Applebot-Extended",
    // Meta AI
    "Meta-ExternalAgent",
    "FacebookBot",
    // Amazon AI / Rufus
    "Amazonbot",
    // ByteDance AI
    "Bytespider",
    // Cohere AI
    "cohere-ai",
    // DuckDuckGo AI Assist
    "DuckAssistBot",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      ...aiSearchAgents.map((agent) => ({
        userAgent: agent,
        allow: "/",
        disallow: ["/api/"],
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
