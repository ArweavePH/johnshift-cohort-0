import { useNextQuestion } from '~/hooks/use-next-question';

const DEFAULT_TEXT = 'Next Question';

interface Props {
  gameId: string;
  text?: string;
}

export const NextQuestionButton = ({ gameId, text = DEFAULT_TEXT }: Props) => {
  const { mutate, isPending } = useNextQuestion(gameId);

  const onClick = () => {
    mutate();
  };

  return (
    <button
      type="button"
      className="btn btn-accent w-full md:w-fit"
      disabled={isPending}
      onClick={onClick}
    >
      {isPending && <span className="loading loading-spinner" />}
      {text}
    </button>
  );
};
