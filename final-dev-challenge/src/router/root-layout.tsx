import { Toaster } from 'react-hot-toast';
import { Outlet } from 'react-router-dom';

export const RootLayout = () => {
  return (
    <div>
      <main>
        <Outlet />
      </main>
      <Toaster
        containerClassName="z-[9999]"
        toastOptions={{
          style: {
            background: '#221551',
            color: 'white',
          },
        }}
      />
    </div>
  );
};
