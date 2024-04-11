export function Pokemon({spriteUrl}) {
    return (
        <>
        <div className="App">
          <header className="App-header">
            <p>Random Pokemon</p>
            {/* Display the fetched Pokémon sprite if the URL has been set */}
            {spriteUrl && <img src={spriteUrl} alt="Random Pokémon" />}
          </header>
        </div>
      </>
    )
}