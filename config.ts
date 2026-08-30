import { defineConfig } from "tinacms";

// TinaCMS content model for the portfolio.
// - Content lives as JSON in /content (bundled by Vite at build time).
// - Media uploads land in /public/assets (in-repo, versioned with the code).
// Run the editor with `npm run cms`, then open http://localhost:5173/admin/index.html
export default defineConfig({
  branch: process.env.TINA_BRANCH || "main",
  // Local editing needs no cloud credentials; these are only used for Tina Cloud.
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",
  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "assets",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      {
        name: "home",
        label: "Home Page",
        path: "content",
        format: "json",
        match: { include: "home" },
        // Singleton: prevent creating/deleting the home document.
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          { type: "string", name: "name", label: "Name", isTitle: true, required: true },
          { type: "string", name: "tagline", label: "Tagline" },
          {
            type: "object",
            name: "work",
            label: "Work",
            fields: [
              { type: "string", name: "title", label: "Section title" },
              { type: "string", name: "role", label: "Role" },
              { type: "string", name: "companies", label: "Companies line" },
            ],
          },
          { type: "string", name: "canopyTitle", label: "Canopy title" },
          {
            type: "object",
            name: "projects",
            label: "Projects (The Canopy)",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.title || "Project" }) },
            fields: [
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "company", label: "Company" },
              { type: "image", name: "preview", label: "Hover preview image" },
              {
                type: "string",
                name: "caseSlug",
                label: "Links to case study (slug)",
                description: "Must match a case study file name in content/case-studies (without .json).",
              },
            ],
          },
          { type: "string", name: "thoughtsTitle", label: "Thoughts title" },
          { type: "string", name: "thoughtsNote", label: "Thoughts note (shown when expanded)" },
          {
            type: "object",
            name: "thoughts",
            label: "Thoughts",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.title || "Thought" }) },
            fields: [
              { type: "string", name: "title", label: "Title" },
              { type: "image", name: "image", label: "Image" },
              {
                type: "string",
                name: "caseSlug",
                label: "Links to case study (optional)",
                description: "Add a case study file name from content/case-studies (without .json).",
              },
            ],
          },
          {
            type: "object",
            name: "contact",
            label: "Contact links",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.label || "Link" }) },
            fields: [
              { type: "string", name: "label", label: "Label" },
              { type: "string", name: "href", label: "URL" },
            ],
          },
        ],
      },
      {
        name: "caseStudy",
        label: "Case Studies",
        path: "content/case-studies",
        format: "json",
        fields: [
          {
            type: "string",
            name: "slug",
            label: "Slug",
            required: true,
            description: "URL slug. Should match this file's name (e.g. merchant-payments).",
          },
          { type: "boolean", name: "locked", label: "Locked (teaser only)" },
          { type: "string", name: "title", label: "Title", isTitle: true, required: true },
          { type: "string", name: "subtitle", label: "Subtitle" },
          {
            type: "object",
            name: "hero",
            label: "Hero media",
            fields: [
              { type: "image", name: "src", label: "Image (optional)" },
              {
                type: "string",
                name: "video",
                label: "Video path (optional)",
                description: "e.g. /assets/case-study-hero.mp4 — a video takes priority over the image.",
              },
              { type: "string", name: "alt", label: "Alt text" },
            ],
          },
          {
            type: "string",
            name: "index",
            label: "Outcome index",
            list: true,
            description: "The right-side list of outcomes. The first item is highlighted.",
          },
          {
            type: "object",
            name: "body",
            label: "Body paragraphs",
            list: true,
            ui: { itemProps: (item) => ({ label: (item?.text || "Paragraph").slice(0, 40) }) },
            fields: [
              {
                type: "string",
                name: "style",
                label: "Style",
                options: [
                  { value: "normal", label: "Normal" },
                  { value: "fade", label: "Fade out (teaser)" },
                ],
              },
              { type: "string", name: "text", label: "Text", ui: { component: "textarea" } },
            ],
          },
          {
            type: "object",
            name: "cards",
            label: "Supporting boards (open case only)",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.alt || "Board" }) },
            fields: [
              { type: "image", name: "src", label: "Image" },
              { type: "string", name: "alt", label: "Alt text" },
            ],
          },
          { type: "string", name: "closing", label: "Closing line (open case only)", ui: { component: "textarea" } },
          {
            type: "object",
            name: "sections",
            label: "Sections",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.title || "Section" }) },
            fields: [
              { type: "string", name: "title", label: "Section title" },
              {
                type: "object",
                name: "media",
                label: "Media (image / GIF / video)",
                fields: [
                  { type: "image", name: "image", label: "Image or GIF" },
                  {
                    type: "string",
                    name: "video",
                    label: "Video path (optional)",
                    description: "e.g. /assets/demo.mp4 — if set, plays instead of the image.",
                  },
                  { type: "string", name: "alt", label: "Alt text" },
                ],
              },
              { type: "string", name: "body", label: "Body text", ui: { component: "textarea" }, description: "Leave a blank line between paragraphs." },
              {
                type: "object",
                name: "stats",
                label: "Info box stats (up to 3)",
                list: true,
                ui: { itemProps: (item) => ({ label: item?.value ? `${item.value} ${item.label || ""}` : "Stat" }) },
                fields: [
                  { type: "string", name: "value", label: "Value (e.g. 40%)" },
                  { type: "string", name: "label", label: "Label" },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
});
