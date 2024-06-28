import { MODAL_IDS } from '~/core/constants';

import { SelectCategoryModal } from './select-category-modal';

export const HostGameForm = () => {
  const onClick = () => {
    const dialogElement = document.getElementById(
      MODAL_IDS.SELECT_CATEGORY,
    ) as HTMLDialogElement | null;

    if (dialogElement) {
      dialogElement.showModal();
    }
  };

  return (
    <>
      <button type="button" className="btn btn-accent" onClick={onClick}>
        HOST GAME
      </button>
      <SelectCategoryModal />
    </>
  );
};
