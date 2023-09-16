export const fetchAllSuperHero = async (searchText) => {
  let url = `https://www.superheroapi.com/api.php/727054372039115/search/${searchText}`;
  try {
    const response = await fetch(url);
    const allData = await response.json();
    if (allData.response === 'success') {
      return (allData.results);
    }
  } catch (error) {
    console.log(error);
  }
};

export const fetchSearchHeroById = async (id) => {
  let url = `https://www.superheroapi.com/api.php/727054372039115/${id}`;
  try {
    const response = await fetch(url);
    const allData = await response.json();
    if (allData.response === 'success') {
      return (allData);
    }
  } catch (error) {
    console.log(error);
  }
};