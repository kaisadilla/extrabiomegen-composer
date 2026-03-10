import { PlusIcon } from '@phosphor-icons/react';
import Button from 'components/Button';
import { useDispatch, useSelector } from 'react-redux';
import { BiomeCatalogueActions } from 'state/biomeCatalogueSlice';
import type { RootState } from 'state/store';
import Group from './Group';
import styles from './tab.module.scss';

export interface GroupsTabProps {
  
}

function GroupsTab (props: GroupsTabProps) {
  const groups = useSelector((state: RootState) => state.biomeCatalogue.groups);
  const dispatch = useDispatch();

  return (
    <div className={styles.tab}>
      <div className={styles.groupGallery}>
        {groups.map((g, i) => <Group key={i} id={i} group={g} />)}

        <Button
          className={styles.add}
          onClick={handleAdd}
        >
          <PlusIcon size={24} />
          <div>New group</div>
        </Button>
      </div>
    </div>
  );

  function handleAdd () {
    dispatch(BiomeCatalogueActions.addGroup({
      name: "unnamed",
      color: "#00ff00",
    }));
  }
}

export default GroupsTab;
