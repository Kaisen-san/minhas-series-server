const axios = require('axios');
const apiKey = '54bc8a90b9ec3f31addef0c092d7c22e';

const getSeriePosterAndBackground = async (name) => {
  try {
    const url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=pt-BR&query=${name}&page=1&include_adult=false`;
    const res = await axios.get(url);
    return {
      poster: `//image.tmdb.org/t/p/original${res.data.results[0].poster_path}`,
      background: `//image.tmdb.org/t/p/original${res.data.results[0].backdrop_path}`
    };
  } catch (err) {
    return { poster: '', background: '' };
  }
}

module.exports = getSeriePosterAndBackground;
