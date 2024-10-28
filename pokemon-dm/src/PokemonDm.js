import { LitElement } from 'lit-element';

export class PokemonDm extends LitElement {

  async fetchPokemonData() {
    try {
      
      this.loading = true; 

      const response = await fetch(
        'https://pokeapi.co/api/v2/pokemon?offset=0&limit=50'
      );
      const data = await response.json();

      const detailedData = await Promise.all(
        data.results.map((pokemon) =>
          fetch(pokemon.url).then((res) => res.json())
        )
      );

      const basePokemon = await Promise.all(
        detailedData.map(async(pokemon) => {
          const speciesResponse = await fetch(pokemon.species.url);
          const speciesData = await speciesResponse.json();
          return speciesData.evolves_from_species ? null : pokemon;
        })
      );

      this.pokemonList = basePokemon.filter((pokemon) => pokemon !== null);
      console.log(this.pokemonList);
    } catch (error) {
      console.error('Error fetching Pokémon data:', error);
    }
    finally {
      this.loading = false; 
    }
  }
}
