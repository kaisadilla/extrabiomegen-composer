import styles from './page.module.scss';

export interface HomePageProps {
  
}

function HomePage (props: HomePageProps) {

  return (
    <div className={styles.page}>
      <h1>Modpacking tools</h1>
      <div className={styles.toolGallery}>
        <_Tool
          name="extrabiomegen"
          description={
            "A set of tools to compose and analyze world generation aided by" +
            "the mod \"Kaisa's Extra Biome Generators\"."
          }
          path="ebg"
        />
        <_Tool
          name="Lang files"
          description={
            "Author a resource pack to override lang files"
          }
          path="lang"
        />
      </div>
    </div>
  );
}

interface _ToolProps {
  name: string;
  description: string;
  path: string;
}

function _Tool ({
  name,
  description,
  path,
}: _ToolProps) {

  return (
    <a
      className={styles.tool}
      target='_blank'
      href={path}
    >
      <div className={styles.name}>
        {name}
      </div>
      
      <div className={styles.description}>
        {description}
      </div>
    </a>
  );
}


export default HomePage;
