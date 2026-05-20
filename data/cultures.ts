export type Culture = {
  id: string;
  title: string;
  description: string;
  origin: string;
  type: string;
};

export const cultures: Culture[] = [
  {
    id: "rumah-gadang",
    title: "Rumah Gadang",
    description:
      "Traditional Minangkabau house with horn-shaped roof architecture that represents lineage, communal life, and adat identity.",
    origin: "Darek Minangkabau",
    type: "Architecture"
  },
  {
    id: "tari-piring",
    title: "Tari Piring",
    description:
      "Traditional dance using plates originating from Minangkabau ceremonial traditions and harvest celebration movements.",
    origin: "West Sumatra",
    type: "Performing Art"
  },
  {
    id: "rendang",
    title: "Rendang",
    description:
      "Traditional Minangkabau cuisine recognized internationally, shaped by slow cooking, spices, and ceremonial hospitality.",
    origin: "Minangkabau",
    type: "Culinary Heritage"
  },
  {
    id: "tradisi-merantau",
    title: "Tradisi Merantau",
    description:
      "Minangkabau cultural philosophy about migration, learning, trade, and self-development while keeping ties to homeland.",
    origin: "Minangkabau society",
    type: "Social Philosophy"
  },
  {
    id: "bahasa-minang",
    title: "Bahasa Minang",
    description:
      "Overview of Minangkabau language and regional dialect identity used across highland and coastal communities.",
    origin: "West Sumatra and Minangkabau diaspora",
    type: "Language"
  }
];
