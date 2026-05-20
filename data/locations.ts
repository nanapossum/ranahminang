export type Location = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  category: string;
  region: "Luhak Agam" | "Luhak Limopuluah" | "Luhak Tanah Datar";
  description: string;
  tourismInfo: string;
  history: string;
};

export const locations: Location[] = [
  {
    id: "istano-basa-pagaruyung",
    name: "Istano Basa Pagaruyung",
    latitude: -0.4716,
    longitude: 100.6215,
    category: "Palace Heritage",
    region: "Luhak Tanah Datar",
    description:
      "Traditional palace associated with the Pagaruyung Kingdom and Minangkabau royal history.",
    tourismInfo:
      "A leading cultural landmark for learning about rumah gadang architecture, royal ceremony, and adat symbolism.",
    history:
      "The palace represents the memory of Pagaruyung as a royal and cultural center in the Minangkabau highlands."
  },
  {
    id: "jam-gadang",
    name: "Jam Gadang",
    latitude: -0.3052,
    longitude: 100.3692,
    category: "Historical Landmark",
    region: "Luhak Agam",
    description:
      "Historical clock tower and iconic landmark of Bukittinggi.",
    tourismInfo:
      "Located in Bukittinggi's civic center, it is a common starting point for walking heritage routes and local culinary visits.",
    history:
      "Jam Gadang reflects Bukittinggi's colonial urban history and its later role as a prominent highland city."
  },
  {
    id: "lembah-harau",
    name: "Lembah Harau",
    latitude: -0.1049,
    longitude: 100.6654,
    category: "Hidden Nature",
    region: "Luhak Limopuluah",
    description:
      "Valley with cliffs and hidden tourism potential in Limapuluh Kota.",
    tourismInfo:
      "Known for steep rock walls, waterfalls, village scenery, and nature-based exploration.",
    history:
      "The valley is tied to Limapuluh Kota's landscape identity and oral stories about settlement in the highland valleys."
  },
  {
    id: "danau-maninjau",
    name: "Danau Maninjau",
    latitude: -0.3093,
    longitude: 100.2036,
    category: "Volcanic Lake",
    region: "Luhak Agam",
    description:
      "Volcanic lake surrounded by Minangkabau settlements and cultural history.",
    tourismInfo:
      "A scenic lake destination with village stays, lake fisheries, viewpoints, and the famous Kelok 44 road.",
    history:
      "Maninjau's caldera landscape shaped local settlement patterns and cultural narratives around lake communities."
  },
  {
    id: "ngarai-sianok",
    name: "Ngarai Sianok",
    latitude: -0.3077,
    longitude: 100.3624,
    category: "Geological Heritage",
    region: "Luhak Agam",
    description:
      "Canyon landscape near Bukittinggi connected to geological and cultural narratives.",
    tourismInfo:
      "A dramatic canyon viewpoint for photography, walking routes, and learning about the Sumatran fault landscape.",
    history:
      "Its landform connects highland culture with the geological forces of Bukit Barisan."
  },
  {
    id: "batu-sangkar",
    name: "Batu Sangkar",
    latitude: -0.4555,
    longitude: 100.5741,
    category: "Historical Region",
    region: "Luhak Tanah Datar",
    description:
      "Historical region closely related to Minangkabau adat and royal civilization.",
    tourismInfo:
      "A practical gateway to heritage villages, traditional houses, inscription sites, and Pagaruyung history.",
    history:
      "Batu Sangkar is deeply associated with Tanah Datar's role in Minangkabau adat, governance, and royal memory."
  }
];
