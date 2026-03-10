import InfoPage from "components/InfoPage";
import { DEFAULT_LANGCODE } from "Const";

export interface InfoTabProps {
  
}

function InfoTab (props: InfoTabProps) {

  return (
    <InfoPage>
      <p>
        This tool allows authoring a resource pack that will override all lang files in the game, in as many languages as you want.
      </p>

      <h1>Settings</h1>
      <p>
        The settings of the pack that will be created.
      </p>

      <h1>Base</h1>
      <p>
        This section defines the lang files that already exist in your modpack. In here, you should import one lang file from each mod you want to override. Preferrably, this lang file should be 'en_us.json', as this tool assumes whatever you paste is that file. For example, if you want to override some text from Regions Unexplored, you should add a new file with the namespace 'regions_unexplored' and its content being a copy-paste of the contents inside assets/regions_unexplored/lang/en_us.json.
      </p>
      <p>
        You can modify the contents of base files you've already added in the editor, making sure to Commit these changes afterwards. If you commit an invalid change, nothing will happen.
      </p>

      <h1>Overrides</h1>
      <p>
        Here is where you'll override text in your modpack. You will see a list of the mods you've imported in "Base". By default, you'll have '{DEFAULT_LANGCODE}' available, but you can add new languages as needed. Selecting a mod will list all text keys that exist for that mod, and show the original text for that key as its placeholder. If you have defined an override of the '{DEFAULT_LANGCODE}' language, the placeholder for other languages will show your override in the '{DEFAULT_LANGCODE}' language.
      </p>
      <p>
        In this section, you can also mark specific keys as disabled. These removals are global (they apply to all languages), and are meant to aid in your development: if you for example, disable an item's name, it will show as disabled and override its name with a 'removed' prefix, which you can then use in-game to check if things that should be removed are still visible. For production builds, you should disable overriding removed keys' names.
      </p>
      
      <h1>Export</h1>
      <p>Using the 'Export' button will produce a ready-to-use resource pack containing all the keys you overrode (or removed, if removal prefix is enabled). This resource pack will only contain text keys you overrode (i.e. it will not contain any key you chose to left unchanged). For languages other than '{DEFAULT_LANGCODE}', if you overrode the value in '{DEFAULT_LANGCODE}' but not in that language, the value in '{DEFAULT_LANGCODE}' will be used instead. This means that, if you change a line of text in '{DEFAULT_LANGCODE}', you should change it in all languages.</p>
    </InfoPage>
  );
}

export default InfoTab;
