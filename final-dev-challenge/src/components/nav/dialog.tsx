import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from '@headlessui/react';

import { Sidebar } from './sidebar';

interface Props {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const NavDialog = ({ sidebarOpen, setSidebarOpen }: Props) => {
  return (
    <Dialog
      className="relative z-50"
      open={sidebarOpen}
      onClose={setSidebarOpen}
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
      />

      <div className="fixed inset-0 flex">
        <DialogPanel
          transition
          className="relative mr-16 flex w-full max-w-xs flex-1 transition duration-300 ease-in-out data-[closed]:-translate-x-full"
        >
          <TransitionChild>
            <div className="absolute left-full top-0 flex h-20 w-8 justify-center pt-8 duration-300 ease-in-out data-[closed]:opacity-0" />
          </TransitionChild>
          <Sidebar />
        </DialogPanel>
      </div>
    </Dialog>
  );
};
