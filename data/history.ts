export type History = {
  id: string;
  title: string;
  content: string;
  region: string;
};

export const histories: History[] = [
  {
    id: "dataran-tinggi-minangkabau",
    title: "Dataran Tinggi Minangkabau",
    content:
      "Dataran Tinggi Minangkabau adalah wilayah pegunungan yang terletak di bagian tengah Bukit Barisan dengan tiga puncak tertinggi yang dijuluki sebagai puncak Tri Arga. Wilayah yang kini menjadi bagian dari provinsi Sumatera Barat ini terdiri dari tiga lembah utama atau juga disebut luhak, yaitu: Luhak Agam, Luhak Limopuluah, dan Luhak Tanah Datar. Wilayah ini merupakan kampung halaman bagi orang Minangkabau; mereka menyebutnya sebagai darek atau alam Minangkabau.",
    region: "Darek Minangkabau"
  },
  {
    id: "bukit-barisan",
    title: "Bukit Barisan",
    content:
      "Bukit Barisan forms the mountain spine of Sumatra. In West Sumatra, its valleys, volcanoes, canyons, and lakes created the ecological setting for Minangkabau settlement and agriculture.",
    region: "Sumatra"
  },
  {
    id: "tri-arga",
    title: "Tri Arga Mountains",
    content:
      "Tri Arga refers to the three high peaks often connected to the Minangkabau highlands: Marapi, Singgalang, and Sago. These mountains frame the traditional heartland and its historical imagination.",
    region: "Minangkabau Highlands"
  },
  {
    id: "darek",
    title: "The Concept of Darek",
    content:
      "Darek means the inland homeland of Minangkabau culture. It is associated with the three luhak, matrilineal villages, rice landscapes, and the source of adat traditions.",
    region: "Luhak Nan Tigo"
  },
  {
    id: "pagaruyung-kingdom",
    title: "Pagaruyung Kingdom",
    content:
      "The Pagaruyung Kingdom is remembered as an important political and cultural center that helped shape Minangkabau royal symbolism, adat authority, and regional identity.",
    region: "Luhak Tanah Datar"
  },
  {
    id: "civilization-west-sumatra",
    title: "Minangkabau Civilization in West Sumatra",
    content:
      "Minangkabau civilization developed through highland agriculture, trade routes, Islamic scholarship, oral literature, architecture, migration, and a strong matrilineal social system.",
    region: "West Sumatra"
  }
];
