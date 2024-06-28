import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { EnterIcon } from './icons';

export const JoinGameForm = () => {
  const navigate = useNavigate();

  const [gameId, setGameId] = useState('');
  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setGameId(e.currentTarget.value);
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    navigate(`/games/${gameId}`);
  };

  const isDisabled = !gameId;

  return (
    <form onSubmit={onSubmit} className="card space-y-6">
      <label className="input input-bordered flex items-center gap-2 pr-2">
        <input
          className="grow"
          placeholder="Enter Game ID"
          value={gameId}
          onChange={onChange}
        />
        <button
          type="submit"
          className="btn btn-square btn-ghost btn-sm"
          disabled={isDisabled}
        >
          <EnterIcon />
        </button>
      </label>
      <button type="submit" className="btn btn-neutral" disabled={isDisabled}>
        JOIN GAME
      </button>
    </form>
  );
};
