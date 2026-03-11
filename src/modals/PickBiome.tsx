import { modals, type ContextModalProps } from '@mantine/modals';
import { type Biome } from 'api/Biome';
import BiomeButton from 'components/BiomeButton';
import { Fragment } from 'react/jsx-runtime';
import { getNamespaces } from 'utils';
import styles from "./PickBiome.module.scss";

export interface PickBiomeModalProps {
  values: Biome[];
  onSubmit?: (id: string) => void;
}

function PickBiomeModal ({
  innerProps,
  context: ctx,
  id: modalId,
}: ContextModalProps<PickBiomeModalProps>) {
  const {
    values,
    onSubmit,
  } = innerProps;

  const groups = [...getNamespaces(values.map(b => b.id))];

  return (
    <div className={styles.modal}>
      {groups.map(g => (<Fragment key={g}>
        <h1>{g}</h1>
        <div className={styles.biomeGallery}>
          {values
            .filter(v => v.id.split(":")[0] === g)
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(v => (
            <BiomeButton
              key={v.id}
              biome={v}
              onClick={() => handleClickBiome(v.id)}
            />
          ))}
        </div>
      </Fragment>))}
    </div>
  );

  function handleClickBiome (id: string) {
    onSubmit?.(id);
    ctx.closeModal(modalId);
  }
}

export function openPickBiomeModal (props: PickBiomeModalProps) {
  modals.openContextModal({
    modal: 'pickBiome',
    innerProps: props,
    size: '1000px',
    closeOnClickOutside: true,
  });
}

export default PickBiomeModal;
