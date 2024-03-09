async function ServerActionExample() {
  const response = await fetch('https://pokeapi.co/api/v2/pokemon/1');
  const data = await response.json();

  console.log(data);

  return data;
}

export function ServerComponentTest() {
  const pokemon = ServerActionExample();
  
  console.log(pokemon);

  return (
    <div/>
  );
}
