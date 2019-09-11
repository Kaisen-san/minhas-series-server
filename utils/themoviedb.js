const axios = require('axios');
const apiKey = '54bc8a90b9ec3f31addef0c092d7c22e';

const getSeriePosterAndBackground = async (name) => {
  try {
    const url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=pt-BR&query=${name}&page=1&include_adult=false`;
    const res = await axios.get(url);

    const serieInfo = res.data.results
      .filter(result => result.media_type === 'tv')
      .find(serie => serie.original_name.includes(name));

    return {
      poster: `//image.tmdb.org/t/p/original${serieInfo.poster_path}`,
      background: `//image.tmdb.org/t/p/original${serieInfo.backdrop_path}`
    };
  } catch (err) {
    return { poster: '', background: '' };
  }
}

module.exports = getSeriePosterAndBackground;
