import Command from "components/Command";
import InfoPage from "components/InfoPage";

export interface InfoProps {
  
}

function Info (props: InfoProps) {

  return (
    <InfoPage>
      <p>
        The biome catalogue stores the list of biomes available in the game. You can obtain the full list of biomes in your modpack with the following command:
      </p>

      <Command command="/extrabiomegen info biome_list" />

      <p>
        In the biome catalogue, you can define the following information for each biome:
        </p>
      <ul>
        <li>
          <strong>Color:</strong> a color used to represent the biome, both in this page and when generating biome maps in-game.
        </li>
        <li>
          <strong>Short name:</strong> a name to use inside this page. As biome table cells can become very small, it should be short and recognizable. This name will not be exported anywhere, so it can be anything that helps you.
        </li>
        <li>
          <strong>Wanted:</strong> true if you want this biome in your modpack, false if you don't.
        </li>
      </ul>

      <p>
        Some of the data defined in this catalogue can be exported to the game's data, at <code>data/extrabiomegen/biomes/*.json</code>. This is required to generate biome maps.
      </p>
    </InfoPage>
  );
}

export default Info;
