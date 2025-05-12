export default {
  isDevel: true,
  inMante: false, // set to true and deploy if you want to set a maintenance message in all the services
  enabledLangs: ['en', 'es', 'ca'],
  mainDomain: 'gbif.es', // used for cookies (without http/https)
  mainLAUrl: 'https://gbif.es',
  baseFooterUrl: 'https://gbif.es',
  theme: 'gbifes', // for now 'material', 'clean', 'superhero', 'yeti', 'cosmo', 'darkly', 'paper', 'sandstone', 'simplex', 'slate' or 'flatly' themes are available. See the last ones in: https://bootswatch.com/3/
  services: {
    collectory: { url: 'https://colecciones.gbif.es', title: 'Collections' },
    biocache: { url: 'https://registros.gbif.es', title: 'Occurrence records' },
    biocacheService: {
      url: 'https://registros-ws.gbif.es',
      title: 'Occurrence records webservice',
    },
    bie: { url: 'https://especies.gbif.es', title: 'Species' },
    bieService: {
      url: 'https://registros-ws.gbif.es',
      title: 'Species webservice',
    },
    regions: { url: 'https://regiones.gbif.es', title: 'Regions' },
    lists: { url: 'https://listas.gbif.es', title: 'Species List' },
    spatial: { url: 'https://espacial.gbif.es', title: 'Spatial Portal' },
    images: { url: 'https://imagenes.gbif.es', title: 'Images Service' },
    cas: { url: 'https://auth.gbif.es', title: 'CAS' },
  },
  otherLinks: [
    { title: 'Datasets', url: 'https://colecciones.gbif.es/datasets' },
    {
      title: 'Explore your area',
      url: 'http://registros.gbif.es/explore/your-area/',
    },
    { title: 'Datasets', url: 'https://colecciones.gbif.es/datasets' },
    { title: 'twitter', url: '', icon: 'twitter' },
  ],
};

